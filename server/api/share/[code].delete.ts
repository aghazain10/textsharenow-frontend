/**
 * DELETE /api/share/:code
 * Response: { ok: true }
 *
 * Deletes a share created with the same Pro license — either the browser
 * session cookie or `Authorization: Bearer <license-key>` (API + MCP).
 * Ownership is checked against the per-license share:owner set written at
 * creation time, so a valid key can never delete someone else's share.
 *
 * 403 — not Pro, or the share belongs to a different license
 * 404 — code not found or expired
 * 429 — more than 20 deletes per minute per IP
 */
import { createHash } from 'node:crypto'
import { resolvePro } from '../../utils/pro'
import {
  findShare,
  upstash,
  KEY_PREFIX,
  READS_PREFIX,
  ATTEMPTS_PREFIX,
} from '../../utils/shareCode'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const { pro, licenseKey } = await resolvePro(event)
  if (!pro || !licenseKey) {
    throw createError({ statusCode: 403, message: 'Pro is required to delete a share.' })
  }

  const rawInput = (getRouterParam(event, 'code') || '').trim()

  // Rate limiting — 20 deletes per minute per IP
  const ip = getRequestHeader(event, 'x-forwarded-for') || 'unknown'
  const rateKey = `rate:delete:${ip}`
  const rate = await upstash(config, ['INCR', rateKey])
  if (rate.result === 1) await upstash(config, ['EXPIRE', rateKey, 60])
  if (rate.result > 20) {
    throw createError({ statusCode: 429, message: 'Too many requests. Please wait a moment.' })
  }

  const found = await findShare(config, rawInput)
  if (!found) {
    throw createError({ statusCode: 404, message: 'Code not found or has expired.' })
  }

  const licHash = createHash('sha256').update(licenseKey.trim()).digest('hex')
  const ownerKey = `share:owner:${licHash}`
  const owner = await upstash(config, ['SISMEMBER', ownerKey, found.code])
  if (owner.result !== 1) {
    throw createError({ statusCode: 403, message: 'You can only delete shares you created with this license key.' })
  }

  await upstash(config, ['DEL', KEY_PREFIX + found.code])
  await upstash(config, ['DEL', READS_PREFIX + found.code])
  await upstash(config, ['DEL', ATTEMPTS_PREFIX + found.code])
  await upstash(config, ['SREM', ownerKey, found.code])

  // Free the custom-code cap slot if this was a custom code.
  try {
    await upstash(config, ['SREM', `custom:owner:${licHash}`, found.code])
  } catch {
    // Non-critical
  }

  return { ok: true }
})
