<template>
    <div>
        <div class="flex flex-wrap items-center justify-between gap-2">
            <p class="text-[17px] font-semibold tracking-[-0.01em]">Here's your text</p>
            <span v-if="copied" class="inline-flex items-center gap-1.5 rounded-full bg-ok-soft px-3 py-1 text-[13px] font-semibold text-ok">
                <TsnIcon name="check" class="h-[18px] w-[18px]" stroke="2.4" />Copied to clipboard
            </span>
        </div>
        <label for="recv-text" class="sr-only">Received text</label>
        <textarea
            id="recv-text"
            ref="textEl"
            readonly
            rows="4"
            class="mt-3 block w-full resize-y rounded-md border border-line bg-bg px-3 py-2.5 text-[15px] leading-relaxed focus:border-muted focus:outline-none"
            :value="text"
        />
        <button type="button" class="btn-primary mt-3 w-full" :disabled="flash" @click="copyAgain">
            <TsnIcon :name="flash ? 'check' : 'copy'" class="h-[18px] w-[18px]" />{{ flash ? "Copied" : "Copy text" }}
        </button>

        <!-- Download the received text in the format you need -->
        <div class="mt-3 overflow-hidden rounded-lg border border-line">
            <p class="border-b border-line px-3 py-2 text-[13px] font-medium text-muted">Download as</p>
            <div class="flex divide-x divide-line">
                <button
                    v-for="f in DOWNLOADS"
                    :key="f.format"
                    type="button"
                    class="flex flex-1 items-center justify-center gap-1.5 px-2 py-2.5 text-[13px] font-medium text-ink transition-colors hover:bg-surface-2"
                    :aria-label="`Download as ${f.label}`"
                    @click="download(f.format)"
                >
                    <TsnIcon name="download" class="h-3.5 w-3.5 shrink-0 text-muted" stroke="1.9" />{{ f.label }}
                </button>
            </div>
        </div>

        <!-- Links in the text open in one tap -->
        <div v-if="links.length" class="mt-2 grid gap-2" :class="links.length > 1 ? 'sm:grid-cols-2' : ''">
            <a
                v-for="l in links"
                :key="l.href"
                :href="l.href"
                target="_blank"
                rel="noopener noreferrer nofollow"
                class="btn-ghost w-full min-w-0"
            >
                <TsnIcon name="external" class="h-4 w-4 shrink-0" /><span class="truncate">{{ links.length > 1 ? l.host : "Open link" }}</span>
            </a>
        </div>
    </div>
</template>

<script setup>
import { downloadText } from "~/utils/textDownloads.js";

const props = defineProps({
    text: { type: String, required: true },
    code: { type: String, default: "" }, // used for the download file name
});

const DOWNLOADS = [
    { format: "txt", label: ".txt" },
    { format: "pdf", label: ".pdf" },
    { format: "json", label: ".json" },
    { format: "md", label: ".md" },
];

const textEl = ref(null);
const copied = ref(false);
const flash = ref(false);

function download(format) {
    downloadText(props.text, format, { code: props.code });
}

// Every http(s) link in the text, up to 3
const links = computed(() => {
    const found = props.text.match(/https?:\/\/[^\s<>"']+/g) || [];
    const seen = new Set();
    return found
        .map((u) => u.replace(/[).,;:!?]+$/, ""))
        .filter((u) => !seen.has(u) && seen.add(u))
        .slice(0, 3)
        .map((href) => {
            try { return { href, host: new URL(href).host.replace(/^www\./, "") }; } catch { return null; }
        })
        .filter(Boolean);
});

// Copy straight away on open (works when the browser still counts the tap that opened it)
onMounted(async () => {
    copied.value = await copyText(props.text);
});

async function copyAgain() {
    if (await copyText(props.text)) {
        copied.value = true;
        flash.value = true;
        setTimeout(() => (flash.value = false), 1600);
    } else {
        textEl.value?.select();
    }
}
</script>
