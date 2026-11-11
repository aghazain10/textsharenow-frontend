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

export type ProPlan = 'monthly' | 'annual'

/** Send S1 read/download notifications to the owner's Gumroad purchase mail. */
const NOTIFY_PREFIX = 'pro:notify:'
const NOTIFY_TTL = 60 * 60 * 24 * 30 // 30 days, refreshed on every verify

/** Everything we know about a verified purchase, cached alongside the key. */
export type ProEntitlement = {
  email?: string
  plan?: ProPlan | null
  /** Next expected charge, when we can derive it from the purchase. */
  renewsAt?: string | null
  /** Access end date for a cancelled/ended subscription. */
  endsAt?: string | null
  subscriptionId?: string | null
}

export type LicenseCheck =
  | ({ valid: true } & ProEntitlement)
  | { valid: false; networkError: false; message: string }
  | { valid: false; networkError: true; message: string }

/** ISO string from a Gumroad timestamp, or null when missing/invalid. */
function isoDate(value: unknown): string | null {
  if (!value) return null
  const date = new Date(String(value))
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

export function detectPlan(purchase: any): ProPlan | null {
  const raw = [
    purchase.recurrence,
    purchase.subscription_recurrence,
    purchase.variants,
    purchase.product_name,
    purchase.price,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  if (/year|annual|yearly/.test(raw)) return 'annual'
  if (/month|monthly/.test(raw)) return 'monthly'

  // Gumroad reports prices in cents. $50/year vs $5/month boundary.
  const price = Number(purchase.price)
  if (Number.isFinite(price) && price > 0) return price >= 2000 ? 'annual' : 'monthly'
  return null
}

/**
 * Estimate the next charge date for an active subscription. Gumroad does not
 * send a "period end" for active memberships, so derive it from the purchase
 * date and recurrence. One-time purchases and cancelled memberships get null.
 */
function nextRenewal(purchase: any, plan: ProPlan | null): string | null {
  if (!plan || !purchase.subscription_id || purchase.subscription_cancelled_at || purchase.subscription_ended_at) {
    return null
  }
  const created = isoDate(purchase.created_at)
  if (!created) return null

  const date = new Date(created)
  const months = plan === 'annual' ? 12 : 1
  const now = Date.now()
  let guard = 0
  while (date.getTime() <= now && guard < 1200) {
    date.setMonth(date.getMonth() + months)
    guard += 1
  }
  return date.toISOString()
}

function entitlementFrom(purchase: any): ProEntitlement {
  const plan = detectPlan(purchase)
  return {
    email: typeof purchase.email === 'string' ? purchase.email : undefined,
    plan,
    renewsAt: nextRenewal(purchase, plan),
    endsAt: isoDate(purchase.subscription_ended_at) || isoDate(purchase.subscription_cancelled_at),
    subscriptionId: purchase.subscription_id ? String(purchase.subscription_id) : null,
  }
}

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

    return { valid: true, ...entitlementFrom(p) }
  } catch {
    return { valid: false, networkError: true, message: 'Could not reach the license server. Please try again.' }
  }
}

function cacheKey(licenseKey: string): string {
  return `pro:lic:${sha256(licenseKey.trim())}`
}

type CachedEntitlement = { hit: true } & ProEntitlement

