/**
 * POST /api/pro/upload-ticket
 * Body: { expires: number, size: number, name?: string, type?: string }
 * Response: { ticket: string, maxBytes: number, ttl: number }
 *
 * Mints a single-use upload ticket that authorizes the files service to
 * accept a Pro-sized upload (up to 100 MB, any non-executable type) with a
 * Pro TTL (up to 30 days). The ticket is a random 256-bit token stored
 * in Redis for 10 minutes; the files service redeems it via
 * POST /api/pro/upload-ticket/consume before storing the file.
 *
 * Executables/installers are rejected when name or type is supplied, and
 * each license has a live-storage ledger (2 GB / 50 live uploads) checked
 * here. The files service is the final authority on file type.
 *
 * 403 — session is not Pro
 * 422 — size/TTL/type outside Pro limits, or storage cap reached
 * 429 — more than 10 mints per minute per IP
 */
import { createHash, randomBytes } from 'node:crypto'
import { PRO_MAX_FILE, FILE_TTLS, FILE_TICKET_TTL } from '~~/utils/premium'
import { isBlockedFile } from '~~/utils/filePolicy'
import { getProLicenseKey } from '../../utils/pro'

const STORAGE_CAP = 2 * 1024 * 1024 * 1024 // 2 GB of live file uploads per license
const LIVE_FILE_LIMIT = 50
const LEDGER_TTL = 2592000 + 3600 // 30 days + 1 h (outlives every file TTL)

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
  const name = typeof body?.name === 'string' ? body.name.slice(0, 255) : ''
  const type = typeof body?.type === 'string' ? body.type.slice(0, 100) : ''

  if (!Number.isInteger(size) || size <= 0 || size > PRO_MAX_FILE) {
    throw createError({ statusCode: 422, message: `Pro uploads must be between 1 B and ${Math.floor(PRO_MAX_FILE / 1048576)} MB.` })
  }
  if (!FILE_TTLS.includes(expires)) {
    throw createError({ statusCode: 422, message: 'Choose a file expiry of 10 min, 30 min, 1 h, 1 day, 7 days, or 30 days.' })
  }
  if (isBlockedFile(name, type)) {
    throw createError({
      statusCode: 422,
      message: 'Executable files and installers are blocked on every plan, including Pro.',
    })
  }

  const licenseKey = getProLicenseKey(event)
  if (!licenseKey) {
    throw createError({ statusCode: 403, message: 'Pro session expired. Activate your license key again.' })
  }

  // Live-storage ledger per license. Each entry is { s: bytes, e: unix-epoch }
  // and self-expires; stale entries are pruned on every mint. Best-effort:
  // a Redis failure here must not block an otherwise valid upload.
  const ledgerKey = `pro:fu:${createHash('sha256').update(licenseKey.trim()).digest('hex')}`
  try {
    const ledgerRaw = await upstash(config, ['HGETALL', ledgerKey])
    const entries = ledgerRaw?.result && typeof ledgerRaw.result === 'object' ? ledgerRaw.result : {}
    const now = Math.floor(Date.now() / 1000)
    const stale: string[] = []
    let liveCount = 0
    let liveBytes = 0
    for (const [id, raw] of Object.entries(entries)) {
      let entry: { s?: number; e?: number } = {}
      try { entry = JSON.parse(String(raw)) } catch {}
      const bytes = Number(entry.s)
      const expiry = Number(entry.e)
      if (!Number.isFinite(bytes) || !Number.isFinite(expiry) || expiry <= now) {
        stale.push(id)
      } else {
        liveCount++
        liveBytes += bytes
      }
    }
    if (stale.length) await upstash(config, ['HDEL', ledgerKey, ...stale])

    if (liveCount >= LIVE_FILE_LIMIT) {
      throw createError({
        statusCode: 422,
        message: `You already have ${LIVE_FILE_LIMIT} live file shares. Wait for some to expire before uploading more.`,
      })
    }
    if (liveBytes + size > STORAGE_CAP) {
      throw createError({
        statusCode: 422,
        message: 'Pro storage limit reached (2 GB of live uploads). Wait for older files to expire, or delete them by downloading once.',
      })
    }
  } catch (err: any) {
    // Re-throw deliberate limit errors; swallow ledger read failures.
    if (err?.statusCode) throw err
  }

  const ticket = randomBytes(32).toString('hex')
  const payload = JSON.stringify({ mb: PRO_MAX_FILE, ttl: expires, size })
  await upstash(config, ['SETEX', `fticket:${ticket}`, FILE_TICKET_TTL, payload])

  try {
    const id = randomBytes(8).toString('hex')
    const entry = JSON.stringify({ s: size, e: Math.floor(Date.now() / 1000) + expires })
    await upstash(config, ['HSET', ledgerKey, id, entry])
    await upstash(config, ['EXPIRE', ledgerKey, LEDGER_TTL])
  } catch {}

  return { ticket, maxBytes: PRO_MAX_FILE, ttl: expires }
})
