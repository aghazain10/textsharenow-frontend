/**
 * Pro share receipts — text shares and multi-file transfers.
 *
 * Receipts are deliberately small and privacy-preserving: event types and
 * timestamps only, no IP addresses, user agents, or content. A receipt lives
 * for 90 days after the share expires; never-expiring shares keep a rolling
 * one-year window.
 *
 * Text shares record opens, reads, and exhaustion. Transfers record link
 * opens, per-file downloads (from the aggregate counts the files service
 * syncs back), and exhaustion when the last file leaves.
 *
 * Redis layout:
 *   receipt:<code>            JSON metadata (owner hash, kind, expiry, limits)
 *   receipt:events:<code>     newest-first list of event JSON, capped at 200
 *   receipt:opens:<code>      open counter
 *   receipt:reads:<code>      successful read counter (text only)
 *   receipt:downloads:<code>  files downloaded counter (transfers only)
 *   receipt:closed:<code>     "exhausted" | "deleted"
 *   receipt:owner:<licHash>   sorted set of codes for receipt history
 *   receipt:seen:<licHash>    last time the owner opened their dashboard
 */
import {
  KEY_PREFIX,
  READS_PREFIX,
  shareStorageForms,
  upstash,
  upstashPipeline,
  type UpstashConfig,
} from './shareCode'
import { transferSummaryKey } from './proTransfers'

export const RECEIPT_PREFIX = 'receipt:'
export const RECEIPT_EVENTS_PREFIX = 'receipt:events:'
export const RECEIPT_OPENS_PREFIX = 'receipt:opens:'
export const RECEIPT_READS_PREFIX = 'receipt:reads:'
export const RECEIPT_DOWNLOADS_PREFIX = 'receipt:downloads:'
export const RECEIPT_CLOSED_PREFIX = 'receipt:closed:'
export const RECEIPT_OWNER_PREFIX = 'receipt:owner:'
export const RECEIPT_SEEN_PREFIX = 'receipt:seen:'

export const RECEIPT_RETENTION = 90 * 86400
export const RECEIPT_NEVER_TTL = 365 * 86400
export const MAX_RECEIPT_EVENTS = 200

export type ReceiptKind = 'text' | 'transfer'
export type ReceiptStatus = 'active' | 'expired' | 'exhausted' | 'deleted'
export type ReceiptEventType =
  | 'created'
  | 'opened'
  | 'read'
  | 'download'
  | 'exhausted'
  | 'deleted'

export type ReceiptMeta = {
  v: 1
  kind: ReceiptKind
  code: string
  owner: string
  createdAt: number
  expiresAt: number | null
  maxReads: number
  passwordRequired: boolean
  custom: boolean
  // Transfers only.
  fileCount?: number
  bytes?: number
}

export type ReceiptEvent = {
  t: number
  e: ReceiptEventType
  r?: number | null
  m?: number
  reason?: string
  /** Files downloaded in this sync (transfer only). */
  n?: number
  /** Files remaining after this sync (transfer only). */
  k?: number
  /** Bytes remaining after this sync (transfer only). */
  b?: number
}

export type ReceiptSummary = {
  kind: ReceiptKind
  code: string
  status: ReceiptStatus
  createdAt: number
  expiresAt: number | null
  maxReads: number | null
  passwordRequired: boolean
  custom: boolean
  opens: number
  reads: number
  downloads: number
  fileCount?: number
  bytes?: number
  lastEventAt?: number | null
}

export type ReceiptRecord = ReceiptSummary & {
  readsLeft: number | null
  filesLeft: number | null
  ttl: number | null
  lastEventAt: number
  events: ReceiptEvent[]
}

export type CreateReceiptInput = {
  code: string
  owner: string
  ttl: number
  maxReads: number
  passwordRequired: boolean
  custom: boolean
}

export type CreateTransferReceiptInput = {
  code: string
  owner: string
  ttl: number
  expiresAt: number | null
  fileCount: number
  bytes: number
}

export function receiptOwnerKey(owner: string): string {
  return RECEIPT_OWNER_PREFIX + owner
}

export function receiptSeenKey(owner: string): string {
  return RECEIPT_SEEN_PREFIX + owner
}

