<template>
    <div>
        <div
            v-if="!code"
            class="rounded-lg border border-line bg-bg"
        >
            <label for="send-textarea" class="sr-only">Text, link or note to share</label>
            <textarea
                id="send-textarea"
                ref="area"
                v-model="text"
                maxlength="10000"
                rows="8"
                placeholder="Paste a link, a note, an address… anything up to 10,000 characters."
                class="block w-full resize-none rounded-t-lg bg-transparent px-5 pb-2 pt-5 text-[17px] leading-relaxed placeholder:text-muted/70 !outline-none focus:!outline-none focus-visible:!outline-none"
                @keydown.enter.meta.prevent="send"
                @keydown.enter.ctrl.prevent="send"
            />
            <p v-if="error" class="mx-5 mb-2 flex items-center gap-2 text-[14px] text-bad" role="alert">
                <TsnIcon name="alert" class="h-4 w-4 shrink-0" />{{ error }}
            </p>
            <div class="flex flex-wrap items-center justify-between gap-3 px-3 pb-3 pl-5">
                <div class="flex items-center gap-3 text-[13px]">
                    <span
                        class="tabular-nums"
                        :class="text.length >= 10000 ? 'font-semibold text-bad' : text.length >= 9000 ? 'font-semibold text-ink' : 'text-muted'"
                        aria-live="polite"
                    >{{ text.length.toLocaleString("en-US") }} / 10,000</span>
                    <button
                        v-if="canPaste && !text.length"
                        type="button"
                        class="inline-flex items-center gap-1.5 rounded-md border border-line px-2 py-1 font-medium text-ink hover:bg-surface-2"
                        @click="pasteIn"
                    >
                        <TsnIcon name="clipboard" class="h-3.5 w-3.5" />Paste
                    </button>
                    <span v-if="pasteHint" class="text-muted">{{ pasteHint }}</span>
                    <button
                        v-if="text.length"
                        type="button"
                        class="rounded-md px-2 py-1 font-medium text-muted hover:bg-surface-2 hover:text-ink"
                        @click="text = ''"
                    >
                        Clear
                    </button>
                </div>
                <div class="flex items-center gap-3">
                    <kbd class="hidden rounded-md border border-line px-1.5 py-0.5 font-sans text-[12px] text-muted sm:inline">{{ shortcut }}</kbd>
                    <button type="button" class="btn-primary" :disabled="!text.trim() || loading" @click="send">
                        {{ loading ? "Generating…" : "Generate code" }}
                    </button>
                </div>
            </div>
        </div>

        <CodeResult v-else :code="code" :ttl="600" :qr-url="qrUrl" @reset="reset" />
    </div>
</template>

<script setup>
const API_BASE = useRuntimeConfig().public.API_BASE;
const text = ref("");
const code = ref("");
const qrUrl = ref("");
const loading = ref(false);
const error = ref("");
const shortcut = ref("Ctrl Enter");
const area = ref(null);
const canPaste = ref(false);
const pasteHint = ref("");

onMounted(() => {
    const mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    if (mac) shortcut.value = "⌘ Enter";
    canPaste.value = !!navigator.clipboard?.readText;
});

// One-tap paste from the clipboard (the browser may ask for permission first)
async function pasteIn() {
    pasteHint.value = "";
    try {
        const clip = await navigator.clipboard.readText();
        if (clip) text.value = clip.slice(0, 10000);
        else pasteHint.value = "Your clipboard is empty.";
    } catch {
        // Permission refused or not supported: fall back to the keyboard
        pasteHint.value = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? "Press ⌘ V to paste." : "Press Ctrl V to paste.";
    }
    area.value?.focus();
}

async function send() {
    if (!text.value.trim() || loading.value) return;
    loading.value = true;
    error.value = "";
    try {
        const res = await $fetch(`${API_BASE}/api/share`, { method: "POST", body: { text: text.value } });
        code.value = res.code;
        qrUrl.value = `${window.location.origin}/r?code=${res.code}`;
        text.value = "";
    } catch (e) {
        error.value = e?.data?.message || "Couldn't create a code. Check your connection and try again.";
    } finally {
        loading.value = false;
    }
}

function reset() {
    code.value = "";
    qrUrl.value = "";
    error.value = "";
}
</script>
