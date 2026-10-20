/**
 * GET /api/pro/shares
 * Response: { shares: [...], truncated: boolean }
 *
 * Lists active text shares created with the Pro license — either the signed
 * browser cookie or `Authorization: Bearer <license-key>`. Never returns the
 * share content or password hash.
 *
 * Each item: { code, custom, ttl, expiresAt, maxReads, readsLeft,
 *              passwordRequired }
 *  - ttl: seconds left, or null for a never-expiring share
 *  - readsLeft: null when reads are unlimited
 *
 * 403 — not Pro
 * 429 — more than 30 dashboard loads per minute per IP
 */
import { createHash } from 'node:crypto'
import { resolvePro } from '../../utils/pro'
import {
  KEY_PREFIX,
  READS_PREFIX,
  parseSharePayload,
  upstash,
  upstashPipeline,
} from '../../utils/shareCode'

const MAX_SHARES = 100

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { pro, licenseKey } = await resolvePro(event)

  if (!pro || !licenseKey) {
    throw createError({ statusCode: 403, message: 'Pro is required to manage your shares.' })
  }

  // Private data — never cache in a browser or CDN.
  setHeader(event, 'Cache-Control', 'no-store')

  // Rate limiting — 30 dashboard loads per minute per IP
  const ip = getRequestHeader(event, 'x-forwarded-for') || 'unknown'
  const rateKey = `rate:mine:${ip}`
  const rate = await upstash(config, ['INCR', rateKey])
  if (rate.result === 1) await upstash(config, ['EXPIRE', rateKey, 60])
  if (rate.result > 30) {
    throw createError({ statusCode: 429, message: 'Too many requests. Please wait a moment.' })
  }

  const licHash = createHash('sha256').update(licenseKey.trim()).digest('hex')
  const ownerKey = `share:owner:${licHash}`
  const customOwnerKey = `custom:owner:${licHash}`

  const [membersRes, customRes] = await Promise.all([
    upstash(config, ['SMEMBERS', ownerKey]),
    upstash(config, ['SMEMBERS', customOwnerKey]),
  ])

  const allCodes: string[] = Array.isArray(membersRes.result) ? membersRes.result : []
  const customCodes = new Set<string>(
    Array.isArray(customRes.result) ? customRes.result : [],
  )
  const codes = allCodes.slice(0, MAX_SHARES)

  if (!codes.length) {
    return { shares: [], truncated: false }
  }

  // One round trip for every share's payload, remaining TTL, and read count.
  const results = await upstashPipeline(
    config,
    codes.flatMap((code) => [
      ['GET', KEY_PREFIX + code],
      ['TTL', KEY_PREFIX + code],
      ['GET', READS_PREFIX + code],
    ]),
  )

  const shares: Array<Record<string, unknown>> = []
  const stale: string[] = []

  codes.forEach((code, i) => {
    const raw = results[i * 3]?.result
    const ttl = results[i * 3 + 1]?.result
    const reads = results[i * 3 + 2]?.result

    if (typeof raw !== 'string' || !raw || ttl === -2) {
      stale.push(code)
      return
    }

    const payload = parseSharePayload(raw)
    const maxReads = payload && typeof payload.mr === 'number' ? payload.mr : 1

    let readsLeft: number | null
    if (maxReads === 0) {
      readsLeft = null
    } else if (maxReads > 1) {
      const used = Number.parseInt(reads ?? '0', 10) || 0
      readsLeft = Math.max(0, maxReads - used)
    } else {
      readsLeft = 1
    }

    const seconds = typeof ttl === 'number' ? ttl : -1

    shares.push({
      code,
      custom: customCodes.has(code),
      ttl: seconds >= 0 ? seconds : null,
      expiresAt: seconds > 0 ? new Date(Date.now() + seconds * 1000).toISOString() : null,
      maxReads,
      readsLeft,
      passwordRequired: !!payload?.pw,
    })
  })

  // Drop codes that have expired or been read from the per-license index.
  if (stale.length) {
    try {
      await upstashPipeline(
        config,
        stale.flatMap((code) => [
          ['SREM', ownerKey, code],
          ['SREM', customOwnerKey, code],
        ]),
      )
    } catch {
      // Non-critical — the next dashboard load will try again.
    }
  }

  shares.sort((a, b) => {
    const at = a.ttl as number | null
    const bt = b.ttl as number | null
    if (at === null && bt === null) return String(a.code).localeCompare(String(b.code))
    if (at === null) return 1
    if (bt === null) return -1
    return at - bt
  })

  return { shares, truncated: allCodes.length > codes.length }
})
