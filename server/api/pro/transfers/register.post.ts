/**
 * POST /api/pro/transfers/register
 * Body: { transferId: string, code: string, count: number, bytes: number }
 * Response: { ok: true }
 *
 * Called server-to-server by the files service after a transfer is complete.
 * `transferId` is the random 128-bit id returned by ticket consume; it is the
 * bearer credential and is never exposed to the browser.
 *
 * 403 — unknown/expired transferId
 * 409 — code already registered to another license
 * 410 — the transfer grant has expired
 * 422 — count/bytes outside the ticket grant
 */
import { KEY_PREFIX } from '../../../utils/shareCode'
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
    throw createError({ statusCode: 422, message: 'Invalid transfer registration.' })
  }
  if (!Number.isInteger(count) || count <= 0 || !Number.isInteger(bytes) || bytes <= 0) {
    throw createError({ statusCode: 422, message: 'Invalid transfer size or file count.' })
  }

  const pendingRes = await redisCommand(config, ['GET', TRANSFER_PENDING_PREFIX + transferId])
  if (!pendingRes.result) {
    throw createError({ statusCode: 403, message: 'Transfer registration has expired.' })
  }

  let pending: { owner?: string; total?: number; maxFiles?: number; ttl?: number; ea?: number } = {}
  try {
    pending = JSON.parse(pendingRes.result)
  } catch {
    throw createError({ statusCode: 403, message: 'Transfer registration is invalid.' })
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
    throw createError({ statusCode: 422, message: 'Transfer registration is outside the ticket grant.' })
  }

  const textRes = await redisCommand(config, ['GET', KEY_PREFIX + code])
  if (textRes.result) {
    throw createError({ statusCode: 409, message: 'That transfer code is already in use.' })
  }

  const summaryKey = TRANSFER_SUMMARY_PREFIX + code
  const existingRes = await redisCommand(config, ['GET', summaryKey])
  if (existingRes.result) {
    try {
      const existing = JSON.parse(existingRes.result)
      if (existing?.owner && existing.owner !== owner) {
        throw createError({ statusCode: 409, message: 'That transfer code is already registered.' })
      }
    } catch (err: any) {
      if (err?.statusCode) throw err
    }
  }

  const nowSec = Math.floor(Date.now() / 1000)
  if (ea <= nowSec) {
    throw createError({ statusCode: 410, message: 'This transfer grant has expired.' })
  }
  const summaryTtl = Math.max(60, Math.min(Math.floor(ttl), ea - nowSec))
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
      createdAt: now.toISOString(),
    }),
  ])
  await redisCommand(config, ['SADD', transferOwnerKey(owner), code])

  return { ok: true }
})
