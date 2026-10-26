/**
 * GET /api/pro/receipts/:code
 * Response: { receipt: {...}, events: [...] }
 *
 * Private receipt for one text share. Requires the same Pro license that
 * created the share. Never returns the share content or password hash.
 *
 * 403 — not Pro, or the receipt belongs to a different license
 * 404 — receipt not found or past its 90-day retention window
 * 429 — more than 30 receipt loads per minute per IP
 */
import { resolvePro } from '../../../utils/pro'
import { upstash } from '../../../utils/shareCode'
import { getReceiptRecord, resolveReceiptCode } from '../../../utils/receipts'
import { licenseHash } from '../../../utils/proStorage'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { pro, licenseKey } = await resolvePro(event)
  if (!pro || !licenseKey) {
    throw createError({ statusCode: 403, message: 'Pro is required to view this receipt.' })
  }

  setHeader(event, 'Cache-Control', 'no-store')

  const ip = getRequestHeader(event, 'x-forwarded-for') || 'unknown'
  const rateKey = `rate:receipt:${ip}`
  const rate = await upstash(config, ['INCR', rateKey])
  await upstash(config, ['EXPIRE', rateKey, 60])
  if (rate.result > 30) {
    throw createError({ statusCode: 429, message: 'Too many requests. Please wait a moment.' })
  }

  const rawCode = (getRouterParam(event, 'code') || '').trim()
  const resolved = await resolveReceiptCode(config, rawCode)
  if (!resolved) {
    throw createError({ statusCode: 404, message: 'Receipt not found or no longer available.' })
  }

  if (resolved.meta.owner !== licenseHash(licenseKey)) {
    throw createError({ statusCode: 403, message: 'This receipt belongs to a different Pro license.' })
  }

  const record = await getReceiptRecord(config, resolved.code)
  if (!record) {
    throw createError({ statusCode: 404, message: 'Receipt not found or no longer available.' })
  }

  const { events, ...receipt } = record
  return { receipt, events }
})
