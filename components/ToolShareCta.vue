<template>
    <div class="tile px-6 py-8 sm:px-10">
        <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
                <p class="text-[13px] font-medium text-muted">Cross-device loop</p>
                <h2 class="mt-2 text-[22px] font-semibold tracking-[-0.03em]">Send this to another device</h2>
                <p class="mt-2 max-w-[54ch] text-[15px] leading-relaxed text-muted">
                    Open {{ label }} on your phone or laptop. The share tool opens with this page's link already filled in —
                    generate a code and pick it up on the other screen.
                </p>
            </div>
            <div class="flex shrink-0 flex-wrap items-center gap-2">
                <NuxtLink :to="sharePath" class="btn-primary" @click="onShare">
                    <TsnIcon name="swap" class="h-[18px] w-[18px]" stroke="1.9" />Send this to another device
                </NuxtLink>
                <button type="button" class="btn-ghost" @click="copy">
                    <TsnIcon :name="copied ? 'check' : 'link'" class="h-[18px] w-[18px]" />{{ copied ? "Copied" : "Copy link" }}
                </button>
            </div>
        </div>
        <p v-if="copied" class="mt-3 text-[13px] text-muted" role="status">
            Link copied — paste it anywhere, or open the share tool on your other device.
        </p>
    </div>
</template>

<script setup>
import { trackToolToShare } from "~/composables/useAnalytics.js";

const props = defineProps({
    tool: { type: String, required: true },
    path: { type: String, required: true },
    label: { type: String, default: "this tool" },
});

// Canonical origin on purpose: the prefilled link must work on the other
// device, not point at a dev server or a preview host.
const url = computed(() => `https://www.textsharenow.com${props.path}`);
const sharePath = computed(() => `/?text=${encodeURIComponent(url.value)}#tool`);
const copied = ref(false);
let timer;

onBeforeUnmount(() => clearTimeout(timer));

function onShare() {
    trackToolToShare(props.tool);
}

async function copy() {
    trackToolToShare(props.tool);
    try {
        await navigator.clipboard.writeText(url.value);
        copied.value = true;
        clearTimeout(timer);
        timer = setTimeout(() => (copied.value = false), 2000);
    } catch {
        copied.value = false;
    }
}
</script>
