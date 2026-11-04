// Client-side analytics for the whole site (GA4 + Vercel Analytics).
// Best-effort: analytics must never block a render or a click.
import { track as vercelTrack } from "@vercel/analytics";

export const ANALYTICS_EVENTS = {
    // Funnel
    SHARE_CREATED: "share_created",
    SHARE_RECEIVED: "share_received",
    SHARE_TO_PRO: "share_to_pro",
    PRO_CTA_CLICK: "pro_cta_click",
    PRO_ACTIVATED: "pro_activated",
    // Tools (used by /tools pages once they ship)
    TOOL_VIEW: "tool_view",
    TOOL_COMPLETE: "tool_complete",
    TOOL_TO_SHARE: "tool_to_share",
    // SEO / content
    PRICING_SCROLL: "pricing_scroll",
    PRICING_FAQ_OPEN: "pricing_faq_open",
};

export function trackEvent(name, props = {}) {
    if (!import.meta.client) return;
    try {
        window.gtag?.("event", name, { ...props, transport_type: "beacon" });
    } catch {}
    try {
        vercelTrack(name, props);
    } catch {}
}

// Convenience wrappers so tool pages stay consistent.
export function trackToolView(tool) {
    trackEvent(ANALYTICS_EVENTS.TOOL_VIEW, { tool });
}
export function trackToolComplete(tool, props = {}) {
    trackEvent(ANALYTICS_EVENTS.TOOL_COMPLETE, { tool, ...props });
}
export function trackToolToShare(tool) {
    trackEvent(ANALYTICS_EVENTS.TOOL_TO_SHARE, { tool });
}