# Multi-file Pro transfers — files-service plan

> For the agent working on the VPS files service (`files.textsharenow.com`,
> code at `/var/lib/filesvc/`). The Nuxt side is implemented locally in this
> repo and must be deployed before end-to-end testing. This plan adds a new
> `/transfer` flow without changing the existing single-file `/upload` +
> `/download/:code` flow.

## 1. What the Nuxt side already does

- Pro users can select up to **20 files**, **100 MB total**, expiry 10 min–30 days.
- One browser request goes to `POST ${FILES_API_URL}/transfer` with:
  - `ticket` — a single-use 64-hex transfer ticket
  - `expires` — seconds
  - `manifest` — JSON array of `{ name, type, size, path }`
  - `files` — repeated file parts, in the same order as `manifest`
- The browser never uploads a ZIP. The service stores individual files.
- Receivers open `/r?tcode=<CODE>` and read `GET /transfer/<CODE>`.
- Individual downloads use `/transfer/<CODE>/file/<FILE_ID>`.
- “Download all” uses `/transfer/<CODE>/zip`.
- The sender dashboard calls `DELETE /transfer/<CODE>` through Nuxt.
- The service must call back to Nuxt after upload so the transfer can appear in
  **My Shares**, and sync remaining counts as files are downloaded.

The Nuxt-side endpoints already exist:

| Endpoint | Purpose |
|---|---|
| `POST /api/pro/transfer-ticket` | Mint a transfer ticket (Pro only) |
| `POST /api/pro/upload-ticket/consume` | Redeem a ticket (called by the files service) |
| `POST /api/pro/transfers/register` | Register a finished transfer for the dashboard |
| `POST /api/pro/transfers/sync` | Update remaining count/size, or remove an empty transfer |
| `DELETE /api/pro/transfers/:code` | Dashboard deletion, signed for the files service |

## 2. New files-service routes

All responses are JSON except downloads.

### 2.1 `POST /transfer`

Multipart form fields:

```
ticket   64-hex transfer ticket
expires  seconds (also included in the ticket; must match)
manifest JSON array: [{ "name": "a.pdf", "type": "application/pdf", "size": 1234, "path": "folder/a.pdf" }]
files    one or more binary parts, same order/count as manifest
```

Implementation order:

1. Parse `ticket`, `expires`, `manifest`.
2. Validate manifest: 1–20 entries; each `size` > 0; total ≤ 100 MB;
   `path` is a safe relative path; `path` basename matches `name`.
3. Sum manifest sizes and call:
   ```
   POST https://www.textsharenow.com/api/pro/upload-ticket/consume
   { "ticket": "<ticket>", "size": <manifest total> }
   ```
   Do this **before** streaming the file parts, so a slow upload does not
   outlive the 10-minute ticket.
4. Require `kind === "transfer"` in the consume response. Reject a single-file
   ticket. Use `maxFiles`, `maxTotal`, and `ttl` from the response.
5. Stream the `files` parts to temporary files. Enforce:
   - actual part count ≤ `maxFiles`;
   - actual total ≤ `maxTotal` and ≤ manifest total;
   - each actual size > 0;
   - actual filename matches the manifest entry;
   - blocked extension/MIME checks on every file;
   - no SVG.
6. Scan every file with the existing ClamAV path. All-or-nothing: if one file
   fails, delete the pending transfer and return an error.
7. Generate a unique 5-character uppercase code. Check it does not collide with
   an existing single-file code or transfer code. Create the transfer manifest
   and move files into permanent storage.
8. Call Nuxt:
   ```
   POST https://www.textsharenow.com/api/pro/transfers/register
   {
     "transferId": "<transferId from consume>",
     "code": "<CODE>",
     "count": <number>,
     "bytes": <actual total>
   }
   ```
   Use the `transferId` exactly as returned by consume. Retry transient failures
   with backoff. The private management key in Nuxt lasts for the transfer TTL
   plus 1 hour, so the first attempt should happen immediately. A registration
   failure must not lose the transfer; log it and retry. If Nuxt returns 409
   (code already taken), generate a new code and retry registration; do not
   overwrite the existing transfer. A 410 means the grant expired while
   uploading: delete the pending transfer and return an error. Do not expose
   `transferId` to the browser or include it in `GET /transfer/:code`.
9. Respond:
   ```json
   {
     "code": "ABCDE",
     "expires_in": 86400,
     "count": 3,
     "bytes": 1234567,
     "files": [
       { "id": "f_...", "name": "a.pdf", "path": "folder/a.pdf", "size": 1234 }
     ]
   }
   ```

`expires_in` must be the honored TTL, not a clamped value.

### 2.2 `GET /transfer/:code`

Public manifest. Does not consume anything. Return only files that still exist:

```json
{
  "code": "ABCDE",
  "expires_in": 83000,
  "count": 3,
  "bytes": 1234567,
  "files": [{ "id": "f_...", "name": "a.pdf", "path": "folder/a.pdf", "size": 1234 }]
}
```

