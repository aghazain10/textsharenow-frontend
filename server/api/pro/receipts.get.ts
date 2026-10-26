/**
 * GET /api/pro/receipts
 * Response: { receipts: [...] }
 *
 * Lists recent text-share receipts for the signed Pro license, including
 * shares that have expired, been used up, or been deleted. Receipts are kept
 * for 90 days after the share closes, so this is how the dashboard exposes
 * that history after the live share disappears.
 *
 * 403 — not Pro
 * 429 — more than 30 receipt loads per minute per IP
 */
import { resolvePro } from '../../utils/pro'
import { upstash } from '../../utils/shareCode'
import { listReceipts } from '../../utils/receipts'
import { licenseHash } from '../../utils/proStorage'

const MAX_RECEIPTS = 100

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { pro, licenseKey } = await resolvePro(event)
  if (!pro || !licenseKey) {
    throw createError({ statusCode: 403, message: 'Pro is required to view receipts.' })
  }

  setHeader(event, 'Cache-Control', 'no-store')

  const ip = getRequestHeader(event, 'x-forwarded-for') || 'unknown'
  const rateKey = `rate:receipts:${ip}`
  const rate = await upstash(config, ['INCR', rateKey])
  if (rate.result === 1) await upstash(config, ['EXPIRE', rateKey, 60])
  if (rate.result > 30) {
    throw createError({ statusCode: 429, message: 'Too many requests. Please wait a moment.' })
  }

  const receipts = await listReceipts(config, licenseHash(licenseKey), MAX_RECEIPTS)
  return { receipts }
})
