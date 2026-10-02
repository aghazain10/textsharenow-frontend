# TextShareNow — Premium Feature Recommendations

*Research-backed suggestions for the paid tier, based on competitor analysis (2026).*

---

## 1. Current Free-Tier Limits

| Aspect | Free limit |
|---|---|
| Text size | 5,000 characters |
| File size | 10 MB |
| File types | PNG, JPEG, WebP, MP4, WebM only |
| Expiry (text) | 10 minutes or first read |
| Expiry (file) | 15 minutes or first download |
| Rate limit | 10 sends/min per IP |
| Account | None required |
| Privacy | No password, no multi-read, no analytics |

Payments infrastructure: **Paddle SDK already installed** (`@paddle/paddle-js`, `@paddle/paddle-node-sdk`).

---

## 2. Competitor Premium Feature Table

| Competitor | Price | Premium features they gate |
|---|---|---|
| **Pastebin PRO** | ~$2.99/mo | 512KB→10MB pastes, unlimited private/unlisted, no inactivity auto-delete, ad-free, captcha-free, API, multiple logins, markdown, prioritized support |
| **WeTransfer** | Starter → Ultimate → Teams | Bigger files (3GB free → 1TB paid), password protection, file requests, custom expiry, branded pages, access control, teams/SSO/SCIM |
| **Send Anywhere** | $5.99–$9.99/mo | 10GB→30GB transfers, expiry 48h→unlimited, custom download counts, download notification emails, password setting, ad removal, custom download page, faster subscriber servers |
| **SendGB Extra** | €29.90–59.90/yr | 200–500GB per send, 30–90 day retention, 1-year storage, password protection, 2FA, transfer tracking, ad-free, address book, priority support |
| **Gofile Premium** | $7.50–9/mo or PAYG | Permanent storage, direct-link controls (expiry/IP/domain/HTTP auth), advanced file manager, account statistics, full API, priority access, ad-free |
| **OnetimeSecret** | €0 / €35 / €125 mo | Custom domains, custom branding, longer expiry (14d→30d), REST API, homepage access control, SSO, RBAC, team management |
| **ZeroHost** | $0 / $7 / $25 mo | Free: 10 shares/day, 24h max. Pro: unlimited shares, custom expiry (1h–30d), burn-after-read, active share management, API (5k req/day), CLI, priority support |
| **Pasteboard Premium** | $3/mo or $27/yr | Never-expire images, view counts/analytics, 10MB→25MB files, draw/text on images, ad-free (for you and viewers) |
| **Pushbullet Pro** | $4.99/mo ($39.99/yr) | 25MB→1GB files, 2GB→100GB storage, unlimited messages (vs 100/mo), end-to-end encryption, API access, universal copy & paste |
| **QuickPaste Pro** | ₹49/mo | 100KB→10MB, custom URL slugs, password locking, burn-after-read, permanent pastes, higher rate limits |
| **PastenShare Pro** | $4.99–9.99 **lifetime** | 5,000→50,000/100,000 chars, file uploads, custom expiry, priority support |
| **Pastepile Pro** | $9/mo | Authenticated API key, 30-day history, higher limits (120/min, 2,000/day, 25MB) |

---

## 3. Recommended Premium Features for TextShareNow

### Tier 1 — Most proven, easiest to build (gate existing free limits)

1. **Larger text** — 5,000 → 50,000–100,000 characters (PastenShare charges for exactly this).
2. **Larger files + any file type** — 10MB → 100MB–1GB; accept PDF, ZIP, DOCX, all types (size/type is the #1 gated feature across all competitors).
3. **Custom expiry** — choose 1hr / 1day / 7days / never, instead of fixed 10–15 min.
4. **Multi-read instead of first-read-only** — set allowed view count (1, 5, unlimited).
5. **Password protection** on any share (near-universal: WeTransfer, SendGB, ZeroHost, Pastes.io).

### Tier 2 — Differentiators

6. **Custom code/slug** — pick your own code (e.g. `textsharenow.com/YOURNAME`) — QuickPaste and Pastewala gate this.
7. **Read/download analytics** — view count, timestamps, "was read" notifications (Pasteboard, Send Anywhere, Privnote).
8. **Account + share history dashboard** — manage/revoke active shares, view past codes (Gofile, ZeroHost, Pastebin).
9. **Permanent storage option** — keep shares beyond auto-delete window (Pasteboard, Gofile monetize exactly this).
10. **Ad-free** — if ads are ever added to the free tier (Pastebin, SendGB, Gofile model).
11. **Developer API + CLI** (OnetimeSecret, Gofile, Pastepile charge for this).

### Tier 3 — Higher / Teams tier

12. **White-label** — remove TextShareNow branding from share page, custom branding (OnetimeSecret €35, WeTransfer branded pages).
13. **Email the link directly to recipient** (WeTransfer, SendGB).
14. **Multi-file / folder transfers.**
15. **Team seats, SSO, priority support** (WeTransfer Teams, OnetimeSecret Team Plus at €125).

---

## 4. Suggested Plan Structure

| | **Free** (keep strong) | **Pro** | **Teams** |
|---|---|---|---|
| Text | 5,000 chars | 100,000 chars | + shared workspace |
| File | 10MB, images/video | 1GB, any type | + admin controls |
| Expiry | 10–15 min, 1 read | Custom + multi-read | Custom + policies |
| Extras | QR, code, no account | Password, custom code, analytics, API, ad-free | SSO, white-label, seats |

---

## 5. Pricing Guidance

- Market cluster: **$3–9/mo**, or lifetime deals at **$4.99–9.99** (PastenShare model).
- Audience skews to India / Pakistan / SE Asia / Russia (per marketing guide) → **$1.99–3.99/mo** or a **lifetime deal via Paddle** will convert better than $9/mo.
- Annual billing with ~17–25% discount is standard.

---

## 6. Strategic Warnings

- Current copy claims *"Completely Free. No subscription, no credits, no hidden fees"* and *"No Account Needed"* (`components/FeaturesSection.vue`). Keep the free tier genuinely good and make premium **additive**, never a gutting of free (Pushbullet's 2015 backlash is the cautionary tale). Update that copy carefully.
- Freemium conversion for tools like this is ~1–3% — the free tier must remain the growth engine.
- Show the paywall **at the moment a user hits a limit they care about** (e.g., the 10MB or 5,000-char error), not upfront. Paywalls convert ~30% better after value is demonstrated.
