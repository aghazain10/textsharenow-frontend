/**
 * DELETE /api/pro/requests/:code/submissions/:index
 * Response: { ok: true, remaining: number }
 *
 * Deletes one inbox submission (by position, newest-first). The request
 * itself and other submissions stay. File submissions: the transfer file
 * itself is NOT deleted here — this removes the inbox marker only.
 */
import { resolvePro } from '../../../../../utils/pro'
import { upstash } from '../../../../../utils/shareCode'
import { loadRequest, inboxKey } from '../../../../../utils/requestStore'
import { licenseHash } from '../../../../../utils/proStorage'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const rawCode = String(getRouterParam(event, 'code') || '').trim()
  const indexRaw = getRouterParam(event, 'index') || ''
  const index = Number(indexRaw)
  if (!Number.isInteger(index) || index < 0 || index >= 25) {
    throw createError({ statusCode: 422, message: 'Invalid submission index.' })
  }

  const { pro, licenseKey } = await resolvePro(event)
  if (!pro || !licenseKey) {
    throw createError({ statusCode: 403, message: 'Pro is required.' })
  }
  const licHash = licenseHash(licenseKey)

  const found = await loadRequest(config, rawCode)
  if (!found || found.meta.owner !== licHash) {
    throw createError({ statusCode: 404, message: 'That request link is gone (or expired).' })
  }
  const code = found.code

  const inbox = inboxKey(code)
  const res = await upstash(config, ['LRANGE', inbox, 0, 24])
  const rows: string[] = Array.isArray(res.result) ? res.result : []
  if (index >= rows.length) {
    return { ok: true, remaining: rows.length }
  }
  const entry = rows[index]
  await upstash(config, ['LREM', inbox, 1, entry])
  return { ok: true, remaining: Math.max(0, rows.length - 1) }
})
