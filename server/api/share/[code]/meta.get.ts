/**
 * GET /api/share/:code/meta
 * Response: { exists, code, ttl, expiresAt, maxReads, readsLeft,
 *             passwordRequired, encrypted }
 *
 * Peeks at a share without consuming a read — useful for MCP clients that
 * want to check whether a code is still valid before retrieving it, and for
 * browsers that hold no #k= key (so they can detect an end-to-end encrypted
 * share BEFORE a keyless fetch would burn it).
 * Never returns the text, ciphertext, or the password hash.
 *
 * 404 — code not found or expired
 * 429 — more than 60 peeks per minute per IP
 */
import {
  findShare,
  parseSharePayload,
  upstash,
  KEY_PREFIX,
  READS_PREFIX,
} from '../../../utils/shareCode'
import { decryptAtRest } from '../../../utils/cipher'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const rawInput = (getRouterParam(event, 'code') || '').trim()

  // Rate limiting — 60 peeks per minute per IP
  const ip = getRequestHeader(event, 'x-forwarded-for') || 'unknown'
  const rateKey = `rate:meta:${ip}`
  const rate = await upstash(config, ['INCR', rateKey])
  if (rate.result === 1) await upstash(config, ['EXPIRE', rateKey, 60])
  if (rate.result > 60) {
    throw createError({ statusCode: 429, message: 'Too many requests. Please wait a moment.' })
  }

  const found = await findShare(config, rawInput)
  if (!found) {
    throw createError({ statusCode: 404, message: 'Code not found or has expired.' })
  }

  const payload = parseSharePayload(decryptAtRest(found.raw))
  const maxReads = payload && typeof payload.mr === 'number' ? payload.mr : 1

  let readsLeft: number | null = null
  if (maxReads === 0) {
    readsLeft = null
  } else if (maxReads > 1) {
    const reads = await upstash(config, ['GET', READS_PREFIX + found.code])
    const used = Number.parseInt(reads.result ?? '0', 10) || 0
    readsLeft = Math.max(0, maxReads - used)
  } else {
    readsLeft = 1
  }

  const ttlRes = await upstash(config, ['TTL', KEY_PREFIX + found.code])
  const ttl = typeof ttlRes.result === 'number' ? ttlRes.result : -1

  return {
    exists: true,
    code: found.code,
    ttl: ttl >= 0 ? ttl : null,
    expiresAt: ttl > 0 ? new Date(Date.now() + ttl * 1000).toISOString() : null,
    maxReads,
    readsLeft,
    passwordRequired: !!payload?.pw,
    encrypted: payload?.enc === 1,
  }
})
