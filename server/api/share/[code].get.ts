/**
 * GET /api/share/:code
 * Password (when required) is sent in the `x-share-password` header. The
 * legacy `?pw=` query parameter is still accepted for older clients but is
 * deprecated — query strings end up in access logs.
 * Response: { text: string, readsLeft?: number | null }            — plain shares
 *   or:     { ct: string, enc: 1, readsLeft?: number | null }      — E2E shares
 *
 * Retrieves the share from Upstash Redis by code (decrypting it at rest).
 *  - Plain-text shares are deleted after one read.
 *  - End-to-end encrypted shares (__tsn 2) return only the stored
 *    ciphertext; the decryption key lives in the link's #k= fragment and
 *    never reached the server, so we hand back what we cannot read.
 *  - Password-protected shares require the PBKDF2 verifier in the header.
 *    Missing password → 401 with the KDF params the browser needs to derive
 *    the value (salt + iterations + verifier format). Wrong password → 403,
 *    and ten wrong attempts within 15 minutes permanently delete the share.
 *  - Multi-read shares (mr > 1) keep a per-share read counter and delete
 *    only once the limit is reached. mr === 0 means unlimited reads.
 *  - Pro text shares also record a private receipt event for each read.
 * Returns 404 if code not found or expired.
 */

import { timingSafeEqual } from 'node:crypto'
import { P2_RE, P3_RE } from '~~/utils/hash'
import { closeReceipt, recordReceiptRead } from '../../utils/receipts'
import { decryptAtRest } from '../../utils/cipher'

const KEY_PREFIX  = 'share:'
const READS_PREFIX = 'reads:'
const ATTEMPTS_PREFIX = 'pwa:'
const MAX_PW_ATTEMPTS = 10
const PW_ATTEMPT_WINDOW = 900

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  return ab.length === bb.length && timingSafeEqual(ab, bb)
}

async function upstashRequest(url: string, token: string, command: unknown[]) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  })

  if (!response.ok) {
    throw new Error(`Upstash error: ${response.status}`)
  }

  return response.json()
}

type Payload = { text?: string; ct?: string; enc?: number; pw?: string; mr?: number }

function parsePayload(raw: string): Payload | null {
  if (!raw.startsWith('{')) return null
  try {
    const parsed = JSON.parse(raw)
    if (!parsed) return null
    if (parsed.__tsn === 1 && typeof parsed.text === 'string') return parsed
    if (parsed.__tsn === 2 && parsed.enc === 1 && typeof parsed.ct === 'string') return parsed
  } catch {
    // Not our JSON — fall through to legacy handling
  }
  return null
}

