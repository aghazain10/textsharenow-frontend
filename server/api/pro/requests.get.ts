/**
 * GET /api/pro/requests
 * Response: { requests: [...], truncated: boolean }
 *
 * Lists the caller's active request links (text + files). Never reveals
 * submission contents — that lives behind the detail endpoint.
 * Instruction text is excluded; labels are safe by construction (plain text).
 *  - left: submissions remaining (atomic counter)
 *  - submissions: number of inbox entries (text + file tags)
 *  - expiresAt: epoch seconds
 */
import { resolvePro } from '../../utils/pro'
import { upstash } from '../../utils/shareCode'
import {
  REQUEST_OWNER_PREFIX,
  REQUEST_PREFIX,
  REQUEST_LEFT_PREFIX,
  inboxKey,
  REQUEST_INBOX_PREFIX,
  loadRequest,
} from '../../utils/requestStore'
import { licenseHash } from '../../utils/proStorage'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { pro, licenseKey } = await resolvePro(event)
  if (!pro || !licenseKey) {
    throw createError({ statusCode: 403, message: 'Pro is required.' })
  }
  const licHash = licenseHash(licenseKey)

  const ip = getRequestHeader(event, 'x-forwarded-for') || 'unknown'
  const rateKey = `rate:pro-requests:${ip}`
  const rate = await upstash(config, ['INCR', rateKey])
  await upstash(config, ['EXPIRE', rateKey, 60])
  if (Number(rate.result) > 30) {
    throw createError({ statusCode: 429, message: 'Slow down for a moment.' })
  }

  // Paginated newest-first owner list.
  const now = Math.floor(Date.now() / 1000)
  let members: string[] = []
  try {
    const res = await upstash(config, ['ZREVRANGE', REQUEST_OWNER_PREFIX + licHash, 0, 99])
    members = Array.isArray(res.result) ? res.result : []
  } catch {
    members = []
  }

  const requests: any[] = []
  const stale: string[] = []
  for (const code of members) {
    const found = await loadRequest(config, code)
    if (!found) {
      stale.push(code)
      continue
    }
    const { meta } = found
    // Expired requests stay listed until the owner deletes them, so they can
    // see the receipt side. Count as "active" only while they can receive.
    const live = (!meta.expiresAt || meta.expiresAt > now)
    const leftRes = await upstash(config, ['GET', REQUEST_LEFT_PREFIX + code])
    const left = Math.max(0, Number(leftRes.result) || 0)
    const subRes = await upstash(config, ['LLEN', inboxKey(code)])
    requests.push({
      code,
      label: meta.label || '',
      createdAt: meta.createdAt,
      expiresAt: meta.expiresAt,
      live,
      max: meta.max,
      left,
      files: meta.files === true,
      notify: meta.notify === true,
      submissions: Number(subRes.result) || 0,
    })
  }

  if (stale.length) {
    try {
      await upstash(config, ['ZREM', REQUEST_OWNER_PREFIX + licHash, ...stale])
    } catch {}
  }

  setHeader(event, 'Cache-Control', 'no-store')
  return { requests, truncated: members.length >= 99 }
})
