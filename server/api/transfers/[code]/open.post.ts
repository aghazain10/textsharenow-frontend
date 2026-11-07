/**
 * POST /api/transfers/:code/open
 * Response: { ok: true }
 *
 * Public beacon fired by the receive page when a transfer link is opened. It
 * only writes an "opened" event on the owner's existing receipt — no content,
 * IP address, or device data is stored. Unknown or non-transfer codes are
 * ignored so this endpoint never reveals whether a code exists.
 *
 * 429 — more than 60 beacons per minute per IP
 */
import { resolveReceiptCode, recordReceiptOpen } from '../../../utils/receipts'
import { upstash } from '../../../utils/shareCode'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  setHeader(event, 'Cache-Control', 'no-store')

  const ip = getRequestHeader(event, 'x-forwarded-for') || 'unknown'
  const rateKey = `rate:transfer-open:${ip}`
  const rate = await upstash(config, ['INCR', rateKey])
  await upstash(config, ['EXPIRE', rateKey, 60])
  if (rate.result > 60) {
    throw createError({ statusCode: 429, message: 'Too many requests. Please wait a moment.' })
  }

  const code = (getRouterParam(event, 'code') || '').trim().toUpperCase()
  if (!/^[A-Z0-9]{5}$/.test(code)) return { ok: true }

  try {
    const resolved = await resolveReceiptCode(config, code)
    if (!resolved || resolved.meta.kind !== 'transfer') return { ok: true }
    await recordReceiptOpen(config, resolved.code)
  } catch {
    // Best-effort telemetry only.
  }

  return { ok: true }
})
