/**
 * POST /api/pro/transfers/sync
 * Body: { transferId: string, code: string, count: number, bytes: number }
 * Response: { ok: true }
 *
 * Called server-to-server by the files service as files are downloaded. Keeps
 * the dashboard summary accurate and removes it once the transfer is empty.
 * `transferId` is the same private bearer credential used at registration.
 *
 * 403 — unknown/expired transferId
 * 409 — code already registered to another license
 * 410 — the transfer grant has expired
 * 422 — count/bytes outside the ticket grant
 */
import { redisCommand } from '../../../utils/proStorage'
import {
  TRANSFER_PENDING_PREFIX,
  TRANSFER_SUMMARY_PREFIX,
  transferOwnerKey,
} from '../../../utils/proTransfers'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  const transferId = typeof body?.transferId === 'string' ? body.transferId : ''
  const code = typeof body?.code === 'string' ? body.code.trim().toUpperCase() : ''
  const count = Number(body?.count)
  const bytes = Number(body?.bytes)

  if (!/^[a-f0-9]{32}$/.test(transferId) || !/^[A-Z0-9]{5}$/.test(code)) {
    throw createError({ statusCode: 422, message: 'Invalid transfer update.' })
  }
  if (
    !Number.isInteger(count) ||
    count < 0 ||
    !Number.isInteger(bytes) ||
    bytes < 0 ||
    (count === 0 ? bytes !== 0 : bytes <= 0)
  ) {
    throw createError({ statusCode: 422, message: 'Invalid remaining transfer size or file count.' })
  }

  const pendingRes = await redisCommand(config, ['GET', TRANSFER_PENDING_PREFIX + transferId])
  if (!pendingRes.result) {
    throw createError({ statusCode: 403, message: 'Transfer update has expired.' })
  }

  let pending: { owner?: string; total?: number; maxFiles?: number; ttl?: number; ea?: number } = {}
  try {
    pending = JSON.parse(pendingRes.result)
  } catch {
    throw createError({ statusCode: 403, message: 'Transfer update is invalid.' })
  }

  const owner = typeof pending.owner === 'string' ? pending.owner : ''
  const total = Number(pending.total)
  const maxFiles = Number(pending.maxFiles)
  const ttl = Number(pending.ttl)
  const ea = Number(pending.ea)

  if (
    !/^[a-f0-9]{64}$/.test(owner) ||
    !Number.isFinite(total) ||
    !Number.isInteger(maxFiles) ||
    !Number.isFinite(ttl) ||
    !Number.isFinite(ea) ||
    count > maxFiles ||
    bytes > total
  ) {
    throw createError({ statusCode: 422, message: 'Transfer update is outside the ticket grant.' })
  }

  const summaryKey = TRANSFER_SUMMARY_PREFIX + code
  const ownerKey = transferOwnerKey(owner)

  const existingRes = await redisCommand(config, ['GET', summaryKey])
  let existing: { owner?: string; createdAt?: string } = {}
  if (existingRes.result) {
    try {
      existing = JSON.parse(existingRes.result)
    } catch {
      existing = {}
    }
    if (existing.owner && existing.owner !== owner) {
      throw createError({ statusCode: 409, message: 'That transfer code is already registered.' })
    }
  }

  if (count === 0) {
    await redisCommand(config, ['DEL', summaryKey])
    await redisCommand(config, ['SREM', ownerKey, code])
    return { ok: true }
  }

  const nowSec = Math.floor(Date.now() / 1000)
  if (ea <= nowSec) {
    throw createError({ statusCode: 410, message: 'This transfer grant has expired.' })
  }

  const remainingGrant = ea - nowSec
  const ttlRes = await redisCommand(config, ['TTL', summaryKey])
  const existingTtl = typeof ttlRes.result === 'number' && ttlRes.result > 0
    ? ttlRes.result
    : remainingGrant
  const summaryTtl = Math.max(60, Math.min(existingTtl, remainingGrant))
  const now = new Date()

  await redisCommand(config, [
    'SETEX',
    summaryKey,
    summaryTtl,
    JSON.stringify({
      owner,
      count,
      bytes,
      ttl: Math.floor(ttl),
      expiresAt: new Date(ea * 1000).toISOString(),
      createdAt: existing.createdAt || now.toISOString(),
    }),
  ])
  await redisCommand(config, ['SADD', ownerKey, code])

  return { ok: true }
})
