/**
 * GET /api/share/:code?pw=<sha256-hex>
 * Response: { text: string, readsLeft?: number | null }
 *
 * Retrieves text from Upstash Redis by code.
 *  - Plain-text (legacy / no-metadata) shares are deleted after one read.
 *  - Password-protected shares require ?pw= matching the stored SHA-256
 *    hash; wrong or missing password → 401/403, the share is NOT consumed.
 *  - Multi-read shares (mr > 1) keep a per-share read counter and delete
 *    only once the limit is reached. mr === 0 means unlimited reads.
 * Returns 404 if code not found or expired.
 */

const KEY_PREFIX  = 'share:'
const READS_PREFIX = 'reads:'

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

function parsePayload(raw: string): { text: string, pw?: string, mr?: number } | null {
  if (!raw.startsWith('{')) return null
  try {
    const parsed = JSON.parse(raw)
    if (parsed && parsed.__tsn === 1 && typeof parsed.text === 'string') return parsed
  } catch {
    // Not our JSON — fall through to legacy handling
  }
  return null
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
  const raw    = getRes.result

  if (!raw) {
    throw createError({ statusCode: 404, message: 'Code not found or has expired.' })
  }

  const payload = parsePayload(raw)

  // Legacy / no-metadata share — single-use plain text
  if (!payload) {
    await upstashRequest(redisUrl, redisToken, ['DEL', key])
    return { text: raw }
  }

  // Password check — must pass before the read is counted or consumed
  if (payload.pw) {
    const provided = String(getQuery(event)?.pw || '')
    if (!provided) {
      throw createError({
        statusCode: 401,
        message: 'This share is password protected.',
        data: { passwordRequired: true },
      })
    }
    if (provided !== payload.pw) {
      throw createError({ statusCode: 403, message: 'Incorrect password. Try again.' })
    }
  }

  const maxReads = typeof payload.mr === 'number' ? payload.mr : 1

  // Unlimited reads — never delete, just hand the text over
  if (maxReads === 0) {
    return { text: payload.text, readsLeft: null }
  }

  // Multi-read — track reads in a sibling key so the payload stays intact
  if (maxReads > 1) {
    const readsKey = READS_PREFIX + code
    const countRes = await upstashRequest(redisUrl, redisToken, ['INCR', readsKey])

    if (countRes.result === 1) {
      // First read — mirror the share's remaining TTL onto the counter
      const ttlRes = await upstashRequest(redisUrl, redisToken, ['TTL', key])
      if (ttlRes.result > 0) {
        await upstashRequest(redisUrl, redisToken, ['EXPIRE', readsKey, ttlRes.result])
      } else if (ttlRes.result === -2) {
        // Share vanished between GET and INCR (expired mid-request)
        await upstashRequest(redisUrl, redisToken, ['DEL', readsKey])
        throw createError({ statusCode: 404, message: 'Code not found or has expired.' })
      }
    }

    const reads = countRes.result
    if (reads >= maxReads) {
      await upstashRequest(redisUrl, redisToken, ['DEL', key])
      await upstashRequest(redisUrl, redisToken, ['DEL', readsKey])
      return { text: payload.text, readsLeft: 0 }
    }

    return { text: payload.text, readsLeft: maxReads - reads }
  }

  // Single-use — delete immediately after retrieval
  await upstashRequest(redisUrl, redisToken, ['DEL', key])
  return { text: payload.text }
})
