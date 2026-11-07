/**
 * POST /api/pro/shares/seen
 * Response: { seenAt: number }
 *
 * Marks the dashboard as read. The next /api/pro/shares load returns this
 * timestamp so the UI can show "new activity" badges on shares that were
 * opened or downloaded since the owner last looked.
 *
 * 403 — not Pro
 * 429 — more than 30 marks per minute per IP
 */
import { resolvePro } from '../../../utils/pro'
import { upstash } from '../../../utils/shareCode'
import { receiptSeenKey, RECEIPT_NEVER_TTL } from '../../../utils/receipts'
import { licenseHash } from '../../../utils/proStorage'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { pro, licenseKey } = await resolvePro(event)
  if (!pro || !licenseKey) {
    throw createError({ statusCode: 403, message: 'Pro is required to manage your shares.' })
  }

  setHeader(event, 'Cache-Control', 'no-store')

  const ip = getRequestHeader(event, 'x-forwarded-for') || 'unknown'
  const rateKey = `rate:shares-seen:${ip}`
  const rate = await upstash(config, ['INCR', rateKey])
  await upstash(config, ['EXPIRE', rateKey, 60])
  if (rate.result > 30) {
    throw createError({ statusCode: 429, message: 'Too many requests. Please wait a moment.' })
  }

  const seenAt = Math.floor(Date.now() / 1000)
  await upstash(config, [
    'SET',
    receiptSeenKey(licenseHash(licenseKey)),
    String(seenAt),
    'EX',
    RECEIPT_NEVER_TTL,
  ])

  return { seenAt }
})
