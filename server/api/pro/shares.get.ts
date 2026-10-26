/**
 * GET /api/pro/shares
 * Response: { shares: [...], truncated: boolean }
 *
 * Lists active text shares and multi-file transfers created with the Pro
 * license — either the signed browser cookie or `Authorization: Bearer
 * <license-key>`. Never returns content or password hashes.
 *
 * Each item: {
 *   kind: 'text' | 'transfer',
 *   code, custom, ttl, expiresAt, maxReads, readsLeft, passwordRequired,
 *   receipt, opens, reads, fileCount?, bytes?
 * }
 *  - receipt: true when a private receipt exists for this text share
 *  - opens/reads: receipt counters, or null when no receipt is available
 *  - ttl: seconds left, or null for a never-expiring text share
 *  - readsLeft: null when reads are unlimited
 *
 * 403 — not Pro
 * 429 — more than 30 dashboard loads per minute per IP
 */
import { createHash } from 'node:crypto'
import { resolvePro } from '../../utils/pro'
import {
  KEY_PREFIX,
  READS_PREFIX,
  parseSharePayload,
  upstash,
  upstashPipeline,
} from '../../utils/shareCode'
import {
  transferOwnerKey,
  transferSummaryKey,
} from '../../utils/proTransfers'
import {
  RECEIPT_OPENS_PREFIX,
  RECEIPT_PREFIX,
  RECEIPT_READS_PREFIX,
} from '../../utils/receipts'

const MAX_SHARES = 100

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { pro, licenseKey } = await resolvePro(event)

  if (!pro || !licenseKey) {
    throw createError({ statusCode: 403, message: 'Pro is required to manage your shares.' })
  }

  setHeader(event, 'Cache-Control', 'no-store')

  const ip = getRequestHeader(event, 'x-forwarded-for') || 'unknown'
  const rateKey = `rate:mine:${ip}`
  const rate = await upstash(config, ['INCR', rateKey])
  if (rate.result === 1) await upstash(config, ['EXPIRE', rateKey, 60])
  if (rate.result > 30) {
    throw createError({ statusCode: 429, message: 'Too many requests. Please wait a moment.' })
  }

  const licHash = createHash('sha256').update(licenseKey.trim()).digest('hex')
  const ownerKey = `share:owner:${licHash}`
  const customOwnerKey = `custom:owner:${licHash}`
  const transferOwner = transferOwnerKey(licHash)

  const [membersRes, customRes, transferRes] = await Promise.all([
    upstash(config, ['SMEMBERS', ownerKey]),
    upstash(config, ['SMEMBERS', customOwnerKey]),
    upstash(config, ['SMEMBERS', transferOwner]),
  ])

  const allCodes: string[] = Array.isArray(membersRes.result) ? membersRes.result : []
  const customCodes = new Set<string>(
    Array.isArray(customRes.result) ? customRes.result : [],
  )
  const allTransferCodes: string[] = Array.isArray(transferRes.result) ? transferRes.result : []
  const codes = allCodes.slice(0, MAX_SHARES)
  const transferCodes = allTransferCodes.slice(0, MAX_SHARES)

  const [results, transferResults] = await Promise.all([
    codes.length
      ? upstashPipeline(
          config,
          codes.flatMap((code) => [
            ['GET', KEY_PREFIX + code],
            ['TTL', KEY_PREFIX + code],
            ['GET', READS_PREFIX + code],
            ['EXISTS', RECEIPT_PREFIX + code],
            ['GET', RECEIPT_OPENS_PREFIX + code],
            ['GET', RECEIPT_READS_PREFIX + code],
          ]),
        )
      : Promise.resolve([]),
    transferCodes.length
      ? upstashPipeline(
          config,
          transferCodes.flatMap((code) => [
            ['GET', transferSummaryKey(code)],
            ['TTL', transferSummaryKey(code)],
          ]),
        )
      : Promise.resolve([]),
  ])

  const shares: Array<Record<string, unknown>> = []
  const stale: string[] = []
  const staleTransfers: string[] = []

  codes.forEach((code, i) => {
    const offset = i * 6
    const raw = results[offset]?.result
    const ttl = results[offset + 1]?.result
    const reads = results[offset + 2]?.result
    const receipt = results[offset + 3]?.result === 1
    const opens = Number.parseInt(String(results[offset + 4]?.result ?? '0'), 10) || 0
    const receiptReads = Number.parseInt(String(results[offset + 5]?.result ?? '0'), 10) || 0

    if (typeof raw !== 'string' || !raw || ttl === -2) {
      stale.push(code)
      return
    }

    const payload = parseSharePayload(raw)
    const maxReads = payload && typeof payload.mr === 'number' ? payload.mr : 1

    let readsLeft: number | null
    if (maxReads === 0) {
      readsLeft = null
    } else if (maxReads > 1) {
      const used = Number.parseInt(reads ?? '0', 10) || 0
      readsLeft = Math.max(0, maxReads - used)
    } else {
      readsLeft = 1
    }

    const seconds = typeof ttl === 'number' ? ttl : -1

    shares.push({
      kind: 'text',
      code,
      custom: customCodes.has(code),
      ttl: seconds >= 0 ? seconds : null,
      expiresAt: seconds > 0 ? new Date(Date.now() + seconds * 1000).toISOString() : null,
      maxReads,
      readsLeft,
      passwordRequired: !!payload?.pw,
      receipt,
      opens: receipt ? opens : null,
      reads: receipt ? receiptReads : null,
    })
  })

  transferCodes.forEach((code, i) => {
    const raw = transferResults[i * 2]?.result
    const ttl = transferResults[i * 2 + 1]?.result
    if (typeof raw !== 'string' || !raw || ttl === -2) {
      staleTransfers.push(code)
      return
    }

    let summary: { owner?: string; count?: number; bytes?: number } = {}
    try { summary = JSON.parse(raw) } catch { staleTransfers.push(code); return }
    if (summary.owner !== licHash) { staleTransfers.push(code); return }
    const count = Number(summary.count)
    const bytes = Number(summary.bytes)
    if (!Number.isInteger(count) || count <= 0 || !Number.isFinite(bytes) || bytes < 0) {
      staleTransfers.push(code)
      return
    }

    const seconds = typeof ttl === 'number' ? ttl : -1
    shares.push({
      kind: 'transfer',
      code,
      custom: false,
      ttl: seconds >= 0 ? seconds : null,
      expiresAt: seconds > 0 ? new Date(Date.now() + seconds * 1000).toISOString() : null,
      maxReads: null,
      readsLeft: null,
      passwordRequired: false,
      fileCount: count,
      bytes,
      receipt: false,
      opens: null,
      reads: null,
    })
  })

  if (stale.length || staleTransfers.length) {
    try {
      await upstashPipeline(config, [
        ...stale.flatMap((code) => [
          ['SREM', ownerKey, code],
          ['SREM', customOwnerKey, code],
        ]),
        ...staleTransfers.map((code) => ['SREM', transferOwner, code]),
      ])
    } catch {
      // Non-critical — the next dashboard load will try again.
    }
  }

  shares.sort((a, b) => {
    const at = a.ttl as number | null
    const bt = b.ttl as number | null
    if (at === null && bt === null) return String(a.code).localeCompare(String(b.code))
    if (at === null) return 1
    if (bt === null) return -1
    return at - bt
  })

  return {
    shares: shares.slice(0, MAX_SHARES),
    truncated: shares.length > MAX_SHARES,
  }
})
