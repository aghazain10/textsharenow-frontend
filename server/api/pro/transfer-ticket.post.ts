/**
 * POST /api/pro/transfer-ticket
 * Body: {
 *   expires: number,
 *   files: Array<{ name: string, type?: string, size: number, path?: string }>
 * }
 * Response: {
 *   ticket: string, maxBytes: number, maxTotal: number, maxFiles: number, ttl: number
 * }
 *
 * Mints a single-use ticket for a multi-file transfer. The files service
 * redeems it once via POST /api/pro/upload-ticket/consume, then accepts up to
 * maxFiles files / maxTotal bytes and calls back to register the transfer.
 *
 * 403 — not Pro
 * 422 — invalid file list, limits, TTL, or storage cap
 * 429 — more than 10 mints per minute per IP
 */
import { randomBytes } from 'node:crypto'
import {
  FILE_TICKET_TTL,
  FILE_TTLS,
  PRO_MAX_FILE,
  PRO_MAX_FILES,
  PRO_MAX_TRANSFER,
} from '~~/utils/premium'
import { isBlockedFile, normalizeTransferPath } from '~~/utils/filePolicy'
import { resolvePro } from '../../utils/pro'
import {
  LIVE_FILE_LIMIT,
  STORAGE_CAP,
  licenseHash,
  readLedger,
  reserveLedger,
  redisCommand,
} from '../../utils/proStorage'

type TransferFile = {
  name: string
  type: string
  size: number
  path: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { pro, licenseKey } = await resolvePro(event)
  if (!pro || !licenseKey) {
    throw createError({
      statusCode: 403,
      message: 'Pro is required for multi-file transfers. Activate your license key to continue.',
    })
  }

  const ip = getRequestHeader(event, 'x-forwarded-for') || 'unknown'
  const rateKey = `rate:fticket:${ip}`
  const rate = await redisCommand(config, ['INCR', rateKey])
  await redisCommand(config, ['EXPIRE', rateKey, 60])
  if (rate.result > 10) {
    throw createError({ statusCode: 429, message: 'Too many upload attempts. Please wait a minute and try again.' })
  }

  const body = await readBody(event)
  const expires = Number(body?.expires)
  const rawFiles = Array.isArray(body?.files) ? body.files : []

  if (!FILE_TTLS.includes(expires)) {
    throw createError({ statusCode: 422, message: 'Choose a file expiry of 10 min, 30 min, 1 h, 1 day, 7 days, or 30 days.' })
  }
  if (!rawFiles.length || rawFiles.length > PRO_MAX_FILES) {
    throw createError({
      statusCode: 422,
      message: `Choose between 1 and ${PRO_MAX_FILES} files for a transfer.`,
    })
  }

  const files: TransferFile[] = []
  const seenPaths = new Set<string>()

  for (const raw of rawFiles) {
    const name = typeof raw?.name === 'string' ? raw.name.trim().slice(0, 255) : ''
    const type = typeof raw?.type === 'string' ? raw.type.slice(0, 100) : ''
    const size = Number(raw?.size)
    const path = normalizeTransferPath(raw?.path, name)

    if (!name || !path) {
      throw createError({ statusCode: 422, message: 'Every file needs a valid name and relative path.' })
    }
    if (!Number.isInteger(size) || size <= 0 || size > PRO_MAX_FILE) {
      throw createError({
        statusCode: 422,
        message: `${name} must be between 1 B and ${Math.floor(PRO_MAX_FILE / 1048576)} MB.`,
      })
    }
    if (isBlockedFile(name, type)) {
      throw createError({
        statusCode: 422,
        message: `${name} is an executable or blocked file type. Those are not allowed on any plan.`,
      })
    }

    const pathKey = path.toLowerCase()
    if (seenPaths.has(pathKey)) {
      throw createError({ statusCode: 422, message: `Two selected files use the same path: ${path}.` })
    }
    seenPaths.add(pathKey)
    files.push({ name, type, size, path })
  }

  const total = files.reduce((sum, file) => sum + file.size, 0)
  if (total > PRO_MAX_TRANSFER) {
    throw createError({
      statusCode: 422,
      message: `The transfer is ${Math.ceil(total / 1048576)} MB. Pro transfers are limited to ${Math.floor(PRO_MAX_TRANSFER / 1048576)} MB total.`,
    })
  }

  const ledger = await readLedger(config, licenseKey)
  if (ledger) {
    if (ledger.liveCount >= LIVE_FILE_LIMIT) {
      throw createError({
        statusCode: 422,
        message: `You already have ${LIVE_FILE_LIMIT} live file shares. Wait for some to expire before uploading more.`,
      })
    }
    if (ledger.liveBytes + total > STORAGE_CAP) {
      throw createError({
        statusCode: 422,
        message: 'Pro storage limit reached (2 GB of live uploads). Wait for older files to expire, or delete them by downloading once.',
      })
    }
  }

  const ticket = randomBytes(32).toString('hex')
  const transferId = randomBytes(16).toString('hex')
  const owner = licenseHash(licenseKey)

  await redisCommand(config, [
    'SETEX',
    `fticket:${ticket}`,
    FILE_TICKET_TTL,
    JSON.stringify({
      v: 2,
      kind: 'transfer',
      mb: PRO_MAX_FILE,
      total,
      ttl: expires,
      maxFiles: files.length,
      owner,
      tid: transferId,
    }),
  ])
  await redisCommand(config, [
    'SETEX',
    `transfer:pending:${transferId}`,
    Math.max(3600, expires + 3600),
    JSON.stringify({
      owner,
      total,
      maxFiles: files.length,
      ttl: expires,
      ea: Math.floor(Date.now() / 1000) + expires,
    }),
  ])
  await reserveLedger(config, licenseKey, total, expires)

  return {
    ticket,
    maxBytes: PRO_MAX_FILE,
    maxTotal: PRO_MAX_TRANSFER,
    maxFiles: files.length,
    ttl: expires,
  }
})
