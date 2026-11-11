/**
 * "Tell me when it's read" — transactional notifications for Pro shares.
 *
 * Opt-in per share (checkbox on the send screen). Two rules keep this
 * honest and bounded:
 *   1. FIRST read / FIRST download only — one email per share, never spam.
 *   2. 50 notification emails per license per day, hard cap.
 *
 * The recipient is resolved from `pro:notify:<licHash>`, written through at
 * activation/verify time from the Gumroad purchase email — per-share
 * receipt records never store an address.
 */
import { sendMail, wrapEmail, escapeHtml } from './mail'
import { resolveReceiptCode } from './receipts'

const NOTIFY_CAP = 50
const DAY_KEY = (licHash: string) =>
  `email:notify:${licHash}:${new Date().toISOString().slice(0, 10)}`
const NOTIFY_KEY = (licHash: string) => `pro:notify:${licHash}`

async function upstash(
  config: { UPSTASH_REDIS_REST_URL: string; UPSTASH_REDIS_REST_TOKEN: string },
  command: unknown[],
): Promise<{ result: any }> {
  const res = await fetch(config.UPSTASH_REDIS_REST_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.UPSTASH_REDIS_REST_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  })
  if (!res.ok) throw new Error(`Upstash error: ${res.status}`)
  return res.json()
}

function parseJson<T>(raw: unknown): T | null {
  if (typeof raw !== 'string' || !raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function timeStamp(): string {
  return new Date().toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  })
}

/** Returns the owner's notification email, or null. Never throws. */
async function notifyEmailFor(
  config: { UPSTASH_REDIS_REST_URL: string; UPSTASH_REDIS_REST_TOKEN: string },
  licHash: string,
): Promise<string | null> {
  try {
    const res = await upstash(config, ['GET', NOTIFY_KEY(licHash)])
    const email = typeof res.result === 'string' ? res.result.trim() : ''
    return email || null
  } catch {
    return null
  }
}

/** Cap: 50 notification emails per license per UTC day. */
async function underCap(
  config: { UPSTASH_REDIS_REST_URL: string; UPSTASH_REDIS_REST_TOKEN: string },
  licHash: string,
): Promise<boolean> {
  try {
    const key = DAY_KEY(licHash)
    const res = await upstash(config, ['INCR', key])
    await upstash(config, ['EXPIRE', key, 90000])
    return Number(res.result) <= NOTIFY_CAP
  } catch {
    // Redis trouble never blocks the read itself; fail closed on sending.
    return false
  }
}

function readTemplate(code: string): { subject: string; html: string; text: string } {
  const stamp = timeStamp()
  const safeCode = escapeHtml(code)
  const html = wrapEmail(`
    <p style="margin:0 0 12px;">Good news — someone just opened your TextShareNow link.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 12px;background:#f6f6f6;border:1px solid #e5e5e5;border-radius:10px;">
      <tr><td style="padding:14px 18px;font-size:14px;line-height:1.7;">
        Code: <strong style="font-family:ui-monospace,monospace;">${safeCode}</strong><br>
        Read at: ${escapeHtml(stamp)}
      </td></tr>
    </table>
    <p style="margin:0;"><a href="https://www.textsharenow.com/my-shares" style="display:inline-block;padding:10px 18px;background:#111;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">Open My Shares</a></p>
  `)
  const text = `Someone just opened your TextShareNow link (code ${code}) at ${stamp}.
Manage your shares: https://www.textsharenow.com/my-shares`
  return { subject: 'Your TextShareNow link was just read', html, text }
}

