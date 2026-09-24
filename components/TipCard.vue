<template>
    <!-- Thanked -->
    <p
        v-if="state === 'thanked'"
        class="mt-3 flex items-center justify-center gap-1.5 rounded-lg border border-line px-4 py-3 text-[14px] font-medium"
    >
        <TsnIcon name="heart" class="h-[18px] w-[18px] text-[var(--heart)]" />
        Thank you. Your tip keeps TextShareNow free for everyone.
    </p>

    <!-- Dismissed just now -->
    <p v-else-if="state === 'later'" class="mt-3 text-center text-[13px] text-muted">
        No problem. You can tip anytime from
        <a class="text-link" :href="tipUrl" target="_blank" rel="noopener noreferrer" @click="tip('click')">Support this project</a>.
    </p>

    <!-- Full card: compact — one heart, two short lines, one button -->
    <div
        v-else
        ref="card"
        class="tip-in mt-3 flex flex-col gap-3 rounded-lg border border-line bg-surface-2/50 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-5"
    >
        <div class="min-w-0">
            <p class="flex items-center gap-1.5 text-[15px] font-semibold tracking-[-0.01em]">
                <TsnIcon name="heart" class="tip-heart h-4 w-4 shrink-0" />{{ copy[0] }}
            </p>
            <p class="mt-0.5 text-[13px] leading-snug text-muted">{{ copy[1] }}</p>
        </div>
        <div class="flex shrink-0 items-center gap-1">
            <a class="btn-primary !h-9 flex-1 sm:flex-none" :href="tipUrl" target="_blank" rel="noopener noreferrer" @click="tip('click')">
                <TsnIcon name="heart" class="tip-heart h-4 w-4" />Leave a tip
            </a>
            <button
                type="button"
                class="h-9 rounded-md px-3 text-[13px] font-medium text-muted hover:bg-surface-2 hover:text-ink"
                @click="later"
            >
                Maybe later
            </button>
        </div>
    </div>
</template>

<script setup>
/*
 * Tip nudge shown after a share or receive works. Never blocks anything.
 * The PayPal link lets people type any amount, so there's one button, no preset amounts.
 * Shown / click / "maybe later" are counted (anonymously) in Upstash via trackTip().
 */
const props = defineProps({
    where: { type: String, default: "share" }, // "share" | "receive"
});

const tipUrl = TIP_URL;
const API_BASE = useRuntimeConfig().public.API_BASE;
const state = ref("full");

const copy = computed(() =>
    props.where === "receive"
        ? ["Got it in seconds?", "A small tip, any amount, keeps TextShareNow free. Card or PayPal."]
        : ["Saved you a few minutes?", "A small tip, any amount, keeps TextShareNow free. Card or PayPal."],
);

const card = ref(null);
let observer;

// Scroll so the whole tool box sits right under the header: result + tip card in view together
function bringIntoView() {
    const el = card.value;
    if (!el) return;
    const box = el.closest("#tool, .tool-glow") || el;
    const header = (document.querySelector("header")?.offsetHeight || 56) + 8;
    const delta = box.getBoundingClientRect().top - header;
    if (Math.abs(delta) < 4) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollBy({ top: delta, behavior: reduce ? "auto" : "smooth" });
}

onMounted(() => {
    // Wait a frame so the result above has its final size
    requestAnimationFrame(() => requestAnimationFrame(bringIntoView));

    // Count "shown" only once the card is really on screen
    if ("IntersectionObserver" in window && card.value) {
        observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    trackTip("shown", props.where, API_BASE);
                    observer.disconnect();
                }
            },
            { threshold: 0.6 },
        );
        observer.observe(card.value);
    } else {
        trackTip("shown", props.where, API_BASE);
    }
});
onBeforeUnmount(() => observer?.disconnect());

function tip(event) {
    trackTip(event, props.where, API_BASE);
    state.value = "thanked";
}

function later() {
    trackTip("later", props.where, API_BASE);
    state.value = "later";
}
</script>
