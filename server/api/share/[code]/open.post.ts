/**
 * POST /api/share/:code/open
 * Response: { ok: true, tracked: boolean }
 *
 * Records an "opened" event for a Pro text share without consuming a read or
 * returning any content. The receive box calls this when a code is submitted,
 * before the password prompt, so the receipt can distinguish "opened" from
 * "read". Free/legacy shares have no receipt and simply return tracked:false.
 *
 * 404 — code not found or expired
 * 429 — more than 60 opens per minute per IP
 */
import { findShare, upstash } from '../../../utils/shareCode'
import { recordReceiptOpen } from '../../../utils/receipts'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const rawInput = (getRouterParam(event, 'code') || '').trim()

  const ip = getRequestHeader(event, 'x-forwarded-for') || 'unknown'
  const rateKey = `rate:open:${ip}`
  const rate = await upstash(config, ['INCR', rateKey])
  if (rate.result === 1) await upstash(config, ['EXPIRE', rateKey, 60])
  if (rate.result > 60) {
    throw createError({ statusCode: 429, message: 'Too many requests. Please wait a moment.' })
  }

  const found = await findShare(config, rawInput)
  if (!found) {
    throw createError({ statusCode: 404, message: 'Code not found or has expired.' })
  }

  setHeader(event, 'Cache-Control', 'no-store')
  let tracked = false
  try { tracked = await recordReceiptOpen(config, found.code) } catch {}
  return { ok: true, tracked }
})
