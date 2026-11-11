# TextShareNow — Tier S Build Plan: Notify-on-Read, Request Links, Email-the-Link

*Implementation status (updated 2026-11-11): **S1 and S4 are BUILT** — mail foundation live (Resend, `mail.textsharenow.com` verified), `server/utils/mail.ts`, `server/utils/notify.ts`, endpoints and UI wired. Not yet live in production: deploy from main. **S3 (request links) is NOT built.** Details in "Build status" at the bottom.*

*Covers the three Tier S features requested (all in `docs/new-paid-features-plan.md`):
**S1** "Notify me when it's read" · **S3** Request links ("Send this link to me") · **S4** Email the link to the recipient.
Tap-to-reveal is excluded from scope and the roadmap.*

**Data verified against the codebase on 2026-11-11.** Key facts:

- Pro receipts exist only for Pro shares: `createReceipt()` is called in `server/api/share.post.ts` when a `licenseKey` is present; transfer receipts in `server/api/pro/transfers/register.post.ts`.
- Receipt events are written by: `recordReceiptRead` (`server/api/share/[code].get.ts`), `recordReceiptOpen` (`server/api/share/[code]/open.post.ts`), `recordReceiptUpdate` (`server/api/pro/shares/[code].put.ts`), `recordTransferDownload` (`server/api/pro/transfers/sync.post.ts`). These are the exact hook points for notifications.
- The Pro owner's email **is available server-side**: Gumroad's license verify returns `purchase.email`; it's cached in `pro:lic:<hash>` and handed to `resolvePro(event)`. Today it's only ever exposed via `maskEmail()` — never stored anywhere else.
- **There is no email infrastructure at all**: no mail dependency in `package.json`, no `server/utils/mail.ts`, no DNS/SPF/DKIM. Both S1 and S4 depend on this foundation.
- Uploads go **directly to an external files service** (frontend server only issues tickets). A *file* request-link feature needs files-service changes; a *text/secret* request is fully self-contained in this repo.
- Ownership for Pro actions is checked via `share:owner:<licHash>` (SADD at share creation, checked in delete/edit/receipts endpoints) — the pattern to reuse for "sender must own the share before we email its link".
- E2E ("Private mode") shares store only ciphertext; the decrypt key lives in the URL fragment (`#k=`), which the server never sees. Any "email the link" feature must receive the full URL **from the client**, fragment included.

---

## 0. Shared foundation (build once, unblocks S1 + S4; S3 needs it too)

1. **Transactional email provider** — recommend **Resend** (simplest API, 3k emails/mo free) or **Postmark** (best deliverability). Amazon SES if volume grows. Env: `EMAIL_API_KEY`, `EMAIL_FROM` (e.g. `TextShareNow <no-reply@textsharenow.com>`).
2. **DNS for textsharenow.com** — SPF, DKIM, DMARC records as provided by the vendor; verify the domain. Without this, mail lands in spam and S1/S4 are worthless.
3. **`server/utils/mail.ts`** — thin wrapper: `sendMail({ to, subject, html, text })` with a 2s timeout, **never throws** (callers treat mail as best-effort, like receipts today), structured result `{ ok, id? }`.
4. **`pro:notify:<licHash>`** (Redis string) — the Pro user's notification email. Default = Gumroad purchase email captured at activation (store it in `setProSession`, it's already in hand). Editable in the Pro panel / My Shares. Lookups happen at event time — per-share receipt keys stay free of email addresses.
5. **Abuse counters** — `email:sent:<licHash>:<YYYY-MM-DD>` and `email:sent:ip:<ip>:<…>` (INCR + EXPIRE 86400). Cap decides whether we send.
6. **Privacy page** — add a section: we store and use your purchase email only to deliver transactional mail (link notifications, emailed links); no marketing email, no content of shares is ever sent.
7. **Rollout safety** — env kill-switch `EMAIL_SENDING=disabled` checked in `mail.ts`; ship dark, enable once DNS verifies.

