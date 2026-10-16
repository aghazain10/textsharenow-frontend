/**
 * POST /api/share
 * Body: { text: string, ttl?: number, pro?: boolean,
 *         passwordHash?: string, maxReads?: number }
 * Response: { code: string, ttl: number }
 *
 * Stores text in Upstash Redis with the requested TTL (seconds).
 * ttl 0 means "never" (stored without an expiry).
 * Allowed TTLs: 600 (10 min), 1800 (30 min), 3600 (1 h) on free;
 * premium adds 86400 (1 day), 604800 (7 days), 2592000 (30 days), 0 (never).
 * Anything invalid falls back to the 10 minute default.
 *
 * Premium extras:
 *  - passwordHash: SHA-256 hex of the password (plaintext never sent)
 *  - maxReads: 1 (burn after read), 5, 10, or 0 (unlimited)
 *
 * Shares that need metadata are stored as JSON tagged with __tsn; plain
 * shares keep the original plain-text format so existing links stay valid.
 * Returns a unique 5-character alphanumeric code.
 */

import { isPro } from '../utils/pro'

const CHARSET     = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const CODE_LENGTH = 5
const TTL_SECONDS = 600
const FREE_TTLS   = [600, 1800, 3600]
const PRO_TTLS    = [600, 1800, 3600, 86400, 604800, 2592000, 0]
const FREE_MAX_CHARS = 10000
const PRO_MAX_CHARS  = 100000
const KEY_PREFIX  = 'share:'
const COUNT_KEY   = 'stats:shares'
const SHA256_HEX  = /^[a-f0-9]{64}$/
const READ_COUNTS = [1, 5, 10, 0]

function dailyCountKey(date = new Date()): string {
  return `stats:shares:daily:${date.toISOString().slice(0, 10)}`
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function generateCode(): string {
  let code = ''
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CHARSET[Math.floor(Math.random() * CHARSET.length)]
  }
  return code
}

async function upstashRequest(url: string, token: string, command: unknown[]) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  })

  if (!response.ok) {
    throw new Error(`Upstash error: ${response.status}`)
  }

  return response.json()
}

// ── Handler ──────────────────────────────────────────────────────────────────

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { UPSTASH_REDIS_REST_URL: redisUrl, UPSTASH_REDIS_REST_TOKEN: redisToken } = config

  // Parse and validate body
  const body = await readBody(event)
  const text  = (body?.text || '').trim()

  if (!text) {
    throw createError({ statusCode: 422, message: 'Please provide text to share.' })
  }

  // Premium flag. Never trust the client in production — entitlement comes
  // from the signed pro session cookie (verified against Gumroad). In dev the
  // "Try Pro" preview pill may still toggle `pro` locally.
  let pro = await isPro(event)
  if (!pro && process.env.NODE_ENV !== 'production' && body?.pro === true) {
    pro = true
  }

  const maxChars = pro ? PRO_MAX_CHARS : FREE_MAX_CHARS
  if (text.length > maxChars) {
    throw createError({ statusCode: 422, message: `Text cannot exceed ${maxChars.toLocaleString('en-US')} characters.` })
  }

  // Expiry — 0 means never; anything invalid falls back to 10 min
  const allowedTtls = pro ? PRO_TTLS : FREE_TTLS
  const requestedTtl = Number(body?.ttl)
  const ttl = allowedTtls.includes(requestedTtl) ? requestedTtl : TTL_SECONDS

  // Password (premium only) — client sends a SHA-256 hex digest
  let passwordHash: string | null = null
  const rawHash = typeof body?.passwordHash === 'string' ? body.passwordHash.trim() : ''
  if (rawHash) {
    if (!pro || !SHA256_HEX.test(rawHash)) {
      throw createError({ statusCode: 422, message: 'Invalid password.' })
    }
    passwordHash = rawHash
  }

  // Read limit (premium only): 1, 5, 10 or 0 = unlimited
  let maxReads = 1
  if (pro) {
    const requested = Number(body?.maxReads)
    maxReads = READ_COUNTS.includes(requested) ? requested : 1
  }

  // Rate limiting — 10 sends per minute per IP
  const ip      = getRequestHeader(event, 'x-forwarded-for') || 'unknown'
  const rateKey = `rate:send:${ip}`
  const rateRes = await upstashRequest(redisUrl, redisToken, ['INCR', rateKey])

  if (rateRes.result === 1) {
    // First request — set expiry of 60 seconds
    await upstashRequest(redisUrl, redisToken, ['EXPIRE', rateKey, 60])
  }

  if (rateRes.result > 10) {
    throw createError({ statusCode: 429, message: 'Too many requests. Please wait a moment.' })
  }

  // Generate a unique code (retry up to 5 times on collision)
  let code = ''
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = generateCode()
    const exists    = await upstashRequest(redisUrl, redisToken, ['EXISTS', KEY_PREFIX + candidate])

    if (exists.result === 0) {
      code = candidate
      break
    }
  }

  if (!code) {
    throw createError({ statusCode: 500, message: 'Could not generate a unique code. Please try again.' })
  }

  // Plain text when there is no metadata (keeps the legacy format), JSON
  // tagged with __tsn when password or multi-read is in play.
  let stored = text
  if (passwordHash || maxReads !== 1) {
    const payload: Record<string, unknown> = { __tsn: 1, text, mr: maxReads }
    if (passwordHash) payload.pw = passwordHash
    stored = JSON.stringify(payload)
  }

  // Store with TTL — ttl 0 ("never") is stored without an expiry
  if (ttl === 0) {
    await upstashRequest(redisUrl, redisToken, ['SET', KEY_PREFIX + code, stored])
  } else {
    await upstashRequest(redisUrl, redisToken, ['SETEX', KEY_PREFIX + code, ttl, stored])
  }

  // Increment the aggregate, anonymous all-time share counter and a daily
  // bucket so usage can be charted over time (UTC days).
  // (Redis INCR creates the key at 0 if it doesn't exist).
  try {
    await upstashRequest(redisUrl, redisToken, ['INCR', COUNT_KEY])
    await upstashRequest(redisUrl, redisToken, ['INCR', dailyCountKey()])
  } catch {
    // Counters are non-critical — a failure here must not block the share.
  }

  return { code, ttl }
})
