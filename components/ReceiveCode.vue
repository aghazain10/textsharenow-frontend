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

                <!-- Multi-file transfer -->
                <template v-else-if="result.type === 'transfer'">
                    <div class="flex flex-wrap items-end justify-between gap-2">
                        <div>
                            <p class="text-[17px] font-semibold tracking-[-0.01em]">{{ result.encrypted && !result.files.length ? "All files downloaded" : "Your files are ready" }}</p>
                            <p v-if="result.files.length" class="mt-1 text-[13px] text-muted">{{ result.count }} file{{ result.count === 1 ? "" : "s" }} · {{ formatBytes(result.bytes) }}</p>
                            <p v-else class="mt-1 text-[13px] text-muted">Every file was decrypted and deleted.</p>
                            <p v-if="result.encrypted && result.files.length" class="mt-1 flex items-center gap-1 text-[12px] text-muted">
                                <TsnIcon name="lock" class="h-3 w-3" stroke="1.9" /> End-to-end encrypted · not virus-scanned
                            </p>
                        </div>
                        <a v-if="!result.encrypted" :href="transferZipUrl" class="btn-primary !h-9 !px-3 !text-[13px]">
                            <TsnIcon name="download" class="h-4 w-4" stroke="1.9" />Download all
                        </a>
                    </div>
                    <ul class="mt-4 grid gap-2">
                        <li v-for="file in result.files" :key="file.id" class="flex items-center gap-3 rounded-lg border border-line px-3 py-2.5">
                            <span class="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-surface-2 text-ink"><TsnIcon name="file" class="h-5 w-5" stroke="1.9" /></span>
                            <span class="min-w-0 flex-1">
                                <span class="block truncate text-[15px] font-medium">{{ file.name }}</span>
                                <span class="block truncate text-[13px] text-muted">{{ file.path !== file.name ? `${file.path} · ` : "" }}{{ formatBytes(file.size) }}</span>
                            </span>
                            <a v-if="!result.encrypted" :href="transferFileUrl(file)" class="btn-ghost !h-8 shrink-0 !px-2.5 !text-[12px]">
                                <TsnIcon name="download" class="h-3.5 w-3.5" stroke="2" />Download
                            </a>
                            <button
                                v-else
                                type="button"
                                class="btn-ghost !h-8 shrink-0 !px-2.5 !text-[12px]"
                                :disabled="!!busyFile"
                                @click="downloadTransferFile(file)"
                            >
                                <TsnIcon name="download" class="h-3.5 w-3.5" stroke="2" />{{ busyFile === file.id ? "Decrypting…" : "Download" }}
                            </button>
                        </li>
                    </ul>
                    <p v-if="result.encrypted && result.files.length" class="mt-3 text-[13px] text-muted">
                        Each file is deleted after you download and decrypt it. The key is in this link, so keep the whole link
                        (including the part after the #). Folder paths are shown here, but encrypted files are saved one at a time.
                    </p>
                    <p v-else-if="result.encrypted" class="mt-3 text-[13px] text-muted">
                        Every file was decrypted and deleted. This transfer code no longer works.
                    </p>
                    <p v-else class="mt-3 text-[13px] text-muted">Each file is deleted after its first download. Download all as a ZIP, or take only the files you need.</p>
                </template>

                <!-- Single file -->
                <template v-else>
                    <template v-if="result.encrypted">
                        <p class="text-[17px] font-semibold tracking-[-0.01em]">{{ result.downloaded ? "Your file is ready" : "Your encrypted file is ready" }}</p>
                        <ul class="mt-4 grid gap-2">
                            <li class="flex items-center gap-3 rounded-lg border border-line px-3 py-2.5">
                                <span class="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-surface-2 text-ink"><TsnIcon name="file" class="h-5 w-5" stroke="1.9" /></span>
                                <span class="min-w-0 flex-1">
                                    <span class="block truncate text-[15px] font-medium">{{ result.name || "Encrypted file" }}</span>
                                    <span class="text-[13px] text-muted">{{ result.downloaded ? "Decrypted and saved" : "Decrypts in your browser" }}</span>
                                </span>
                                <TsnIcon v-if="result.downloaded" name="check" class="h-5 w-5 text-ok" stroke="2.4" />
                            </li>
                        </ul>
                        <button v-if="!result.downloaded" type="button" class="btn-primary mt-4" :disabled="downloadingSingle" @click="downloadSingleFile">
                            <TsnIcon name="download" class="h-[18px] w-[18px]" stroke="1.9" />{{ downloadingSingle ? "Downloading & decrypting…" : "Download & decrypt" }}
                        </button>
                        <p class="mt-3 text-[13px] text-muted">
                            {{ result.downloaded ? "Saved to your downloads folder. The server copy has been deleted." : "The file stays encrypted on our server until you download it. The key is in this link." }}
                        </p>
                    </template>
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
                </template>

                <p v-if="!(result.encrypted && (result.type === 'file' || result.type === 'transfer'))" class="mt-3 flex items-start justify-center gap-1.5 text-center text-[13px] text-muted">
                    <TsnIcon name="trash" class="mt-px h-3.5 w-3.5 shrink-0" stroke="1.8" />
                    <span v-if="result.type === 'text' && result.readsLeft === null">Available until the sender's expiry time.</span>
                    <span v-else-if="result.type === 'text' && result.readsLeft > 0">Read {{ result.readsLeft }} more time{{ result.readsLeft === 1 ? "" : "s" }} before it's deleted.</span>
                    <span v-else-if="result.type === 'transfer'">The code stops working when every file is downloaded or the timer ends.</span>
                    <span v-else>Deleted from our server. Code {{ result.code }} won't work again.</span>
                </p>

                <button type="button" class="btn-ghost mt-4 w-full" @click="reset">Enter another code</button>

                <div v-if="error" class="mx-auto mt-5 max-w-md rounded-lg border border-bad/30 bg-bad-soft px-4 py-3 text-left text-[14px]" role="alert">
                    <p class="font-semibold text-bad">{{ error.title }}</p>
                    <p class="mt-0.5 text-ink/75">{{ error.body }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
/*
 * One Receive box for text, single-file, and multi-file codes.
 * Text is tried first (it's cheap and single-use); then the transfer manifest;
 * then a HEAD on the single-file download, which doesn't use up the download.
 */
import { hashPassword, hashLegacyPassword } from "~/utils/hash.js";
import { decryptText, derivePasswordMix, createPassphrase, shareKeyFor, rememberShareKey, forgetShareKey, keyFromLink } from "~/utils/e2e.js";
import { decryptFile } from "~/utils/fileE2e.js";

const props = defineProps({
    initialCode: { type: String, default: "" },
    initialKind: { type: String, default: "" }, // "text" | "file" | "transfer" from a scanned QR link
});

const config = useRuntimeConfig();
const FILES_API = config.public.FILES_API_URL;

const value = ref("");
const focused = ref(false);
const loading = ref(false);
const error = ref(null);
const shake = ref(false);
const result = ref(null);
const busyFile = ref("");
const downloadingSingle = ref(false);
const inputEl = ref(null);
const slots = ref([]);

// Password-protected shares
const passwordNeeded = ref(false);
const password = ref("");
const passwordError = ref("");
const pwInput = ref(null);
const kdfParams = ref(null); // { kdf, salt, iterations } from the 401 response
const keyMix = ref(null); // PBKDF2(password) mix for E2E passphrase shares

const canPaste = ref(false);
const pasteHint = ref("");

// 5 slots for random codes; more (wrapped) as a custom code grows.
const slotCount = computed(() => Math.max(5, value.value.length));

// Paste a code (or a copied share link) from the clipboard, then open it
async function pasteCode() {
    pasteHint.value = "";
    try {
        const clip = (await navigator.clipboard.readText()) || "";
        const fromLink = clip.match(/[?&](?:([ft])code|code)=([A-Za-z0-9_-]{3,32})/i);
        const code = clean(fromLink ? fromLink[2] : clip);
        if (code.length < 3) {
            pasteHint.value = "There's no code on your clipboard.";
            return;
        }
        value.value = code;
        // A pasted encrypted link carries its key after the #; a bare code
        // has none — forget any earlier key so we never try the wrong one.
        const linkKey = keyFromLink(clip);
        if (linkKey && fromLink) rememberShareKey(code, linkKey);
        else forgetShareKey();
        const prefix = fromLink?.[1]?.toLowerCase();
        receive(prefix === "f" ? "file" : prefix === "t" ? "transfer" : "");
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

async function markOpened(code) {
    try {
        await $fetch(`${config.public.API_BASE}/api/share/${encodeURIComponent(code)}/open`, {
            method: "POST",
        });
    } catch {
        // Opening a receipt is best-effort — never block the actual receive.
    }
}

/**
 * Peek without consuming a read: is this an end-to-end encrypted share we
 * hold no key for? A keyless fetch would burn the read and then fail to
 * decrypt — so check first. Any doubt (404, network) → false → normal flow.
 */
async function isEncryptedWithoutKey(code) {
    if (shareKeyFor(code)) return false; // key present → fetch can proceed
    try {
        const res = await $fetch(`${config.public.API_BASE}/api/share/${encodeURIComponent(code)}/meta`);
        return !!res?.encrypted;
    } catch {
        return false;
    }
}

async function getText(code, pwHash) {
    try {
        // The verifier goes in a header, never the URL — query strings end
        // up in access logs.
        const res = await $fetch(`${config.public.API_BASE}/api/share/${code}`, {
            headers: pwHash ? { "x-share-password": pwHash } : undefined,
        });
        if (res?.enc === 1 && typeof res.ct === "string") {
            const key = shareKeyFor(code);
            if (!key) {
                const err = new Error("no key");
                err.code = "NOKEY";
                throw err;
            }
            let text;
            try {
                text = await decryptText(res.ct, key, keyMix.value);
            } catch {
                const err = new Error("wrong key");
                err.code = "BADKEY";
                throw err;
            }
            return { type: "text", text, code, readsLeft: res.readsLeft };
        }
        return { type: "text", text: res.text, code, readsLeft: res.readsLeft };
    } catch (e) {
        const status = e?.status ?? e?.response?.status;
        if (status === 404) return null;
        if (status === 401) {
            const params = e?.data?.data || e?.data || {};
            kdfParams.value = {
                kdf: params.kdf || "sha256",
                format: params.format || (params.kdf === "pbkdf2" ? "p2" : "sha256"),
                encrypted: !!params.encrypted,
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
async function getTransfer(code, strict = false) {
    let res;
    try {
        res = await fetch(`${FILES_API}/transfer/${encodeURIComponent(code)}`, {
            headers: { Accept: "application/json" },
            cache: "no-store",
        });
    } catch {
        if (strict) throw new Error("Couldn't reach TextShareNow. Check your internet connection and try again.");
        return null;
    }

    if (res.status === 404) return null;
    if (res.status === 429) throw new Error("Too many tries. Wait a minute and try again.");
    if (!res.ok) throw new Error("Couldn't load that transfer. Please try again.");

    let data;
    try {
        data = await res.json();
    } catch {
        throw new Error("Couldn't load that transfer. Please try again.");
    }

    const encrypted = data?.enc === true || data?.enc === 1 || data?.enc === "1" || !!shareKeyFor(code);
    const files = (Array.isArray(data?.files) ? data.files : [])
        .filter((file) => file && file.id && file.name)
        .map((file) => ({
            id: String(file.id),
            name: String(file.name),
            path: String(file.path || file.name),
            size: Number(file.size) || 0,
            csize: Number(file.csize) || 0,
        }));
    if (!files.length) return null;
    if (encrypted && !shareKeyFor(code)) {
        const err = new Error("no key");
        err.code = "NOKEY";
        throw err;
    }

    return {
        type: "transfer",
        code: String(data.code || code),
        encrypted,
        files,
        count: files.length,
        bytes: Number(data.bytes) || files.reduce((sum, file) => sum + file.size, 0),
    };
}

async function getFile(code) {
    const head = await fetch(`${FILES_API}/download/${code}`, { method: "HEAD" }).catch(() => null);
    if (!head) throw new Error("Couldn't reach TextShareNow. Check your internet connection and try again.");
    if (head.status === 404) return null;
    if (!head.ok) throw new Error("The download didn't start. Please try again.");

    const marker = head.headers.get("x-tsn-encrypted");
    const encrypted = marker ? marker === "1" || marker.toLowerCase() === "true" : !!shareKeyFor(code);
    if (encrypted) {
        if (!shareKeyFor(code)) {
            const err = new Error("no key");
            err.code = "NOKEY";
            throw err;
        }
        // Never navigate straight to the ciphertext: decrypt and save in the
        // browser, then acknowledge so the server can delete its copy.
        return { type: "file", code, encrypted: true };
    }

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
        if (kind !== "file" && kind !== "transfer") {
            // End-to-end encrypted share + no key in this URL → stop before
            // the fetch, which would consume (and destroy) a read.
            if (!pwHash && (await isEncryptedWithoutKey(code))) {
                return fail(
                    "Encrypted link incomplete",
                    "This share is end-to-end encrypted, so the code alone can't open it. Ask the sender to copy and send the full link — it includes the key after the # — or paste that whole link here."
                );
            }
            if (!pwHash) await markOpened(code);
            res = await getText(code, pwHash);
        }
        if (!res && kind !== "text" && kind !== "file") res = await getTransfer(code, kind === "transfer");
        if (!res && kind !== "text" && kind !== "transfer") res = await getFile(code);
        if (!res) return fail(...NOT_FOUND);
        if (res.encrypted && res.type !== "text" && !shareKeyFor(res.code || code)) {
            const err = new Error("no key");
            err.code = "NOKEY";
            throw err;
        }
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
            keyMix.value = null;
            fail("Share deleted", e.message);
        } else if (e?.code === "NOKEY") {
            fail(
                "Encrypted link incomplete",
                "This share is end-to-end encrypted, so the code alone can't open it. Ask the sender to copy and send the full link — it includes the key after the # — or paste that whole link here."
            );
        } else if (e?.code === "BADKEY") {
            fail(
                "Can't decrypt this share",
                "The key in this link doesn't match this code. Ask the sender to copy the full link again — the part after the # is the key."
            );
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
    if (params?.format === "p3" && params.salt && params.iterations) {
        // E2E passphrase: derive the mix locally and send only its hash to
        // the server, then decrypt with fragment key + mix.
        const pass = await createPassphrase(password.value, params.salt, params.iterations);
        keyMix.value = pass.mix;
        receive("", pass.verifier);
    } else if (params?.kdf === "pbkdf2" && params.salt && params.iterations) {
        const hash = await hashPassword(password.value, params.salt, params.iterations);
        // Pre-M2 encrypted shares (p2) used the PBKDF2 output itself as the
        // key mix; standard p2 shares don't need a mix at all.
        keyMix.value = params.encrypted
            ? await derivePasswordMix(password.value, params.salt, params.iterations)
            : null;
        receive("", hash);
    } else {
        keyMix.value = null;
        receive("", await hashLegacyPassword(password.value));
    }
}

function saveBlob(blob, name, type) {
    const download = new Blob([blob], { type: type || "application/octet-stream" });
    const url = URL.createObjectURL(download);
    const a = document.createElement("a");
    a.href = url;
    a.download = name || "download.bin";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
}

async function ackFile(url) {
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
    });
    if (!res.ok) throw new Error("The file downloaded, but we couldn't confirm deletion. Try again before closing this page.");
}

async function downloadSingleFile() {
    if (downloadingSingle.value || result.value?.type !== "file") return;
    downloadingSingle.value = true;
    error.value = null;
    const code = result.value.code;
    try {
        const key = shareKeyFor(code);
        if (!key) {
            const err = new Error("no key");
            err.code = "NOKEY";
            throw err;
        }
        const res = await fetch(`${FILES_API}/download/${encodeURIComponent(code)}`, { cache: "no-store" });
        if (!res.ok) throw new Error("The download didn't start. The link may have expired.");
        let decrypted;
        try {
            decrypted = await decryptFile(await res.blob(), key);
        } catch {
            const err = new Error("bad key");
            err.code = "BADKEY";
            throw err;
        }
        saveBlob(decrypted.blob, decrypted.name, decrypted.type);
        await ackFile(`${FILES_API}/download/${encodeURIComponent(code)}/ack`);
        result.value = { ...result.value, downloaded: true, name: decrypted.name };
    } catch (e) {
        if (e?.code === "NOKEY") {
            fail("Encrypted link incomplete", "This file is end-to-end encrypted. Ask the sender to send the full link, including the part after the #.");
        } else if (e?.code === "BADKEY") {
            fail("Can't decrypt this file", "The key in this link doesn't match this file. Ask the sender to copy the full link again.");
        } else {
            fail("Couldn't download that file", e.message);
        }
    } finally {
        downloadingSingle.value = false;
    }
}

async function downloadTransferFile(file) {
    if (busyFile.value || result.value?.type !== "transfer") return;
    busyFile.value = file.id;
    error.value = null;
    const code = result.value.code;
    try {
        const key = shareKeyFor(code);
        if (!key) {
            const err = new Error("no key");
            err.code = "NOKEY";
            throw err;
        }
        const res = await fetch(transferFileUrl(file), { cache: "no-store" });
        if (!res.ok) throw new Error("That file is no longer available. It may have been downloaded already.");
        let decrypted;
        try {
            decrypted = await decryptFile(await res.blob(), key);
        } catch {
            const err = new Error("bad key");
            err.code = "BADKEY";
            throw err;
        }
        saveBlob(decrypted.blob, decrypted.name || file.name, decrypted.type);
        await ackFile(`${FILES_API}/transfer/${encodeURIComponent(code)}/file/${encodeURIComponent(file.id)}/ack`);

        const files = result.value.files.filter((f) => f.id !== file.id);
        const bytes = files.reduce((sum, f) => sum + f.size, 0);
        result.value = { ...result.value, files, count: files.length, bytes };
    } catch (e) {
        if (e?.code === "NOKEY") {
            fail("Encrypted link incomplete", "This transfer is end-to-end encrypted. Ask the sender to send the full link, including the part after the #.");
        } else if (e?.code === "BADKEY") {
            fail("Can't decrypt this file", "The key in this link doesn't match this file. Ask the sender to copy the full link again.");
        } else {
            fail("Couldn't download that file", e.message);
        }
    } finally {
        busyFile.value = "";
    }
}

function formatBytes(bytes) {
    if (!bytes) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
}

const transferZipUrl = computed(() => {
    if (result.value?.type !== "transfer" || result.value.encrypted) return "";
    return `${FILES_API}/transfer/${encodeURIComponent(result.value.code)}/zip`;
});

function transferFileUrl(file) {
    if (result.value?.type !== "transfer") return "";
    return `${FILES_API}/transfer/${encodeURIComponent(result.value.code)}/file/${encodeURIComponent(file.id)}`;
}

function reset() {
    result.value = null;
    busyFile.value = "";
    downloadingSingle.value = false;
    error.value = null;
    value.value = "";
    passwordNeeded.value = false;
    password.value = "";
    passwordError.value = "";
    kdfParams.value = null;
    keyMix.value = null;
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