---

## S1 — "Notify me when it's read" (email; webhook optional later)

**UX** — In `SendText.vue` / `SendFile.vue`, a Pro-gated checkbox on the same pattern as the password field (readonly + paywall click for free users):

> ✉ Email me when this link is read *(Pro)*
> ☐ Notify me on the first download too *(transfers)*
> ☐ …or every read *(capped, off by default)*

Shown only in the send UI, never pre-checked; result panel confirms "We'll email you at a***@example.com".

**Server**
- Add `notify?: true` to `ReceiptMeta` (additive — old receipts simply have no flag). Thread `notify` through `POST /api/share` → `createReceipt` and `/api/pro/transfers/register` → `createTransferReceipt`. No change to the share payload itself.
- In `writeEvent()` / or the three call sites, after the receipt is written, `maybeNotify(config, code, eventType, meta)`:
  1. `meta.notify` set? → `licHash = meta.owner` → GET `pro:notify:<licHash>` → email.
  2. Event filter: `read` and (for transfers) `download`. `opened` is excluded by default (opens without reads are noise — browsers/antivirus ping URLs).
  3. Granularity: **first read only** (track via existing `receipt:reads:<code>` counter — notify iff counter === 1), or `r.m === null` unlimited shares default to first-read too. "Every read" is an opt-in flag capped by the abuse counters.
  4. Subject/body: `Your TextShareNow link was just read` / `…your files were downloaded`. Body contains code, time, reads remaining — **never** the text/file contents.
- **Sending mode**: V1 = awaited with the 2s timeout from `mail.ts`, only for notify-enabled shares (adds ~200–400 ms to that one read; free users unaffected). V1.1 (if it hurts): push to `notify:queue` and drain via a Vercel cron hitting `/api/pro/notify/drain` every minute.
- **Caps**: 50 notification emails/day per license (then silently degrade to dashboard badge), first-read-only default.
- **Webhook (phase 2, dev audience)**: `pro:webhook:<licHash>` = HTTPS URL, POSTed the same events with an HMAC-SHA256 signature header (`X-TSN-Signature`) over the body; 1 retry; delete webhook after 5 consecutive failures. No new UI beyond a field in My Shares.

**Dashboard** — share rows in My Shares show a ✉ chip when notify is on; receipts show "owner notified by email" per subscribed event. (Optional.)

**Effort**: ~2–3 days. **Depends on**: §0. **Payoff**: the single most emotional Pro feature — buyer feels value on receipt of the email; also drives "first read" retention habit.

---

## S4 — Email the link to the recipient

**UX** — On the result panel after creating a share, a button next to "Copy link":

> Send by email → recipient's address → **Send link**

Free users see it locked (same upsell pattern). One recipient per send in V1; no custom subject or body in V1 (kills phishing-lure abuse).

