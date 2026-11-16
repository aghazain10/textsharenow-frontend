/**
 * POST /api/request/:code/delete
 * Body: { token: string } — the anonymous creator's manage token
 * Response: { ok: true }
 *
 * Burns a request early — creator's right and escape hatch. Idempotent.
 * Text submissions tied to this request are wiped with it (they were the
 * creator's to dispose of); already-sent file transfer payloads live on
 * in the files service as usual.
 */
import { upstash } from '../../../utils/shareCode'
import {
  loadRequest,
  manageTokenMatches,
  inboxKey,
  REQUEST_LEFT_PREFIX,
  REQUEST_OWNER_PREFIX,
  REQUEST_PREFIX,
} from '../../../utils/requestStore'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const rawCode = String(getRouterParam(event, 'code') || '').trim()

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
    return { ok: true } // idempotent even for strangers
  }
  const { code, meta } = found

  await upstash(config, ['DEL', REQUEST_PREFIX + code])
  await upstash(config, ['DEL', REQUEST_LEFT_PREFIX + code])
  await upstash(config, ['DEL', inboxKey(code)])
  if (meta.owner) {
    try {
      await upstash(config, ['ZREM', REQUEST_OWNER_PREFIX + meta.owner, code])
    } catch {}
  }

  return { ok: true }
})
