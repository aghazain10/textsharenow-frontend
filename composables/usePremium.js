// Pro entitlement state + actions.
//  - `isPro` drives the whole UI (locks, limits, expiry, reads, password)
//  - hydrated once per load from GET /api/pro/status (the signed cookie
//    decides — the client never claims pro on its own)
//  - `activate(key)` posts a Gumroad license key to /api/pro/activate
//  - `deactivate()` clears the session cookie
// In dev, `isPro` can still be toggled directly by the "Try Pro" preview pill.
export function usePremium() {
    const isPro = useState("premium-preview", () => false);
    const activating = useState("premium-activating", () => false);
    const checked = useState("premium-checked", () => false);

    async function checkStatus(force = false) {
        if (checked.value && !force) return;
        try {
            const res = await $fetch("/api/pro/status");
            isPro.value = !!res.pro;
        } catch {
            isPro.value = false;
        }
        checked.value = true;
    }

    /** Activate with a Gumroad license key. Returns { ok, message }. */
    async function activate(licenseKey) {
        if (activating.value) return { ok: false, message: "Already activating…" };
        activating.value = true;
        try {
            await $fetch("/api/pro/activate", {
                method: "POST",
                body: { licenseKey: licenseKey.trim() },
            });
            isPro.value = true;
            checked.value = true;
            return { ok: true, message: "Pro activated. Enjoy the power features!" };
        } catch (e) {
            return {
                ok: false,
                message: e?.data?.message || "Couldn't activate that key. Check it and try again.",
            };
        } finally {
            activating.value = false;
        }
    }

    async function deactivate() {
        try {
            await $fetch("/api/pro/logout", { method: "POST" });
        } catch {}
        isPro.value = false;
        checked.value = true;
    }

    return { isPro, activating, checked, checkStatus, activate, deactivate };
}
