# Phase 3 — Files Service: Pro Upload Support (Server Plan)

> For the agent working **on the VPS** against the files service (`files.textsharenow.com`,
> code at `/var/lib/filesvc/`). The Nuxt side is already live — nothing in this doc
> touches the frontend repo. Feature is fully additive: the free path must keep its
> exact current behavior.

---

## 1. Context

- Text-share Pro (Gumroad license key) is live: 100K chars, password, multi-read, long expiry.
- **Pro file uploads are not yet honored by this service.** The frontend now promises
  Pro users: **up to 100 MB, any file type (except SVG), expiry 10 min – 30 days**,
  but this service still hard-caps everything at 10 MB, a 5-type whitelist, and a
  600–3600 s TTL clamp. That's the broken promise this plan fixes.
- Authorization uses **single-use HMAC-free upload tickets** minted by the Nuxt API.
  The ticket token (random 256-bit hex) is the only credential — **no shared secret
  to configure**. The service only needs the public Nuxt base URL.

## 2. Ticket protocol (exact contract)

### 2.1 Mint (done, already deployed — do not modify)

```
POST https://www.textsharenow.com/api/pro/upload-ticket
Cookie: tsn_pro=...            (browser session; Pro required)
Content-Type: application/json
Body: { "expires": 86400, "size": 52428800 }   // seconds, bytes

200 → { "ticket": "<64-hex>", "maxBytes": 104857600, "ttl": 86400 }
403 → not Pro      422 → size/ttl out of range      429 → >10 mints/min/IP
```

- Ticket lives in Redis at `fticket:<token>` for **600 s** and is **single-use**.

### 2.2 Consume (done, already deployed — you call this)

```
POST https://www.textsharenow.com/api/pro/upload-ticket/consume
Content-Type: application/json
Body: { "ticket": "<64-hex>", "size": 52428800 }   // size = bytes of the file being uploaded

200 → { "ok": true, "maxBytes": 104857600, "ttl": 86400 }
403 → ticket missing / expired / already redeemed   (GETDEL — atomic single-use)
422 → size exceeds what the ticket authorizes
```

## 3. Changes to the upload handler

Current request shape from the browser (unchanged):

```
POST /upload
multipart/form-data: file=<binary>, expires=<seconds>, ticket=<64-hex, PRO ONLY>
```

Implement in this order:

1. **Parse** multipart fields (`expires`, optional `ticket`) and determine the file
   size (Content-Length and/or after writing to the temp file — your call, but
   enforce before permanent storage).
2. **If `ticket` field present (Pro path):**
   a. POST `{ticket, size}` to the consume endpoint (step 2.2). Treat the base URL
      as config, e.g. env `NITRO_API_BASE=https://www.textsharenow.com` (use
      localhost/Nitro default port only if this service runs on the same host — it
      does not; go through the public domain over HTTPS).
   b. On **200**: `maxBytes = body.maxBytes`, `ttl = body.ttl` — use these below.
   c. On **403/422**: return the same status + message to the client as JSON, in the
      service's existing error shape. **Do not fall back to free limits** — the user
      explicitly requested Pro capacity; a silent 10 MB accept would be wrong.
   d. On network failure calling consume: return **502** with a retryable message
      ("Pro verification unavailable — try again in a moment").
3. **If no `ticket`:** behave **exactly as today** — 10 MB cap, the 5-type
   whitelist, TTL clamp 600–3600 s. Zero behavioral change.
4. **Size check (Pro):** reject if file > `maxBytes` (413 or existing shape).
5. **Type check (Pro):** allow **every** type **except SVG** — reject when content-type
   is `image/svg+xml` **or** the filename ends in `.svg` / `.svgz` (SVG can carry
   scripts; file shares are served from this domain). Free whitelist unchanged.
6. **Malware scan:** unchanged for both tiers — Pro does not bypass ClamAV.
7. **Store with TTL = `ttl` seconds exactly** (600 … 2592000). This is the bug fix:
   today's code clamps every TTL into 600–3600 s. Long TTLs must survive storage
   **and** any cleanup/sweeper job (check the reaper for hardcoded short windows).
8. **Response:** keep the existing shape and field names, but `expires_in` **must be
   the honored TTL in seconds** (e.g. `2592000` for 30 days). The frontend renders
   its countdown from `expires_in` — a clamped value here reintroduces the bug.

## 4. Infra checklist

- [ ] Reverse proxy `client_max_body_size` (or Caddy equivalent) **≥ 110 m** — or
      scoped to `/upload`. Today it is presumably ~10 m and will 413 every Pro upload.
- [ ] Upload/read timeouts ≥ 5 min for `/upload` (100 MB on a slow link).
- [ ] Disk: 100 MB × 30 days retention — check current usage headroom; the existing
      TTL-based cleanup covers it only if long TTLs are handled (step 7).
- [ ] Do **not** log full ticket values (they are bearer tokens; log first 8 chars max).
- [ ] Keep everything on HTTPS; consume calls go to the public Nuxt domain.

