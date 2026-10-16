<template>
    <Teleport to="body">
        <Transition name="pro">
            <div
                v-if="isOpen"
                class="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center"
                role="dialog"
                aria-modal="true"
                aria-labelledby="pro-modal-title"
                @mousedown.self="close"
                @keydown.esc="close"
            >
                <div class="absolute inset-0 bg-ink/40 backdrop-blur-[2px]" aria-hidden="true" />
                <div ref="panel" class="pro-panel relative w-full max-w-md rounded-xl border border-line bg-surface p-6 shadow-card">
                    <button type="button" class="btn-icon absolute top-3 right-3" aria-label="Close" @click="close">
                        <TsnIcon name="x" class="h-4 w-4" stroke="2.2" />
                    </button>

                    <span class="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-2.5 py-1 text-[12px] font-semibold text-ink">
                        <TsnIcon name="lock" class="h-3 w-3" stroke="2.2" />
                        Premium feature
                    </span>

                    <h2 id="pro-modal-title" class="mt-3 text-[22px] font-bold tracking-[-0.02em] text-ink">{{ copy.title }}</h2>
                    <p class="mt-1.5 text-[14px] leading-relaxed text-muted">{{ copy.line }}</p>

                    <ul class="mt-4 grid gap-2.5">
                        <li v-for="f in FEATURES" :key="f" class="flex items-start gap-2.5 text-[14px] text-ink">
                            <span class="mt-0.5 grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full bg-brand-soft text-ink">
                                <TsnIcon name="check" class="h-3 w-3" stroke="3" />
                            </span>
                            {{ f }}
                        </li>
                    </ul>

                    <div class="mt-5 flex items-baseline justify-between gap-3 rounded-lg border border-line bg-bg px-4 py-3">
                        <span class="text-[15px] font-semibold text-ink">TextShareNow Pro</span>
                        <span class="text-[15px] font-bold text-ink">$5<span class="text-[13px] font-medium text-muted">/month</span></span>
                    </div>

                    <!-- Already activated on this device -->
                    <div v-if="isPro" class="mt-4 rounded-lg border border-line bg-surface-2 p-4 text-center">
                        <p class="text-[14px] font-semibold text-ink">Pro is active on this device 🎉</p>
                        <p class="mt-1 text-[13px] text-muted">All power features are unlocked.</p>
                        <button
                            type="button"
                            class="mt-3 rounded-md border border-line bg-bg px-3 py-1.5 text-[13px] font-medium text-muted transition-colors hover:text-ink"
                            @click="deactivate"
                        >
                            Deactivate Pro
                        </button>
                    </div>

                    <!-- Not activated: buy or redeem a key -->
                    <template v-else>
                        <a
                            :href="PRO_URL"
                            target="_blank"
                            rel="noopener noopener"
                            class="btn-primary mt-4 flex w-full items-center justify-center"
                        >
                            Get Pro — $5/month
                        </a>

                        <button
                            type="button"
                            class="mt-3 w-full text-[13px] font-medium text-brand transition-colors hover:underline"
                            @click="showKey = !showKey"
                        >
                            {{ showKey ? "Hide license key entry" : "I already have a license key" }}
                        </button>

                        <div v-if="showKey" class="mt-2 flex gap-2">
                            <input
                                v-model="licenseKey"
                                type="text"
                                placeholder="XXXX-XXXX-XXXX-XXXX"
                                aria-label="License key"
                                class="min-w-0 flex-1 rounded-md border border-line bg-bg px-3 py-2 font-mono text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand"
                                autocomplete="off"
                                spellcheck="false"
                                @keyup.enter="onActivate"
                            />
                            <button
                                type="button"
                                class="btn-primary !px-4"
                                :disabled="activating || !licenseKey.trim()"
                                @click="onActivate"
                            >
                                {{ activating ? "…" : "Activate" }}
                            </button>
                        </div>

                        <p
                            v-if="feedback"
                            class="mt-2 text-center text-[13px]"
                            :class="feedbackOk ? 'text-ok' : 'text-bad'"
                            role="status"
                        >{{ feedback }}</p>

                        <button type="button" class="mt-2 w-full rounded-md py-2 text-[14px] font-medium text-muted transition-colors hover:text-ink" @click="close">
                            Maybe later
                        </button>
                    </template>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
const { isOpen, copy, close } = useProModal();
const { isPro, activating, activate, deactivate } = usePremium();

const FEATURES = [
    "Up to 100,000 characters per share",
    "Files up to 100 MB — any type",
    "Custom expiry: 1 day, 7 days, 30 days or never",
    "Read limits: 5, 10 or unlimited reads",
    "Password-protect any share",
    "Custom code & link — coming soon",
];

const PRO_URL = useRuntimeConfig().public.PRO_URL;

const showKey = ref(false);
const licenseKey = ref("");
const feedback = ref("");
const feedbackOk = ref(false);

async function onActivate() {
    const key = licenseKey.value.trim();
    if (!key || activating.value) return;
    feedback.value = "";
    const res = await activate(key);
    feedbackOk.value = res.ok;
    feedback.value = res.message;
    if (res.ok) {
        licenseKey.value = "";
        setTimeout(() => {
            feedback.value = "";
            close();
        }, 1200);
    }
}

async function onDeactivate() {
    await deactivate();
    feedback.value = "";
}

const panel = ref(null);
let lastFocus = null;

function onKey(e) {
    if (e.key === "Escape") close();
}

watch(isOpen, (open) => {
    if (open) {
        lastFocus = document.activeElement;
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", onKey);
        feedback.value = "";
        nextTick(() => panel.value?.querySelector("button")?.focus());
    } else {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", onKey);
        lastFocus?.focus?.();
    }
});

onBeforeUnmount(() => {
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKey);
});
</script>

<style scoped>
.pro-enter-active, .pro-leave-active { transition: opacity 0.18s ease; }
.pro-enter-active .pro-panel, .pro-leave-active .pro-panel { transition: transform 0.18s ease; }
.pro-enter-from, .pro-leave-to { opacity: 0; }
.pro-enter-from .pro-panel, .pro-leave-to .pro-panel { transform: translateY(10px) scale(0.98); }
</style>
