<template>
    <div>
        <form v-if="!result" class="rounded-lg border border-line px-4 py-8 text-center sm:px-8 sm:py-10" novalidate @submit.prevent="receive">
            <label for="code-input" class="text-[17px] font-semibold tracking-[-0.01em]">Enter the code from your other device</label>
            <p class="mt-1 text-[14px] text-muted">Codes are 5 characters — or a custom code with Pro</p>

            <div class="code-field relative mx-auto mt-6 w-fit" :class="{ error: !!error, shake }">
                <div class="flex flex-wrap justify-center gap-1.5 sm:gap-2.5" aria-hidden="true">
                    <span
                        v-for="i in slotCount"
                        :key="i"
                        ref="slots"
                        class="flap slot"
                        :class="{ empty: !value[i - 1], filled: !!value[i - 1], active: focused && i - 1 === Math.min(value.length, slotCount - 1) }"
                    >{{ value[i - 1] || "·" }}</span>
                </div>
                <input
                    id="code-input"
                    ref="inputEl"
                    :value="value"
                    type="text"
                    maxlength="30"
                    inputmode="text"
                    autocomplete="one-time-code"
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

            <!-- Password prompt for protected shares -->
            <div v-if="passwordNeeded" class="mx-auto mt-5 max-w-xs text-left">
                <label for="pw-input" class="flex items-center gap-1.5 text-[13px] font-medium text-ink">
                    <TsnIcon name="lock" class="h-3.5 w-3.5 shrink-0 text-muted" stroke="1.8" />
                    This share has a password
                </label>
                <input
                    id="pw-input"
                    ref="pwInput"
                    v-model="password"
                    type="password"
                    autocomplete="off"
                    placeholder="Enter the password"
                    class="mt-1.5 w-full rounded-md border border-line bg-bg px-3 py-2 text-[15px] text-ink placeholder:text-muted/70 !outline-none"
                    @keydown.enter.prevent="unlock"
                />
                <p v-if="passwordError" class="mt-1.5 text-[13px] text-bad" role="alert">{{ passwordError }}</p>
                <button type="button" class="btn-primary mt-2 w-full" :disabled="!password || loading" @click="unlock">
                    {{ loading ? "Checking…" : "Unlock" }}
                </button>
            </div>

            <div v-if="error" id="receive-error" class="mx-auto mt-5 max-w-md rounded-lg border border-bad/30 bg-bad-soft px-4 py-3 text-left text-[14px]" role="alert">
                <p class="font-semibold text-bad">{{ error.title }}</p>
                <p class="mt-0.5 text-ink/75">{{ error.body }}</p>
            </div>

            <div class="mx-auto mt-6 flex w-full max-w-xs flex-col gap-2">
                <button type="submit" class="btn-primary w-full" :disabled="value.length < 3 || loading">
                    {{ loading ? "Opening…" : "Receive" }}
                </button>
                <button v-if="canPaste && !value" type="button" class="btn-ghost w-full" @click="pasteCode">
                    <TsnIcon name="clipboard" class="h-4 w-4" />Paste code
                </button>
            </div>
            <p v-if="pasteHint" class="mt-3 text-[13px] text-muted">{{ pasteHint }}</p>
            <p class="mt-4 text-[13px] text-muted">Text is copied to your clipboard as soon as it opens.</p>
        </form>

        <div v-else>
            <div class="rounded-lg border border-line p-5 sm:p-7">
                <!-- Text -->
                <ReceivedText v-if="result.type === 'text'" :text="result.text" :code="result.code" />

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
                    <p class="mt-3 text-[13px] text-muted">Original quality and file names are kept.</p>
                </template>

                <p class="mt-3 flex items-start justify-center gap-1.5 text-center text-[13px] text-muted">
                    <TsnIcon name="trash" class="mt-px h-3.5 w-3.5 shrink-0" stroke="1.8" />
                    <span v-if="result.type === 'text' && result.readsLeft === null">Available until the sender's expiry time.</span>
                    <span v-else-if="result.type === 'text' && result.readsLeft > 0">Read {{ result.readsLeft }} more time{{ result.readsLeft === 1 ? "" : "s" }} before it's deleted.</span>
                    <span v-else>Deleted from our server. Code {{ result.code }} won't work again.</span>
                </p>

                <button type="button" class="btn-ghost mt-4 w-full" @click="reset">Enter another code</button>            </div>
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
import { hashPassword, hashLegacyPassword } from "~/utils/hash.js";

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
const inputEl = ref(null);
const slots = ref([]);

