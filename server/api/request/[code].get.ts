/**
 * GET /api/request/:code
 * Response: { ok: true, label, files, maxBytes, left, expiresAt, complete }
 * Public — no auth. Never reveals the owner or who submitted what.
 */
import { upstash } from '../../utils/shareCode'
import { loadRequest, REQUEST_LEFT_PREFIX } from '../../utils/requestStore'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const raw = String(getRouterParam(event, 'code') || '').trim()

  const found = await loadRequest(config, raw)
  if (!found) {
    throw createError({ statusCode: 404, message: "That request link doesn't exist or has expired." })
  }
  const { code, meta } = found
  const now = Math.floor(Date.now() / 1000)
  if (meta.expiresAt && now >= meta.expiresAt) {
    throw createError({ statusCode: 404, message: "That request link has expired." })
  }

  const leftRes = await upstash(config, ['GET', REQUEST_LEFT_PREFIX + code])
  const left = Number(leftRes.result)
  const remaining = Number.isFinite(left) ? Math.max(0, left) : 0

  setHeader(event, 'Cache-Control', 'no-store')
  setHeader(event, 'X-Robots-Tag', 'noindex, nofollow')
  return {
    ok: true,
    label: meta.label || '',
    files: meta.files === true,
    maxBytes: meta.maxBytes,
    left: remaining,
    expiresAt: meta.expiresAt,
    complete: remaining <= 0,
  }
})
