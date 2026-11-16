/**
 * POST /api/request/create
 * Body (Pro):  { label?, ttl?, maxSubmissions?, files?, maxBytes?, notify? }
 * Body (free): {} — free callers get one request, 3 submissions, 24h, text only.
 * Response: { code, ttl, max, files, manageable }
 *
 * Free creators get the funnel: 1 active request / 3 submissions / 24h / no
 * files / no email. Pro creators get the workhorse: 10 parallel, 25 per
 * request, 7/30-day expiry, files, labels, notify.
 */
import { resolvePro } from '../../utils/pro'
import {
  REQUEST_TTLS,
  FILE_MAX_OPTIONS,
  FREE_MAX_SUBMISSIONS,
  PRO_MAX_SUBMISSIONS,
  sanitizeLabel,
  createRequestRecord,
  REQUEST_OWNER_PREFIX,
  REQUEST_PREFIX,
} from '../../utils/requestStore'
import { upstash } from '../../utils/shareCode'
import { licenseHash } from '../../utils/proStorage'

const FREE_MAX_ACTIVE = 1
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
    // Free: one request per active-window. Heap-verify there isn't one
    // from this IP already active — soft but effective without accounts.
    const activeIp = await upstash(config, ['GET', `request:active-ip:${ip}`])
    if (activeIp.result) {
      throw createError({
        statusCode: 429,
        message: 'Free includes one active request at a time. Open Pro to run many in parallel.',
      })
    }
    const created = await createRequestRecord(config, {
      owner: null,
      label: '',
      ttl: DAY,
      max: FREE_MAX_SUBMISSIONS,
      files: false,
      maxBytes: null,
      notify: false,
      text: true,
    })
    await upstash(config, ['SET', `request:active-ip:${ip}`, created.code, 'EX', DAY])
    return { code: created.code, ttl: DAY, max: FREE_MAX_SUBMISSIONS, files: false, manageable: false }
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

  return { code: created.code, ttl, max: maxSubmissions, files, manageable: true }
})
