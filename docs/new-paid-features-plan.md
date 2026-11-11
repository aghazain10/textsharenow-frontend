# TextShareNow — New Paid Features Plan

*Suggested additions to the paid plan, based on competitor analysis (OnetimeSecret live pricing fetched 2026-11-11 + the 2026 research in `docs/premium-features.md`) and an audit of the website and codebase.*

**Scope note:** the "tap to reveal" interstitial was removed from this plan — we are not implementing it for now.

---

## 1. Where we stand today

**Pro ($5/mo, $50/yr, 7-day trial, Gumroad license-key activation):**
100K chars · 20 files / 100 MB · any non-executable type · expiry to never (text) / 30 days · 5/10/unlimited reads · password protection · custom codes · My Shares dashboard · edit live link · open/read/download receipts · API + MCP for AI agents.

**Our genuine differentiators** (competitors rarely have all three): edit-a-live-link, receipts with seen-tracking, and MCP/API positioning for AI agents.

**Our structural gaps vs. the market:**

| Competitor | What they charge for / give away | Our position |
|---|---|---|
| Onetime Secret | **Free:** 1 custom domain, email-the-link, REST API, "Incoming Secrets". **€35/mo:** unlimited domains, custom branding, 30-day expiry, homepage access control. **€125/mo:** SSO, RBAC, teams, custom email sender | We gate API/MCP + custom codes (defensible), but we have **no email delivery, no incoming-secrets/file-request links, no custom domain, no branding** |
| Pastebin PRO (~$3/mo) | Ad-free, markdown, API | No ads yet — ad-free is untapped if AdSense lands |
| Send Anywhere (~$6–10) | Download-notification emails, custom download page, password, ad removal | Our receipts are **dashboard-only** — no email/push on read |
| WeTransfer | File requests, branded pages, passwords | No file-request links, no branding tier |
| Gofile ($7.50–9) | Direct-link controls: IP lock, domain lock, HTTP auth, stats | No viewer-side access controls beyond password |
| PastenShare / Pastepile ($5–10 **lifetime**) | Lifetime deals, higher limits | No lifetime option — and our audience (India/Pakistan/Thailand per the marketing guide) is exactly the lifetime-deal-friendly segment |
| Privnote (premium) | Read notifications, custom note lifetime | No read notifications |

---

## 2. The features that attract buyers

Ordered by "person sees it → reaches for a card" power, not build difficulty.

### Tier S — headline features (build first)

1. **"Notify me when it's read" — email or webhook (Pro).**
   Receipts already record open/read/download. Surface them as a push: an email (or optional webhook URL for devs) fired on first read/download. Privnote, Send Anywhere and SendGB all monetize exactly this — the single most emotionally compelling Pro feature, because the buyer *feels* the value the moment the email arrives. Cheap to build on top of `recordReceiptRead`.

2. **File/secret request links ("Send this link to me").**
   Generate a one-time incoming link; the recipient uploads files or pastes a secret *to us*, and it lands in the Pro user's My Shares dashboard/receipts. OnetimeSecret ships this **free**, WeTransfer gates it behind paid — we'd be the no-account version of it. The #1 use case for freelancers ("clients send files without email accounts").

3. **Email the link to the recipient.**
   Enter an email, we send "You have a secure link from TextShareNow" → link. OnetimeSecret Basic includes it free; table stakes for the "send a secret to Mom" audience we're marketing to. Easy via any transactional email service. Unlocks the killer Pro line: *"never type a URL over the phone again."*

### Tier A — strong conversion drivers (weeks, not hours)

4. **Lifetime Pro — $29–39 one-time (Gumroad).**
   PastenShare/Pastepile sell exactly this at $5–10. For a price-sensitive IN/PK/TH audience, a lifetime deal converts far better than another subscription, creates launch buzz, and filters for our most committed users. Keep it limited (e.g. "first 500 keys") to protect subscription revenue.

