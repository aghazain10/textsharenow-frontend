<template>
    <div>
        <div
            v-if="!code"
            class="rounded-lg border border-line bg-bg"
        >
            <label for="send-textarea" class="sr-only">Text, link or note to share</label>
            <div class="relative">
                <textarea
                    id="send-textarea"
                    ref="area"
                    v-model="text"
                    :maxlength="maxChars"
                    rows="8"
                    :placeholder="`Paste a link, a note, an address… anything up to ${maxChars.toLocaleString('en-US')} characters.`"
                    class="block w-full resize-none rounded-t-lg bg-transparent px-5 pb-9 pt-5 text-[17px] leading-relaxed placeholder:text-muted/70 !outline-none focus:!outline-none focus-visible:!outline-none"
                    @keydown.enter.meta.prevent="send"
                    @keydown.enter.ctrl.prevent="send"
                    @beforeinput="onBeforeInput"
                />
                <div class="pointer-events-none absolute inset-x-5 bottom-2 flex items-center justify-between gap-3 text-[13px]">
                    <span class="pointer-events-auto flex items-center gap-2">
                        <button
                            v-if="canPaste && !text.length"
                            type="button"
                            class="inline-flex items-center gap-1.5 rounded-md border border-line px-2 py-1 font-medium text-ink hover:bg-surface-2"
                            @click="pasteIn"
                        >
                            <TsnIcon name="clipboard" class="h-3.5 w-3.5" />Paste
                        </button>
                        <span v-if="pasteHint" class="text-muted">{{ pasteHint }}</span>
                    </span>
                    <span class="pointer-events-auto flex items-center gap-1.5">
                        <button
                            v-if="!isPro"
                            type="button"
                            class="inline-flex items-center gap-1 rounded-md border border-line px-1.5 py-0.5 text-[12px] font-medium text-muted transition-colors hover:text-ink"
                            :class="{ 'border-brand text-ink': text.length >= maxChars }"
                            title="Go Pro for 100,000 characters"
                            @click="openProModal('chars')"
                        >
                            <TsnIcon name="lock" class="h-3 w-3" stroke="2.2" />
                            100K with Pro
                        </button>
                        <span
                            class="tabular-nums"
                            :class="text.length >= maxChars ? 'font-semibold text-bad' : text.length >= maxChars * 0.9 ? 'font-semibold text-ink' : 'text-muted'"
                            aria-live="polite"
                        >{{ text.length.toLocaleString("en-US") }} / {{ maxChars.toLocaleString("en-US") }}</span>
                        <button
                            v-if="text.length"
                            type="button"
                            class="rounded-md px-2 py-1 font-medium text-muted hover:bg-surface-2 hover:text-ink"
                            @click="text = ''"
                        >
                            Clear
                        </button>
                    </span>
                </div>
            </div>

            <!-- Premium controls: always visible; locked for free users -->
            <div class="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line px-5 py-3">
                <ExpirySelect v-model="maxReads" :options="READ_OPTIONS" label="Allowed reads" icon="eye" reason="reads" />
                <label class="inline-flex min-w-[190px] flex-1 cursor-pointer items-center gap-1.5 text-[13px] text-muted">
                    <TsnIcon name="lock" class="h-3.5 w-3.5 shrink-0" :class="isPro ? 'text-muted' : ''" stroke="1.8" />
                    <input
                        ref="pwInput"
                        v-model="password"
                        type="password"
                        autocomplete="new-password"
                        placeholder="Password (optional)"
                        aria-label="Password (optional)"
                        class="w-full rounded-md border border-line bg-bg px-2.5 py-1 text-[12px] text-ink placeholder:text-muted/70 !outline-none"
                        :class="isPro ? '' : 'cursor-pointer'"
                        :readonly="!isPro"
                        @focus="onPasswordFocus"
                        @click="onPasswordFocus"
                    />
                </label>
                <label class="inline-flex min-w-[190px] flex-1 cursor-pointer items-center gap-1.5 text-[13px] text-muted">
                    <TsnIcon name="link" class="h-3.5 w-3.5 shrink-0" :class="isPro ? 'text-muted' : ''" stroke="1.8" />
                    <input
                        v-model="customCode"
                        type="text"
                        autocomplete="off"
                        autocapitalize="off"
                        autocorrect="off"
                        spellcheck="false"
                        placeholder="Custom code (optional)"
                        aria-label="Custom code (Pro)"
                        class="w-full rounded-md border border-line bg-bg px-2.5 py-1 text-[12px] text-ink placeholder:text-muted/70 !outline-none"
                        :class="isPro ? '' : 'cursor-pointer'"
                        :readonly="!isPro"
                        @focus="onCustomFocus"
                        @click="onCustomFocus"
                    />
                    <span v-if="customStatus === 'taken'" class="shrink-0 text-[11px] font-semibold text-bad" role="status">taken</span>
                    <span v-else-if="customStatus === 'available'" class="shrink-0 text-[11px] font-semibold text-ok" role="status">free</span>
                    <span v-else-if="customStatus === 'invalid'" class="shrink-0 text-[11px] font-semibold text-bad" role="status">invalid</span>
                </label>
            </div>

            <!-- Gentle nudge: custom codes are memorable (and guessable) -->
            <Transition name="hint">
                <p v-if="showCodePwHint" class="mx-5 -mt-1 mb-2 inline-flex items-center gap-1.5 rounded-md bg-surface-2 px-2.5 py-1.5 text-[12px] text-muted" role="status">
                    <TsnIcon name="lock" class="h-3.5 w-3.5 shrink-0" stroke="1.8" />
                    Custom codes are easy to guess —
                    <button type="button" class="cursor-pointer font-medium text-ink underline decoration-line underline-offset-2 transition-colors hover:decoration-ink" @click="focusPassword">add a password</button>
                    to keep this private.
                </p>
            </Transition>

            <p v-if="error" class="mx-5 mb-2 flex items-center gap-2 text-[14px] text-bad" role="alert">
                <TsnIcon name="alert" class="h-4 w-4 shrink-0" />{{ error }}
            </p>
            <div class="flex flex-wrap items-center gap-3 px-3 pb-3 pl-5 pt-3">
                <ExpirySelect v-model="ttl" />
                <button
                    type="button"
                    role="switch"
                    :aria-checked="encryptNow"
                    title="Encrypt in your browser — the recipient must open the full link; the 5-character code won't work."
                    class="inline-flex items-center gap-2 rounded-md border border-line px-2.5 py-1.5 text-[13px] font-medium text-muted transition-colors hover:text-ink"
                    @click="encryptNow = !encryptNow"
                >
                    <span
                        class="relative inline-block h-4 w-7 shrink-0 rounded-full transition-colors"
                        :class="encryptNow ? 'bg-ink' : 'bg-line'"
                        aria-hidden="true"
                    >
                        <span
                            class="absolute left-[2px] top-[2px] h-3 w-3 rounded-full transition-transform"
                            :class="encryptNow ? 'translate-x-[14px] bg-bg' : 'translate-x-0 bg-muted'"
                        />
                    </span>
                    <span :class="encryptNow ? 'text-ink' : ''">Encrypt Now</span>
                </button>
                <div class="ml-auto flex items-center gap-3">
                    <kbd class="hidden rounded-md border border-line px-1.5 py-0.5 font-sans text-[12px] text-muted sm:inline">{{ shortcut }}</kbd>
                    <button type="button" class="btn-primary" :disabled="!text.trim() || loading" @click="send">
                        {{ loading ? (encryptNow ? "Encrypting…" : "Generating…") : (encryptNow ? "Encrypt & share" : "Generate code") }}
                    </button>
                </div>
            </div>
        </div>

        <CodeResult
            v-else
            :code="code"
            :ttl="ttl"
            :qr-url="qrUrl"
            :max-reads="resultReads"
            :password-set="resultPassword"
            :encrypted="resultEncrypted"
            @reset="reset"
        />
    </div>
