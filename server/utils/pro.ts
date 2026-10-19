/**
 * Pro entitlement: Gumroad license-key verification + signed session cookie.
 *
 * Flow:
 *  - POST /api/pro/activate verifies a license key against Gumroad
 *  - a valid key is stored in an httpOnly HMAC-signed cookie (30 days)
 *  - the validity is cached in Redis (pro:lic:<hash>, 24h) so each user
 *    costs at most one Gumroad API call per day
 *  - isPro(event) checks cookie → cache → re-verifies on cache miss
 */
import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

const COOKIE = 'tsn_pro'
const CACHE_TTL = 86400 // 24 h — one Gumroad verification per day per user
const SESSION_TTL = 60 * 60 * 24 * 30 // 30 days

type Upstash = { UPSTASH_REDIS_REST_URL: string; UPSTASH_REDIS_REST_TOKEN: string }

function sha256(str: string): string {
  return createHash('sha256').update(str).digest('hex')
}

// No secret in the repo: PRO_SECRET env if set, otherwise derived from the
// Upstash token (stable per deployment). Fails closed when neither exists.
function getSecret(config: any): string {
  if (config.PRO_SECRET) return config.PRO_SECRET
  if (config.UPSTASH_REDIS_REST_TOKEN) {
    return sha256(`tsn-pro:${config.UPSTASH_REDIS_REST_TOKEN}`)
  }
  if (process.env.NODE_ENV !== 'production') return 'tsn-dev-insecure-secret'
  return ''
}

function sign(value: string, secret: string): string {
  const mac = createHmac('sha256', secret).update(value).digest('base64url')
  return `${value}.${mac}`
}

function unsign(signed: string, secret: string): string | null {
  const i = signed.lastIndexOf('.')
  if (i <= 0) return null
  const value = signed.slice(0, i)
  const mac = signed.slice(i + 1)
  const expected = createHmac('sha256', secret).update(value).digest('base64url')
  try {
    const a = Buffer.from(mac)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null
    return value
  } catch {
    return null
  }
}

async function upstash<T = any>(config: Upstash, command: unknown[]): Promise<T> {
  const res = await fetch(config.UPSTASH_REDIS_REST_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.UPSTASH_REDIS_REST_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  })
  if (!res.ok) throw new Error(`Upstash error: ${res.status}`)
  return res.json()
}

export type LicenseCheck =
  | { valid: true; email?: string }
  | { valid: false; networkError: false; message: string }
  | { valid: false; networkError: true; message: string }

/**
 * Ask Gumroad whether a license key is valid and currently subscribed.
 * Distinguishes a definitive "invalid" answer from a network failure so
 * callers can fail closed on the former and keep the session on the latter.
 */
export async function verifyGumroadLicense(licenseKey: string): Promise<LicenseCheck> {
  const config = useRuntimeConfig()

  try {
    const res = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        product_id: config.GUMROAD_PRODUCT_ID,
        license_key: licenseKey.trim(),
        increment_uses_count: 'false',
      }),
    })
    const data = await res.json()

    if (!data?.success) {
      return {
        valid: false,
        networkError: false,
        message: 'That license key is invalid or does not belong to this product.',
      }
    }

    const p = data.purchase || {}
    if (p.refunded || p.disputed || p.chargebacked) {
      return { valid: false, networkError: false, message: 'This purchase has been refunded or disputed.' }
    }
    if (p.subscription_cancelled_at || p.subscription_failed_at) {
      return { valid: false, networkError: false, message: 'This subscription is cancelled or past due.' }
    }

    return { valid: true, email: p.email }
  } catch {
    return { valid: false, networkError: true, message: 'Could not reach the license server. Please try again.' }
  }
}

function cacheKey(licenseKey: string): string {
  return `pro:lic:${sha256(licenseKey.trim())}`
}

async function readCache(config: Upstash, licenseKey: string): Promise<{ hit: true; email?: string } | { hit: false }> {
  try {
    const res = await upstash<{ result: string | null }>(config, ['GET', cacheKey(licenseKey)])
    if (res.result) {
      try {
        return { hit: true, ...JSON.parse(res.result) }
      } catch {
        return { hit: true }
      }
    }
  } catch {}
  return { hit: false }
}

async function writeCache(config: Upstash, licenseKey: string, email?: string): Promise<void> {
  try {
    await upstash(config, ['SETEX', cacheKey(licenseKey), CACHE_TTL, JSON.stringify({ email })])
  } catch {}
}

/** Store the verified key in an httpOnly signed cookie + prime the cache. */
export async function setProSession(event: any, licenseKey: string, email?: string): Promise<void> {
  const config = useRuntimeConfig()
  const secret = getSecret(config)
  if (!secret) {
    throw createError({ statusCode: 503, message: 'Pro sessions are not configured on this server.' })
  }
  setCookie(event, COOKIE, sign(licenseKey.trim(), secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_TTL,
    path: '/',
  })
  await writeCache(config, licenseKey, email)
}

export function clearProSession(event: any): void {
  deleteCookie(event, COOKIE, { path: '/' })
}

function readSessionLicense(event: any): string | null {
  const config = useRuntimeConfig()
  const secret = getSecret(config)
  if (!secret) return null
  const cookie = getCookie(event, COOKIE)
  if (!cookie) return null
  return unsign(cookie, secret)
}

/** The Pro license key bound to this session, if any (no verification). */
export function getProLicenseKey(event: any): string | null {
  return readSessionLicense(event)
}

/** Server-side entitlement check — the only source of truth for `pro`. */
export async function isPro(event: any): Promise<boolean> {
  const config = useRuntimeConfig()
  const licenseKey = readSessionLicense(event)
  if (!licenseKey) return false

  const cached = await readCache(config, licenseKey)
  if (cached.hit) return true

  // Cache miss (or >24h since last check) — re-verify with Gumroad.
  const check = await verifyGumroadLicense(licenseKey)
  if (check.valid) {
    await writeCache(config, licenseKey, check.email)
    return true
  }
  if (check.networkError) {
    // Gumroad unreachable: the signed cookie still proves a past successful
    // verification, so keep the session instead of punishing the user.
    return true
  }
  // Definitively invalid (refunded / cancelled / revoked) — drop the session.
  clearProSession(event)
  return false
}
