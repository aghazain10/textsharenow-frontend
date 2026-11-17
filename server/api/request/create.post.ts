/**
 * POST /api/request/create
 * Body (Pro):  { label?, ttl?, maxSubmissions?, files?, maxBytes?, notify? }
 * Body (free): {} — free callers get 3 requests per day, 5 submissions, 48h, text only.
 * Response: { code, ttl, max, files, manageable }
 *
 * Free creators get the funnel: 3 requests per 24h / 5 submissions / 48h /
 * text only, resets daily. Pro creators get the workhorse: 10 parallel,
 * 25 per request, 7/30-day expiry, files, labels, notify.
 */
import { resolvePro } from '../../utils/pro'
import {
  REQUEST_TTLS,
  FILE_MAX_OPTIONS,
  FREE_MAX_SUBMISSIONS,
  FREE_REQUEST_TTL,
  FREE_REQUESTS_PER_DAY,
  PRO_MAX_SUBMISSIONS,
  sanitizeLabel,
  createRequestRecord,
  REQUEST_OWNER_PREFIX,
  REQUEST_PREFIX,
} from '../../utils/requestStore'
import { upstash } from '../../utils/shareCode'
import { licenseHash } from '../../utils/proStorage'

const PRO_SUBMISSION_CHOICES = [1, 5, 10, 25]
const DAY = 86400

/** Prune owner ZSET entries that no longer resolve to a live request. */
async function pruneOwner(config: any, licHash: string): Promise<string[]> {
  try {
    const members = await upstash(config, ['ZREVRANGE', REQUEST_OWNER_PREFIX + licHash, 0, 200])
    const codes: string[] = Array.isArray(members.result) ? members.result : []
    const alive: string[] = []
    for (const code of codes) {
      const raw = await upstash(config, ['EXISTS', REQUEST_PREFIX + code])
      if (Number(raw.result) === 1) alive.push(code)
      else await upstash(config, ['ZREM', REQUEST_OWNER_PREFIX + licHash, code])
    }
    return alive
  } catch {
    return []
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event).catch(() => ({}))

  const { pro, licenseKey } = await resolvePro(event)
  const licHash = pro && licenseKey ? licenseHash(licenseKey) : null

  // Rate limit — per IP, generous but bounded (12 creates/day/IP).
  const ip = getRequestHeader(event, 'x-forwarded-for') || 'unknown'
  const rateKey = `rate:request:create:${ip}`
  const rate = await upstash(config, ['INCR', rateKey])
  await upstash(config, ['EXPIRE', rateKey, DAY])
  if (Number(rate.result) > 12) {
    throw createError({ statusCode: 429, message: 'Too many request links from this connection today.' })
  }

  if (!pro) {
    // Free: 3 request links per rolling 24h per IP — generous enough to
    // actually feel the feature, resets daily.
    const dayKey = `request:free-day:${ip}`
    const dayCount = await upstash(config, ['INCR', dayKey])
    await upstash(config, ['EXPIRE', dayKey, DAY])
    if (Number(dayCount.result) > FREE_REQUESTS_PER_DAY) {
      // Undo the extra increment so a rejected create doesn't burn the slot.
      await upstash(config, ['DECR', dayKey])
      throw createError({
        statusCode: 429,
        message: 'Free gives 3 request links per day. Open Pro to run many in parallel.',
      })
    }
    const created = await createRequestRecord(config, {
      owner: null,
      label: '',
      ttl: FREE_REQUEST_TTL,
      max: FREE_MAX_SUBMISSIONS,
      files: false,
      maxBytes: null,
      notify: false,
      text: true,
    })
    return { code: created.code, ttl: FREE_REQUEST_TTL, max: FREE_MAX_SUBMISSIONS, files: false, manageable: true, manage: created.manage }
  }

  // Pro path ---------------------------------------------------------------
  const alive = await pruneOwner(config, licHash!)
  if (alive.length >= 10) {
    throw createError({ statusCode: 422, message: 'You already have 10 active request links. Expire or delete one first.' })
  }

  const label = sanitizeLabel(body?.label)
  const ttl = REQUEST_TTLS.includes(Number(body?.ttl)) ? Number(body?.ttl) : 7 * DAY
  const maxSubmissions = PRO_SUBMISSION_CHOICES.includes(Number(body?.maxSubmissions))
    ? Number(body?.maxSubmissions)
    : 5
  const files = body?.files === true
  const maxBytes = files
    ? (FILE_MAX_OPTIONS.includes(Number(body?.maxBytes)) ? Number(body?.maxBytes) : 25 * 1048576)
    : null
  const notify = body?.notify !== false

  const created = await createRequestRecord(config, {
    owner: licHash,
    label,
    ttl,
    max: Math.min(maxSubmissions, PRO_MAX_SUBMISSIONS),
    files,
    maxBytes,
    notify,
    text: true,
  })

  return { code: created.code, ttl, max: maxSubmissions, files, manageable: true, manage: created.manage }
})