## 5. Env / config

| Var | Value | Notes |
|---|---|---|
| `NITRO_API_BASE` (or your naming) | `https://www.textsharenow.com` | Only new config. No secret — tickets are self-authenticating. |

## 6. Acceptance tests (run all before done)

Setup — mint a real ticket (get a Pro cookie first; ask the operator for the test
license key, or have them run the mint in their browser session):

```bash
BASE=https://www.textsharenow.com
# 1) activate Pro session
curl -c /tmp/c.txt -X POST $BASE/api/pro/activate -H 'Content-Type: application/json' \
  -d '{"licenseKey":"<TEST_LICENSE_KEY>"}'
# 2) mint a ticket (600 s ttl so cleanup tests are fast)
curl -b /tmp/c.txt -X POST $BASE/api/pro/upload-ticket -H 'Content-Type: application/json' \
  -d '{"expires":600,"size":52428800}'
```

| # | Case | Expect |
|---|---|---|
| 1 | Free: 5 MB PNG, no ticket | 200, `expires_in` ≤ 3600 (unchanged) |
| 2 | Free: 20 MB, no ticket | Rejected, same as today |
| 3 | Free: MP4, no ticket | 200 (whitelist unchanged) |
| 4 | Pro ticket + 5 MB PNG, `expires=600` | 200, `expires_in: 600`, downloadable until TTL, gone after |
| 5 | Pro ticket + 5 MB PNG, `expires=86400` | 200, `expires_in: 86400` |
| 6 | Reuse the same ticket | 403 |
| 7 | Fresh ticket + 101 MB file | Rejected (> maxBytes) |
| 8 | Fresh ticket + `evil.svg` | Rejected (SVG block) |
| 9 | Expired ticket (> 10 min after mint) | 403 |
| 10 | Garbage ticket value | 403 |
| 11 | Ticket but consume endpoint unreachable (simulate) | 502 to client, no partial storage |
| 12 | Optional: EICAR test file with valid ticket | Still blocked by AV |

Verify on the files domain that a 30-day share still downloads at minute 2 (TTL
actually persisted, not just returned).

## 7. Rollback

Feature is additive and ticket-gated. If anything misbehaves in production: delete
the ticket branch from the upload handler (falling back to free limits for
everything) — free users are unaffected either way. The consume/mint endpoints on
the Nuxt side can stay idle indefinitely.

## 8. Out of scope (do not do)

- No password protection for files (text-only feature).
- No download-count / multi-download for files (files stay first-download-delete).
- No auth/accounts on the files service.
- No changes to the public API shape beyond `expires_in` correctness.

## 9. Phase 3b addendum — executable denylist (required)

The Nuxt side now rejects executables in two places (`utils/filePolicy.js`):

- browser pick-time check in `SendFile.vue`;
- `POST /api/pro/upload-ticket` rejects the request when `name`/`type` are supplied
  and match the denylist.

Both are bypassable: a caller with a valid ticket can post arbitrary bytes straight
to the files service. The files service must enforce the same denylist in
`validateProUpload()` (and ideally for free uploads too) using the original
filename and/or content type:

```
svg exe dll msi msp msix appx bat cmd com scr pif hta cpl msc reg
vbs vbe js jse wsf wsh ps1 psm1 sh bash jar apk aab deb rpm dmg pkg app run
lnk url desktop service
```

Also reject these MIME types: `image/svg+xml`, `application/x-msdownload`,
`application/x-msdos-program`, `application/x-ms-installer`,
`application/vnd.microsoft.portable-executable`, `application/x-msi`,
`application/java-archive`, `application/vnd.android.package-archive`,
`application/vnd.debian.binary-package`, `application/x-rpm`,
`application/x-apple-diskimage`, `application/x-sh`, `application/x-bat`,
`application/x-ms-shortcut`, `application/x-executable`, `application/x-elf`.

Missing/mismatched filenames must fail closed only for Pro uploads if the ticket
body carried a blocked type; the mint endpoint already rejects known-bad values.

**Storage backstop:** the Nuxt mint endpoint caps each license at 2 GB of live
uploads and 50 live file shares via a Redis ledger (`pro:fu:<licHash>`). If easy,
mirror the accounting in the files service (increment on store, decrement on
delete/expiry cleanup) and reject uploads that would exceed ~2.5 GB per license.
At minimum, alert on disk usage — the ledger is best-effort and non-atomic.

### Additional acceptance tests

| # | Case | Expect |
|---|---|---|
| 13 | Valid ticket, browser pick of `setup.exe` | Blocked client-side with message |
| 14 | Valid ticket minted with `name: "setup.exe"` | 422 from `/api/pro/upload-ticket` |
| 15 | Valid ticket, direct `POST /upload` with `evil.exe` (no name/type in mint) | 422 from the files service |
| 16 | Valid ticket, direct upload with `application/x-msdownload` | 422 from the files service |
| 17 | Mint while license ledger is at 2 GB / 50 live files | 422 with storage-limit message |
