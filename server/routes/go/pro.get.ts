/**
 * GET /go/pro?plan=monthly&loc=hero
 *
 * The only checkout link the UI hands out. Counts the click anonymously in
 * Upstash, then 302s to Gumroad's payment form with UTMs attached — so Pro
 * CTAs never point at the product page and every click is measurable.
 *
 * Fail-open: if Redis is unreachable the redirect still happens.
 */
import { proCheckoutUrl, normalizeProPlan, normalizeProLocation } from "../../../utils/checkout.js";

async function bumpCounter(redisUrl: string, token: string, key: string, field: string, ttlSeconds?: number) {
    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    await fetch(redisUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(["HINCRBY", key, field, 1]),
    });

    if (ttlSeconds) {
        await fetch(redisUrl, {
            method: "POST",
            headers,
            body: JSON.stringify(["EXPIRE", key, String(ttlSeconds)]),
        });
    }
}

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const plan = normalizeProPlan(String(query.plan ?? ""));
    const location = normalizeProLocation(String(query.loc ?? ""));
    const config = useRuntimeConfig();

    const destination = proCheckoutUrl({
        base: config.public.PRO_URL,
        plan,
        location,
    });

    const day = new Date().toISOString().slice(0, 10);
    try {
        const { UPSTASH_REDIS_REST_URL: redisUrl, UPSTASH_REDIS_REST_TOKEN: token } = config;
        if (redisUrl && token) {
            await Promise.all([
                bumpCounter(redisUrl, token, "stats:pro:total", location),
                bumpCounter(redisUrl, token, `stats:pro:daily:${day}`, location, 60 * 60 * 24 * 400),
            ]);
        }
    } catch {
        // Never block checkout on analytics.
    }

    setHeader(event, "Cache-Control", "no-store");
    setHeader(event, "X-Robots-Tag", "noindex, nofollow");
    return sendRedirect(event, destination, 302);
});