// Password-protected shares
const passwordNeeded = ref(false);
const password = ref("");
const passwordError = ref("");
const pwInput = ref(null);
const kdfParams = ref(null); // { kdf, salt, iterations } from the 401 response

const canPaste = ref(false);
const pasteHint = ref("");

// 5 slots for random codes; more (wrapped) as a custom code grows.
const slotCount = computed(() => Math.max(5, value.value.length));

// Paste a code (or a copied share link) from the clipboard, then open it
async function pasteCode() {
    pasteHint.value = "";
    try {
        const clip = (await navigator.clipboard.readText()) || "";
        const fromLink = clip.match(/[?&]f?code=([A-Za-z0-9_-]{3,32})/);
        const code = clean(fromLink ? fromLink[1] : clip);
        if (code.length < 3) {
            pasteHint.value = "There's no code on your clipboard.";
            return;
        }
        value.value = code;
        receive(fromLink && /fcode=/.test(fromLink[0]) ? "file" : "");
    } catch {
        pasteHint.value = "Your browser blocked the clipboard. Tap the boxes and paste instead.";
        inputEl.value?.focus();
    }
}

// Random codes are uppercase; custom codes lowercase with - and _ allowed.
// Case is preserved as typed — the server tries both storage forms.
const clean = (s) => s.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 30);

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

const NOT_FOUND = ["Code not found or expired", "Check each character and try again. Codes last as long as the sender chose — from 10 minutes up to never."];

async function getText(code, pwHash) {
    try {
        const res = await $fetch(`${config.public.API_BASE}/api/share/${code}`, {
            query: pwHash ? { pw: pwHash } : undefined,
        });
        return { type: "text", text: res.text, code, readsLeft: res.readsLeft };
    } catch (e) {
        const status = e?.status ?? e?.response?.status;
        if (status === 404) return null;
        if (status === 401) {
            const params = e?.data?.data || e?.data || {};
            kdfParams.value = {
                kdf: params.kdf || "sha256",
                salt: params.salt || "",
                iterations: params.iterations || 0,
            };
            const err = new Error("password required");
            err.code = "PASSWORD";
            throw err;
        }
        if (status === 403) {
            const message = e?.data?.message || "Incorrect password. Try again.";
            const err = new Error(message);
            err.code = /permanently deleted/i.test(message) ? "BURNED" : "WRONG_PASSWORD";
            throw err;
        }
        if (status === 429) throw new Error("Too many tries. Wait a minute and try again.");
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

async function receive(kind, pwHash) {
    const code = value.value;
    if (code.length < 3 || loading.value) return;
    loading.value = true;
    error.value = null;
    try {
        let res = null;
        if (kind !== "file") res = await getText(code, pwHash);
        if (!res && kind !== "text") res = await getFile(code);
        if (!res) return fail(...NOT_FOUND);
        passwordNeeded.value = false;
        passwordError.value = "";
        result.value = res;
    } catch (e) {
        if (e?.code === "PASSWORD") {
            passwordNeeded.value = true;
            passwordError.value = "";
            nextTick(() => pwInput.value?.focus());
        } else if (e?.code === "WRONG_PASSWORD") {
            passwordNeeded.value = true;
            passwordError.value = e.message;
            nextTick(() => pwInput.value?.select());
        } else if (e?.code === "BURNED") {
            passwordNeeded.value = false;
            password.value = "";
            kdfParams.value = null;
            fail("Share deleted", e.message);
        } else {
            fail("Something went wrong", e.message);
        }
    } finally {
        loading.value = false;
    }
}

async function unlock() {
    if (!password.value || loading.value) return;
    const params = kdfParams.value;
    const hash =
        params?.kdf === "pbkdf2" && params.salt && params.iterations
            ? await hashPassword(password.value, params.salt, params.iterations)
            : await hashLegacyPassword(password.value);
    receive("", hash);
}

function reset() {
    result.value = null;
    value.value = "";
    passwordNeeded.value = false;
    password.value = "";
    passwordError.value = "";
    kdfParams.value = null;
    nextTick(() => inputEl.value?.focus());
}

// A scanned QR link (/?code= or /?fcode=) opens straight away
function openInitial() {
    const code = clean(props.initialCode || "");
    if (code.length >= 3) {
        value.value = code;
        receive(props.initialKind);
    }
}
onMounted(() => {
    canPaste.value = !!navigator.clipboard?.readText;
    openInitial();
});
watch(() => props.initialCode, openInitial);

defineExpose({ focus: () => inputEl.value?.focus({ preventScroll: true }) });
</script>
