/**
 * POST /api/pro/upload-ticket/consume
 * Body: { ticket: string, size: number }
 * Response: { ok: true, maxBytes: number, ttl: number }
 *
 * Called by the files service (server-to-server) before storing an upload.
 * Redeems the ticket atomically (GETDEL): the random 256-bit token is the
 * only credential, so no shared secret is needed. Validated against the
 * values the ticket was minted with.
 * 403 — ticket missing, expired, or already redeemed
 * 422 — upload exceeds what the ticket authorizes
 */
type Upstash = { UPSTASH_REDIS_REST_URL: string; UPSTASH_REDIS_REST_TOKEN: string }

async function upstash(config: Upstash, command: unknown[]): Promise<any> {
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

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const ticket = typeof body?.ticket === 'string' && /^[a-f0-9]{64}$/.test(body.ticket) ? body.ticket : ''
  const size = Number(body?.size)

  if (!ticket) {
    throw createError({ statusCode: 403, message: 'Invalid upload ticket.' })
  }

  // Single-use redeem — one ticket authorizes exactly one upload attempt.
  const res = await upstash(config, ['GETDEL', `fticket:${ticket}`])
  if (!res.result) {
    throw createError({ statusCode: 403, message: 'Upload ticket is invalid or has expired. Ask the user to retry the upload.' })
  }

  let minted: {
    mb?: number
    ttl?: number
    kind?: string
    total?: number
    maxFiles?: number
    owner?: string
    tid?: string
    enc?: boolean
  }
  try {
    minted = JSON.parse(res.result)
  } catch {
    throw createError({ statusCode: 403, message: 'Upload ticket is invalid or has expired. Ask the user to retry the upload.' })
  }

  const maxBytes = Number(minted.mb)
  const ttl = Number(minted.ttl)
  const isTransfer = minted.kind === 'transfer'
  const total = Number(minted.total)
  const maxFiles = Number(minted.maxFiles)
  const authorized = isTransfer ? total : maxBytes

  if (
    !Number.isInteger(size) ||
    size <= 0 ||
    !Number.isFinite(maxBytes) ||
    !Number.isFinite(ttl) ||
    !Number.isFinite(authorized) ||
    size > authorized
  ) {
    throw createError({ statusCode: 422, message: 'Upload exceeds what this ticket authorizes.' })
  }

  if (isTransfer && (!Number.isInteger(maxFiles) || maxFiles <= 0 || typeof minted.owner !== 'string' || typeof minted.tid !== 'string')) {
    throw createError({ statusCode: 403, message: 'Upload ticket is invalid or has expired. Ask the user to retry the upload.' })
  }

  return {
    ok: true,
    maxBytes,
    ttl,
    enc: minted.enc === true,
    ...(isTransfer
      ? {
          kind: 'transfer',
          maxFiles,
          maxTotal: total,
          ownerHash: minted.owner,
          transferId: minted.tid,
        }
      : {}),
  }
})
