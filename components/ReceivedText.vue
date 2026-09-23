<template>
    <div>
        <div class="flex flex-wrap items-center justify-between gap-3">
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
            rows="6"
            class="mt-4 block w-full resize-y rounded-md border border-line bg-bg px-3 py-2.5 text-[15px] leading-relaxed focus:border-muted focus:outline-none"
            :value="text"
        />
        <button type="button" class="btn-primary mt-4 w-full" :disabled="flash" @click="copyAgain">
            <TsnIcon :name="flash ? 'check' : 'copy'" class="h-[18px] w-[18px]" />{{ flash ? "Copied" : "Copy text" }}
        </button>
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
        <p class="mt-3 text-center text-[13px] text-muted">Copy it before you leave this page.</p>
    </div>
</template>

<script setup>
const props = defineProps({
    text: { type: String, required: true },
});

const textEl = ref(null);
const copied = ref(false);
const flash = ref(false);

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
