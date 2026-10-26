/**
 * Best-effort security event log for incident response.
 *
 * Stores one small JSON line per event in a per-day Redis list:
 *   { ev, code, at, note? }
 * — event type, share code, timestamp and an optional short note. Never the
 * share content, never an IP address. Lists are capped and expire after
 * 7 days, matching what the privacy policy describes.
 *
 * Logging must never block or fail a user request.
 */
import { upstash, type UpstashConfig } from './shareCode'

const PREFIX = 'sec:log:'
const MAX_EVENTS_PER_DAY = 500
const RETENTION = 7 * 86400

export type SecurityEvent = 'password_fail' | 'share_burned'

export async function logSecurityEvent(
  config: UpstashConfig,
  event: SecurityEvent,
  code: string,
  note?: string,
): Promise<void> {
  try {
    const day = new Date().toISOString().slice(0, 10)
    const key = PREFIX + day
    const entry = JSON.stringify({
      ev: event,
      code,
      at: Date.now(),
      ...(note ? { note } : {}),
    })
    await upstash(config, ['LPUSH', key, entry])
    await upstash(config, ['LTRIM', key, 0, MAX_EVENTS_PER_DAY - 1])
    await upstash(config, ['EXPIRE', key, RETENTION])
  } catch {
    // Security logging is non-critical — never surface errors to the client.
  }
}
