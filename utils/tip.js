/** Where tips go (PayPal payment link: card or PayPal, no account needed to pay by card). */
export const TIP_URL = "https://www.paypal.com/ncp/payment/QDLKMQZAPHDHE";

/**
 * Count a tip-nudge event (shown / click / later) in Upstash via /api/tip-event.
 * Uses sendBeacon so the count still goes out when the click opens PayPal.
 * Pass `base` = useRuntimeConfig().public.API_BASE (read it in setup, not in a click handler).
 */
export const trackTip = (event, where, base = "") => {
    if (typeof window === "undefined") return;
    try {
        const url = `${base}/api/tip-event`;
        const data = JSON.stringify({ event, where });
        // text/plain keeps it a "simple" request, so it works cross-origin without a preflight
        const blob = new Blob([data], { type: "text/plain" });
        if (!navigator.sendBeacon?.(url, blob)) {
            fetch(url, { method: "POST", body: data, headers: { "Content-Type": "text/plain" }, keepalive: true }).catch(() => {});
        }
    } catch {
        // Tracking must never break the page
    }
};
