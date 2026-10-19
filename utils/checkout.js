// Pro checkout links.
//
// Every Pro CTA goes through /go/pro, which counts the click and redirects
// straight to Gumroad's payment form (`?wanted=true`) — buyers never see the
// Gumroad product page. Adding a plan later means adding one entry here (and
// enabling its recurrence on the Gumroad product first).
//
// Gumroad reference:
//   ?wanted=true     open the checkout form directly
//   &yearly=true     annual recurrence (must exist on the product)
//   &tier=<name>     membership tier (must exist on the product)

export const PRO_PLANS = {
    monthly: { label: "Monthly", enabled: true, recurrence: "monthly", price: "$5/month" },
    // Flip `enabled` only after the yearly recurrence is live on Gumroad.
    annual: { label: "Annual", enabled: false, recurrence: "yearly", price: "$50/year" },
};

// Where a CTA lives. Kept small and whitelisted so counts stay comparable.
export const PRO_LOCATIONS = ["hero", "plan_card", "how_to", "bottom", "pro_modal", "footer"];

export function normalizeProPlan(plan) {
    const key = typeof plan === "string" ? plan.trim().toLowerCase() : "";
    if (PRO_PLANS[key]?.enabled) return key;
    return "monthly";
}

export function normalizeProLocation(location) {
    const key = typeof location === "string" ? location.trim().toLowerCase() : "";
    if (PRO_LOCATIONS.includes(key)) return key;
    // The modal passes its reason (e.g. "pro_modal_password") — group those.
    if (key.startsWith("pro_modal") || key.startsWith("modal")) return "pro_modal";
    return "other";
}

export function proCheckoutUrl({ base, plan = "monthly", location = "pricing" } = {}) {
    const url = new URL(base || "https://textsharenow.gumroad.com/l/pro");
    const planKey = normalizeProPlan(plan);

    url.searchParams.set("wanted", "true");
    if (PRO_PLANS[planKey].recurrence !== "monthly") {
        url.searchParams.set(PRO_PLANS[planKey].recurrence, "true");
    }
    url.searchParams.set("utm_source", "textsharenow");
    url.searchParams.set("utm_medium", "pricing");
    url.searchParams.set("utm_campaign", "pro");
    url.searchParams.set("utm_content", normalizeProLocation(location));

    return url.toString();
}

// First-party link the UI uses. The server route turns it into the Gumroad URL.
export function proCheckoutPath({ plan = "monthly", location = "pricing" } = {}) {
    const params = new URLSearchParams({
        plan: normalizeProPlan(plan),
        loc: normalizeProLocation(location),
    });
    return `/go/pro?${params.toString()}`;
}
