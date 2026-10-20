/**
 * Shared share-code lookup for the /api/share meta + delete endpoints.
 * Mirrors the forms logic in [code].get.ts: random codes are 5 uppercase
 * alphanumerics, custom codes (Pro) are 3–30 lowercase [a-z0-9_-].
 */

export type UpstashConfig = { UPSTASH_REDIS_REST_URL: string; UPSTASH_REDIS_REST_TOKEN: string }

export const KEY_PREFIX = 'share:'
export const READS_PREFIX = 'reads:'
export const ATTEMPTS_PREFIX = 'pwa:'

export async function upstash(config: UpstashConfig, command: unknown[]): Promise<any> {
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

/** Run several Redis commands in one round trip (Upstash /pipeline). */
export async function upstashPipeline(
  config: UpstashConfig,
  commands: unknown[][],
): Promise<any[]> {
  const url = config.UPSTASH_REDIS_REST_URL.replace(/\/$/, '') + '/pipeline'
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.UPSTASH_REDIS_REST_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
  })
  if (!res.ok) throw new Error(`Upstash error: ${res.status}`)
  return res.json()
}

/** Candidate storage forms, most likely first (keeps random codes a single GET). */
export function shareStorageForms(rawInput: string): string[] {
  const raw = (rawInput || '').trim()
  const randomForm = raw.toUpperCase().replace(/[^A-Z0-9]/g, '')
  const customForm = raw.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 30)

  const forms: string[] = []
  if (/^[A-Za-z0-9]{5}$/.test(raw)) {
    forms.push(randomForm)
    if (customForm !== randomForm) forms.push(customForm)
  } else {
    if (customForm.length >= 3) forms.push(customForm)
    if (randomForm.length >= 4 && randomForm !== customForm) forms.push(randomForm)
  }
  return forms
}

export async function findShare(
  config: UpstashConfig,
  rawInput: string,
): Promise<{ code: string; raw: string } | null> {
  for (const form of shareStorageForms(rawInput)) {
    const res = await upstash(config, ['GET', KEY_PREFIX + form])
    if (res.result) return { code: form, raw: res.result }
  }
  return null
}

export function parseSharePayload(raw: string): { text: string; pw?: string; mr?: number } | null {
  if (!raw.startsWith('{')) return null
  try {
    const parsed = JSON.parse(raw)
    if (parsed && parsed.__tsn === 1 && typeof parsed.text === 'string') return parsed
  } catch {
    // Not our JSON — legacy plain text
  }
  return null
}
