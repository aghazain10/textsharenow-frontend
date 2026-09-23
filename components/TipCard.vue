<template>
    <!-- Thanked -->
    <p
        v-if="state === 'thanked'"
        class="mt-3 flex items-center justify-center gap-1.5 rounded-lg border border-line px-4 py-3 text-[14px] font-medium"
    >
        <TsnIcon name="heart" class="h-[18px] w-[18px]" />
        Thank you. Your tip keeps TextShareNow free for everyone.
    </p>

    <!-- Dismissed just now -->
    <p v-else-if="state === 'later'" class="mt-3 text-center text-[13px] text-muted">
        No problem. You can tip anytime from
        <a class="text-link" :href="tipUrl" target="_blank" rel="noopener noreferrer">Support this project</a>.
    </p>

    <!-- Small nudge (already tipped recently, or said "maybe later" this visit) -->
    <p v-else-if="state === 'compact'" class="tip-in mt-3 flex items-center justify-center gap-1.5 text-[13px] text-muted">
        <TsnIcon name="heart" class="h-[18px] w-[18px]" />
        <span>Enjoying TextShareNow?
            <a class="text-link" :href="tipUrl" target="_blank" rel="noopener noreferrer" @click="markTipped">Leave a tip</a></span>
    </p>

    <!-- Full card -->
    <div v-else class="tip-in mt-3 flex gap-5 rounded-lg border border-line bg-surface-2/50 p-5">
        <div class="min-w-0 flex-1">
        <div class="flex items-start gap-3">
            <span class="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-brand text-on-brand">
                <TsnIcon name="heart" class="h-[18px] w-[18px]" />
            </span>
            <div class="min-w-0">
                <p class="text-[15px] font-semibold tracking-[-0.01em]">{{ copy[0] }}</p>
                <p class="mt-0.5 text-[14px] text-muted">{{ copy[1] }}</p>
            </div>
        </div>
        <div class="mt-4 flex flex-wrap items-center gap-2">
            <div class="flex gap-1.5" role="group" aria-label="Tip amount">
                <button
                    v-for="a in AMOUNTS"
                    :key="a"
                    type="button"
                    class="h-10 min-w-14 rounded-md border px-3 text-[14px] font-semibold tabular-nums transition-colors"
                    :class="a === amount ? 'border-brand bg-brand text-on-brand' : 'border-line bg-bg hover:bg-surface-2'"
                    :aria-pressed="a === amount"
                    @click="amount = a"
                >
                    {{ CURRENCY }}{{ a }}
                </button>
            </div>
            <a class="btn-primary" :href="tipUrl" target="_blank" rel="noopener noreferrer" @click="markTipped">
                <TsnIcon name="heart" class="h-[18px] w-[18px]" />Tip {{ CURRENCY }}{{ amount }}
            </a>
            <button
                type="button"
                class="h-10 rounded-md px-3 text-[14px] font-medium text-muted hover:bg-surface-2 hover:text-ink"
                @click="later"
            >
                Maybe later
            </button>
        </div>
        <p class="mt-3 text-[12px] text-muted">Optional. TextShareNow stays free either way. Pay securely with card or PayPal.</p>
        </div>
        <figure class="hidden shrink-0 flex-col items-center gap-1.5 md:flex">
            <div class="w-24 overflow-hidden rounded-md border border-line bg-white p-1 [&_canvas]:!h-auto [&_canvas]:!w-full">
                <QrCode :text="tipUrl" :size="92" />
            </div>
            <figcaption class="text-[11px] text-muted">Scan to tip</figcaption>
        </figure>
    </div>
</template>

<script setup>
/*
 * Tip nudge shown after a share or receive works. Never blocks anything.
 * The PayPal link doesn't take an amount, so the buttons set the label and
 * people confirm the amount on the PayPal page.
 */
const props = defineProps({
    where: { type: String, default: "share" }, // "share" | "receive"
});

const tipUrl = TIP_URL;
const CURRENCY = "$";
const AMOUNTS = [2, 5, 10];
const amount = ref(5);
const state = ref("full");

const copy = computed(() =>
    props.where === "receive"
        ? ["Got it in seconds?", "If TextShareNow helped you, a small tip keeps it free for everyone."]
        : ["Did this save you a few minutes?", "TextShareNow is free, with no accounts and no paid plan. A small tip keeps the servers running."],
);

const safe = (fn) => { try { return fn(); } catch { return null; } };

onMounted(() => {
    const tipped = Number(safe(() => localStorage.getItem("tsn-tipped"))) || 0;
    const recently = Date.now() - tipped < 30 * 864e5;
    if (recently || safe(() => sessionStorage.getItem("tsn-tip-later"))) state.value = "compact";
});

function markTipped() {
    safe(() => localStorage.setItem("tsn-tipped", String(Date.now())));
    state.value = "thanked";
}

function later() {
    safe(() => sessionStorage.setItem("tsn-tip-later", "1"));
    state.value = "later";
}
</script>
