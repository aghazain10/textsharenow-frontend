/**
 * GET /api/pro/requests/:code
 * Response: { ok: true, code, label, expiresAt, max, left, files, notify, submissions: [...] }
 *
 * Detail view for the owner: decrypted inbox entries. Only the requester
 * (license hash match on the request meta) may read the contents. Text
 * submissions are returned as plaintext; file submissions return the
 * transfer code + size and link to /r?tcode=.
 */
import { resolvePro } from '../../../utils/pro'
import { decryptAtRest } from '../../../utils/cipher'
import { upstash } from '../../../utils/shareCode'
import { loadRequest, inboxKey, REQUEST_LEFT_PREFIX } from '../../../utils/requestStore'
import { licenseHash } from '../../../utils/proStorage'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const rawCode = String(getRouterParam(event, 'code') || '').trim()
  const { pro, licenseKey } = await resolvePro(event)
  if (!pro || !licenseKey) {
    throw createError({ statusCode: 403, message: 'Pro is required.' })
  }
  const licHash = licenseHash(licenseKey)

  const found = await loadRequest(config, rawCode)
  if (!found) {
    throw createError({ statusCode: 404, message: 'That request link is gone (or expired).' })
  }
  const { code, meta } = found
  if (meta.owner !== licHash) {
    throw createError({ statusCode: 404, message: 'That request link is gone (or expired).' })
  }

  const leftRes = await upstash(config, ['GET', REQUEST_LEFT_PREFIX + code])
  const left = Math.max(0, Number(leftRes.result) || 0)

  // Newest-first list, decoded on the server for the owner only.
  const inbox = inboxKey(code)
  const entries: any[] = []
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
  } catch {
    // Unreadable inbox (legacy/corrupt) — show emptiness, never fail the page.
  }

  const now = Math.floor(Date.now() / 1000)
  setHeader(event, 'Cache-Control', 'no-store')
  return {
    ok: true,
    code,
    label: meta.label || '',
    createdAt: meta.createdAt,
    expiresAt: meta.expiresAt,
    live: !meta.expiresAt || meta.expiresAt > now,
    max: meta.max,
    left,
    files: meta.files === true,
    notify: meta.notify === true,
    submissions: entries,
  }
})
