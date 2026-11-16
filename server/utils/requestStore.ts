/**
 * Incoming request links — "Send this to me" links.
 *
 * A request link lets an anonymous stranger hand something to the
 * requester: text (everyone) or files (Pro creators). The link itself is
 * capacity-coupled — it dies when its submission budget is spent or its
 * TTL passes.
 *
 * Redis layout:
 *   request:<code>          JSON meta {v, owner|null, label, expiresAt, max, files, maxBytes, notify, createdAt}
 *   request:left:<code>     submissions left (atomic DECR)
 *   request:owner:<licHash> ZSET of codes created by a Pro license
 *   request:inbox:<code>    envelope-encrypted submission entries, capped at 25
 *
 * Free creators get one request, 3 submissions, 24h expiry. Pro creators
 * get 10 parallel requests, 25 submissions each, 7/30-day expiry, files,
 * labels, and email notify.
 * NOTE: array/object constants in this file use literal numbers — Nitro's
 * AST scan chokes on `N * IDENT` expressions and fails the build.
 */
import { createHash } from 'node:crypto'
import { encryptAtRest, decryptAtRest } from './cipher'
import { shareStorageForms, upstash } from './shareCode'
import { licenseHash } from './proStorage'

export const REQUEST_PREFIX = 'request:'
export const REQUEST_LEFT_PREFIX = 'request:left:'
export const REQUEST_OWNER_PREFIX = 'request:owner:'
export const REQUEST_INBOX_PREFIX = 'request:inbox:'

export const FREE_REQUEST_TTL = 86400
export const FREE_MAX_SUBMISSIONS = 3
export const PRO_MAX_SUBMISSIONS = 25
export const PRO_MAX_REQUESTS = 10
export const MAX_REQUEST_SUBMITS = 25
export const TEXT_SUBMIT_MAX_CHARS = 5000
export const MAX_LABEL = 80

export const REQUEST_TTLS = [86400, 604800, 2592000]
export const FILE_MAX_OPTIONS = [5242880, 26214400, 104857600]

export const REQUEST_MAX_CODE = 5
export const REQUEST_CODE_CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export type RequestMeta = {
  v: 1
  owner: string | null
  label: string
  createdAt: number
  expiresAt: number
  max: number
  files: boolean
  maxBytes: number | null
  notify: boolean
  text: boolean
}

export function requestCode(): string {
  let code = ''
  for (let i = 0; i < REQUEST_MAX_CODE; i++) {
    code += REQUEST_CODE_CHARSET[Math.floor(Math.random() * REQUEST_CODE_CHARSET.length)]
  }
  return code
}

export function canCreate(existingActive: number, pro: boolean): boolean {
  return pro ? existingActive < PRO_MAX_REQUESTS : existingActive < 1
}

/** Sanitize a user label: plain text, single line, bounded. */
export function sanitizeLabel(value: unknown): string {
  const raw = typeof value === 'string' ? value : ''
  return raw
    .replace(/[<>&"']/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_LABEL)
}

export function parseRequestMeta(raw: unknown): RequestMeta | null {
  if (typeof raw !== 'string' || !raw) return null
  try {
    const meta = JSON.parse(raw)
    if (!meta || meta.v !== 1) return null
    return {
      v: 1,
      owner: typeof meta.owner === 'string' ? meta.owner : null,
      label: typeof meta.label === 'string' ? meta.label : '',
      createdAt: Number(meta.createdAt) || 0,
      expiresAt: Number(meta.expiresAt) || 0,
      max: Number(meta.max) || 1,
      files: meta.files === true,
      maxBytes: Number.isFinite(meta.maxBytes) ? Number(meta.maxBytes) : null,
      notify: meta.notify === true,
      text: meta.text !== false,
    }
  } catch {
    return null
  }
}

/** Create the request record + its atomic submissions-left counter. */
export async function createRequestRecord(
  config: { UPSTASH_REDIS_REST_URL: string; UPSTASH_REDIS_REST_TOKEN: string },
  input: {
    owner: string | null
    label: string
    ttl: number
    max: number
    files: boolean
    maxBytes: number | null
    notify: boolean
    text: boolean
  },
): Promise<{ code: string }> {
  const ttl = Math.max(60, Math.min(input.ttl, 2592000))
  const now = Math.floor(Date.now() / 1000)

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = requestCode()
    const exists = await upstash(config, ['EXISTS', REQUEST_PREFIX + code])
    if (exists.result !== 0) continue

    const meta: RequestMeta = {
      v: 1,
      owner: input.owner,
      label: input.label,
      createdAt: now,
      expiresAt: now + ttl,
      max: input.max,
      files: input.files,
      maxBytes: input.maxBytes,
      notify: input.notify,
      text: input.text,
    }

    await upstash(config, ['SET', REQUEST_PREFIX + code, encryptAtRest(JSON.stringify(meta)), 'EX', String(ttl + 86400)])
    await upstash(config, ['SET', REQUEST_LEFT_PREFIX + code, String(input.max), 'EX', String(ttl + 86400)])

    if (input.owner) {
      await upstash(config, ['ZADD', REQUEST_OWNER_PREFIX + input.owner, now, code])
      await upstash(config, ['EXPIRE', REQUEST_OWNER_PREFIX + input.owner, 31968000])
    }

    return { code }
  }
  throw createError({ statusCode: 500, message: 'Could not generate a unique code. Try again.' })
}

export async function loadRequest(
  config: { UPSTASH_REDIS_REST_URL: string; UPSTASH_REDIS_REST_TOKEN: string },
  rawCode: string,
): Promise<{ code: string; meta: RequestMeta } | null> {
  for (const form of shareStorageForms(rawCode)) {
    const res = await upstash(config, ['GET', REQUEST_PREFIX + form])
    if (!res.result) continue
    const raw = decryptAtRest(res.result)
    const meta = parseRequestMeta(raw)
    if (meta) return { code: form, meta }
  }
  return null
}

/** Atomically consume one submission slot. False when exhausted. */
export async function consumeSubmissionSlot(
  config: { UPSTASH_REDIS_REST_URL: string; UPSTASH_REDIS_REST_TOKEN: string },
  code: string,
): Promise<boolean> {
  const res = await upstash(config, ['DECR', REQUEST_LEFT_PREFIX + code])
  const left = Number(res.result)
  if (!Number.isFinite(left)) {
    await upstash(config, ['SET', REQUEST_LEFT_PREFIX + code, '0', 'EX', '86400'])
    return false
  }
  if (left < 0) {
    await upstash(config, ['INCR', REQUEST_LEFT_PREFIX + code])
    return false
  }
  return true
}

export function inboxKey(code: string): string {
  return REQUEST_INBOX_PREFIX + code
}
