/**
 * GET /api/share/:code
 * Response: { text: string }
 *
 * Retrieves text from Upstash Redis by code.
 * Deletes the entry immediately after retrieval (single-use).
 * Returns 404 if code not found or expired.
 */

const KEY_PREFIX = 'share:'

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

  // Get and sanitise the code from the URL
  const rawCode = getRouterParam(event, 'code') || ''
  const code    = rawCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')

  if (code.length < 4) {
    throw createError({ statusCode: 422, message: 'Invalid code format.' })
  }

  // Rate limiting — 20 retrieval attempts per minute per IP
  const ip      = getRequestHeader(event, 'x-forwarded-for') || 'unknown'
  const rateKey = `rate:receive:${ip}`
  const rateRes = await upstashRequest(redisUrl, redisToken, ['INCR', rateKey])

  if (rateRes.result === 1) {
    await upstashRequest(redisUrl, redisToken, ['EXPIRE', rateKey, 60])
  }

  if (rateRes.result > 20) {
    throw createError({ statusCode: 429, message: 'Too many requests. Please wait a moment.' })
  }

  const key    = KEY_PREFIX + code
  const getRes = await upstashRequest(redisUrl, redisToken, ['GET', key])
  const text   = getRes.result

  if (!text) {
    throw createError({ statusCode: 404, message: 'Code not found or has expired.' })
  }

  // Single-use — delete immediately after retrieval
  await upstashRequest(redisUrl, redisToken, ['DEL', key])

  return { text }
})
