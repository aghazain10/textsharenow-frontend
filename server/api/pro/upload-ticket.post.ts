/**
 * POST /api/pro/upload-ticket
 * Body: { expires: number, size: number }
 * Response: { ticket: string, maxBytes: number, ttl: number }
 *
 * Mints a single-use upload ticket that authorizes the files service to
 * accept a Pro-sized upload (up to 100 MB, any non-SVG type) with a
 * Pro TTL (up to 30 days). The ticket is a random 256-bit token stored
 * in Redis for 10 minutes; the files service redeems it via
 * POST /api/pro/upload-ticket/consume before storing the file.
 * 403 — session is not Pro
 * 422 — size/TTL outside Pro limits
 * 429 — more than 10 mints per minute per IP
 */
import { randomBytes } from 'node:crypto'
import { PRO_MAX_FILE, FILE_TTLS, FILE_TICKET_TTL } from '~~/utils/premium'

type Upstash = { UPSTASH_REDIS_REST_URL: string; UPSTASH_REDIS_REST_TOKEN: string }

async function upstash(config: Upstash, command: unknown[]): Promise<any> {
  const res = await fetch(config.UPSTASH_REDIS_REST_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.UPSTASH_REDIS_REST_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  })
  if (!res.ok) throw new Error(`Upstash error: ${res.status}`)
  return res.json()
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  if (!(await isPro(event))) {
    throw createError({ statusCode: 403, message: 'Pro is required for this upload. Activate your license key to continue.' })
  }

  // Rate limit — 10 ticket mints per minute per IP
  const ip = getRequestHeader(event, 'x-forwarded-for') || 'unknown'
  const rateKey = `rate:fticket:${ip}`
  const rate = await upstash(config, ['INCR', rateKey])
  if (rate.result === 1) await upstash(config, ['EXPIRE', rateKey, 60])
  if (rate.result > 10) {
    throw createError({ statusCode: 429, message: 'Too many upload attempts. Please wait a minute and try again.' })
  }

  const body = await readBody(event)
  const expires = Number(body?.expires)
  const size = Number(body?.size)

  if (!Number.isInteger(size) || size <= 0 || size > PRO_MAX_FILE) {
    throw createError({ statusCode: 422, message: `Pro uploads must be between 1 B and ${Math.floor(PRO_MAX_FILE / 1048576)} MB.` })
  }
  if (!FILE_TTLS.includes(expires)) {
    throw createError({ statusCode: 422, message: 'Choose a file expiry of 10 min, 30 min, 1 h, 1 day, 7 days, or 30 days.' })
  }

  const ticket = randomBytes(32).toString('hex')
  const payload = JSON.stringify({ mb: PRO_MAX_FILE, ttl: expires, size })
  await upstash(config, ['SETEX', `fticket:${ticket}`, FILE_TICKET_TTL, payload])

  return { ticket, maxBytes: PRO_MAX_FILE, ttl: expires }
})
