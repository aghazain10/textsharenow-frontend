/**
 * POST /api/pro/activate
 * Body: { licenseKey: string }
 * Response: { ok: true }
 *
 * Verifies a Gumroad license key and stores the signed pro session cookie.
 * 422 — key invalid / refunded / subscription inactive (definitive answer)
 * 502 — Gumroad unreachable (retryable)
 * 429 — more than 5 attempts per minute per IP
 */
import { verifyGumroadLicense, setProSession } from '../../utils/pro'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const licenseKey = typeof body?.licenseKey === 'string' ? body.licenseKey.trim() : ''

  if (!licenseKey) {
    throw createError({ statusCode: 422, message: 'Enter your license key to activate Pro.' })
  }

  // Rate limit — 5 activation attempts per minute per IP
  const ip = getRequestHeader(event, 'x-forwarded-for') || 'unknown'
  const rateKey = `rate:pro-activate:${ip}`
  const rateRes = await fetch(config.UPSTASH_REDIS_REST_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.UPSTASH_REDIS_REST_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(['INCR', rateKey]),
  })
  const rate = await rateRes.json()
  await fetch(config.UPSTASH_REDIS_REST_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.UPSTASH_REDIS_REST_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(['EXPIRE', rateKey, 60]),
  })
  if (rate.result > 5) {
    throw createError({ statusCode: 429, message: 'Too many attempts. Please wait a minute and try again.' })
  }

  const check = await verifyGumroadLicense(licenseKey)
  if (!check.valid) {
    throw createError({
      statusCode: check.networkError ? 502 : 422,
      message: check.message,
    })
  }

  await setProSession(event, licenseKey, check.email)
  return { ok: true }
})
