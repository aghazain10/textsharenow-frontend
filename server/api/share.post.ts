/**
 * POST /api/share
 * Body: { text: string, ttl?: number }
 * Response: { code: string, ttl: number }
 *
 * Stores text in Upstash Redis with the requested TTL (seconds).
 * Allowed TTLs: 600 (10 min), 1800 (30 min), 3600 (1 h) — anything else
 * falls back to the 10 minute default.
 * Returns a unique 5-character alphanumeric code.
 */

const CHARSET     = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const CODE_LENGTH = 5
const TTL_SECONDS = 600
const ALLOWED_TTLS = [600, 1800, 3600] // 10 min, 30 min, 1 h
const KEY_PREFIX  = 'share:'
const COUNT_KEY   = 'stats:shares'

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

  if (text.length > 10000) {
    throw createError({ statusCode: 422, message: 'Text cannot exceed 10,000 characters.' })
  }

  // Expiry: 10 min, 30 min or 1 h — anything else falls back to 10 min
  const requestedTtl = Number(body?.ttl)
  const ttl = ALLOWED_TTLS.includes(requestedTtl) ? requestedTtl : TTL_SECONDS

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

  // Store in Redis with TTL
  await upstashRequest(redisUrl, redisToken, ['SETEX', KEY_PREFIX + code, ttl, text])

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