/** The content half of a GET response: plaintext, or ciphertext for v2. */
function contentOf(payload: Payload): { text: string } | { ct: string; enc: 1 } {
  if (payload.enc === 1 && typeof payload.ct === 'string') return { ct: payload.ct, enc: 1 }
  return { text: payload.text ?? '' }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { UPSTASH_REDIS_REST_URL: redisUrl, UPSTASH_REDIS_REST_TOKEN: redisToken } = config

  // Random codes are 5 uppercase alphanumerics; custom codes (Pro) are
  // 3–30 lowercase [a-z0-9_-]. Try the most likely storage form first so the
  // common random-code path stays a single Redis GET.
  const rawInput = (getRouterParam(event, 'code') || '').trim()
  const randomForm = rawInput.toUpperCase().replace(/[^A-Z0-9]/g, '')
  const customForm = rawInput.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 30)

  const forms: string[] = []
  if (/^[A-Za-z0-9]{5}$/.test(rawInput)) {
    forms.push(randomForm)
    if (customForm !== randomForm) forms.push(customForm)
  } else {
    if (customForm.length >= 3) forms.push(customForm)
    if (randomForm.length >= 4 && randomForm !== customForm) forms.push(randomForm)
  }

  if (!forms.length) {
    throw createError({ statusCode: 422, message: 'Invalid code format.' })
  }

  // Rate limiting — 20 retrieval attempts per minute per IP
  const ip      = getRequestHeader(event, 'x-forwarded-for') || 'unknown'
  const rateKey = `rate:receive:${ip}`
  const rateRes = await upstashRequest(redisUrl, redisToken, ['INCR', rateKey])

  if (rateRes.result === 1) {
    await upstashRequest(redisUrl, redisToken, ['EXPIRE', rateKey, 60])
  }

  if (rateRes.result > 20) {
    throw createError({ statusCode: 429, message: 'Too many requests. Please wait a moment.' })
  }

  // Resolve the stored form — first hit wins; miss across all forms → 404
  let code = ''
  let raw: string | null = null
  for (const form of forms) {
    const getRes = await upstashRequest(redisUrl, redisToken, ['GET', KEY_PREFIX + form])
    if (getRes.result) {
      code = form
      raw = getRes.result
      break
    }
  }

  if (!raw) {
    throw createError({ statusCode: 404, message: 'Code not found or has expired.' })
  }

  const key = KEY_PREFIX + code

  // Values written since M2 are envelope-encrypted; legacy plaintext values
  // pass through unchanged and expire naturally.
  const decoded = decryptAtRest(raw)
  const payload = parsePayload(decoded)

  // Legacy / no-metadata share — single-use plain text
  if (!payload) {
    await upstashRequest(redisUrl, redisToken, ['DEL', key])
    try {
      const tracked = await recordReceiptRead(config, code, 0, 1)
      if (tracked) await closeReceipt(config, code, 'exhausted')
    } catch {}
    return { text: decoded }
  }

  // Password check — must pass before the read is counted or consumed.
  // The verifier arrives in a header (query fallback kept for old clients).
  if (payload.pw) {
    const provided = String(
      getRequestHeader(event, 'x-share-password') || getQuery(event)?.pw || ''
    )
    if (!provided) {
      const p3 = P3_RE.exec(payload.pw)
      const p2 = P2_RE.exec(payload.pw)
      throw createError({
        statusCode: 401,
        message: 'This share is password protected.',
        data: p3
          ? {
              passwordRequired: true,
              encrypted: payload.enc === 1,
              kdf: 'pbkdf2',
              format: 'p3',
              iterations: Number(p3[1]),
              salt: p3[2],
            }
          : p2
            ? {
                passwordRequired: true,
                encrypted: payload.enc === 1,
                kdf: 'pbkdf2',
                format: 'p2',
                iterations: Number(p2[1]),
                salt: p2[2],
              }
            : { passwordRequired: true, encrypted: payload.enc === 1, kdf: 'sha256', format: 'sha256' },
      })
    }
    if (!safeEqual(provided, payload.pw)) {
      const attemptsKey = ATTEMPTS_PREFIX + code
      const attempts = await upstashRequest(redisUrl, redisToken, ['INCR', attemptsKey])
      if (attempts.result === 1) {
        await upstashRequest(redisUrl, redisToken, ['EXPIRE', attemptsKey, PW_ATTEMPT_WINDOW])
      }
      if (attempts.result >= MAX_PW_ATTEMPTS) {
        // Burn the share: repeated guessing destroys the content so it
        // cannot be brute-forced slowly over many IPs.
        await upstashRequest(redisUrl, redisToken, ['DEL', key])
        await upstashRequest(redisUrl, redisToken, ['DEL', READS_PREFIX + code])
        await upstashRequest(redisUrl, redisToken, ['DEL', attemptsKey])
        try { await closeReceipt(config, code, 'deleted', 'password') } catch {}
        throw createError({
          statusCode: 403,
          message: 'Too many incorrect attempts. This share has been permanently deleted.',
        })
      }
      throw createError({ statusCode: 403, message: 'Incorrect password. Try again.' })
    }
    // Correct password — reset the wrong-attempt counter.
    await upstashRequest(redisUrl, redisToken, ['DEL', ATTEMPTS_PREFIX + code])
  }

  const maxReads = typeof payload.mr === 'number' ? payload.mr : 1

  // Unlimited reads — never delete, just hand the content over
  if (maxReads === 0) {
    try { await recordReceiptRead(config, code, null, 0) } catch {}
    return { ...contentOf(payload), readsLeft: null }
  }

  // Multi-read — track reads in a sibling key so the payload stays intact
  if (maxReads > 1) {
    const readsKey = READS_PREFIX + code
    const countRes = await upstashRequest(redisUrl, redisToken, ['INCR', readsKey])

    if (countRes.result === 1) {
      // First read — mirror the share's remaining TTL onto the counter
      const ttlRes = await upstashRequest(redisUrl, redisToken, ['TTL', key])
      if (ttlRes.result > 0) {
        await upstashRequest(redisUrl, redisToken, ['EXPIRE', readsKey, ttlRes.result])
      } else if (ttlRes.result === -2) {
        // Share vanished between GET and INCR (expired mid-request)
        await upstashRequest(redisUrl, redisToken, ['DEL', readsKey])
        throw createError({ statusCode: 404, message: 'Code not found or has expired.' })
      }
    }

    const reads = countRes.result
    if (reads >= maxReads) {
      await upstashRequest(redisUrl, redisToken, ['DEL', key])
      await upstashRequest(redisUrl, redisToken, ['DEL', readsKey])
      try {
        const tracked = await recordReceiptRead(config, code, 0, maxReads)
        if (tracked) await closeReceipt(config, code, 'exhausted')
      } catch {}
      return { ...contentOf(payload), readsLeft: 0 }
    }

    try { await recordReceiptRead(config, code, maxReads - reads, maxReads) } catch {}
    return { ...contentOf(payload), readsLeft: maxReads - reads }
  }

  // Single-use — delete immediately after retrieval
  await upstashRequest(redisUrl, redisToken, ['DEL', key])
  try {
    const tracked = await recordReceiptRead(config, code, 0, 1)
    if (tracked) await closeReceipt(config, code, 'exhausted')
  } catch {}
  return contentOf(payload)
})
