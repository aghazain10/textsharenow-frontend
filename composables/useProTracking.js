// Client-side events for the Pro funnel. GA4 (gtag) is the primary channel;
// Vercel Analytics custom events are sent too when the plan supports them.
// Both calls are best-effort — analytics must never block a click or a render.
import { track as vercelTrack } from "@vercel/analytics";

export function trackProEvent(name, props = {}) {
    if (!import.meta.client) return;

    try {
        window.gtag?.("event", name, { ...props, transport_type: "beacon" });
    } catch {}

    try {
        vercelTrack(name, props);
    } catch {}
}
