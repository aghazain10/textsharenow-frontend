// Global "Go Pro" modal state — open from any component when a free user
// hits a limit (chars, file size) or clicks a locked premium feature
// (reads, password, expiry). `reason` lets the modal tailor its copy.
const COPY = {
    chars: {
        title: "You hit the free limit",
        line: "Free shares hold up to 10,000 characters. Pro raises that to 100,000.",
    },
    file: {
        title: "This file needs Pro",
        line: "Free uploads are up to 10 MB — PNG, JPEG, WebP, MP4 or WebM. Pro takes any file up to 100 MB.",
    },
    reads: {
        title: "Multiple reads are a Pro feature",
        line: "Let a share be read 5, 10 or unlimited times before it deletes itself.",
    },
    password: {
        title: "Password protection is Pro",
        line: "Viewers must enter the password before the text is revealed.",
    },
    expiry: {
        title: "Longer expiry is Pro",
        line: "Free shares delete after up to 1 hour. Pro keeps them up to 30 days — or forever.",
    },
    code: {
        title: "Custom codes are Pro",
        line: "Claim a memorable code like coffee-menu or invoice-2026 instead of 5 random characters.",
    },
    notify: {
        title: "Get emailed when it's read",
        line: "Pro sends you a one-tap email the moment someone opens your link — so you always know it landed.",
    },
    email: {
        title: "Email the link to them",
        line: "Send the link straight to their inbox — no copy-paste, no typing codes over the phone.",
    },
    general: {
        title: "Unlock TextShareNow Pro",
        line: "Everything in free, plus the power features:",
    },
};

import { trackEvent, ANALYTICS_EVENTS } from "./useAnalytics.js";

export function useProModal() {
    const isOpen = useState("pro-modal-open", () => false);
    const reason = useState("pro-modal-reason", () => "general");
    const placement = useState("pro-modal-placement", () => "composer");
    const copy = computed(() => COPY[reason.value] || COPY.general);

    /**
     * Open the paywall.
     * @param {string} r        why it opened (chars, file, reads, password…)
     * @param {string} source   where it opened from (send_text, pricing_plan_card…)
     */
    const open = (r = "general", source = "composer") => {
        reason.value = r;
        placement.value = source;
        isOpen.value = true;
        // `paywall_view` is the funnel event; keep `share_to_pro` for the
        // existing GA4 explorations that already depend on it.
        trackEvent(ANALYTICS_EVENTS.PAYWALL_VIEW, { reason: r, placement: source });
        trackEvent(ANALYTICS_EVENTS.SHARE_TO_PRO, { reason: r, placement: source });
    };
    const close = () => {
        isOpen.value = false;
    };

    return { isOpen, reason, placement, copy, open, close };
}