export function receiptTtlForShare(ttl: number): number {
  return ttl > 0 ? ttl + RECEIPT_RETENTION : RECEIPT_NEVER_TTL
}

function nowSeconds(): number {
  return Math.floor(Date.now() / 1000)
}

function parseJson<T>(raw: unknown): T | null {
  if (typeof raw !== 'string' || !raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function toCount(raw: unknown): number {
  const value = Number.parseInt(String(raw ?? '0'), 10)
  return Number.isFinite(value) && value > 0 ? value : 0
}

function statusFrom(meta: ReceiptMeta, closed: string | null, shareExists: boolean): ReceiptStatus {
  if (closed === 'deleted' || closed === 'exhausted') return closed
  if (!shareExists) return 'expired'
  if (meta.expiresAt && Math.floor(Date.now() / 1000) >= meta.expiresAt) return 'expired'
  return 'active'
}

export async function createReceipt(
  config: UpstashConfig,
  input: CreateReceiptInput,
): Promise<void> {
  const createdAt = nowSeconds()
  const ttl = receiptTtlForShare(input.ttl)
  const meta: ReceiptMeta = {
    v: 1,
    kind: 'text',
    code: input.code,
    owner: input.owner,
    createdAt,
    expiresAt: input.ttl > 0 ? createdAt + input.ttl : null,
    maxReads: input.maxReads,
    passwordRequired: input.passwordRequired,
    custom: input.custom,
  }
  const event: ReceiptEvent = { t: createdAt, e: 'created', m: input.maxReads }
  await writeNewReceipt(config, meta, event, ttl)
}

/**
 * Create a receipt for a multi-file transfer.
 *
 * The files service registers a transfer once, after the upload completes, so
 * this is idempotent: an existing receipt for the code is left untouched.
 */
export async function createTransferReceipt(
  config: UpstashConfig,
  input: CreateTransferReceiptInput,
): Promise<boolean> {
  const existingRes = await upstash(config, ['GET', RECEIPT_PREFIX + input.code])
  const existing = parseJson<ReceiptMeta>(existingRes.result)

  if (existing?.kind === 'transfer' && existing.owner === input.owner) return false
  // A code can be reused after its text share is deleted, but never while the
  // text share is still live (register already rejects that separately).
  if (existing) {
    const shareRes = await upstash(config, ['EXISTS', KEY_PREFIX + input.code])
    if (shareRes.result === 1) return false
  }

  const createdAt = nowSeconds()
  const meta: ReceiptMeta = {
    v: 1,
    kind: 'transfer',
    code: input.code,
    owner: input.owner,
    createdAt,
    expiresAt: input.expiresAt,
    maxReads: 0,
    passwordRequired: false,
    custom: false,
    fileCount: input.fileCount,
    bytes: input.bytes,
  }
  const event: ReceiptEvent = {
    t: createdAt,
    e: 'created',
    k: input.fileCount,
    b: input.bytes,
  }
  await writeNewReceipt(config, meta, event, receiptTtlForShare(input.ttl))
  return true
}

async function writeNewReceipt(
  config: UpstashConfig,
  meta: ReceiptMeta,
  event: ReceiptEvent,
  ttl: number,
): Promise<void> {
  const eventsKey = RECEIPT_EVENTS_PREFIX + meta.code
  const ownerKey = receiptOwnerKey(meta.owner)

  await upstashPipeline(config, [
    // A deleted custom code can be claimed again later. Clear any old receipt
    // for that code so the new share never inherits the previous timeline.
    ['DEL', RECEIPT_PREFIX + meta.code],
    ['DEL', eventsKey],
    ['DEL', RECEIPT_OPENS_PREFIX + meta.code],
    ['DEL', RECEIPT_READS_PREFIX + meta.code],
    ['DEL', RECEIPT_DOWNLOADS_PREFIX + meta.code],
    ['DEL', RECEIPT_CLOSED_PREFIX + meta.code],
    ['SET', RECEIPT_PREFIX + meta.code, JSON.stringify(meta), 'EX', ttl],
    ['LPUSH', eventsKey, JSON.stringify(event)],
    ['LTRIM', eventsKey, 0, MAX_RECEIPT_EVENTS - 1],
    ['EXPIRE', eventsKey, ttl],
    ['ZADD', ownerKey, meta.createdAt, meta.code],
    ['EXPIRE', ownerKey, RECEIPT_NEVER_TTL],
  ])
}

async function receiptTtlRemaining(config: UpstashConfig, code: string): Promise<number | null> {
  const res = await upstash(config, ['TTL', RECEIPT_PREFIX + code])
  if (res.result === -2) return null
  if (res.result === -1) return RECEIPT_NEVER_TTL
  if (typeof res.result === 'number') return Math.max(1, res.result)
  return null
}

async function writeEvent(
  config: UpstashConfig,
  code: string,
  counterPrefix: string,
  event: ReceiptEvent,
  increment = 1,
): Promise<boolean> {
  const ttl = await receiptTtlRemaining(config, code)
  if (!ttl) return false

  const counterKey = counterPrefix + code
  const eventsKey = RECEIPT_EVENTS_PREFIX + code
  await upstashPipeline(config, [
    ['INCRBY', counterKey, increment],
    ['EXPIRE', counterKey, ttl],
    ['LPUSH', eventsKey, JSON.stringify(event)],
    ['LTRIM', eventsKey, 0, MAX_RECEIPT_EVENTS - 1],
    ['EXPIRE', eventsKey, ttl],
  ])
  return true
}

export async function recordReceiptOpen(
  config: UpstashConfig,
  code: string,
): Promise<boolean> {
  return writeEvent(config, code, RECEIPT_OPENS_PREFIX, { t: nowSeconds(), e: 'opened' })
}

export async function recordReceiptRead(
  config: UpstashConfig,
  code: string,
  readsLeft: number | null,
  maxReads: number,
): Promise<boolean> {
  return writeEvent(config, code, RECEIPT_READS_PREFIX, {
    t: nowSeconds(),
    e: 'read',
    r: readsLeft,
    m: maxReads,
  })
}

/**
 * Record files downloaded from a transfer. The files service reports the
 * remaining file count/bytes after each download, so the delta is what we
 * log. Returns false when no receipt exists for the code.
 */
export async function recordTransferDownload(
  config: UpstashConfig,
  code: string,
  downloaded: number,
  filesLeft: number,
  bytesLeft: number,
): Promise<boolean> {
  if (downloaded <= 0) return false
  return writeEvent(
    config,
    code,
    RECEIPT_DOWNLOADS_PREFIX,
    {
      t: nowSeconds(),
      e: 'download',
      n: downloaded,
      k: Math.max(0, filesLeft),
      b: Math.max(0, bytesLeft),
    },
    downloaded,
  )
}

export async function closeReceipt(
  config: UpstashConfig,
  code: string,
  status: 'exhausted' | 'deleted',
  reason?: string,
): Promise<void> {
  const exists = await upstash(config, ['EXISTS', RECEIPT_PREFIX + code])
  if (exists.result !== 1) return

  const event: ReceiptEvent = { t: nowSeconds(), e: status }
  if (reason) event.reason = reason
  const eventsKey = RECEIPT_EVENTS_PREFIX + code

  await upstashPipeline(config, [
    ['SET', RECEIPT_CLOSED_PREFIX + code, status, 'EX', RECEIPT_RETENTION],
    ['EXPIRE', RECEIPT_PREFIX + code, RECEIPT_RETENTION],
    ['EXPIRE', RECEIPT_OPENS_PREFIX + code, RECEIPT_RETENTION],
    ['EXPIRE', RECEIPT_READS_PREFIX + code, RECEIPT_RETENTION],
    ['EXPIRE', RECEIPT_DOWNLOADS_PREFIX + code, RECEIPT_RETENTION],
    ['LPUSH', eventsKey, JSON.stringify(event)],
    ['LTRIM', eventsKey, 0, MAX_RECEIPT_EVENTS - 1],
    ['EXPIRE', eventsKey, RECEIPT_RETENTION],
  ])
}

export async function resolveReceiptCode(
  config: UpstashConfig,
  rawInput: string,
): Promise<{ code: string; meta: ReceiptMeta } | null> {
  for (const form of shareStorageForms(rawInput)) {
    const res = await upstash(config, ['GET', RECEIPT_PREFIX + form])
    const meta = parseJson<ReceiptMeta>(res.result)
    if (meta && meta.v === 1 && meta.code === form && typeof meta.owner === 'string') {
      return { code: form, meta }
    }
  }
  return null
}

export async function getReceiptRecord(
  config: UpstashConfig,
  rawInput: string,
): Promise<ReceiptRecord | null> {
  const resolved = await resolveReceiptCode(config, rawInput)
  if (!resolved) return null

  const { code, meta } = resolved
  const kind: ReceiptKind = meta.kind === 'transfer' ? 'transfer' : 'text'

  if (kind === 'transfer') {
    const [eventsRes, opensRes, downloadsRes, closedRes, summaryRes, summaryTtlRes] =
      await upstashPipeline(config, [
        ['LRANGE', RECEIPT_EVENTS_PREFIX + code, 0, MAX_RECEIPT_EVENTS - 1],
        ['GET', RECEIPT_OPENS_PREFIX + code],
        ['GET', RECEIPT_DOWNLOADS_PREFIX + code],
        ['GET', RECEIPT_CLOSED_PREFIX + code],
        ['GET', transferSummaryKey(code)],
        ['TTL', transferSummaryKey(code)],
      ])

    const events = parseEvents(eventsRes.result)
    const closed = typeof closedRes.result === 'string' ? closedRes.result : null
    const summary = parseJson<{ count?: number; bytes?: number }>(summaryRes.result)
    const summaryExists = summaryTtlRes.result !== -2 && !!summary
    const status = statusFrom(meta, closed, summaryExists)
    const fileCount = Number.isInteger(meta.fileCount)
      ? Number(meta.fileCount)
      : Number.isInteger(summary?.count)
        ? Number(summary?.count)
        : 0
    const downloads = toCount(downloadsRes.result)
    const filesLeft =
      status === 'active' && summaryExists && Number.isInteger(summary?.count)
        ? Math.max(0, Number(summary?.count))
        : Math.max(0, fileCount - downloads)
    const summaryTtl = typeof summaryTtlRes.result === 'number' ? summaryTtlRes.result : -2

    return {
      kind,
      code,
      status,
      createdAt: meta.createdAt,
      expiresAt: meta.expiresAt,
      maxReads: null,
      passwordRequired: false,
      custom: false,
      opens: toCount(opensRes.result),
      reads: 0,
      downloads,
      fileCount,
      bytes: Number.isInteger(meta.bytes) ? Number(meta.bytes) : Number(summary?.bytes) || 0,
      readsLeft: null,
      filesLeft,
      ttl: status === 'active' && summaryTtl > 0 ? summaryTtl : null,
      lastEventAt: events[0]?.t ?? meta.createdAt,
      events,
    }
  }

  const [eventsRes, opensRes, readsRes, downloadsRes, closedRes, shareRes, shareTtlRes, shareReadsRes] =
    await upstashPipeline(config, [
      ['LRANGE', RECEIPT_EVENTS_PREFIX + code, 0, MAX_RECEIPT_EVENTS - 1],
      ['GET', RECEIPT_OPENS_PREFIX + code],
      ['GET', RECEIPT_READS_PREFIX + code],
      ['GET', RECEIPT_DOWNLOADS_PREFIX + code],
      ['GET', RECEIPT_CLOSED_PREFIX + code],
      ['GET', KEY_PREFIX + code],
      ['TTL', KEY_PREFIX + code],
      ['GET', READS_PREFIX + code],
    ])

  const events = parseEvents(eventsRes.result)
  const closed = typeof closedRes.result === 'string' ? closedRes.result : null
  const shareExists = shareTtlRes.result !== -2 && typeof shareRes.result === 'string'
  const status = statusFrom(meta, closed, shareExists)
  const maxReads = Number.isInteger(meta.maxReads) ? meta.maxReads : 1
  const used = toCount(shareReadsRes.result)

  let readsLeft: number | null
  if (maxReads === 0) {
    readsLeft = null
  } else if (status !== 'active') {
    readsLeft = 0
  } else if (maxReads === 1) {
    readsLeft = 1
  } else {
    readsLeft = Math.max(0, maxReads - used)
  }

  const shareTtl = typeof shareTtlRes.result === 'number' ? shareTtlRes.result : -2
  const lastEventAt = events[0]?.t ?? meta.createdAt

  return {
    kind,
    code,
    status,
    createdAt: meta.createdAt,
    expiresAt: meta.expiresAt,
    maxReads,
    passwordRequired: !!meta.passwordRequired,
    custom: !!meta.custom,
    opens: toCount(opensRes.result),
    reads: toCount(readsRes.result),
    downloads: toCount(downloadsRes.result),
    readsLeft,
    filesLeft: null,
    ttl: status === 'active' && shareTtl > 0 ? shareTtl : null,
    lastEventAt,
    events,
  }
}

function parseEvents(raw: unknown): ReceiptEvent[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((entry) => parseJson<ReceiptEvent>(entry))
    .filter(Boolean) as ReceiptEvent[]
}

/**
 * Newest non-creation event timestamp, for "new activity" badges. A fresh
 * share is not unread just because it exists.
 */
function eventHeadAt(raw: unknown): number | null {
  if (!Array.isArray(raw) || !raw.length) return null
  const event = parseJson<ReceiptEvent>(raw[0])
  if (!event || event.e === 'created') return null
  return Number.isFinite(event.t) ? Number(event.t) : null
}

export async function listReceipts(
  config: UpstashConfig,
  owner: string,
  limit = 100,
): Promise<ReceiptSummary[]> {
  const ownerKey = receiptOwnerKey(owner)
  const members = await upstash(config, ['ZREVRANGE', ownerKey, 0, Math.max(0, limit - 1)])
  const codes: string[] = Array.isArray(members.result) ? members.result : []
  if (!codes.length) return []

  const results = await upstashPipeline(
    config,
    codes.flatMap((code) => [
      ['GET', RECEIPT_PREFIX + code],
      ['GET', RECEIPT_CLOSED_PREFIX + code],
      ['GET', RECEIPT_OPENS_PREFIX + code],
      ['GET', RECEIPT_READS_PREFIX + code],
      ['GET', RECEIPT_DOWNLOADS_PREFIX + code],
      ['EXISTS', KEY_PREFIX + code],
      ['EXISTS', transferSummaryKey(code)],
      ['LRANGE', RECEIPT_EVENTS_PREFIX + code, 0, 0],
    ]),
  )

  const receipts: ReceiptSummary[] = []
  const stale: string[] = []

  codes.forEach((code, index) => {
    const offset = index * 8
    const meta = parseJson<ReceiptMeta>(results[offset]?.result)
    if (!meta || meta.v !== 1 || meta.code !== code || meta.owner !== owner) {
      stale.push(code)
      return
    }

    const kind: ReceiptKind = meta.kind === 'transfer' ? 'transfer' : 'text'
    const closed = typeof results[offset + 1]?.result === 'string' ? results[offset + 1].result : null
    const exists = results[offset + (kind === 'transfer' ? 6 : 5)]?.result === 1
    receipts.push({
      kind,
      code,
      status: statusFrom(meta, closed, exists),
      createdAt: meta.createdAt,
      expiresAt: meta.expiresAt,
      maxReads: kind === 'transfer'
        ? null
        : Number.isInteger(meta.maxReads)
          ? meta.maxReads
          : 1,
      passwordRequired: !!meta.passwordRequired,
      custom: !!meta.custom,
      opens: toCount(results[offset + 2]?.result),
      reads: toCount(results[offset + 3]?.result),
      downloads: toCount(results[offset + 4]?.result),
      lastEventAt: eventHeadAt(results[offset + 7]?.result),
      ...(kind === 'transfer'
        ? {
            fileCount: Number.isInteger(meta.fileCount) ? Number(meta.fileCount) : undefined,
            bytes: Number.isInteger(meta.bytes) ? Number(meta.bytes) : undefined,
          }
        : {}),
    })
  })

  if (stale.length) {
    try {
      await upstashPipeline(config, stale.map((code) => ['ZREM', ownerKey, code]))
    } catch {
      // Non-critical: the next load will prune again.
    }
  }

  return receipts
}