5. **PPP / regional pricing.**
   $5/mo ≈ ₹450+ — brutal in our dominant geos. Gumroad supports discount codes; an India/Pakistan-specific checkout path (or a 50% annual coupon advertised on pricing for those geos) will likely lift conversions more than any single feature.

6. **Custom domain support (share.yourname.com → your links).**
   OnetimeSecret gives away 1 free; we can make this pure Pro. Devs and SMBs get "a branded secret link" — huge perceived value, modest engineering (CNAME verification + TLS via the existing Vercel setup). The clearest brand/logo-adjacent attraction feature short of full white-label.

7. **Reader-side controls for Pro links:** IP lock, one-view-then-lock, domain allowlist for files.
   Gofile charges for this. Positions us as "the paranoid person's WeTransfer." (Password verify already exists; this adds gating before content is reached.)

8. **Ad-free promise.**
   Per the AdSense journey doc, ads are coming. The moment they exist, "Pro removes all ads (incl. on received-text pages)" becomes the #1 free reason to upgrade. Pastebin and Gofile prove the model.

### Tier B — differentiation / deeper moats (later)

9. **Automatic clipboard pair / universal copy-paste** between paired devices via QR pairing (Pushbullet's killer feature). Big build, but the only feature that makes Pro feel like *infrastructure* rather than "bigger limits." This is a $10–15/mo feature.

10. **Browser extension** (one-click share of selection/clipboard as a TSN link). Tiny, devs love it, word-of-mouth in r/webdev / Hacker News.

11. **White-label share page + workspace tier ($15–25/mo):** logo on the share page, custom "sent via" line, team seats, admin dashboard. OnetimeSecret's Identity Plus (€35) and WeTransfer's branding tier validate the price band. Needed before serious business-buyer conversations.

12. **Analytics export (CSV/JSON)** of receipts — trivial on top of existing data, beloved by consultants and compliance-flavored users.

13. **Branded QR Pro** (logo embed, brand colors, SVG/HD print export) once the QR SEO pages funnel there.

14. **Priority support badge** ("answers within 1 business day") — nearly free to offer, listed by ZeroHost / SendGB / others, quietly raises perceived plan value.

---

## 3. Website / positioning changes (half the battle)

The pricing page is already strong (comparison table, charts, FAQ schema, funnel instrumentation). The gap is **emotional pull**:

- **Lead the Pro section with Tier-S features, not limits.** "Get an email the moment your link is read," "Request files from anyone with one link," "Links email themselves." Right now Pro reads as "10× more," not "I want that."
- **Homepage Pro preview:** add locked rows in the free tool ("🔒 Email me when read — Pro", "🔒 File request link — Pro"). Showing the *locked* button lifts paywall views from the `limit_hit` path we already instrument.
- **Update `ProModal` copy** to match the new headline features — it currently sells limits only.
- **Blog CTAs** in the highest-traffic posts (AirDrop cluster, Wi-Fi password, long URLs) pointing at the new features with use-case copy ("Share this password — get emailed when they read it").
- **Social proof:** usage counters are already shown ("N texts shared"). Add one or two real quotes or a "used for N transfers" line near the Pro CTA — proof beats another bullet point.
- **Pricing page:** add the lifetime deal card ("or $29 once, forever") with a counter — urgency + impulse purchase in one element.

**Do NOT:** gut or shame the free tier (keep the "free forever" promise), gate QR generation or basic receipts, require an account (license key is our trust advantage), watermark shares, or add ads to Pro users.

---

## 4. Order of attack

1. **This month (quick wins):** read/download email notification · Lifetime deal + regional coupon · pricing/modal copy rewritten to lead with Tier-S features.
2. **Next 4–6 weeks:** Email-the-link · file/secret request links · inbound webhooks (dev audience) · ad-free promise ready for the AdSense launch.
3. **Quarter 2:** Custom domains · browser extension · branded white-label + Teams tier skeleton · analytics export.

Two of these (lifetime deal, email notification) are small builds and will each independently show whether Pro conversion moves, using the existing `limit_hit → paywall_view → checkout_started` funnel instrumentation.
