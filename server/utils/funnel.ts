/**
 * Server-side funnel events.
 *
 * Client GA4 events cover the normal path, but purchases are confirmed by
 * Gumroad (never by the browser). This helper records those confirmations in
 * Upstash and, when GA4_API_SECRET is configured, forwards them to GA4's
 * Measurement Protocol so they land in the same property as the client events.
 *
 * Analytics is best-effort: every failure is swallowed.
 */

type FunnelProps = Record<string, string | number | boolean | null | undefined>

function upstashCommand(config: any, command: unknown[]) {
  return fetch(config.UPSTASH_REDIS_REST_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  })
}

/** Daily + all-time counters, grouped by a readable dimension. */
async function recordCounter(event: string, props: FunnelProps) {
  const config = useRuntimeConfig()
  if (!config.UPSTASH_REDIS_REST_URL || !config.UPSTASH_REDIS_REST_TOKEN) return

  const day = new Date().toISOString().slice(0, 10)
  const field =
    [props.plan, props.location, props.reason].filter(Boolean).join(":") || "all"
  const ttl = 60 * 60 * 24 * 400

  try {
    await Promise.all([
      upstashCommand(config, ["HINCRBY", `stats:funnel:${event}:total`, field, 1]),
      upstashCommand(config, ["HINCRBY", `stats:funnel:${event}:${day}`, field, 1]).then(() =>
        upstashCommand(config, ["EXPIRE", `stats:funnel:${event}:${day}`, String(ttl)]),
      ),
    ])
  } catch {}
}

/** Forward an event through GA4's Measurement Protocol, when configured. */
async function recordGa4(event: string, props: FunnelProps, clientId: string) {
  const config = useRuntimeConfig()
  const apiSecret = config.GA4_API_SECRET
  const measurementId = config.GA4_MEASUREMENT_ID
  if (!apiSecret || !measurementId) return

  // Keep the payload free of PII — plan, value and reason are enough.
  const params: FunnelProps = {}
  for (const [key, value] of Object.entries(props)) {
    if (value === null || value === undefined || value === "") continue
    params[key] = value
  }

  try {
    await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(measurementId)}&api_secret=${encodeURIComponent(apiSecret)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: clientId,
          events: [{ name: event, params }],
        }),
      },
    )
  } catch {}
}

export async function recordFunnelEvent(
  event: string,
  props: FunnelProps = {},
  { sendToGa4 = true, clientId = "server.textsharenow" } = {},
) {
  await Promise.allSettled([
    recordCounter(event, props),
    sendToGa4 ? recordGa4(event, props, clientId) : Promise.resolve(),
  ])
}

/**
 * Idempotency guard for webhooks. Returns true the first time a key is seen
 * and false afterwards. Fails open if Redis is unavailable.
 */
export async function claimOnce(key: string, ttlSeconds = 60 * 60 * 24 * 90): Promise<boolean> {
  const config = useRuntimeConfig()
  if (!config.UPSTASH_REDIS_REST_URL || !config.UPSTASH_REDIS_REST_TOKEN) return true
  try {
    const res = await upstashCommand(config, ["SET", key, "1", "NX", "EX", String(ttlSeconds)])
    const data = await res.json()
    return data?.result === "OK"
  } catch {
    return true
  }
}
