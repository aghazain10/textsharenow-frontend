/**
 * GET /api/pro/shares/:code
 * Response: {
 *   code, custom, ttl, maxReads, readsUsed, passwordRequired,
 *   encrypted, editable, text?
 * }
 *
 * Content source for the My Shares editor. Returns the stored text of a
 * server-readable share owned by this license — never the password hash or
 * decryption-key material. Private-mode (encrypted) shares return no content
 * because the server cannot read them; the UI offers a replacement link.
 *
 * 403 — not Pro, or the share belongs to a different license
 * 404 — code not found or expired
 * 429 — more than 30 loads per minute per IP
 */
import { resolvePro } from '../../../utils/pro'
import {
  KEY_PREFIX,
  READS_PREFIX,
  findShare,
  parseSharePayload,
  upstash,
} from '../../../utils/shareCode'
import { decryptAtRest } from '../../../utils/cipher'
import { licenseHash } from '../../../utils/proStorage'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { pro, licenseKey } = await resolvePro(event)
  if (!pro || !licenseKey) {
    throw createError({ statusCode: 403, message: 'Pro is required to edit this share.' })
  }

  setHeader(event, 'Cache-Control', 'no-store')

  const ip = getRequestHeader(event, 'x-forwarded-for') || 'unknown'
  const rateKey = `rate:share-source:${ip}`
  const rate = await upstash(config, ['INCR', rateKey])
  await upstash(config, ['EXPIRE', rateKey, 60])
  if (rate.result > 30) {
    throw createError({ statusCode: 429, message: 'Too many requests. Please wait a moment.' })
  }

  const rawInput = (getRouterParam(event, 'code') || '').trim()
  const found = await findShare(config, rawInput)
  if (!found) {
    throw createError({ statusCode: 404, message: 'Code not found or has expired.' })
  }

  const licHash = licenseHash(licenseKey)
  const owner = await upstash(config, ['SISMEMBER', `share:owner:${licHash}`, found.code])
  if (owner.result !== 1) {
    throw createError({ statusCode: 403, message: 'You can only edit shares you created with this license key.' })
  }

  const [ttlRes, readsRes, customRes] = await Promise.all([
    upstash(config, ['TTL', KEY_PREFIX + found.code]),
    upstash(config, ['GET', READS_PREFIX + found.code]),
    upstash(config, ['SISMEMBER', `custom:owner:${licHash}`, found.code]),
  ])
  const keyTtl = typeof ttlRes.result === 'number' ? ttlRes.result : -1
  const ttl = keyTtl >= 0 ? keyTtl : null
  const used = Number.parseInt(String(readsRes.result ?? '0'), 10) || 0

  let decoded: string
  try {
    decoded = decryptAtRest(found.raw)
  } catch {
    throw createError({ statusCode: 422, message: 'Could not decrypt that share on this device.' })
  }

  const payload = parseSharePayload(decoded)
  const encrypted = !!payload && payload.enc === 1
  const maxReads = payload && typeof payload.mr === 'number' ? payload.mr : 1
  const readsUsed = maxReads > 1 ? used : maxReads === 0 ? null : 0

  const base = {
    code: found.code,
    kind: 'text' as const,
    encrypted,
    editable: !encrypted,
    custom: customRes.result === 1,
    ttl,
    maxReads,
    readsUsed,
    passwordRequired: !!payload?.pw,
  }

  if (encrypted) return base
  return { ...base, text: payload?.text ?? decoded }
})
