// Pro entitlement state + actions.
//  - `isPro` drives the whole UI (locks, limits, expiry, reads, password)
//  - hydrated once per load from GET /api/pro/status (the signed cookie
//    decides — the client never claims pro on its own)
//  - `activate(key)` posts a Gumroad license key to /api/pro/activate
//  - `deactivate()` clears the session cookie
// In dev, `isPro` can still be toggled directly by the "Try Pro" preview pill.
import { trackEvent, ANALYTICS_EVENTS } from "./useAnalytics.js";

// How close to the next charge before we ask the user to check their plan.
const RENEWAL_WINDOW_DAYS = 7;

export function usePremium() {
    const isPro = useState("premium-preview", () => false);
    const activating = useState("premium-activating", () => false);
    const checked = useState("premium-checked", () => false);
    // Entitlement details returned by /api/pro/status. Null for free users
    // and for older sessions whose cache predates these fields.
    const plan = useState("premium-plan", () => null);
    const renewalAt = useState("premium-renewal-at", () => null);
    const endsAt = useState("premium-ends-at", () => null);
    const email = useState("premium-email", () => null);

    function applyEntitlement(data) {
        plan.value = data?.plan || null;
        renewalAt.value = data?.renewsAt || null;
        endsAt.value = data?.endsAt || null;
        email.value = data?.email || null;
    }

    // Fire `renewal_due` at most once per day per browser when the next
    // charge (or cancellation end date) is within a week.
    function maybeTrackRenewalDue() {
        if (!isPro.value) return;
        const raw = renewalAt.value || endsAt.value;
        if (!raw) return;
        const when = new Date(raw).getTime();
        if (!Number.isFinite(when)) return;
        const daysLeft = Math.ceil((when - Date.now()) / 86400000);
        if (daysLeft < 0 || daysLeft > RENEWAL_WINDOW_DAYS) return;
        try {
            const key = `tsn:renewal-due:${new Date().toISOString().slice(0, 10)}`;
            if (sessionStorage.getItem(key)) return;
            sessionStorage.setItem(key, "1");
        } catch {}
        trackEvent(ANALYTICS_EVENTS.RENEWAL_DUE, {
            plan: plan.value,
            days_left: daysLeft,
            renewal_at: raw,
        });
    }

    async function checkStatus(force = false) {
        if (checked.value && !force) return;
        const wasPro = isPro.value;
        try {
            const res = await $fetch("/api/pro/status");
            const nextPro = !!res.pro;
            isPro.value = nextPro;
            if (nextPro) {
                applyEntitlement(res);
                maybeTrackRenewalDue();
            } else {
                applyEntitlement(null);
                // A verified "no" after previously being pro means the
                // subscription lapsed, was refunded, or the cookie expired.
                if (wasPro) {
                    trackEvent(ANALYTICS_EVENTS.PRO_DEACTIVATED, { reason: "session_expired" });
                }
            }
        } catch {
            // Network hiccup: keep the last known state instead of logging a
            // false deactivation. Initial loads still default to free.
            if (!checked.value) isPro.value = false;
        }
        checked.value = true;
    }

    /** Activate with a Gumroad license key. Returns { ok, message, plan }. */
    async function activate(licenseKey, { source = "modal" } = {}) {
        if (activating.value) return { ok: false, message: "Already activating…" };
        activating.value = true;
        try {
            const res = await $fetch("/api/pro/activate", {
                method: "POST",
                body: { licenseKey: licenseKey.trim() },
            });
            isPro.value = true;
            checked.value = true;
            applyEntitlement(res);
            trackEvent(ANALYTICS_EVENTS.ACTIVATION_SUCCESS, {
                source,
                plan: res?.plan || "unknown",
            });
            maybeTrackRenewalDue();
            return { ok: true, message: "Pro activated. Enjoy the power features!", plan: res?.plan || null };
        } catch (e) {
            const message = e?.data?.message || "Couldn't activate that key. Check it and try again.";
            trackEvent(ANALYTICS_EVENTS.ACTIVATION_FAILED, {
                source,
                status: e?.statusCode || e?.status || 0,
                reason: message,
            });
            return { ok: false, message };
        } finally {
            activating.value = false;
        }
    }

    async function deactivate(reason = "manual") {
        try {
            await $fetch("/api/pro/logout", { method: "POST" });
        } catch {}
        isPro.value = false;
        checked.value = true;
        applyEntitlement(null);
        trackEvent(ANALYTICS_EVENTS.PRO_DEACTIVATED, { reason });
    }

    return {
        isPro,
        activating,
        checked,
        plan,
        renewalAt,
        endsAt,
        email,
        checkStatus,
        activate,
        deactivate,
    };
}