- 404 if the transfer is missing, expired, or has no files left.
- `Cache-Control: no-store`.
- CORS: allow `https://www.textsharenow.com` (and the existing dev origin, if
  the service currently has one). Allow `GET, HEAD, POST, DELETE, OPTIONS`.

### 2.3 `GET /transfer/:code/file/:fileId`

- Stream the file with `Content-Disposition: attachment` and the basename
  (`a.pdf`, not `folder/a.pdf`).
- Atomically claim the file before streaming (per-file lock or atomic rename).
  A concurrent second request must not also stream it.
- Delete **that file** after the response finishes successfully; on an aborted
  response, release the claim and keep the file.
- 404 if the file/transfer is gone or already claimed.
- Do not allow a second successful download of the same file.
- After a successful download, update the manifest and call Nuxt
  `POST /api/pro/transfers/sync` with `{ transferId, code, count, bytes }` for
  the remaining files. If no files remain, send `count: 0, bytes: 0`; Nuxt
  removes the dashboard entry.

### 2.4 `GET /transfer/:code/zip`

- Lock the transfer (or claim all files) before streaming so individual
  downloads cannot race the ZIP.
- Stream a ZIP of all remaining files, preserving `path` inside the archive.
- Sanitize paths; reject traversal, absolute paths, symlinks, duplicate paths.
- Cap entry count and uncompressed size; clean up temp ZIP files.
- On successful completion, delete all files and the transfer, then call
  `POST /api/pro/transfers/sync` with `count: 0, bytes: 0`.
- If the stream is aborted, keep the files and release the lock; do not call
  sync with zero.
- 404 if nothing remains or the transfer is locked by another ZIP.
- If the stream is aborted, either keep the transfer for retry (preferred) or
  follow the existing single-file delete-on-start semantics. Document the
  choice; the frontend says “each file is deleted after its first download”.

### 2.5 `DELETE /transfer/:code`

Called by Nuxt, never directly by browsers. Require:

```
X-TSN-Timestamp: <unix seconds>
X-TSN-Signature: <hex HMAC-SHA256(TSN_DELETE_SECRET, `${code}.${timestamp}`)>
```

- Reject missing/bad signatures, timestamps older/newer than 5 minutes.
- Delete the transfer directory, manifest, and any partial files.
- Return 200 even if the transfer is already gone, or 404; Nuxt treats both as
  success.

The same secret must be set in both places:

- Vercel: `FILES_DELETE_SECRET`
- files service: `TSN_DELETE_SECRET`

## 3. Storage model

Suggested layout (adapt to the service’s existing conventions):

```
/var/lib/filesvc/transfers/<CODE>/manifest.json
/var/lib/filesvc/transfers/<CODE>/files/<fileId>.<safe-ext>
```

Manifest fields:

```json
{
  "code": "ABCDE",
  "createdAt": 1760000000,
  "expiresAt": 1760086400,
  "owner": "<ownerHash from consume>",
  "files": [
    {
      "id": "f_...",
      "name": "a.pdf",
      "path": "folder/a.pdf",
      "size": 1234,
      "mime": "application/pdf",
      "storedAs": "files/f_....pdf"
    }
  ]
}
```

Write the manifest atomically (temp file + rename). The code is the public
credential; the directory name must not be user-controlled. Never use
`manifest.path` as a filesystem path. Treat `transferId` as a secret: it is only
needed for the register/sync callbacks.

Keep private registration state (for example `registeredAt` and `lastSyncAt`) in
the manifest or a sidecar. If registration or sync fails, do not fail the upload
or download: leave the state pending and retry from the sweeper or the next
transfer operation. On registration `409`, generate a new code, atomically
rename the transfer directory/manifest, and retry. On `410`, delete the transfer.

## 4. Expiry and cleanup

- Store the exact `ttl` from the ticket/consume response (10 min–30 days).
- The existing sweeper must cover both single files and transfer directories.
  Check for hardcoded 1-hour limits.
- Remove expired transfer directories and manifests.
- Disk alert at the VPS level; the current Pro ledger is best-effort and
  non-atomic.
- Do not delete a transfer early just because a manifest request happened;
  only downloads and expiry consume files.

## 5. Security requirements

- Consume the ticket before accepting bytes; reject reuse (the Nuxt endpoint
  already uses `GETDEL`).
- Treat manifest names/types/paths as untrusted. Enforce actual file names,
  sizes, and types server-side.
- Reject `.svg`, executables/installers/scripts, absolute paths, `..`, control
  and bidi characters, duplicate paths, and path/name mismatches. Mirror the
  single-file denylist rather than trusting the browser MIME type.
- Scan every file, not the ZIP container. If nested archives are allowed,
  preserve the existing single-file policy and consider archive inspection
  separately.
- Do not log full tickets or `transferId`; log at most an 8-character prefix.
- Use per-file/transfer locks for single-use downloads and ZIPs; clean stale
  claims during the sweeper.
