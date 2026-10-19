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

  // Random codes are 5 uppercase alphanumerics; custom codes (Pro) are
  // 3–30 lowercase [a-z0-9_-]. Try the most likely storage form first so the
  // common random-code path stays a single Redis GET.
  const rawInput = (getRouterParam(event, 'code') || '').trim()
  const randomForm = rawInput.toUpperCase().replace(/[^A-Z0-9]/g, '')
  const customForm = rawInput.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 30)

  const forms: string[] = []
  if (/^[A-Za-z0-9]{5}$/.test(rawInput)) {
    forms.push(randomForm)
    if (customForm !== randomForm) forms.push(customForm)
  } else {
    if (customForm.length >= 3) forms.push(customForm)
    if (randomForm.length >= 4 && randomForm !== customForm) forms.push(randomForm)
  }

  if (!forms.length) {
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

  // Resolve the stored form — first hit wins; miss across all forms → 404
  let code = ''
  let raw: string | null = null
  for (const form of forms) {
    const getRes = await upstashRequest(redisUrl, redisToken, ['GET', KEY_PREFIX + form])
    if (getRes.result) {
      code = form
      raw = getRes.result
      break
    }
  }

  if (!raw) {
    throw createError({ statusCode: 404, message: 'Code not found or has expired.' })
  }

  const key = KEY_PREFIX + code

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
