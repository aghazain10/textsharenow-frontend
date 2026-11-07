/**
 * PUT /api/pro/shares/:code
 * Body: {
 *   text?: string            — replace the share content (trimmed, Pro limit)
 *   ttl?: number             — new expiry from now: 600|1800|3600|86400|604800
 *                              |2592000|0 (0 = never)
 *   maxReads?: number        — new TOTAL limit: 1|5|10|0 (0 = unlimited)
 *   passwordHash?: string | null — set a new verifier, null clears, omit keeps
 * }
 * Response: { ok: true, changed: string[] }
 *
 * Edits a text share in place: the code and link stay the same, everyone
 * with the link sees the new version next load. Ownership is checked against
 * the per-license share:owner set, same as delete.
 *
 * Read limits are a TOTAL, not a top-up: the reads already used stay used.
 * A new limit at or below the reads used so far is rejected so a receipt
 * can never look like the share granted more than it did.
 *
 * 403 — not Pro, or the share belongs to a different license
 * 404 — code not found or expired
 * 422 — validation failed (content, expiry, read limit, password, encrypted)
 * 429 — more than 20 edits per minute per IP
 */
import { resolvePro } from '../../../utils/pro'
import {
  findShare,
  KEY_PREFIX,
  READS_PREFIX,
  ATTEMPTS_PREFIX,
  parseSharePayload,
  upstash,
  upstashPipeline,
} from '../../../utils/shareCode'
import { decryptAtRest, encryptAtRest } from '../../../utils/cipher'
import { licenseHash } from '../../../utils/proStorage'
import { P2_RE, P3_RE, PBKDF2_ITERATIONS } from '~~/utils/hash'
import { PRO_MAX_CHARS } from '~~/utils/premium'
import { recordReceiptUpdate } from '../../../utils/receipts'

