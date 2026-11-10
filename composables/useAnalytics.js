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
    // Pro funnel (Step 1)
    LIMIT_HIT: "limit_hit",
    PAYWALL_VIEW: "paywall_view",
    CHECKOUT_STARTED: "checkout_started",
    CHECKOUT_COMPLETED: "checkout_completed",
    ACTIVATION_SUCCESS: "activation_success",
    ACTIVATION_FAILED: "activation_failed",
    RENEWAL_DUE: "renewal_due",
    PRO_DEACTIVATED: "pro_deactivated",
    // Tools (used by /tools pages once they ship)
    TOOL_VIEW: "tool_view",
    TOOL_COMPLETE: "tool_complete",
    TOOL_TO_SHARE: "tool_to_share",
    TOOL_LINK_CLICK: "tool_link_click",
    // SEO / content
    PRICING_SCROLL: "pricing_scroll",
    PRICING_FAQ_OPEN: "pricing_faq_open",
};

// The free limits that can trigger a paywall. Keep these names stable so
// GA4 explorations can compare one gate against another over time.
export const PRO_FEATURES = {
    CHARS: "chars",
    FILE_SIZE: "file_size",
    FILE_TYPE: "file_type",
    FILE_COUNT: "file_count",
    TOTAL_SIZE: "total_size",
    READS: "reads",
    PASSWORD: "password",
    EXPIRY: "expiry",
    CODE: "code",
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

/**
 * Record that a free user hit a Pro limit.
 * `attempted` is what they tried (characters, bytes, MIME type, read count…)
 * and `limit` is the free ceiling. `placement` identifies the composer/page.
 */
export function trackLimitHit(feature, { attempted, limit, placement = "composer" } = {}) {
    trackEvent(ANALYTICS_EVENTS.LIMIT_HIT, { feature, attempted, limit, placement });
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
/** A promo link to a free browser tool was clicked. */
export function trackToolLinkClick(tool, placement = "home_hero") {
    trackEvent(ANALYTICS_EVENTS.TOOL_LINK_CLICK, { tool, placement });
}
