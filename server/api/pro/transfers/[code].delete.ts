/**
 * DELETE /api/pro/transfers/:code
 * Response: { ok: true }
 *
 * Deletes a multi-file transfer created with this Pro license. The transfer
 * summary is only a dashboard index; the files service owns the bytes and the
 * delete request is signed with FILES_DELETE_SECRET.
 *
 * 403 — not Pro, or the transfer belongs to another license
 * 404 — transfer not found or already deleted
 * 502 — files service unavailable
 */
import { createHmac } from 'node:crypto'
import { resolvePro } from '../../../utils/pro'
import { licenseHash, redisCommand } from '../../../utils/proStorage'
import { transferOwnerKey, transferSummaryKey } from '../../../utils/proTransfers'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { pro, licenseKey } = await resolvePro(event)
  if (!pro || !licenseKey) {
    throw createError({ statusCode: 403, message: 'Pro is required to delete a transfer.' })
  }

  const ip = getRequestHeader(event, 'x-forwarded-for') || 'unknown'
  const rateKey = `rate:transfer-delete:${ip}`
  const rate = await redisCommand(config, ['INCR', rateKey])
  if (rate.result === 1) await redisCommand(config, ['EXPIRE', rateKey, 60])
  if (rate.result > 20) {
    throw createError({ statusCode: 429, message: 'Too many requests. Please wait a moment.' })
  }

  const code = (getRouterParam(event, 'code') || '').trim().toUpperCase()
  if (!/^[A-Z0-9]{5}$/.test(code)) {
    throw createError({ statusCode: 404, message: 'Transfer not found or already deleted.' })
  }

  const owner = licenseHash(licenseKey)
  const ownerKey = transferOwnerKey(owner)
  const summaryRes = await redisCommand(config, ['GET', transferSummaryKey(code)])
  if (!summaryRes.result) {
    await redisCommand(config, ['SREM', ownerKey, code])
    throw createError({ statusCode: 404, message: 'Transfer not found or already deleted.' })
  }

  let summary: { owner?: string } = {}
  try {
    summary = JSON.parse(summaryRes.result)
  } catch {
    throw createError({ statusCode: 404, message: 'Transfer not found or already deleted.' })
  }
  if (summary.owner !== owner) {
    throw createError({ statusCode: 403, message: 'You can only delete transfers created with this license key.' })
  }

  const secret = config.FILES_DELETE_SECRET
  if (!secret) {
    throw createError({ statusCode: 503, message: 'Transfer deletion is not configured on this server.' })
  }

  const timestamp = Math.floor(Date.now() / 1000).toString()
  const signature = createHmac('sha256', secret).update(`${code}.${timestamp}`).digest('hex')
  let res: Response
  try {
    res = await fetch(`${config.public.FILES_API_URL}/transfer/${code}`, {
      method: 'DELETE',
      headers: {
        'X-TSN-Timestamp': timestamp,
        'X-TSN-Signature': signature,
      },
      signal: AbortSignal.timeout(10000),
    })
  } catch {
    throw createError({ statusCode: 502, message: 'The file service is unavailable. Try again in a moment.' })
  }

  if (!res.ok && res.status !== 404) {
    throw createError({ statusCode: 502, message: 'The file service could not delete that transfer. Try again in a moment.' })
  }

  await redisCommand(config, ['DEL', transferSummaryKey(code)])
  await redisCommand(config, ['SREM', ownerKey, code])

  return { ok: true }
})
