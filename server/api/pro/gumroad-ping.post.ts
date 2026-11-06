/**
 * POST /api/pro/gumroad-ping?secret=<GUMROAD_PING_SECRET>
 *
 * Gumroad calls this URL after every successful charge, renewal, refund and
 * cancellation. The browser cannot confirm a purchase, so this endpoint is
 * the source of truth for `checkout_completed` and `pro_deactivated`.
 *
 * Configure it in the Gumroad product → Advanced → "Ping URL" as:
 *   https://www.textsharenow.com/api/pro/gumroad-ping?secret=YOUR_SECRET
 *
 * Response: { ok: true, event?: string, duplicate?: boolean }
 * 401 — wrong/missing secret
 * 503 — GUMROAD_PING_SECRET is not configured
 */
import { detectPlan } from "../../utils/pro";
import { claimOnce, recordFunnelEvent } from "../../utils/funnel";

function truthy(value: unknown): boolean {
  return value === true || value === "true" || value === "1" || value === 1;
}

async function readPing(event: any): Promise<Record<string, any>> {
  try {
    const raw = await readRawBody(event, "utf8");
    if (!raw) return {};
    if (raw.trim().startsWith("{")) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    return Object.fromEntries(new URLSearchParams(raw));
  } catch {
    return {};
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const secret = String(config.GUMROAD_PING_SECRET || "");
  if (!secret) {
    throw createError({ statusCode: 503, message: "Gumroad ping is not configured." });
  }

  const query = getQuery(event);
  if (String(query.secret || "") !== secret) {
    throw createError({ statusCode: 401, message: "Invalid ping secret." });
  }

  const body = await readPing(event);
  const productId = String(body.product_id || "");
  if (productId && productId !== String(config.GUMROAD_PRODUCT_ID || "")) {
    throw createError({ statusCode: 400, message: "Unknown product." });
  }

  // Gumroad retries pings; keep each sale_id from being counted twice.
  const saleId = String(body.sale_id || body.sale_key || "");
  if (saleId) {
    const fresh = await claimOnce(`funnel:gumroad:${saleId}`);
    if (!fresh) return { ok: true, duplicate: true };
  }

  const plan = detectPlan(body);
  const price = Number(body.price);
  const props = {
    plan,
    value: Number.isFinite(price) ? price / 100 : null,
    currency: body.currency ? String(body.currency) : null,
    recurrence: body.recurrence ? String(body.recurrence) : null,
  };

  const refunded = truthy(body.refunded) || truthy(body.disputed) || truthy(body.chargebacked);
  const ended =
    !!body.subscription_ended_at || !!body.subscription_cancelled_at || !!body.subscription_failed_at;
  const recurring = truthy(body.is_recurring_charge);

  let name = "checkout_completed";
  let extra: Record<string, any> = {};
  if (refunded) {
    name = "pro_deactivated";
    extra = { reason: "refund" };
  } else if (ended) {
    name = "pro_deactivated";
    extra = { reason: "cancelled" };
  } else if (recurring) {
    // A renewal is a retention signal, not a new checkout.
    name = "renewal_completed";
  }

  await recordFunnelEvent(
    name,
    { ...props, ...extra },
    { clientId: saleId ? `gumroad.${saleId}` : "server.textsharenow" },
  );

  return { ok: true, event: name };
});