function downloadTemplate(code: string): { subject: string; html: string; text: string } {
  const stamp = timeStamp()
  const safeCode = escapeHtml(code)
  const html = wrapEmail(`
    <p style="margin:0 0 12px;">Good news — someone just downloaded your TextShareNow transfer.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 12px;background:#f6f6f6;border:1px solid #e5e5e5;border-radius:10px;">
      <tr><td style="padding:14px 18px;font-size:14px;line-height:1.7;">
        Code: <strong style="font-family:ui-monospace,monospace;">${safeCode}</strong><br>
        Downloaded at: ${escapeHtml(stamp)}
      </td></tr>
    </table>
    <p style="margin:0;"><a href="https://www.textsharenow.com/my-shares" style="display:inline-block;padding:10px 18px;background:#111;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">Open My Shares</a></p>
  `)
  const text = `Someone just downloaded your TextShareNow transfer (code ${code}) at ${stamp}.
Manage your shares: https://www.textsharenow.com/my-shares`
  return { subject: 'Your TextShareNow files were just downloaded', html, text }
}

export function buildLinkEmail(
  code: string,
  kind: 'text' | 'transfer',
): { subject: string; html: string; text: string } {
  const safeCode = escapeHtml(code)
  const param = kind === 'transfer' ? 'tcode' : 'code'
  const url = `https://www.textsharenow.com/r?${param}=${encodeURIComponent(code)}`
  const safeUrl = escapeHtml(url)
  const what = kind === 'transfer' ? 'files' : 'a secure link'
  const html = wrapEmail(`
    <p style="margin:0 0 12px;">You have ${what} waiting for you from TextShareNow.</p>
    <p style="margin:0 0 16px;"><a href="${safeUrl}" style="display:inline-block;padding:12px 22px;background:#111;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">Open it</a></p>
    <p style="margin:0 0 12px;font-size:13px;color:#666;">Or paste this link into your browser:<br><span style="font-family:ui-monospace,monospace;">${safeUrl}</span></p>
    <p style="margin:0;font-size:13px;color:#666;">If you weren't expecting this, you can ignore this email — the link is single-use or expiring.</p>
  `)
  const text = `You have ${what} waiting for you from TextShareNow.
Open it here: ${url}
If you weren't expecting this, you can ignore this email — the link is single-use or expiring.`
  return { subject: 'You received a secure TextShareNow link', html, text }
}

type NotifyConfig = {
  UPSTASH_REDIS_REST_URL: string
  UPSTASH_REDIS_REST_TOKEN: string
}

/**
 * First-read check + send for a text share. Call AFTER the read was
 * recorded. Best-effort: every failure is swallowed and the caller's flow
 * (handing out the content) is unaffected.
 */
export async function notifyOnRead(config: NotifyConfig, code: string): Promise<boolean> {
  try {
    const resolved = await resolveReceiptCode(config, code)
    if (!resolved?.meta?.notify) return false
    const meta = resolved.meta

    const readsRes = await upstash(config, ['GET', `receipt:reads:${meta.code}`])
    if (Number(readsRes.result) !== 1) return false // first read only

    const email = await notifyEmailFor(config, meta.owner)
    if (!email) return false
    if (!(await underCap(config, meta.owner))) return false

    const mail = readTemplate(meta.code)
    const result = await sendMail({ to: email, ...mail })
    return result.ok
  } catch {
    return false
  }
}

/**
 * First-download check + send for a multi-file transfer. `downloaded` is the
 * delta the caller just applied (1 file vs a "download all" batch) — the
 * receipt counter is now at least that value; anything above it is history.
 */
export async function notifyOnDownload(
  config: NotifyConfig,
  code: string,
  downloaded: number,
): Promise<boolean> {
  try {
    const resolved = await resolveReceiptCode(config, code)
    if (!resolved?.meta?.notify) return false
    const meta = resolved.meta

    const got = Number(downloaded)
    if (!Number.isFinite(got) || got <= 0) return false

    const dlRes = await upstash(config, ['GET', `receipt:downloads:${meta.code}`])
    if (Number(dlRes.result) !== got) return false // downloads already happened before this call → not first

    const email = await notifyEmailFor(config, meta.owner)
    if (!email) return false
    if (!(await underCap(config, meta.owner))) return false

    const mail = downloadTemplate(meta.code)
    const result = await sendMail({ to: email, ...mail })
    return result.ok
  } catch {
    return false
  }
}
