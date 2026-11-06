# Pro funnel instrumentation

Step 1 of the Pro roadmap: measure every stage from hitting a free limit to
renewal or cancellation. No free tool is gated and no account is required.

## Events

All client events go through `trackEvent` in `composables/useAnalytics.js`
(GA4 `gtag` + Vercel Analytics). Server-confirmed events are written by
`server/utils/funnel.ts`.

| Event | Fired by | Main properties |
|---|---|---|
| `limit_hit` | Free user hits a gate | `feature`, `attempted`, `limit`, `placement` |
| `paywall_view` | `useProModal.open(reason, placement)` | `reason`, `placement` |
| `checkout_started` | Every Pro CTA + `/go/pro` fallback counter | `location`, `plan`, `placement` |
| `checkout_completed` | Gumroad ping (server) | `plan`, `value`, `currency` |
| `activation_success` | `usePremium.activate()` | `source`, `plan` |
| `activation_failed` | `usePremium.activate()` | `source`, `status`, `reason` |
| `renewal_due` | `usePremium.checkStatus()` | `plan`, `days_left`, `renewal_at` |
| `renewal_completed` | Gumroad ping (server) | `plan`, `value`, `currency` |
| `pro_deactivated` | `usePremium.deactivate()`, status check, Gumroad ping | `reason` |

`share_to_pro`, `pro_cta_click` and `pro_activated` are still emitted so the
existing GA4 explorations keep working.

### `limit_hit` features

`chars`, `file_size`, `file_type`, `file_count`, `total_size`, `reads`,
`password`, `expiry`, `code`.

### Placements

`send_text`, `send_file`, `app_header`, `my_shares`, `receipts`,
`pricing_plan_card`, `pricing_how_to`, and the checkout locations from
`utils/checkout.js` (`hero`, `plan_card`, `how_to`, `bottom`, `pro_modal`,
`developers`).

## Pro status API

`GET /api/pro/status` now returns:

```json
{
  "pro": true,
  "via": "cookie",
  "plan": "annual",
  "email": "j***@example.com",
  "renewsAt": "2027-02-01T00:00:00.000Z",
  "endsAt": null
}
```

`renewsAt` is derived from the purchase date and recurrence (Gumroad does not
return the next charge date for active subscriptions). `endsAt` is populated
when Gumroad reports a subscription end date. Both are `null` when unknown.
The email is masked before it leaves the server.

## Gumroad ping (checkout confirmation)

Client-side events cannot prove a payment. Configure the Gumroad product's
**Ping URL** to call this endpoint after each sale:

```
https://www.textsharenow.com/api/pro/gumroad-ping?secret=YOUR_SECRET
```

Set the same value in the deployment environment:

```
GUMROAD_PING_SECRET=YOUR_SECRET
```

If you set it at runtime rather than build time, use the Nuxt override name
`NUXT_GUMROAD_PING_SECRET` (the config falls back to it automatically).

Behaviour:

- `POST` with Gumroad's form-encoded payload.
- Rejects requests without the secret (`401`) and does nothing when
  `GUMROAD_PING_SECRET` is unset (`503`).
- Ignores pings for a different `product_id`.
- Idempotent per `sale_id` (Redis `SET NX`), so Gumroad retries do not double
  count.
- `checkout_completed` for a new sale, `renewal_completed` for a recurring
  charge, and `pro_deactivated` (`reason: refund` / `cancelled`) otherwise.

## GA4 Measurement Protocol (optional)

Server events reach Upstash counters even without GA4 credentials. To also put
them in the same GA4 property as the client events:

```
GA4_API_SECRET=...            # GA4 Admin → Data streams → Measurement Protocol API secrets
GA4_MEASUREMENT_ID=G-PXW7CX14YN
```

Only non-PII properties are forwarded (plan, value, currency, reason).

## Counters in Redis

- `stats:funnel:<event>:total` — all-time `HINCRBY` by plan/location/reason
- `stats:funnel:<event>:<YYYY-MM-DD>` — daily, 400-day TTL
- `stats:pro:total` and `stats:pro:daily:<YYYY-MM-DD>` — existing `/go/pro`
  checkout click counters