</template>

<script setup>
import { DEFAULT_EXPIRY } from "~/utils/expiry.js";
import { READ_OPTIONS, DEFAULT_READS } from "~/utils/reads.js";
import { FREE_MAX_CHARS, PRO_MAX_CHARS } from "~/utils/premium.js";
import { hashPassword } from "~/utils/hash.js";
import { generateShareKey, encryptText, createPassphrase } from "~/utils/e2e.js";
import { normalizeCustomCode, isValidCustomCode } from "~/utils/customCode.js";

const API_BASE = useRuntimeConfig().public.API_BASE;
const { isPro } = usePremium();
const { open: openProModal } = useProModal();
const text = ref("");
const code = ref("");
const qrUrl = ref("");
const ttl = ref(DEFAULT_EXPIRY); // seconds, 0 = never
const maxReads = ref(DEFAULT_READS); // 1, 5, 10 or 0 = unlimited
const password = ref("");
const customCode = ref("");
const customStatus = ref(""); // "" | "checking" | "available" | "taken" | "invalid"
const encryptNow = ref(false); // opt-in zero-knowledge mode (link only)
let customTimer = null;
const loading = ref(false);
const error = ref("");
const shortcut = ref("Ctrl Enter");
const area = ref(null);
const pwInput = ref(null);
const canPaste = ref(false);
const pasteHint = ref("");
const limitModalShown = ref(false); // open the "Go Pro" modal only once per visit to the limit

// What was actually sent — shown in the result card
const resultReads = ref(1);
const resultPassword = ref(false);
const resultEncrypted = ref(false);

const maxChars = computed(() => (isPro.value ? PRO_MAX_CHARS : FREE_MAX_CHARS));

// Nudge to add a password while a valid custom code is set unprotected.
const showCodePwHint = computed(
    () => isPro.value && customCode.value.length >= 3 && isValidCustomCode(customCode.value) && !password.value
);

function focusPassword() {
    pwInput.value?.focus();
}

