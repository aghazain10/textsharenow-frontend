<template>
    <div>
        <form v-if="!result" class="rounded-lg border border-line px-4 py-8 text-center sm:px-8 sm:py-10" novalidate @submit.prevent="receive">
            <label for="code-input" class="text-[17px] font-semibold tracking-[-0.01em]">Enter the code from your other device</label>
            <p class="mt-1 text-[14px] text-muted">Codes are 5 characters</p>

            <div class="code-field relative mx-auto mt-6 w-fit" :class="{ error: !!error, shake }">
                <div class="flex gap-1.5 sm:gap-2.5" aria-hidden="true">
                    <span
                        v-for="i in 5"
                        :key="i"
                        ref="slots"
                        class="flap slot"
                        :class="{ empty: !value[i - 1], filled: !!value[i - 1], active: focused && i - 1 === Math.min(value.length, 4) }"
                    >{{ value[i - 1] || "·" }}</span>
                </div>
                <input
                    id="code-input"
                    ref="inputEl"
                    :value="value"
                    type="text"
                    maxlength="5"
                    inputmode="text"
                    autocomplete="one-time-code"
                    autocapitalize="characters"
                    autocorrect="off"
                    spellcheck="false"
                    class="absolute inset-0 h-full w-full cursor-text rounded-xl bg-transparent text-[16px] text-transparent caret-transparent opacity-0"
                    aria-describedby="receive-error"
                    @input="onInput"
                    @focus="focused = true"
                    @blur="focused = false"
                    @select="toEnd"
                />
            </div>

            <div v-if="error" id="receive-error" class="mx-auto mt-5 max-w-md rounded-lg border border-bad/30 bg-bad-soft px-4 py-3 text-left text-[14px]" role="alert">
                <p class="font-semibold text-bad">{{ error.title }}</p>
                <p class="mt-0.5 text-ink/75">{{ error.body }}</p>
            </div>

            <button type="submit" class="btn-primary mt-6 w-full max-w-xs" :disabled="value.length < 5 || loading">
                {{ loading ? "Opening…" : "Receive" }}
            </button>
            <p class="mt-4 text-[13px] text-muted">Text is copied to your clipboard as soon as it opens.</p>
        </form>

        <div v-else>
            <div class="rounded-lg border border-line p-5 sm:p-7">
                <!-- Text -->
                <template v-if="result.type === 'text'">
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
                        :value="result.text"
                    />
                    <button type="button" class="btn-primary mt-4 w-full" :disabled="flash" @click="copyAgain">
                        <TsnIcon :name="flash ? 'check' : 'copy'" class="h-[18px] w-[18px]" />{{ flash ? "Copied" : "Copy text" }}
                    </button>
                    <p class="mt-3 text-center text-[13px] text-muted">This text has now been deleted from our server. Copy it before you leave.</p>
                </template>

                <!-- File -->
                <template v-else>
                    <p class="text-[17px] font-semibold tracking-[-0.01em]">Your file is downloading</p>
                    <ul class="mt-4 grid gap-2">
                        <li class="flex items-center gap-3 rounded-lg border border-line px-3 py-2.5">
                            <span class="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-surface-2 text-ink"><TsnIcon name="file" class="h-5 w-5" stroke="1.9" /></span>
                            <span class="min-w-0 flex-1">
                                <span class="block truncate text-[15px] font-medium">Code {{ result.code }}</span>
                                <span class="text-[13px] text-muted">Check your downloads folder</span>
                            </span>
                            <TsnIcon name="check" class="h-5 w-5 text-ok" stroke="2.4" />
                        </li>
                    </ul>
                    <p class="mt-3 text-[13px] text-muted">Original quality and file names are kept. The file has now been deleted from our server.</p>
                </template>

                <button type="button" class="btn-ghost mt-4 w-full" @click="reset">Enter another code</button>
            </div>
            <TipCard where="receive" />
        </div>
    </div>
</template>

<script setup>
/*
 * One Receive box for both text and file codes.
 * Text is tried first (it's cheap and single-use); if that code isn't a text
 * share, we check the files service with a HEAD request, which doesn't use up
 * the download, then hand the browser the real download link.
 */
const props = defineProps({
    initialCode: { type: String, default: "" },
    initialKind: { type: String, default: "" }, // "text" | "file" from a scanned QR link
});

const config = useRuntimeConfig();
const FILES_API = config.public.FILES_API_URL;

const value = ref("");
const focused = ref(false);
const loading = ref(false);
const error = ref(null);
const shake = ref(false);
const result = ref(null);
const copied = ref(false);
const flash = ref(false);
const inputEl = ref(null);
const textEl = ref(null);
const slots = ref([]);

const clean = (s) => s.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5);

function onInput(e) {
    const before = e.target.value;
    value.value = clean(before);
    e.target.value = value.value;
    error.value = null;
    const last = slots.value[value.value.length - 1];
    if (last && before.length) {
        last.classList.remove("tick");
        void last.offsetWidth;
        last.classList.add("tick");
    }
}
function toEnd(e) {
    const n = e.target.value.length;
    e.target.setSelectionRange(n, n);
}

function fail(title, body) {
    error.value = { title, body };
    shake.value = false;
    requestAnimationFrame(() => (shake.value = true));
}

const NOT_FOUND = ["Code not found or expired", "Check each character and try again. Text codes last 10 minutes, file codes last 15."];

async function getText(code) {
    try {
        const res = await $fetch(`${config.public.API_BASE}/api/share/${code}`);
        return { type: "text", text: res.text, code };
    } catch (e) {
        if (e?.response?.status === 404) return null;
        if (e?.response?.status === 429) throw new Error("Too many tries. Wait a minute and try again.");
        throw new Error("Couldn't reach TextShareNow. Check your internet connection and try again.");
    }
}
async function getFile(code) {
    const head = await fetch(`${FILES_API}/download/${code}`, { method: "HEAD" }).catch(() => null);
    if (!head) throw new Error("Couldn't reach TextShareNow. Check your internet connection and try again.");
    if (head.status === 404) return null;
    if (!head.ok) throw new Error("The download didn't start. Please try again.");
    window.location.href = `${FILES_API}/download/${code}`;
    return { type: "file", code };
}

async function receive(kind) {
    const code = value.value;
    if (code.length < 5 || loading.value) return;
    loading.value = true;
    error.value = null;
    try {
        let res = null;
        if (kind !== "file") res = await getText(code);
        if (!res && kind !== "text") res = await getFile(code);
        if (!res) return fail(...NOT_FOUND);
        result.value = res;
        if (res.type === "text") {
            copied.value = await copyText(res.text);
        }
    } catch (e) {
        fail("Something went wrong", e.message);
    } finally {
        loading.value = false;
    }
}

async function copyAgain() {
    if (await copyText(result.value.text)) {
        copied.value = true;
        flash.value = true;
        setTimeout(() => (flash.value = false), 1600);
    } else {
        textEl.value?.select();
    }
}

function reset() {
    result.value = null;
    value.value = "";
    copied.value = false;
    nextTick(() => inputEl.value?.focus());
}

// A scanned QR link (/?code= or /?fcode=) opens straight away
function openInitial() {
    const code = clean(props.initialCode || "");
    if (code.length >= 5) {
        value.value = code;
        receive(props.initialKind);
    }
}
onMounted(openInitial);
watch(() => props.initialCode, openInitial);

defineExpose({ focus: () => inputEl.value?.focus({ preventScroll: true }) });
</script>
