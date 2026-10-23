import { createHash, randomBytes } from 'node:crypto'

export type Upstash = { UPSTASH_REDIS_REST_URL: string; UPSTASH_REDIS_REST_TOKEN: string }

export const STORAGE_CAP = 2 * 1024 * 1024 * 1024
export const LIVE_FILE_LIMIT = 50
export const LEDGER_TTL = 2592000 + 3600

export async function redisCommand(config: Upstash, command: unknown[]): Promise<any> {
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

export function licenseHash(licenseKey: string): string {
  return createHash('sha256').update(licenseKey.trim()).digest('hex')
}

function ledgerKey(licenseKey: string): string {
  return `pro:fu:${licenseHash(licenseKey)}`
}

export async function readLedger(
  config: Upstash,
  licenseKey: string,
): Promise<{ liveCount: number; liveBytes: number } | null> {
  try {
    const ledgerRaw = await redisCommand(config, ['HGETALL', ledgerKey(licenseKey)])
    const entries = ledgerRaw?.result && typeof ledgerRaw.result === 'object' ? ledgerRaw.result : {}
    const now = Math.floor(Date.now() / 1000)
    const stale: string[] = []
    let liveCount = 0
    let liveBytes = 0

    for (const [id, raw] of Object.entries(entries)) {
      let entry: { s?: number; e?: number } = {}
      try { entry = JSON.parse(String(raw)) } catch {}
      const bytes = Number(entry.s)
      const expiry = Number(entry.e)
      if (!Number.isFinite(bytes) || !Number.isFinite(expiry) || expiry <= now) {
        stale.push(id)
      } else {
        liveCount++
        liveBytes += bytes
      }
    }

    if (stale.length) await redisCommand(config, ['HDEL', ledgerKey(licenseKey), ...stale])
    return { liveCount, liveBytes }
  } catch {
    return null
  }
}

export async function reserveLedger(
  config: Upstash,
  licenseKey: string,
  size: number,
  expires: number,
): Promise<void> {
  try {
    const id = randomBytes(8).toString('hex')
    const entry = JSON.stringify({ s: size, e: Math.floor(Date.now() / 1000) + expires })
    await redisCommand(config, ['HSET', ledgerKey(licenseKey), id, entry])
    await redisCommand(config, ['EXPIRE', ledgerKey(licenseKey), LEDGER_TTL])
  } catch {}
}
