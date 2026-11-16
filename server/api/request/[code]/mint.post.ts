/**
 * POST /api/request/:code/mint
 * Response: { ok: true, ticket, ttl, maxBytes }
 *
 * Mints a single-file, single-use upload ticket for a stranger on a file-
 * enabled request. The ticket is capacity-coupled to the request's remaining
 * submissions and owned by the requester's license — the stranger stays
 * anonymous and authenticated never to anything.
 *
 * The file itself goes to the files service via the standard /transfer
 * path (kind=transfer everywhere it already exists). No changes there.
 *
 * 403 — not a file request / wrong plan  ·  410 — request complete
 */
import { randomBytes } from 'node:crypto'
import { upstash } from '../../../utils/shareCode'
import { loadRequest, REQUEST_LEFT_PREFIX } from '../../../utils/requestStore'
import { licenseHash } from '../../../utils/proStorage'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const raw = String(getRouterParam(event, 'code') || '').trim()

  const ip = getRequestHeader(event, 'x-forwarded-for') || 'unknown'
  const rateKey = `rate:request:mint:${ip}`
  const rate = await upstash(config, ['INCR', rateKey])
  await upstash(config, ['EXPIRE', rateKey, 3600])
  if (Number(rate.result) > 10) {
    throw createError({ statusCode: 429, message: 'Too many uploads from this connection. Wait a bit.' })
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
  if (!meta.files) {
    throw createError({ statusCode: 422, message: "This request doesn't accept files." })
  }
  if (!meta.owner) {
    throw createError({ statusCode: 403, message: 'File requests need a Pro creator.' })
  }
  const maxBytes = Number(meta.maxBytes) || 25 * 1048576

  // Loose capacity check — the authoritative consume happens at registration.
  const leftRes = await upstash(config, ['GET', REQUEST_LEFT_PREFIX + code])
  if (Number(leftRes.result) <= 0) {
    throw createError({ statusCode: 410, message: 'This request is complete — everything it asked for was received.' })
  }

  const owner = meta.owner // 64-hex licHash (file requests are always Pro)
  const ttl = Math.max(300, (meta.expiresAt || now + 3600) - now)
  const ticket = randomBytes(32).toString('hex')
  const transferId = randomBytes(16).toString('hex')

  // Standard transfer ticket shape — the files service needs nothing new.
  await upstash(config, [
    'SETEX',
    `fticket:${ticket}`,
    600,
    JSON.stringify({
      v: 2,
      kind: 'transfer',
      mb: maxBytes,
      total: maxBytes,
      ttl,
      maxFiles: 1,
      enc: false,
      owner,
      tid: transferId,
    }),
  ])
  await upstash(config, [
    'SETEX',
    `transfer:pending:${transferId}`,
    Math.max(3600, ttl + 3600),
    JSON.stringify({
      owner,
      total: maxBytes,
      maxFiles: 1,
      ttl,
      ea: now + ttl,
      req: code, // the files-service callback tags our request inbox with this
    }),
  ])

  setHeader(event, 'Cache-Control', 'no-store')
  return { ok: true, ticket, ttl, maxBytes }
})
