/**
 * POST /api/tip-event
 * Body: { event, where }
 *   event: "shown" | "shown_small" | "click" | "click_small" | "later"
 *          (shown/click = full tip card, *_small = the one-line nudge, later = "Maybe later")
 *   where: "share" | "receive" (tip card) or "banner" | "footer" | "about" (support links)
 * Response: 204
 *
 * Anonymous counters for the tip nudge, so we can see how often it's shown and clicked.
 * Nothing about the visitor is stored — just numbers in two Redis hashes:
 *   stats:tip:total              field "<where>:<event>"  all-time count
 *   stats:tip:daily:<YYYY-MM-DD> field "<where>:<event>"  per-day count (kept 400 days)
 * Read them in the Upstash console with: HGETALL stats:tip:total
 */

const EVENTS = new Set(['shown', 'shown_small', 'click', 'click_small', 'later'])
const PLACES = new Set(['share', 'receive', 'banner', 'footer', 'about'])
const DAY_TTL = 400 * 24 * 60 * 60

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

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { UPSTASH_REDIS_REST_URL: redisUrl, UPSTASH_REDIS_REST_TOKEN: redisToken } = config

  // Sent with navigator.sendBeacon as text/plain (no CORS preflight), so parse by hand
  let body: any = await readBody(event).catch(() => null)
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch { body = null }
  }

  const name  = String(body?.event || '')
  const where = String(body?.where || '')
  if (!EVENTS.has(name) || !PLACES.has(where)) {
    throw createError({ statusCode: 422, message: 'Unknown tip event.' })
  }

  // Keep one visitor from inflating the numbers: 30 events per minute per IP
  const ip      = getRequestHeader(event, 'x-forwarded-for') || 'unknown'
  const rateKey = `rate:tip:${ip}`
  const rateRes = await upstashRequest(redisUrl, redisToken, ['INCR', rateKey])
  if (rateRes.result === 1) {
    await upstashRequest(redisUrl, redisToken, ['EXPIRE', rateKey, 60])
  }
  if (rateRes.result > 30) {
    setResponseStatus(event, 204)
    return null
  }

  const field  = `${where}:${name}`
  const day    = new Date().toISOString().slice(0, 10)
  const dayKey = `stats:tip:daily:${day}`

  try {
    await upstashRequest(redisUrl, redisToken, ['HINCRBY', 'stats:tip:total', field, 1])
    await upstashRequest(redisUrl, redisToken, ['HINCRBY', dayKey, field, 1])
    await upstashRequest(redisUrl, redisToken, ['EXPIRE', dayKey, DAY_TTL])
  } catch {
    // Counters are non-critical — never surface an error to the visitor.
  }

  setResponseStatus(event, 204)
  return null
})