- Rate-limit `POST /transfer` and manifest reads by IP. The browser can retry,
  but a 100 MB upload must not be trivial to spam.
- CORS only for the production Nuxt origin; do not use `*` for manifest/download
  routes if credentials are ever added. (Current frontend uses no cookies on
  the files domain.)
- Do not expose a public delete route. Delete requires the HMAC headers.

## 6. Proxy / infra

- `client_max_body_size` (or Caddy equivalent) ≥ **110 MB** for `/transfer`.
- Upload/read timeouts ≥ **5 minutes** for 100 MB on a slow connection.
- Keep `/upload` unchanged; do not route old single-file traffic through
  `/transfer`.
- Verify `GET /transfer/:code` and ZIP responses include the CORS headers the
  browser needs.
- Ensure the service can reach `https://www.textsharenow.com` for consume and
  register callbacks. `NITRO_API_BASE` (or the existing equivalent) should be
  the production Nuxt origin.

## 7. Local Nuxt contract details

The browser sends:

```ts
POST `${FILES_API_URL}/transfer`
FormData:
  ticket: "<64 hex>"
  expires: "86400"
  manifest: JSON.stringify([{ name, type, size, path }])
  files: <File>, <File>, ...
```

The browser expects success:

```json
{ "code": "ABCDE", "expires_in": 86400, "count": 2, "bytes": 1234 }
```

The receiver expects:

```json
{
  "code": "ABCDE",
  "expires_in": 83000,
  "count": 2,
  "bytes": 1234,
  "files": [{ "id": "f_1", "name": "a.pdf", "path": "folder/a.pdf", "size": 600 }]
}
```

The service sends `{ transferId, code, count, bytes }` to
`POST /api/pro/transfers/sync` after each download; `count: 0, bytes: 0`
removes the dashboard entry. `transferId` stays server-side.

The dashboard delete expects Nuxt to call the service with the HMAC headers
above. Nuxt already registers `FILES_DELETE_SECRET`; set it in Vercel before
testing deletion.

## 8. Acceptance tests

### Upload
- 1 file / 2 files / 20 files / 21 files.
- 99 MB total / 101 MB total.
- One blocked `.exe` in a batch → entire transfer rejected, no partial files.
- One infected EICAR file in a batch → entire transfer rejected.
- SVG in a batch → rejected.
- Duplicate paths → rejected.
- `../`, absolute path, path/name mismatch → rejected.
- Expired/reused/garbage ticket → rejected.
- Single-file ticket sent to `/transfer` → rejected.
- Slow upload longer than the 10-minute ticket mint window (but within the
  transfer TTL) → accepted because the ticket is consumed up front.
- CORS preflight for `POST /transfer` → correct headers.

### Receive
- `GET /transfer/:code` lists remaining files; no content leaks.
- Download one file → that file disappears, others remain.
- Download the same file again → 404 or 409, never a second 200 body.
- Two concurrent downloads of one file → only one succeeds.
- Abort a ZIP mid-stream → files remain; retry the ZIP works.
- Download all ZIP → paths preserved; all files gone; second request 404.
- Expired code → 404.
- Manifest request does not consume a file.
- Mobile/receiver UI shows count, total size, individual downloads, and ZIP.
- `/r?tcode=CODE` and `/r?code=CODE` both resolve correctly.

### Dashboard / auth
- After upload, `POST /api/pro/transfers/register` is called with the correct
  `transferId`, code, count, and bytes.
- Transfer appears in `/my-shares` with file count and total size.
- Downloading one file updates the remaining count and size in My Shares.
- Downloading the last file or the ZIP removes the transfer from My Shares.
- `DELETE /api/pro/transfers/:code` from the dashboard signs and deletes the
  service transfer; it disappears from My Shares.
- Wrong license cannot delete another license’s transfer.
- Missing `FILES_DELETE_SECRET` / bad HMAC → service rejects delete.
- Registration callback failure does not break downloads; retry succeeds.
- Sync callback failure does not break downloads; dashboard may lag until the
  next sync or expiry.

### Limits
- 50 live transfers / 2 GB ledger still enforced by the Nuxt mint.
- Service independently enforces 20 files / 100 MB per transfer.
- Disk cleanup removes expired transfer directories and partial uploads.

## 9. Rollout order

1. Commit and deploy the Nuxt changes (new ticket/register/sync/delete routes,
   UI). Single-file uploads still use `/upload` and are unaffected.
2. Deploy the files-service `/transfer` routes.
3. Set `FILES_DELETE_SECRET` in Vercel and `TSN_DELETE_SECRET` on the VPS.
4. Run the upload/receive/dashboard tests above.
5. Only then advertise multi-file on pricing/FAQ if that copy is not already
   live.

Rollback: disable/remove the `/transfer` routes; the old single-file flow keeps
working. The Nuxt transfer endpoints can stay idle.
