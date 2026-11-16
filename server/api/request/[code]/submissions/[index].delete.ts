/**
 * DELETE /api/request/:code/submissions/:index
 * Body: { token: string } — anonymous creator's manage token
 * Response: { ok: true, remaining: number }
 *
 * Deletes one inbox submission by position (newest-first) for a
 * token-managed request. The request itself stays.
 */
import { upstash } from '../../../../utils/shareCode'
import {
  loadRequest,
  manageTokenMatches,
  inboxKey,
} from '../../../../utils/requestStore'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const rawCode = String(getRouterParam(event, 'code') || '').trim()
  const index = Number(getRouterParam(event, 'index') || '')
  if (!Number.isInteger(index) || index < 0 || index >= 25) {
    throw createError({ statusCode: 422, message: 'Invalid submission index.' })
  }

  const ip = getRequestHeader(event, 'x-forwarded-for') || 'unknown'
  const rateKey = `rate:request:burn:${ip}`
  const rate = await upstash(config, ['INCR', rateKey])
  await upstash(config, ['EXPIRE', rateKey, 60])
  if (Number(rate.result) > 20) {
    throw createError({ statusCode: 429, message: 'Slow down for a moment.' })
  }

  const body = await readBody(event).catch(() => ({}))
  const token = typeof body?.token === 'string' ? body.token : ''

  const found = await loadRequest(config, rawCode)
  if (!found || !manageTokenMatches(found.meta, token)) {
    throw createError({ statusCode: 404, message: "That link doesn't exist." })
  }
  const code = found.code

  const inbox = inboxKey(code)
  const res = await upstash(config, ['LRANGE', inbox, 0, 24])
  const rows: string[] = Array.isArray(res.result) ? res.result : []
  if (index >= rows.length) {
    return { ok: true, remaining: rows.length }
  }
  await upstash(config, ['LREM', inbox, 1, rows[index]])
  return { ok: true, remaining: Math.max(0, rows.length - 1) }
})
