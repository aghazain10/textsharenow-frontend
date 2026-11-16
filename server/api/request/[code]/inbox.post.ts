/**
 * POST /api/request/:code/inbox
 * Body: { token: string } — the anonymous creator's manage token (from URL fragment)
 * Response: { ok: true, label, expiresAt, left, max, files, submissions: [...] }
 *
 * Lets a creator read their submissions without an account: the secret
 * token lives only in the URL fragment/localStorage and never hits the URL
 * path or our logs. Server stores only sha256(token) in the request meta.
 */
import { upstash } from '../../../utils/shareCode'
import { decryptAtRest } from '../../../utils/cipher'
import { loadRequest, manageTokenMatches, inboxKey, REQUEST_LEFT_PREFIX } from '../../../utils/requestStore'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const rawCode = String(getRouterParam(event, 'code') || '').trim()

  const ip = getRequestHeader(event, 'x-forwarded-for') || 'unknown'
  const rateKey = `rate:request:manage:${ip}`
  const rate = await upstash(config, ['INCR', rateKey])
  await upstash(config, ['EXPIRE', rateKey, 60])
  if (Number(rate.result) > 30) {
    throw createError({ statusCode: 429, message: 'Slow down for a moment.' })
  }

  const body = await readBody(event).catch(() => ({}))
  const token = typeof body?.token === 'string' ? body.token : ''

  const found = await loadRequest(config, rawCode)
  if (!found || !manageTokenMatches(found.meta, token)) {
    // Same answer as "doesn't exist" — never confirm a code to a non-holder.
    throw createError({ statusCode: 404, message: "That link doesn't exist." })
  }
  const { code, meta } = found

  const leftRes = await upstash(config, ['GET', REQUEST_LEFT_PREFIX + code])
  const left = Math.max(0, Number(leftRes.result) || 0)

  const entries: any[] = []
  const inbox = inboxKey(code)
  try {
    const res = await upstash(config, ['LRANGE', inbox, 0, 24])
    const rows: string[] = Array.isArray(res.result) ? res.result : []
    for (let i = 0; i < rows.length; i++) {
      const raw = decryptAtRest(rows[i])
      if (!raw || !raw.startsWith('{')) {
        entries.push({ index: i, kind: 'unknown', t: 0 })
        continue
      }
      const parsed = JSON.parse(raw)
      if (parsed?.kind === 'text') {
        entries.push({ index: i, kind: 'text', t: Number(parsed.t) || 0, text: String(parsed.body || '') })
      } else if (parsed?.kind === 'file') {
        entries.push({
          index: i,
          kind: 'file',
          t: Number(parsed.t) || 0,
          code: String(parsed.code || ''),
          bytes: Number(parsed.bytes) || 0,
          count: Number(parsed.count) || 1,
        })
      } else {
        entries.push({ index: i, kind: 'unknown', t: Number(parsed?.t) || 0 })
      }
    }
  } catch {}

  setHeader(event, 'Cache-Control', 'no-store')
  return {
    ok: true,
    label: meta.label || '',
    createdAt: meta.createdAt,
    expiresAt: meta.expiresAt,
    max: meta.max,
    left,
    files: meta.files === true,
    notify: meta.notify === true,
    submissions: entries,
  }
})
