<template>
    <div>
        <!-- Compact on purpose: code, copy and the tip card all fit on one screen, even on phones -->
        <div class="rounded-lg border border-line p-5 sm:p-6">
            <div class="grid gap-x-6 gap-y-5 sm:grid-cols-[1fr_auto]" :class="{ 'is-dead': expired }">
                <div class="min-w-0">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <p class="text-[14px] font-medium text-muted">{{ encrypted ? "Your private link" : "Your code" }}</p>
                        <!-- Small timer chip instead of a big timer row -->
                        <span
                            class="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-0.5 text-[12px] font-medium tabular-nums"
                            :class="expired ? 'text-bad' : 'text-muted'"
                            role="timer"
                        >
                            <svg v-if="!expired && !never" class="timer-ring h-3.5 w-3.5" viewBox="0 0 44 44" aria-hidden="true">
                                <circle class="track" cx="22" cy="22" r="18" style="stroke-width: 7" />
                                <circle class="bar" cx="22" cy="22" r="18" style="stroke-width: 7" :stroke-dasharray="CIRC" :stroke-dashoffset="CIRC * (1 - left / ttl)" />
                            </svg>
                            <template v-if="never">Never expires<template v-if="passwordSet"> · password</template></template>
                            <template v-else-if="!expired">{{ clock }} · {{ readLabel }}<template v-if="passwordSet"> · password</template></template>
                            <template v-else>Expired</template>
                        </span>
                    </div>
                    <div v-if="!encrypted" ref="flapsEl" class="mt-3 flex flex-wrap gap-1.5 sm:gap-2" role="img" :aria-label="`Code ${code.split('').join(' ')}`">
                        <span v-for="(c, i) in code" :key="i" class="flap flap-lg">·</span>
                    </div>
                    <!-- Share link: same destination as the QR code, copyable in one tap -->
                    <button
                        v-if="!expired && qrUrl"
                        type="button"
                        class="mt-4 flex w-full items-center gap-2.5 rounded-lg border border-line bg-bg px-3 py-2.5 text-left transition-colors hover:bg-surface-2"
                        aria-label="Copy share link"
                        @click="copyLink"
                    >
                        <TsnIcon name="link" class="h-4 w-4 shrink-0 text-muted" stroke="1.8" />
                        <span class="min-w-0 flex-1 truncate font-mono text-[14px] text-ink">{{ shortLink }}</span>
                        <span class="shrink-0 text-[13px] font-medium" :class="linkCopied ? 'text-ok' : 'text-muted'">
                            {{ linkCopied ? "Copied" : "Copy link" }}
                        </span>
                    </button>
                    <p v-if="!expired" class="mt-3 text-[13px] text-muted">
                        <template v-if="encrypted">Send this whole link to the recipient. The 5-character code won't work for this share — opening the link is the only way in.</template>
                        <template v-else>On the other device, go to textsharenow.com/r and enter this code — or just open the link.</template>
                    </p>
                    <p v-else class="mt-3 text-[13px] text-muted">Nobody opened it in time, so it was deleted. Share again to get a new {{ encrypted ? "link" : "code" }}.</p>
                    <div v-if="!expired" class="mt-4 flex flex-wrap gap-2">
                        <button
                            v-if="encrypted"
                            ref="copyBtn"
                            type="button"
                            class="btn-primary"
                            :disabled="linkCopied"
                            @click="copyLink"
                        >
                            <TsnIcon :name="linkCopied ? 'check' : 'link'" class="h-[18px] w-[18px]" />{{ linkCopied ? "Copied" : "Copy link" }}
                        </button>
                        <button
                            v-else
                            ref="copyBtn"
                            type="button"
                            class="btn-primary"
                            :disabled="copied"
                            @click="doCopy"
                        >
                            <TsnIcon :name="copied ? 'check' : 'copy'" class="h-[18px] w-[18px]" />{{ copied ? "Copied" : "Copy code" }}
                        </button>
                        <button v-if="!encrypted" type="button" class="btn-ghost" @click="openBig">
                            <TsnIcon name="expand" class="h-[18px] w-[18px]" stroke="1.9" />Show big
                        </button>
                    </div>
                    <p v-if="encrypted && !expired" class="mt-3 flex items-start gap-1.5 text-[13px] text-muted">
                        <TsnIcon name="lock" class="mt-0.5 h-3.5 w-3.5 shrink-0" stroke="1.9" />
                        <span>
                            Encrypted in your browser before sending — we can't read it. The 5-character code won't work: share the full link, including the part after the #.
                            <template v-if="kind !== 'text'"> File contents are not virus-scanned in this mode, so only open files from people you trust.</template>
                        </span>
                    </p>
                </div>

                <!-- QR: beside the code on bigger screens, last on phones -->
                <figure v-if="!expired && qrUrl" class="order-last flex items-center gap-4 sm:order-none sm:row-span-2 sm:flex-col sm:justify-start sm:gap-2">
                    <div class="w-24 shrink-0 overflow-hidden rounded-lg border border-line bg-white p-1.5 sm:w-32 [&_canvas]:!h-auto [&_canvas]:!w-full">
                        <QrCode :text="qrUrl" :size="120" />
                    </div>
                    <figcaption class="text-[13px] text-muted sm:text-center">
                        <template v-if="encrypted">Scan to open<br class="hidden sm:inline" /> the private link</template>
                        <template v-else>Or scan with your<br class="hidden sm:inline" /> phone camera</template>
                    </figcaption>
                </figure>
            </div>

            <button type="button" class="btn-ghost mt-5 w-full" @click="$emit('reset')">Share something else</button>
        </div>

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
                <div class="flex flex-wrap justify-center gap-[2vw]" role="img" :aria-label="`Code ${code.split('').join(' ')}`">
                    <span v-for="(c, i) in code" :key="i" class="flap" style="--w: min(16vw, 10rem)">{{ c }}</span>
                </div>
                <p class="text-[15px] text-muted">
                    <template v-if="!expired">
                        <template v-if="never">No expiry. </template>
                        <template v-else>Expires in <span class="tabular-nums font-semibold text-ink">{{ clock }}</span>. </template>
                        {{ bigReadLabel }}
                    </template>
                    <template v-else>This code expired.</template>
                </p>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
