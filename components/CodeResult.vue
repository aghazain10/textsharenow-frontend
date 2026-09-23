<template>
    <div>
        <div class="rounded-lg border border-line p-5 sm:p-7">
            <div class="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center" :class="{ 'is-dead': expired }">
                <div class="min-w-0">
                    <p class="text-[14px] font-medium text-muted">Your code</p>
                    <div ref="flapsEl" class="mt-3 flex gap-1.5 sm:gap-2" role="img" :aria-label="`Code ${code.split('').join(' ')}`">
                        <span v-for="(c, i) in code" :key="i" class="flap flap-lg">·</span>
                    </div>
                    <div class="mt-5 flex flex-wrap gap-2">
                        <button v-if="!expired" ref="copyBtn" type="button" class="btn-primary" :disabled="copied" @click="doCopy">
                            <TsnIcon :name="copied ? 'check' : 'copy'" class="h-[18px] w-[18px]" />{{ copied ? "Copied" : "Copy code" }}
                        </button>
                        <button v-if="!expired" type="button" class="btn-ghost" @click="openBig">
                            <TsnIcon name="expand" class="h-[18px] w-[18px]" />Show big
                        </button>
                        <button type="button" class="btn-ghost" @click="$emit('reset')">Share something else</button>
                    </div>
                </div>
                <figure v-if="!expired && qrUrl" class="flex items-center gap-4 sm:flex-col sm:gap-2">
                    <div class="w-28 shrink-0 overflow-hidden rounded-lg border border-line bg-white p-1.5 sm:w-32 [&_canvas]:!h-auto [&_canvas]:!w-full">
                        <QrCode :text="qrUrl" :size="120" />
                    </div>
                    <figcaption class="text-[13px] text-muted sm:text-center">Or scan with your<br class="hidden sm:inline" /> phone camera</figcaption>
                </figure>
            </div>

            <div class="mt-6 flex items-center gap-4 border-t border-line pt-5">
                <template v-if="!expired">
                    <svg class="timer-ring h-12 w-12 shrink-0" viewBox="0 0 44 44" aria-hidden="true">
                        <circle class="track" cx="22" cy="22" r="18" />
                        <circle class="bar" cx="22" cy="22" r="18" :stroke-dasharray="CIRC" :stroke-dashoffset="CIRC * (1 - left / ttl)" />
                    </svg>
                    <div class="text-[14px]">
                        <p class="font-semibold">
                            Expires in <span class="tabular-nums">{{ clock }}</span>. Works once.
                        </p>
                        <p class="mt-0.5 text-muted">
                            On the other device, go to textsharenow.com/r and enter this code.
                        </p>
                    </div>
                </template>
                <template v-else>
                    <span class="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-surface-2 text-ink">
                        <TsnIcon name="x" class="h-4 w-4" />
                    </span>
                    <div class="text-[14px]">
                        <p class="font-semibold">This code expired</p>
                        <p class="mt-0.5 text-muted">
                            Nobody opened it in time, so it was deleted. Share again to get a new code.
                        </p>
                    </div>
                </template>
            </div>
        </div>
        <TipCard where="share" />

        <!-- Big code: full screen, easy to read from across the room -->
        <Teleport to="body">
            <div
                v-if="big"
                class="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-8 bg-bg px-4 py-[calc(2rem+env(safe-area-inset-top,0px))] text-center text-ink"
                role="dialog"
                aria-modal="true"
                aria-label="Your code, shown big"
                @keydown.esc="closeBig"
            >
                <button ref="closeBtn" type="button" class="btn-ghost absolute right-4 top-[calc(1rem+env(safe-area-inset-top,0px))]" @click="closeBig">
                    <TsnIcon name="x" class="h-4 w-4" stroke="2.2" />Close
                </button>
                <p class="text-[17px] font-medium text-muted">Enter this code on your other device</p>
                <div class="flex gap-[2vw]" role="img" :aria-label="`Code ${code.split('').join(' ')}`">
                    <span v-for="(c, i) in code" :key="i" class="flap" style="--w: min(16vw, 10rem)">{{ c }}</span>
                </div>
                <p class="text-[15px] text-muted">
                    <template v-if="!expired">Expires in <span class="tabular-nums font-semibold text-ink">{{ clock }}</span>. Works once.</template>
                    <template v-else>This code expired.</template>
                </p>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
const props = defineProps({
    code: { type: String, required: true },
    ttl: { type: Number, required: true }, // seconds
    qrUrl: { type: String, default: "" },
});
defineEmits(["reset"]);

const CIRC = 2 * Math.PI * 18;
const flapsEl = ref(null);
const copyBtn = ref(null);
const copied = ref(false);
const left = ref(props.ttl);
const expired = computed(() => left.value <= 0);
const clock = computed(() => `${Math.floor(left.value / 60)}:${String(left.value % 60).padStart(2, "0")}`);

let timer;
onMounted(async () => {
    const end = Date.now() + props.ttl * 1000;
    timer = setInterval(() => {
        left.value = Math.max(0, Math.round((end - Date.now()) / 1000));
        if (!left.value) clearInterval(timer);
    }, 1000);
    await flipTo(Array.from(flapsEl.value.children), props.code);
    copyBtn.value?.focus({ preventScroll: true });
});
onBeforeUnmount(() => clearInterval(timer));

const big = ref(false);
const closeBtn = ref(null);
let wakeLock = null;

async function openBig() {
    big.value = true;
    await nextTick();
    closeBtn.value?.focus();
    // Keep the screen on while the code is shown, where the browser allows it
    try { wakeLock = await navigator.wakeLock?.request("screen"); } catch {}
}
function closeBig() {
    big.value = false;
    wakeLock?.release?.().catch(() => {});
    wakeLock = null;
}
onBeforeUnmount(closeBig);

async function doCopy() {
    if (await copyText(props.code)) {
        copied.value = true;
        setTimeout(() => (copied.value = false), 1600);
    }
}
</script>