async function readCache(config: Upstash, licenseKey: string): Promise<CachedEntitlement | { hit: false }> {
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

/**
 * Write the owner's notification email to `pro:notify:<licHash>` so receipt
 * events (read/download) can mail them without per-share address storage.
 * Best-effort and idempotent — called on every license verify, so existing
 * Pro users self-heal on their next request.
 */
async function persistNotifyEmail(config: Upstash, licenseKey: string, email?: string): Promise<void> {
  if (!email || typeof email !== 'string' || !email.includes('@')) return
  try {
    await upstash(config, ['SET', NOTIFY_PREFIX + sha256(licenseKey.trim()), email.trim(), 'EX', String(NOTIFY_TTL)])
  } catch {}
}

async function writeCache(config: Upstash, licenseKey: string, entitlement: ProEntitlement = {}): Promise<void> {
  try {
    await upstash(config, ['SETEX', cacheKey(licenseKey), CACHE_TTL, JSON.stringify(entitlement)])
  } catch {}
}

/** Store the verified key in an httpOnly signed cookie + prime the cache. */
export async function setProSession(event: any, licenseKey: string, entitlement: ProEntitlement = {}): Promise<void> {
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
  await writeCache(config, licenseKey, entitlement)
  await persistNotifyEmail(config, licenseKey, entitlement.email)
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

function cachedEntitlement(cached: CachedEntitlement): ProEntitlement {
  return {
    email: cached.email,
    plan: cached.plan,
    renewsAt: cached.renewsAt,
    endsAt: cached.endsAt,
    subscriptionId: cached.subscriptionId,
  }
}

function checkEntitlement(check: Extract<LicenseCheck, { valid: true }>): ProEntitlement {
  return {
    email: check.email,
    plan: check.plan,
    renewsAt: check.renewsAt,
    endsAt: check.endsAt,
    subscriptionId: check.subscriptionId,
  }
}

/** a***@example.com — enough for a receipt confirmation, not a PII dump. */
export function maskEmail(email?: string | null): string | null {
  if (!email || typeof email !== 'string') return null
  const at = email.lastIndexOf('@')
  if (at <= 0) return null
  const local = email.slice(0, at)
  const domain = email.slice(at + 1)
  return `${local.slice(0, 1)}${local.length > 1 ? '***' : ''}@${domain}`
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
    await writeCache(config, licenseKey, checkEntitlement(check))
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

// ── Unified API auth (Bearer license key or browser cookie) ─────────────────

const BEARER_RE = /^Bearer\s+(.+)$/i

/** Raw `Authorization: Bearer <license-key>` value, if present. */
export function getBearerLicenseKey(event: any): string | null {
  const header = getRequestHeader(event, 'authorization') || ''
  const match = BEARER_RE.exec(header)
  const key = match?.[1]?.trim()
  return key || null
}

// Caps Gumroad verifications per IP so random Bearer keys can't be used as a
// verification oracle. Best-effort: Redis trouble never blocks a real user.
async function allowGumroadVerify(config: any, event: any): Promise<boolean> {
  try {
    const ip = getRequestHeader(event, 'x-forwarded-for') || 'unknown'
    const key = `rate:gumroad:${ip}`
    const res = await upstash<{ result: number }>(config, ['INCR', key])
    await upstash(config, ['EXPIRE', key, 60])
    return res.result <= 30
  } catch {
    return true
  }
}

/**
 * Entitlement for every endpoint, accepting either credential:
 *   1. `Authorization: Bearer <license-key>`  (API + MCP clients)
 *   2. the signed tsn_pro cookie              (browser)
 * Both resolve through the same Gumroad cache, so limits and features are
 * identical. Bearer keys fail closed on network errors; the cookie keeps its
 * fail-open behavior because it proves a past successful verification.
 */
export type ProResolution = {
  pro: boolean
  licenseKey: string | null
  via: 'bearer' | 'cookie' | null
} & ProEntitlement

export async function resolvePro(event: any): Promise<ProResolution> {
  const config = useRuntimeConfig()
  const bearerKey = getBearerLicenseKey(event)

  if (bearerKey) {
    const cached = await readCache(config, bearerKey)
    if (cached.hit) {
      await persistNotifyEmail(config, bearerKey, cached.email)
      return { pro: true, licenseKey: bearerKey, via: 'bearer', ...cachedEntitlement(cached) }
    }

    if (!(await allowGumroadVerify(config, event))) {
      return { pro: false, licenseKey: null, via: 'bearer' }
    }

    const check = await verifyGumroadLicense(bearerKey)
    if (check.valid) {
      const entitlement = checkEntitlement(check)
      await writeCache(config, bearerKey, entitlement)
      await persistNotifyEmail(config, bearerKey, entitlement.email)
      return { pro: true, licenseKey: bearerKey, via: 'bearer', ...entitlement }
    }
    return { pro: false, licenseKey: null, via: 'bearer' }
  }

  const cookieKey = readSessionLicense(event)
  if (!cookieKey) return { pro: false, licenseKey: null, via: null }

  const cached = await readCache(config, cookieKey)
  if (cached.hit) {
    await persistNotifyEmail(config, cookieKey, cached.email)
    return { pro: true, licenseKey: cookieKey, via: 'cookie', ...cachedEntitlement(cached) }
  }

  const check = await verifyGumroadLicense(cookieKey)
  if (check.valid) {
    const entitlement = checkEntitlement(check)
    await writeCache(config, cookieKey, entitlement)
    await persistNotifyEmail(config, cookieKey, entitlement.email)
    return { pro: true, licenseKey: cookieKey, via: 'cookie', ...entitlement }
  }
  if (check.networkError) {
    // Fail open: the signed cookie proves a past successful verification, we
    // just can't refresh the plan details right now.
    return { pro: true, licenseKey: cookieKey, via: 'cookie' }
  }

  // Definitively invalid (refunded / cancelled / revoked) — drop the session.
  clearProSession(event)
  return { pro: false, licenseKey: null, via: 'cookie' }
}