// Free user ran into the character cap (typing at the limit, or pasting
// more than fits): show the Pro modal once until they're back under it.
function onBeforeInput(e) {
    if (isPro.value) return;
    const type = e.inputType || "";
    if (type.startsWith("delete") || type.startsWith("history")) return;
    // Pasted text arrives on dataTransfer; typed text on data.
    const incoming = type === "insertFromPaste" ? (e.dataTransfer?.getData("text/plain") ?? "") : (e.data ?? "");
    const wouldExceed = text.value.length >= FREE_MAX_CHARS || text.value.length + incoming.length > FREE_MAX_CHARS;
    if (wouldExceed && !limitModalShown.value) {
        limitModalShown.value = true;
        openProModal("chars");
    }
}

// Free users can't type a password — clicking the locked field opens the modal.
function onPasswordFocus(e) {
    if (isPro.value) return;
    e.target.blur();
    openProModal("password");
}

// Same for the custom code field.
function onCustomFocus(e) {
    if (isPro.value) return;
    e.target.blur();
    openProModal("code");
}

// Keep the input lowercase + trimmed to the legal charset as they type.
watch(customCode, (v) => {
    const n = normalizeCustomCode(v);
    if (v !== n) customCode.value = n;
});

// Debounced availability check against the server.
watch(customCode, (v) => {
    clearTimeout(customTimer);
    if (!v || v.length < 3 || !isValidCustomCode(v)) {
        customStatus.value = v && v.length >= 3 && !isValidCustomCode(v) ? "invalid" : "";
        return;
    }
    customStatus.value = "checking";
    customTimer = setTimeout(async () => {
        try {
            const res = await $fetch(`${API_BASE}/api/share/custom-check`, { query: { code: v } });
            customStatus.value = res.available ? "available" : "taken";
        } catch {
            customStatus.value = "";
        }
    }, 400);
});

// Turning Pro off resets anything premium that was selected
watch(isPro, (pro) => {
    if (pro) return;
    if (![600, 1800, 3600].includes(ttl.value)) ttl.value = DEFAULT_EXPIRY;
    maxReads.value = DEFAULT_READS;
    password.value = "";
    customCode.value = "";
    customStatus.value = "";
    if (text.value.length > FREE_MAX_CHARS) text.value = text.value.slice(0, FREE_MAX_CHARS);
    limitModalShown.value = false;
});

// Re-arm the modal the moment they get back under the limit
watch(text, (t) => {
    if (t.length < FREE_MAX_CHARS) limitModalShown.value = false;
});

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
        if (clip.length > FREE_MAX_CHARS && !isPro.value) {
            limitModalShown.value = true;
            openProModal("chars");
        }
        if (clip) text.value = clip.slice(0, maxChars.value);
        else pasteHint.value = "Your clipboard is empty.";
    } catch {
        // Permission refused or not supported: fall back to the keyboard
        pasteHint.value = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? "Press ⌘ V to paste." : "Press Ctrl V to paste.";
    }
    area.value?.focus();
}

async function send() {
    if (!text.value.trim() || loading.value) return;
    if (text.value.length > maxChars.value) {
        error.value = `Text cannot exceed ${maxChars.value.toLocaleString("en-US")} characters.`;
        return;
    }
    loading.value = true;
    error.value = "";
    try {
        const body = { ttl: ttl.value, pro: isPro.value };
        let shareKey = "";
        let mix = null;
        if (isPro.value) {
            body.maxReads = maxReads.value;
            if (password.value) {
                if (encryptNow.value) {
                    // p3 verifier: the server stores sha256(mix), never the
                    // mix that salts the AES key. Both the link and the
                    // password are needed to decrypt.
                    const pass = await createPassphrase(password.value);
                    body.passwordHash = pass.verifier;
                    mix = pass.mix;
                } else {
                    body.passwordHash = await hashPassword(password.value);
                }
            }
            if (customCode.value) body.customCode = customCode.value;
        }
        if (encryptNow.value) {
            // Zero-knowledge: encrypt in the browser before anything leaves
            // the device. The random key goes only into the link's #k=
            // fragment — the server receives ciphertext it cannot read, and
            // the 5-character code alone will not open this share.
            shareKey = generateShareKey();
            try {
                body.ct = await encryptText(text.value, shareKey, mix);
            } catch {
                error.value = "Couldn't encrypt in this browser. Try a private window or update your browser.";
                return;
            }
        } else {
            body.text = text.value;
        }
        const res = await $fetch(`${API_BASE}/api/share`, { method: "POST", body });
        code.value = res.code;
        if (res.ttl !== undefined) ttl.value = res.ttl;
        qrUrl.value = shareKey
            ? `${window.location.origin}/r?code=${res.code}#k=${shareKey}`
            : `${window.location.origin}/r?code=${res.code}`;
        resultReads.value = isPro.value ? maxReads.value : 1;
        resultPassword.value = !!(isPro.value && password.value);
        resultEncrypted.value = !!shareKey;
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
    resultReads.value = 1;
    resultPassword.value = false;
    resultEncrypted.value = false;
    encryptNow.value = false;
}
</script>

<style scoped>
.hint-enter-active,
.hint-leave-active {
    transition: opacity 0.15s ease;
}

.hint-enter-from,
.hint-leave-to {
    opacity: 0;
}
</style>
