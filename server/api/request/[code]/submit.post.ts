/**
 * POST /api/request/:code/submit
 * Body: { text: string }
 * Response: { ok: true }
 *
 * Free (anonymous) submissions of text against a request link. The text is
 * envelope-encrypted at rest and readable only through the owner's
 * authenticated dashboard. 410 when the request is exhausted.
 */
import { upstash } from '../../../utils/shareCode'
import { encryptAtRest } from '../../../utils/cipher'
import {
  loadRequest,
  consumeSubmissionSlot,
  inboxKey,
  REQUEST_LEFT_PREFIX,
  MAX_REQUEST_SUBMITS,
  TEXT_SUBMIT_MAX_CHARS,
} from '../../../utils/requestStore'
import { notifyOnRequestSubmit } from '../../../utils/notify'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const raw = String(getRouterParam(event, 'code') || '').trim()

  const ip = getRequestHeader(event, 'x-forwarded-for') || 'unknown'
  const rateKey = `rate:request:submit:${ip}`
  const rate = await upstash(config, ['INCR', rateKey])
  await upstash(config, ['EXPIRE', rateKey, 3600])
  if (Number(rate.result) > 20) {
    throw createError({ statusCode: 429, message: 'Too many submissions from this connection. Wait a moment.' })
  }

  const found = await loadRequest(config, raw)
  if (!found) {
    throw createError({ statusCode: 404, message: "That request link doesn't exist or has expired." })
  }
  const { code, meta } = found

  const now = Math.floor(Date.now() / 1000)
  if (meta.expiresAt && now >= meta.expiresAt) {
    throw createError({ statusCode: 410, message: 'This request has expired.' })
  }

  const body = await readBody(event).catch(() => ({}))
  const text = typeof body?.text === 'string' ? body.text.trim() : ''
  if (!text) {
    throw createError({ statusCode: 422, message: 'Type something first.' })
  }
  if (text.length > TEXT_SUBMIT_MAX_CHARS) {
    throw createError({ statusCode: 422, message: `That's over ${TEXT_SUBMIT_MAX_CHARS.toLocaleString('en-US')} characters.` })
  }

  if (!(await consumeSubmissionSlot(config, code))) {
    throw createError({ statusCode: 410, message: 'This request is complete — everything it asked for was received.' })
  }

  const payload = encryptAtRest(JSON.stringify({ t: now, kind: 'text', body: text }))
  const inbox = inboxKey(code)
  await upstash(config, ['LPUSH', inbox, payload])
  await upstash(config, ['LTRIM', inbox, 0, MAX_REQUEST_SUBMITS - 1])
  // Inbox lifetime mirrors the request plus a grace period for the owner to read.
  const remainingTtl = Math.max(86400, (meta.expiresAt || now) - now + 30 * 86400)
  await upstash(config, ['EXPIRE', inbox, remainingTtl])

  // File-like submissions land via /transfer (mint endpoint); text submits are done.
  if (meta.owner && meta.notify) {
    try { await notifyOnRequestSubmit(config, meta.owner, meta.label, 'text') } catch {}
  }

  setHeader(event, 'Cache-Control', 'no-store')
  return { ok: true }
})