**Server**
- New endpoint `POST /api/pro/share/email` { `code`, `to`, `url?` }
  - `resolvePro` → must be Pro (else 402/403).
  - **Ownership check**: `SISMEMBER share:owner:<licHash> <code>` (or transfer equivalent). Non-owner → 404.
  - Existence/TTL check of the share (already-doable with the `findShare` helper in `server/utils/shareCode.ts`).
  - **E2E shares**: client sends the *full* URL including `#k=` fragment (server can't reconstruct it). Server uses it verbatim — the email would contain the key regardless; disclose in the UI: "the emailed link can decrypt the share — same as any emailed link". Recommend private-mode + short expiry if that's not wanted.
  - Non-E2E: server builds `https://www.textsharenow.com/r?code=<CODE>` itself (ignore any client-sent URL — never put arbitrary URLs in our mail, or the feature is an open relay to phishing sites).
- **Template** (fixed): brand header, "You received a secure TextShareNow link", one big link button, expiry line, "This is an automated message about a link created by a TextShareNow user. If you weren't expecting it, you can ignore this email and the link will expire on its own." + `Report abuse` → contact page. Footer: `TextShareNow · privacy link`. No user-supplied content anywhere except the link.
- **Rate limits / abuse** — this makes us an email sender for arbitrary (Pro) users, so: 10/hour and 30/day per license, 100/day per IP, blocklist set `email:ban:<licHash>` (flip after abuse reports; manual review in V1), log every send to `email:log:<YYYY-MM>` (recipient hash, licHash, code hash — not plaintext recipients, not content) with 30-day TTL for forensics.
- **Deliverability**: dedicated `sir @textsharenow`-ish subdomain (e.g. `mail.textsharenow.com`) keeps link-email reputation isolated from anything else we send.
- **UI states**: sent ✓ / the usual error surface; success toast "Link sent to a***@example.com".

**Effort**: ~2–4 days. **Depends on**: §0. **Payoff**: "never type a URL over the phone again" — table stakes for the audience OnetimeSecret serves; lowest-effort trust builder.

---

## S3 — Request links ("Send this link to me")

Scope split:

| | **V1: Secret (text) requests** | **V2: File requests** |
|---|---|---|
| Dependency | None (Upstash + existing cipher/receipt code) | External files service must tag uploads to a request + call back (like `transfers/sync`) |
| Effort | ~4–6 days | ~1–2+ weeks, incl. coordination |
| Abuse surface | Low (text only) | High (baaabaaa hostile uploads) — needs the existing malware scan path + hard caps |

Recommendation: **ship V1 now, V2 after S1/S4 prove out.** Details below assume V1.

**UX** — New section in My Shares: **"Requests"** → *Create request link*:

> Label (optional, ≤80 chars, plain text): e.g. "Wi-Fi password please"
> Allowed submissions: 1 / 5 / unlimited · Expires: 24h / 7d / 30d (default 7d)
> → generates `https://www.textsharenow.com/request/<CODE>`

The sender shares that link any way they like. The public page is a minimal form: label, textarea (≤100K chars), Send. Free for the *submitter*; the *creator* must be Pro (it's the Pro feature).

**Server**
- `POST /api/pro/request/create` (Pro-only) → `request:<code>` = `{ owner: licHash, label, max: number|0, left: number, expiresAt, createdAt }`, TTL'd. Code from the same generator as custom codes.
- Public `GET /request/<code>` page (Nuxt) — plain, noindex; shows label + textarea; disabled state when `left === 0` or expired ("This request is complete").
- `POST /api/request/[code]/submit` (public): rate limit 5/min/IP; fetch `request:<code>`; if expired/`left === 0` → 410; envelope-encrypt the text (`utils/cipher.ts`, same as shares); `LPUSH request:inbox:<code> { ct, t }`; `DECR request:<code>.left`; when it hits 0, LPUSH a `complete` marker. Returns 201.
- Owner listing: `GET /api/pro/requests` → per request: created, label, left, submissions (paginated, cap 50). `DELETE /api/pro/requests/<code>` → close early; `DELETE /api/pro/requests/<code>/<n>` → delete one submission.
- Read = plain GET of own inbox (owner-only via licHash check). **Not** burn-after-read by default (it's the owner's inbox; keep until deleted); offer a "burn after reading" per-request toggle for the paranoid.
- **Notify** (ties into S1): email the owner on each submission ("Someone sent you a secret ✨") when the request is created with notify on (default on). Reuses the S1 pipeline — one more event type.
- **Abuse**: plain-text label (escaped, length-capped, no URLs rendered as links); submission size cap; per-IP rate limit; max total submissions per request (cap 25 regardless of "unlimited"); requests auto-expire; owner can close anytime; content never logged/never in email.

**Effort**: ~4–6 days (V1). **Depends on**: §0 for the email-on-submit. **Payoff**: freelancer-magnet feature; OnetimeSecret gives it away — with files it becomes WeTransfer's paid "file requests" without an account. Strongest long-term differentiator of the three.

---

## Order & effort summary

| Step | What | Est. | Blocked on |
|---|---|---|---|
| 1 | §0 email provider + DNS + `mail.ts` + `pro:notify` storage | 0.5–1 d | vendor account |
| 2 | **S4** email-the-link (template, endpoint, ownership check, rate limits, UI) | 2–4 d | step 1 |
| 3 | **S1** notify-on-read (checkbox, `ReceiptMeta.notify`, hooks, template, caps) | 2–3 d | step 1 |
| 4 | **S3** text requests (create/submit/inbox/dashboard UI) | 4–6 d | step 1 (for submit email) |
| 5 | S2 — lifetime deal + regional coupon (business config, from plan) | 0.5–1 d | Gumroad product |
| 6 | S1 webhook variant / S3 file requests | 2d / 1–2 wks | after 1–4 ship |

**Open decisions needed from you:**
1. Provider + sender (Resend vs Postmark; `mail.` subdomain ok?) — ✅ resolved: Resend Free, `mail.textsharenow.com` verified and sending.
2. Emailed links for **Private-mode shares carry the `#k=` key** — ✅ decided: **refuse** (server has no way to build the link; the key would transit our API and Resend).
3. Notify default: ✅ decided: **first read / first download only**, capped at 50 mails/license/day.
4. S3 V1 = text-only, ship first (recommended) — open.
5. Inbox submissions: keep-by-default (recommended) or burn-after-read default — open.

---

## Build status (2026-11-11)

Done & building cleanly:

- **§0 foundation**: `server/utils/mail.ts` (Resend REST, 2.5s timeout, never throws, `EMAIL_SENDING=disabled` kill-switch), runtime config in `nuxt.config.ts` (`RESEND_API_KEY` / Vercel `NUXT_RESEND_API_KEY`, `EMAIL_FROM`), privacy-safe fixed templates in `server/utils/notify.ts`.
- **S1**: `pro:notify:<licHash>` write-through at activation/verify/cache-hit in `server/utils/pro.ts` (existing customers self-heal). `ReceiptMeta.notify` flows: text share (`POST /api/share` → `createReceipt`) and Pro transfer (`transfer-ticket` → `transfer:pending` → `register` → `createTransferReceipt`). Read/download hooks call `notifyOnRead` / `notifyOnDownload` (first-read/first-download only, 50/day cap). UI: "Email me on read" checkbox (`SendText`), "Email me on download" checkbox for transfers (`SendFile`), both Pro-gated with paywall.
- **S4**: `POST /api/pro/share/email` — Pro-only, ownership-checked (`share:owner:` / `transfer:owner:` sets), fixed template, 10/h + 30/day per license + 30/day per IP, `email:ban:` kill switch, E2E shares refused, funnel event `pro_email_sent`. UI: "Send by email" on the result panel (`CodeResult`), hidden for Private-mode and single-file shares (no ownership tracking), locked paywall for free users.
- Verified: free shares create no receipts (no notify), unauthed email endpoint 403s, build compiles, new UI strings in bundle.

Limitations to be aware of:

- ~~Single-file Pro shares have no receipts and no ownership tracking~~ **Fixed (2026-11-11):** single Pro uploads now route through the same transfer flow as multi-file transfers (1-file transfer, no files-service change needed) — they get receipts, My Shares listing, owner-based delete/email, download notify and email-the-link. Free single files are unchanged (still on `/upload`).
- Transfer notify fires on the files-service callback (`transfers/sync`) — i.e., when the files service reports downloads.
- `pro:notify` Redis keys are 30-day TTL refreshed on every Gumroad verify; if a user's email changes in Gumroad, the next verify updates it automatically.
- Not deployed yet — needs `main` deploy + a live Pro-key test of both flows on production (create share → read from second device → expect one email).