const props = defineProps({
    code: { type: String, required: true },
    ttl: { type: Number, required: true }, // seconds, 0 = never
    qrUrl: { type: String, default: "" },
    maxReads: { type: Number, default: 1 }, // 1, 5, 10 or 0 = unlimited
    passwordSet: { type: Boolean, default: false },
    kind: { type: String, default: "text" }, // "text" | "file" | "transfer"
    fileCount: { type: Number, default: 0 },
    encrypted: { type: Boolean, default: false }, // E2E text/file: full link required
});
defineEmits(["reset"]);

const CIRC = 2 * Math.PI * 18;
const never = computed(() => props.ttl === 0);
const flapsEl = ref(null);
const copyBtn = ref(null);
const copied = ref(false);
const linkCopied = ref(false);
const left = ref(props.ttl);
const expired = computed(() => !never.value && left.value <= 0);
const readLabel = computed(() => {
    if (props.kind === "transfer") return `${props.fileCount || 1} ${props.fileCount === 1 ? "file" : "files"}`;
    if (props.kind === "file") return "deleted after download";
    return props.maxReads === 0 ? "unlimited reads" : props.maxReads > 1 ? `${props.maxReads} reads` : "works once";
});
const bigReadLabel = computed(() => {
    if (props.kind === "transfer") return "Each file works once.";
    if (props.kind === "file") return "Deleted after download.";
    return props.maxReads === 0 ? "Unlimited reads." : props.maxReads > 1 ? `Works up to ${props.maxReads} times.` : "Works once.";
});
const clock = computed(() => {
    const h = Math.floor(left.value / 3600);
    const m = Math.floor((left.value % 3600) / 60);
    const s = left.value % 60;
    const mm = String(m).padStart(2, "0");
    const ss = String(s).padStart(2, "0");
    return h ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
});

// The share link is the same URL the QR code encodes, shown without the scheme
const shortLink = computed(() => props.qrUrl.replace(/^https?:\/\//, ""));

let timer;
onMounted(async () => {
    if (!never.value) {
        const end = Date.now() + props.ttl * 1000;
        timer = setInterval(() => {
            left.value = Math.max(0, Math.round((end - Date.now()) / 1000));
            if (!left.value) clearInterval(timer);
        }, 1000);
    }
    await flipTo(Array.from(flapsEl.value?.children || []), props.code);
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

async function copyLink() {
    if (props.qrUrl && (await copyText(props.qrUrl))) {
        linkCopied.value = true;
        setTimeout(() => (linkCopied.value = false), 1600);
    }
}
</script>
