/**
 * POST /api/pro/share/email
 * Body: { code: string, to: string, kind?: "text" | "transfer" }
 * Response: { ok: true }
 *
 * Emails the owner's share link to someone else ("Send by email" on the
 * result panel). Rules:
 *  - Pro-only (session cookie or Bearer license key) — this endpoint is an
 *    outbound email sender, so it must never be an open relay.
 *  - The sender must OWN the link (same check as edit/delete).
 *  - The server builds the URL itself. Private-mode (E2E) links are REFUSED
 *    — their decryption key rides in the URL fragment and never reaches us,
 *    so we have no way to email them and no business embedding one.
 *  - Fixed template, no custom subject/body — only the link.
 *  - Rate limits: 10/hour + 30/day per license, 30/day per IP.
 *
 * 403 — not Pro (or sender IP/license is banned)
 * 404 — share not found / not yours / expired
 * 422 — invalid input, or the share is Private-mode
 * 429 — rate limit
 */
import { resolvePro } from '../../../utils/pro'
import { findShare, upstash, parseSharePayload } from '../../../utils/shareCode'
import { transferOwnerKey } from '../../../utils/proTransfers'
import { isValidMailbox, sendMail } from '../../../utils/mail'
import { buildLinkEmail } from '../../../utils/notify'
import { decryptAtRest } from '../../../utils/cipher'
import { recordFunnelEvent } from '../../../utils/funnel'
import { licenseHash } from '../../../utils/proStorage'

const CODE_TEXT_RE = /^[A-Za-z0-9]{5}$/
const CODE_CUSTOM_RE = /^[a-z0-9_-]{3,30}$/
const CODE_TRANSFER_RE = /^[A-Z0-9]{5}$/
const DAY = () => new Date().toISOString().slice(0, 10)
const HOUR = () => new Date().toISOString().slice(0, 13)

async function bump(config: any, key: string, ttlSeconds: number): Promise<number> {
  const res = await upstash(config, ['INCR', key])
  await upstash(config, ['EXPIRE', key, ttlSeconds])
  return Number(res.result) || 0
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  const { pro, licenseKey } = await resolvePro(event)
  if (!pro || !licenseKey) {
    throw createError({ statusCode: 403, message: 'Pro is required to email links.' })
  }
  const licHash = licenseHash(licenseKey)

  // Soft ban — flipped manually after abuse reports; silent generic answer.
  const banned = await upstash(config, ['GET', `email:ban:${licHash}`]).catch(() => null)
  if (banned?.result) {
    throw createError({ statusCode: 403, message: 'Email sending is temporarily unavailable on this account.' })
  }

  const kind = body?.kind === 'transfer' ? 'transfer' : 'text'
  const to = typeof body?.to === 'string' ? body.to.trim().toLowerCase() : ''
  if (!isValidMailbox(to)) {
    throw createError({ statusCode: 422, message: 'Enter a valid recipient email address.' })
  }

  const rawCode = typeof body?.code === 'string' ? body.code.trim() : ''
  const isTextCode = (CODE_TEXT_RE.test(rawCode) && /^[A-Z0-9]{5}$/.test(rawCode)) || CODE_CUSTOM_RE.test(rawCode)
  const isTransferCode = CODE_TRANSFER_RE.test(rawCode)
  if (kind === 'text' ? !isTextCode : !isTransferCode) {
    throw createError({ statusCode: 422, message: 'Invalid code.' })
  }

  // Rate limits — per license (hourly + daily) and per IP (daily).
  const ip = getRequestHeader(event, 'x-forwarded-for') || 'unknown'
  const perHour = await bump(config, `email:link:lic:${licHash}:${HOUR()}`, 3600)
  if (perHour > 10) {
    throw createError({ statusCode: 429, message: 'Too many emails this hour. Please wait a bit.' })
  }
  const perDay = await bump(config, `email:link:lic:${licHash}:${DAY()}`, 90000)
  if (perDay > 30) {
    throw createError({ statusCode: 429, message: "That's 30 emails today — the limit. Try again tomorrow." })
  }
  const perIpDay = await bump(config, `email:link:ip:${ip}:${DAY()}`, 90000)
  if (perIpDay > 30) {
    throw createError({ statusCode: 429, message: 'Too many emails from this connection today.' })
  }

  if (kind === 'transfer') {
    const owner = await upstash(config, ['SISMEMBER', transferOwnerKey(licHash), rawCode])
    if (owner.result !== 1) {
      throw createError({ statusCode: 404, message: "That link doesn't exist or expired." })
    }
    const summary = await upstash(config, ['GET', `transfer:summary:${rawCode}`])
    if (!summary.result) {
      throw createError({ statusCode: 404, message: "That transfer has already been downloaded or expired." })
    }
  } else {
    const found = await findShare(config, rawCode)
    if (!found) {
      throw createError({ statusCode: 404, message: "That share doesn't exist or already expired." })
    }
    const owner = await upstash(config, ['SISMEMBER', `share:owner:${licHash}`, found.code])
    if (owner.result !== 1) {
      // Same answer as "not found" — never leak existence to non-owners.
      throw createError({ statusCode: 404, message: "That share doesn't exist or already expired." })
    }
    // Refuse E2E shares: the decryption key lives in the URL fragment,
    // which this server never sees. We cannot email what we cannot read.
    try {
      const decoded = decryptAtRest(found.raw)
      const payload = parseSharePayload(decoded)
      if (payload?.enc === 1) {
        throw createError({
          statusCode: 422,
          message: "Private (encrypted) links can't be emailed — the decryption key stays in the link itself. Copy it and share it yourself, or send a non-private link.",
        })
      }
    } catch (err: any) {
      if (err?.statusCode) throw err
      // Unparseable payload — treat as legacy plaintext; emailing is fine.
    }
  }

  const mail = buildLinkEmail(rawCode, kind)
  const result = await sendMail({ to, ...mail })
  if (!result.ok) {
    throw createError({
      statusCode: 502,
      message: "Email couldn't be sent just now. Try again in a moment.",
    })
  }

  try {
    await recordFunnelEvent('pro_email_sent', { kind }, { sendToGa4: false })
  } catch {}

  setHeader(event, 'Cache-Control', 'no-store')
  return { ok: true }
})
