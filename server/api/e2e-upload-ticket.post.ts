/**
 * POST /api/e2e-upload-ticket
 * Body: { expires: number, size: number, name?: string, type?: string }
 * Response: { ticket: string, maxBytes: number, ttl: number, enc: true }
 *
 * Mints the single-use ticket required for a free-tier end-to-end encrypted
 * file upload. E2E uploads always require a ticket so the files service can
 * trust the `enc` flag instead of accepting it from the request body.
 *
 * Free E2E limits mirror free files: 10 MB and 10 min / 30 min / 1 h.
 * Pro users use POST /api/pro/upload-ticket instead.
 *
 * 422 — size/TTL/type outside free limits
 * 429 — more than 10 mints per minute per IP
 */
import { randomBytes } from 'node:crypto'
import { FREE_MAX_FILE, FREE_FILE_TTLS, FILE_TICKET_TTL } from '~~/utils/premium'
import { isBlockedFile } from '~~/utils/filePolicy'
import { redisCommand } from '../utils/proStorage'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const ip = getRequestHeader(event, 'x-forwarded-for') || 'unknown'
  const rateKey = `rate:e2eticket:${ip}`
  const rate = await redisCommand(config, ['INCR', rateKey])
  await redisCommand(config, ['EXPIRE', rateKey, 60])
  if (rate.result > 10) {
    throw createError({ statusCode: 429, message: 'Too many upload attempts. Please wait a minute and try again.' })
  }

  const body = await readBody(event)
  const expires = Number(body?.expires)
  const size = Number(body?.size)
  const name = typeof body?.name === 'string' ? body.name.slice(0, 255) : ''
  const type = typeof body?.type === 'string' ? body.type.slice(0, 100) : ''

  // Ciphertext adds a small authenticated header and per-chunk tag; allow
  // 64 KB of headroom so a full 10 MB file still fits.
  const maxBytes = FREE_MAX_FILE + 65536
  if (!Number.isInteger(size) || size <= 0 || size > maxBytes) {
    throw createError({
      statusCode: 422,
      message: `Free encrypted uploads must be between 1 B and ${Math.floor(FREE_MAX_FILE / 1048576)} MB.`,
    })
  }
  if (!FREE_FILE_TTLS.includes(expires)) {
    throw createError({ statusCode: 422, message: 'Free file expiry must be 10 min, 30 min, or 1 h.' })
  }
  if (isBlockedFile(name, type)) {
    throw createError({ statusCode: 422, message: 'Executable files and installers are blocked on every plan.' })
  }

  const ticket = randomBytes(32).toString('hex')
  const payload = JSON.stringify({ v: 2, kind: 'file', mb: maxBytes, ttl: expires, size, enc: true })
  await redisCommand(config, ['SETEX', `fticket:${ticket}`, FILE_TICKET_TTL, payload])

  return { ticket, maxBytes, ttl: expires, enc: true }
})
