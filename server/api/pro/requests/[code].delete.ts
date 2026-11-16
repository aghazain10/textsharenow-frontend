/**
 * DELETE /api/pro/requests/:code
 * Response: { ok: true }
 *
 * Owner closes a request early. Removes the request, its submissions-left
 * counter and inbox, and unlists it from the owner dashboard. Issued text
 * and files already delivered are NOT wiped — the stranger's submission
 * file remains as a transfer (owner can delete it there too, as usual).
 */
import { resolvePro } from '../../../utils/pro'
import { upstash } from '../../../utils/shareCode'
import {
  loadRequest,
  inboxKey,
  REQUEST_LEFT_PREFIX,
  REQUEST_OWNER_PREFIX,
  REQUEST_PREFIX,
} from '../../../utils/requestStore'
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
    // Already gone — make the delete idempotent.
    return { ok: true }
  }
  const { code, meta } = found
  if (meta.owner !== licHash) {
    throw createError({ statusCode: 404, message: 'That request link is gone (or expired).' })
  }

  await upstash(config, ['DEL', REQUEST_PREFIX + code])
  await upstash(config, ['DEL', REQUEST_LEFT_PREFIX + code])
  await upstash(config, ['DEL', inboxKey(code)])
  await upstash(config, ['ZREM', REQUEST_OWNER_PREFIX + licHash, code])

  return { ok: true }
})
