/**
 * Transactional mail via Resend's REST API.
 *
 * Deliberately tiny and fail-quiet: mail is a courtesy, never a blocker.
 * Callers must treat { ok: false } as "the user wasn't emailed" — never throw.
 *
 * Env (see nuxt.config.ts):
 *   RESEND_API_KEY   (NUXT_RESEND_API_KEY overrides at runtime)
 *   EMAIL_FROM       "TextShareNow <no-reply@mail.textsharenow.com>"
 *   EMAIL_SENDING    set to "disabled" to mute everything without a deploy
 *
 * Sender identity: DKIM/SPF/DMARC for mail.textsharenow.com are verified, so
 * mail from no-reply@mail.textsharenow.com shows "mailed-by" our domain in
 * Gmail — the trust signal recipients need for a privacy tool.
 */

export type MailInput = {
  to: string
  subject: string
  html: string
  text?: string
}

export type MailResult = { ok: true; id?: string } | { ok: false; error: string }

const EMAIL_RE = /^[^@\s]{1,64}@[^@\s]{1,255}$/
const FETCH_TIMEOUT_MS = 2500

export function isValidMailbox(value: string): boolean {
  const to = typeof value === 'string' ? value.trim() : ''
  return to.length <= 254 && EMAIL_RE.test(to)
}

/** Resend accepts 100 emails/day on the free plan; we stay well under it. */
export async function sendMail(input: MailInput): Promise<MailResult> {
  const config = useRuntimeConfig()
  const apiKey = String(config.RESEND_API_KEY || '')
  const from = String(config.EMAIL_FROM || 'TextShareNow <no-reply@mail.textsharenow.com>')
  const muted = String(config.EMAIL_SENDING || '').toLowerCase() === 'disabled'

  if (muted) return { ok: false, error: 'disabled' }
  if (!apiKey) return { ok: false, error: 'no_api_key' }

  const to = String(input?.to || '').trim()
  if (!isValidMailbox(to)) return { ok: false, error: 'invalid_recipient' }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: String(input.subject || '').slice(0, 200),
        html: input.html,
        text: input.text || undefined,
      }),
      signal: controller.signal,
    })
    const data = await response.json().catch(() => ({} as any))
    if (!response.ok) {
      return { ok: false, error: String(data?.message || `resend_${response.status}`).slice(0, 200) }
    }
    return { ok: true, id: typeof data?.id === 'string' ? data.id : undefined }
  } catch {
    return { ok: false, error: 'network' }
  } finally {
    clearTimeout(timer)
  }
}

export function escapeHtml(value: string): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Branded, email-client-safe shell. Inline CSS only; no external assets. */
export function wrapEmail(innerHtml: string): string {
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>TextShareNow</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:24px 16px;">
    <tr><td align="center">
      <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border:1px solid #e5e5e5;border-radius:12px;overflow:hidden;">
        <tr><td style="padding:18px 28px;border-bottom:1px solid #eee;">
          <span style="font-size:15px;font-weight:700;letter-spacing:-0.01em;color:#111;">TextShareNow</span>
        </td></tr>
        <tr><td style="padding:24px 28px;font-size:15px;line-height:1.6;color:#333;">
          ${innerHtml}
        </td></tr>
        <tr><td style="padding:16px 28px;border-top:1px solid #eee;font-size:12px;color:#888;line-height:1.5;">
          Automated message about a link created on <a href="https://www.textsharenow.com" style="color:#555;text-decoration:none;">textsharenow.com</a>.<br>
          This is not marketing email — TextShareNow does not send newsletters.
          <a href="https://www.textsharenow.com/my-shares" style="color:#555;">Manage notifications</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
