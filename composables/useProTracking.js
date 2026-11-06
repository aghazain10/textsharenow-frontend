// Client-side events for the Pro funnel. This is a thin alias over the shared
// analytics module so every Pro event also reaches Vercel Analytics and uses
// the same beacon transport as the rest of the site.
export { ANALYTICS_EVENTS as PRO_EVENTS, trackLimitHit } from "./useAnalytics.js";
import { trackEvent } from "./useAnalytics.js";

export function trackProEvent(name, props = {}) {
    trackEvent(name, props);
}