const PRO_TTLS    = [600, 1800, 3600, 86400, 604800, 2592000, 0]
const READ_COUNTS = [1, 5, 10, 0]

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { pro, licenseKey } = await resolvePro(event)
  if (!pro || !licenseKey) {
    throw createError({ statusCode: 403, message: 'Pro is required to edit this share.' })
  }

  setHeader(event, 'Cache-Control', 'no-store')

  const ip = getRequestHeader(event, 'x-forwarded-for') || 'unknown'
  const rateKey = `rate:share-edit:${ip}`
  const rate = await upstash(config, ['INCR', rateKey])
  await upstash(config, ['EXPIRE', rateKey, 60])
  if (rate.result > 20) {
    throw createError({ statusCode: 429, message: 'Too many requests. Please wait a moment.' })
  }

  const body = await readBody(event)
  const has = (key: string) => Object.prototype.hasOwnProperty.call(body ?? {}, key)
  if (!has('text') && !has('ttl') && !has('maxReads') && !has('passwordHash')) {
    throw createError({ statusCode: 422, message: 'Nothing to change.' })
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

  let decoded: string
  try {
    decoded = decryptAtRest(found.raw)
  } catch {
    throw createError({ statusCode: 422, message: 'Could not decrypt that share on this device.' })
  }
  const payload = parseSharePayload(decoded)
  const encrypted = !!payload && payload.enc === 1
  if (encrypted) {
    throw createError({
      statusCode: 422,
      message: "Private-mode shares can't be edited because we never see the key. Create a replacement link instead.",
    })
  }

  const key = KEY_PREFIX + found.code
  const readsKey = READS_PREFIX + found.code
  const attemptsKey = ATTEMPTS_PREFIX + found.code

  const currentText: string = payload?.text ?? decoded
  const currentMr: number =
    payload && typeof payload.mr === 'number' ? payload.mr : 1
  const currentPw: string | null = payload?.pw ?? null

  const [ttlRes, readsRes] = await Promise.all([
    upstash(config, ['TTL', key]),
    upstash(config, ['GET', readsKey]),
  ])
  const keyTtl = typeof ttlRes.result === 'number' ? ttlRes.result : -1
  const ttlProvided = has('ttl')
  const ttlValue = ttlProvided ? Number(body.ttl) : undefined
  if (ttlValue !== undefined && !Number.isInteger(ttlValue)) {
    throw createError({ statusCode: 422, message: 'Invalid expiry.' })
  }
  if (ttlValue !== undefined && !PRO_TTLS.includes(ttlValue)) {
    throw createError({ statusCode: 422, message: 'Expiry must be one of the Pro presets (including Never).' })
  }

  const used = Number.parseInt(String(readsRes.result ?? '0'), 10) || 0

  // ── Text ──────────────────────────────────────────────────────────────
  let text = currentText
  let textChanged = false
  if (has('text')) {
    if (typeof body.text !== 'string') {
      throw createError({ statusCode: 422, message: 'Invalid text.' })
    }
    text = body.text.trim()
    if (!text) {
      throw createError({ statusCode: 422, message: 'A share needs some text.' })
    }
    if (text.length > PRO_MAX_CHARS) {
      throw createError({
        statusCode: 422,
        message: `Text cannot exceed ${PRO_MAX_CHARS.toLocaleString('en-US')} characters.`,
      })
    }
    textChanged = text !== currentText
  }

  // ── Read limit (TOTAL, not a top-up) ──────────────────────────────────
  let maxReads = currentMr
  let readsChanged = false
  if (has('maxReads')) {
    const requested = Number(body.maxReads)
    if (!Number.isInteger(requested) || !READ_COUNTS.includes(requested)) {
      throw createError({ statusCode: 422, message: 'Choose 1, 5, 10 or unlimited reads.' })
    }
    const changed = requested !== currentMr
    if (changed && requested > 1 && used >= requested) {
      throw createError({
        statusCode: 422,
        message: `That share has already been read ${used} time${used === 1 ? '' : 's'}. Choose a higher limit, or unlimited.`,
      })
    }
    maxReads = requested
    readsChanged = changed
  }

  // ── Password ──────────────────────────────────────────────────────────
  let passwordHash: string | null = currentPw
  let passwordChanged = false
  if (has('passwordHash')) {
    const raw = body.passwordHash
    if (raw === null || raw === '') {
      // Removing the password.
      passwordHash = null
      passwordChanged = currentPw !== null
    } else if (typeof raw !== 'string' || !raw.trim()) {
      throw createError({ statusCode: 422, message: 'Invalid password.' })
    } else {
      const verifier = raw.trim()
      const p2 = P2_RE.exec(verifier)
      const p3 = P3_RE.exec(verifier)
      const matched = p2 || p3
      if (!matched || matched[1] !== String(PBKDF2_ITERATIONS)) {
        throw createError({ statusCode: 422, message: 'Invalid password. Please try again.' })
      }
      // P2 is the standard format; P3 only makes sense for Private mode and
      // Private-mode shares can never reach this handler.
      if (!p2) {
        throw createError({ statusCode: 422, message: 'Invalid password format for this share.' })
      }
      passwordHash = verifier
      passwordChanged = verifier !== currentPw
    }
  }

  const changedFields: string[] = []
  if (textChanged) changedFields.push('text')
  if (ttlProvided) changedFields.push('expiry')
  if (readsChanged) changedFields.push('reads')
  if (passwordChanged) changedFields.push('password')

  if (!changedFields.length && !ttlProvided) {
    return { ok: true, changed: [] }
  }

  // ── Build the new stored payload the same way create does ─────────────
  const newText = text
  const newMr = maxReads
  let stored = newText
  const wantsJson = !!passwordHash || newMr !== 1
  if (wantsJson) {
    const out: Record<string, unknown> = { __tsn: 1, text: newText, mr: newMr }
    if (passwordHash) out.pw = passwordHash
    stored = JSON.stringify(out)
  }
  stored = encryptAtRest(stored)

  const pipeline: unknown[][] = []
  const setCmd: unknown[] = ['SET', key, stored]
  if (ttlProvided && ttlValue !== undefined) {
    if (ttlValue > 0) setCmd.push('EX', ttlValue)
    // ttlValue === 0 → SET without an expiry (never expires)
  } else {
    setCmd.push('KEEPTTL')
  }
  pipeline.push(setCmd)

  if (ttlProvided && ttlValue !== undefined) {
    if (ttlValue > 0) pipeline.push(['EXPIRE', readsKey, ttlValue])
    else pipeline.push(['PERSIST', readsKey])
  }
  // Switching to a single read (or burning after read) makes the used
  // counter meaningless — drop it so a later top-up starts from zero.
  if (readsChanged && newMr <= 1) {
    pipeline.push(['DEL', readsKey])
  }
  // A new or removed password must not inherit stale wrong-attempt counters —
  // otherwise a share that was nearly burned stays nearly burned.
  if (passwordChanged) {
    pipeline.push(['DEL', attemptsKey])
  }

  const written = await upstashPipeline(config, pipeline)
  const setReply = Array.isArray(written) ? written[0]?.result : null
  if (setReply !== 'OK' && setReply !== true && setReply !== 1) {
    // Upstash SET returns "OK"; anything else means the write did not happen.
    if (setReply !== 'OK') {
      throw createError({ statusCode: 502, message: 'Could not save the changes. Please try again.' })
    }
  }

  try {
    await recordReceiptUpdate(config, found.code, {
      ...(ttlProvided && ttlValue !== undefined ? { ttl: ttlValue } : {}),
      ...(readsChanged ? { maxReads: newMr } : {}),
      ...(passwordChanged ? { passwordRequired: !!passwordHash } : {}),
      fields: changedFields,
    })
  } catch {
    // The share is already updated; the receipt is a nice-to-have event.
  }

  return {
    ok: true,
    changed: changedFields,
    ttl: ttlProvided && ttlValue !== undefined && ttlValue > 0 ? ttlValue : ttlProvided ? null : (keyTtl >= 0 ? keyTtl : null),
    maxReads: newMr,
  }
})
