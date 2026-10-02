<template>
    <!-- Non-blocking cookie preferences banner. Shown on first visit (no stored
         choice) and re-openable from /privacy#cookie-preferences. Google Consent
         Mode v2 defaults everything to "denied" in nuxt.config.ts, so GA4 and
         AdSense stay inert until Accept is pressed. -->
    <div
        v-if="visible"
        role="region"
        aria-label="Cookie preferences"
        class="fixed inset-x-4 bottom-4 z-50 rounded-xl border border-line bg-surface p-5 shadow-card sm:right-6 sm:left-auto sm:mx-0 sm:w-[min(32rem,calc(100vw-3rem))]"
    >
        <p class="text-[15px] font-semibold text-ink">Cookies on this site</p>

        <p class="mt-2 text-[14px] leading-relaxed text-muted">
            We use Google Analytics to understand how the site is used, and Google AdSense
            advertising cookies to display ads. Nothing is stored until you choose.
            Declining keeps only essential storage and blocks both.
            <NuxtLink to="/privacy" class="text-link">Privacy Policy</NuxtLink>
        </p>

        <p v-if="current" class="mt-3 text-[13px] text-muted">
            Current choice:
            <span class="font-medium text-ink">{{ current }}</span>
        </p>

        <div class="mt-4 flex flex-wrap items-center gap-3">
            <button type="button" class="btn-primary" @click="grant">Accept all</button>
            <button type="button" class="btn-ghost" @click="deny">Decline</button>
            <button v-if="mode === 'first'" type="button" class="nav-link" @click="dismiss">
                Decide later
            </button>
        </div>
    </div>
</template>

<script setup>
const KEY = "tsn-consent";
const GRANTED = { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted", analytics_storage: "granted" };
const DENIED = { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" };

const visible = ref(false);
const mode = ref("first");
const current = ref("");

const read = () => {
    try {
        return localStorage.getItem(KEY) || "";
    } catch {
        return "";
    }
};

const write = (value) => {
    try {
        localStorage.setItem(KEY, value);
    } catch {
        // storage unavailable (private mode) — consent still applies to this session
    }
};

// Apply a choice: persist it, tell Google Consent Mode, then unhide the banner
// if the visitor opened it from the Privacy Policy.
const apply = (choice) => {
    write(choice);
    try {
        window.gtag?.("consent", "update", choice === "granted" ? GRANTED : DENIED);
    } catch {
        // gtag not present (tag blocked) — nothing to update
    }
    visible.value = false;
};

const grant = () => apply("granted");
const deny = () => apply("denied");

// First-visit dismissal: hides for this page only, so the choice is still
// offered on the next full page load.
const dismiss = () => {
    visible.value = false;
};

const open = (openMode) => {
    mode.value = openMode;
    current.value = read() === "granted" ? "Accepted" : read() === "denied" ? "Declined" : "Not set";
    visible.value = true;
};

onMounted(() => {
    const stored = read();

    if (!stored) {
        visible.value = true;
        mode.value = "first";
        current.value = "";
    }

    // Re-open from /privacy#cookie-preferences, or from any code calling
    // window.tsnOpenConsent() — withdrawing consent must be as easy as giving it.
    const fromHash = () => {
        if (location.hash === "#cookie-preferences") open("manage");
    };
    window.addEventListener("hashchange", fromHash);
    fromHash();

    window.addEventListener("tsn:consent", () => open("manage"));
    window.tsnOpenConsent = () => open("manage");
});
</script>
