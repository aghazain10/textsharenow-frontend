/**
 * POST /api/file-share
 * Response: { ok: true }
 *
 * Increments the aggregate, anonymous all-time file-share counter.
 * File uploads go directly to the external files service, so the client
 * calls this endpoint after a successful upload to record it.
 * (Redis INCR creates the key at 0 if it doesn't exist).
 */

const COUNT_KEY = 'stats:file_shares'

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

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { UPSTASH_REDIS_REST_URL: redisUrl, UPSTASH_REDIS_REST_TOKEN: redisToken } = config

  // Rate limiting — 20 increments per minute per IP
  const ip      = getRequestHeader(event, 'x-forwarded-for') || 'unknown'
  const rateKey = `rate:file-share:${ip}`
  const rateRes = await upstashRequest(redisUrl, redisToken, ['INCR', rateKey])

  if (rateRes.result === 1) {
    // First request — set expiry of 60 seconds
    await upstashRequest(redisUrl, redisToken, ['EXPIRE', rateKey, 60])
  }

  if (rateRes.result > 20) {
    throw createError({ statusCode: 429, message: 'Too many requests. Please wait a moment.' })
  }

  await upstashRequest(redisUrl, redisToken, ['INCR', COUNT_KEY])

  return { ok: true }
})
