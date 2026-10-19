/**
 * GET /api/share/custom-check?code=<candidate>
 * Response: { available: boolean }
 *
 * Live availability check for custom share codes (Pro). The random 256-bit
 * upload-style secrecy does not apply here — "taken" confirming a share
 * exists is inherent to the feature; content stays behind the code (+ optional
 * password). Rate-limited to 30 checks per minute per IP.
 */
import { CUSTOM_CODE_RE, RESERVED_CODES, normalizeCustomCode } from '~~/utils/customCode'

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

  // Rate limiting — 30 availability checks per minute per IP
  const ip      = getRequestHeader(event, 'x-forwarded-for') || 'unknown'
  const rateKey = `rate:custom-check:${ip}`
  const rateRes = await upstashRequest(redisUrl, redisToken, ['INCR', rateKey])

  if (rateRes.result === 1) {
    await upstashRequest(redisUrl, redisToken, ['EXPIRE', rateKey, 60])
  }

  if (rateRes.result > 30) {
    throw createError({ statusCode: 429, message: 'Too many checks. Please wait a minute.' })
  }

  const code = normalizeCustomCode(getQuery(event)?.code)
  if (!CUSTOM_CODE_RE.test(code) || RESERVED_CODES.has(code)) {
    return { available: false }
  }

  const exists = await upstashRequest(redisUrl, redisToken, ['EXISTS', 'share:' + code])
  return { available: exists.result === 0 }
})
