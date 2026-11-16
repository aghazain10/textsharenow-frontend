<template>
    <section class="relative isolate overflow-hidden px-4 pb-20 pt-14 sm:pt-20">
        <div class="hero-grid absolute inset-0 -z-10" aria-hidden="true" />
        <div class="mx-auto max-w-lg text-center">
            <p class="text-[13px] font-medium uppercase tracking-[0.14em] text-muted">TextShareNow request</p>
            <h1 class="mt-3 text-[clamp(1.6rem,5vw,2.4rem)] font-bold leading-[1.15] tracking-[-0.03em]">{{ heading }}</h1>
            <p class="mt-3 text-[16px] leading-relaxed text-muted">{{ subline }}</p>
        </div>

        <div v-if="status === 'loading'" class="mx-auto mt-12 max-w-lg">
            <div class="rounded-xl border border-line p-10 text-center text-muted">Loading…</div>
        </div>
        <div v-if="status === 'manage'" class="mx-auto mt-10 max-w-2xl">
            <div class="tile">
                <div class="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h2 class="text-[20px] font-semibold tracking-[-0.02em] text-ink">Your private inbox</h2>
                        <p class="mt-1 text-[13px] text-muted">
                            <template v-if="inboxMeta.label">“{{ inboxMeta.label }}” · </template>
                            {{ inboxMeta.left }} of {{ inboxMeta.max }} submissions left · {{ reqExpiryText }}
                        </p>
                    </div>
                    <button type="button" class="btn-ghost shrink-0 !text-bad" :disabled="burning" @click="burn">{{ burning ? "Burning…" : "Burn link now" }}</button>
                </div>
                <p v-if="!inbox.length" class="mt-6 text-center text-[14px] text-muted">Nothing yet — share the send link and this page fills itself.</p>
                <ul v-else class="mt-4 grid gap-2">
                    <li v-for="sub in inbox" :key="sub.index" class="rounded-md border border-line bg-bg px-3 py-2.5">
                        <div v-if="sub.kind === 'text'" class="flex items-start justify-between gap-3">
                            <p class="whitespace-pre-wrap break-words text-[14px] leading-6 text-ink">{{ sub.text }}</p>
                            <button type="button" class="btn-icon shrink-0 text-muted hover:!text-bad" aria-label="Delete this submission" @click="deleteSubmission(sub.index)"><TsnIcon name="x" class="h-4 w-4" stroke="2" /></button>
                        </div>
                        <div v-else-if="sub.kind === 'file'" class="flex flex-wrap items-center justify-between gap-3">
                            <p class="text-[14px] text-ink"><TsnIcon name="file" class="mr-1.5 inline h-4 w-4 align-[-3px]" stroke="1.8" />File · {{ formatBytes(sub.bytes) }}</p>
                            <div class="flex items-center gap-2">
                                <NuxtLink :to="`/r?tcode=${encodeURIComponent(sub.code)}`" class="btn-ghost !h-8 !px-3 !text-[12px]">Download</NuxtLink>
                                <button type="button" class="btn-icon text-muted hover:!text-bad" aria-label="Remove file entry" @click="deleteSubmission(sub.index)"><TsnIcon name="x" class="h-4 w-4" stroke="2" /></button>
                            </div>
                        </div>
                    </li>
                </ul>
                <p v-if="manageError" class="mt-4 flex items-center gap-2 text-[13px] text-bad" role="alert"><TsnIcon name="alert" class="h-4 w-4 shrink-0" stroke="1.8" />{{ manageError }}</p>
            </div>
            <p class="mt-4 text-center text-[13px] text-muted">Only this private link can see these messages — not even an account.</p>
        </div>
        <div v-else-if="status === 'burned'" class="mx-auto mt-12 max-w-lg">
            <div class="rounded-xl border border-line p-10 text-center">
                <TsnIcon name="trash" class="mx-auto h-8 w-8 text-muted" stroke="1.6" />
                <p class="mt-3 text-[17px] font-semibold text-ink">Link burned</p>
                <p class="mt-1 text-[15px] text-muted">Anyone holding this link now gets a dead page. Everything received was wiped with it.</p>
            </div>
        </div>
        <div v-else-if="status === 'gone'" class="mx-auto mt-12 max-w-lg">
            <div class="rounded-xl border border-line p-10 text-center">
                <TsnIcon name="trash" class="mx-auto h-8 w-8 text-muted" stroke="1.6" />
                <p class="mt-3 text-[17px] font-semibold text-ink">This link is dead</p>
                <p class="mt-1 text-[15px] text-muted">It doesn't exist, completed, or expired. Ask the requester to send a fresh one.</p>
            </div>
        </div>
        <div v-else-if="status === 'complete'" class="mx-auto mt-12 max-w-lg">
            <div class="rounded-xl border border-line p-10 text-center">
                <TsnIcon name="check" class="mx-auto h-8 w-8 text-ok" stroke="2" />
                <p class="mt-3 text-[17px] font-semibold text-ink">Everything's been received</p>
                <p class="mt-1 text-[15px] text-muted">This request already got its submissions. You can close this tab.</p>
            </div>
        </div>
        <div v-else-if="status === 'sent'" class="mx-auto mt-12 max-w-lg">
            <div class="rounded-xl border border-line p-10 text-center">
                <TsnIcon name="check" class="mx-auto h-8 w-8 text-ok" stroke="2" />
                <p class="mt-3 text-[17px] font-semibold text-ink">Sent</p>
                <p class="mt-1 text-[15px] text-muted">They'll be notified. You can close this tab — nothing else to do.</p>
                <NuxtLink to="/" class="btn-ghost mt-6">What is TextShareNow?</NuxtLink>
            </div>
        </div>
        <div v-else class="mx-auto mt-10 max-w-lg">
            <div class="rounded-xl border border-line bg-surface p-5 shadow-card sm:p-6">
                <label class="block text-[13px] font-medium text-muted" for="req-text">Type something — or drop a file below</label>
                <textarea
                    id="req-text"
                    v-model="text"
                    rows="5"
                    :maxlength="5000"
                    placeholder="Paste a password, a note, a link, an answer…"
                    class="mt-2 block w-full resize-none rounded-lg border border-line bg-bg px-4 py-3 text-[16px] leading-relaxed text-ink placeholder:text-muted/60 !outline-none focus:!outline-none"
                    :disabled="sending || uploading"
                />
                <div class="mt-4 flex items-center justify-between gap-3 text-[13px] text-muted">
                    <span class="tabular-nums">{{ text.length }} / 5,000</span>
                    <button
                        type="button"
                        class="btn-primary"
                        :disabled="!text.trim() || sending || uploading"
                        @click="sendText"
                    >
                        {{ sending ? "Sending…" : "Send text" }}
                    </button>
                </div>

                <template v-if="files">
                    <div class="my-5 flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.12em] text-muted">
                        <span class="h-px flex-1 bg-line" aria-hidden="true" /> or send a file <span class="h-px flex-1 bg-line" aria-hidden="true" />
                    </div>
                    <div v-if="!chosen" class="grid place-items-center rounded-lg border border-dashed border-line px-4 py-6 text-center transition-colors hover:border-ink">
                        <input ref="fileInput" type="file" class="sr-only" aria-label="Choose a file" @change="onPick" />
                        <button type="button" class="btn-ghost" :disabled="uploading" @click="fileInput?.click()">
                            <TsnIcon name="upload" class="h-[18px] w-[18px]" stroke="1.9" />Choose a file
                        </button>
                        <p class="mt-2 text-[12px] text-muted">Up to {{ maxLabel }}. Files are scanned and deleted after one download.</p>
                    </div>
                    <div v-else class="rounded-lg border border-line p-3">
                        <div class="flex items-center gap-3">
                            <TsnIcon name="file" class="h-6 w-6 shrink-0 text-ink" stroke="1.6" />
                            <div class="min-w-0 flex-1">
                                <p class="truncate text-[14px] font-medium">{{ chosen.name }}</p>
                                <p class="text-[12px] text-muted">{{ size(chosen.size) }}</p>
                            </div>
                            <button type="button" class="btn-icon" aria-label="Remove file" :disabled="uploading" @click="chosen = null"><TsnIcon name="x" class="h-4 w-4" stroke="2.2" /></button>
                        </div>
                        <p v-if="fileError" class="mt-2 text-[13px] text-bad" role="alert">{{ fileError }}</p>
                        <div class="mt-3 flex items-center justify-end">
                            <button type="button" class="btn-primary" :disabled="uploading" @click="sendFile">
                                {{ uploading ? `Uploading… ${progress}%` : "Send file" }}
                            </button>
                        </div>
                    </div>
                </template>
                <p v-if="error" class="mt-4 flex items-center gap-2 rounded-md border border-bad/30 bg-bad-soft px-3 py-2 text-[13px] text-bad" role="alert">
                    <TsnIcon name="alert" class="h-4 w-4 shrink-0" stroke="1.8" />{{ error }}
                </p>
            </div>
            <p class="mt-4 text-center text-[13px] text-muted">The requester only sees what you send. This link works once.</p>
        </div>
    </section>
</template>

<script setup>
useSeo({
    title: "Reply to a request — TextShareNow",
    description: "Send text or a file to whoever shared this request link. One submission, no account needed.",
    pagePath: "/request/[code]",
});
useHead({ meta: [{ name: "robots", content: "noindex, nofollow" }] });

const route = useRoute();
const config = useRuntimeConfig();
const FILES_API_URL = config.public.FILES_API_URL;
const code = String(route.params.code || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5);

const status = ref("loading"); // loading | ready | complete | gone | sent | manage | burned
const label = ref("");
const files = ref(false);
const maxBytes = ref(25 * 1024 * 1024);
const left = ref(0);
const text = ref("");
const chosen = ref(null);
const fileError = ref("");
const error = ref("");
const sending = ref(false);
const uploading = ref(false);
const progress = ref(0);
const fileInput = ref(null);

// ── Private manage mode (fragment #m=<token> or localStorage) ───────────────
const managerToken = ref("");
const inbox = ref([]);
const inboxMeta = ref({ left: 0, max: 0, expiresAt: 0, label: "" });
const manageError = ref("");
const burning = ref(false);

function readManageToken() {
    try {
        const h = window.location.hash || "";
        const m = /[#&]m=([A-Za-z0-9_-]{16,80})/.exec(h);
        if (m) return m[1];
        return localStorage.getItem(`tsn-request-${code}`) || "";
    } catch {
        return "";
    }
}

const reqExpiryText = computed(() => {
    const exp = Number(inboxMeta.value.expiresAt) || 0;
    const ms = exp * 1000 - Date.now();
    if (ms <= 0) return "expired";
    const days = Math.floor(ms / 86400000);
    const hours = Math.floor((ms % 86400000) / 3600000);
    if (days) return `expires in ${days}d ${hours}h`;
    if (hours) return `expires in ${hours}h`;
    return "expires within the hour";
});

const formatBytes = (b) => (b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`);

async function loadInbox() {
    try {
        const res = await $fetch(`/api/request/${encodeURIComponent(code)}/inbox`, {
            method: "POST",
            body: { token: managerToken.value },
        });
        inboxMeta.value = { left: Number(res.left) || 0, max: Number(res.max) || 0, expiresAt: Number(res.expiresAt) || 0, label: res.label || "" };
        inbox.value = res.submissions || [];
        status.value = "manage";
    } catch {
        status.value = "gone";
    }
}

async function deleteSubmission(index) {
    manageError.value = "";
    try {
        await $fetch(`/api/request/${encodeURIComponent(code)}/submissions/${index}`, {
            method: "DELETE",
            body: { token: managerToken.value },
        });
        inbox.value = inbox.value.filter((s) => s.index !== index);
        if (inboxMeta.value.left > 0 || inbox.value.length === 0) {
            inboxMeta.value.left = inboxMeta.value.max - inbox.value.length;
        }
    } catch (e) {
        manageError.value = "Couldn't delete that one. Try again.";
    }
}

async function burn() {
    if (burning.value) return;
    if (!confirm("Burn this link? Anyone holding it gets a dead page and everything received is wiped.")) return;
    burning.value = true;
    manageError.value = "";
    try {
        await $fetch(`/api/request/${encodeURIComponent(code)}/delete`, {
            method: "POST",
            body: { token: managerToken.value },
        });
        try { localStorage.removeItem(`tsn-request-${code}`); } catch {}
        status.value = "burned";
    } catch {
        manageError.value = "Couldn't burn it just now. Try again.";
    } finally {
        burning.value = false;
    }
}

const heading = computed(() => (label.value ? `They asked: “${label.value}”` : "They asked you for something"));
const subline = computed(() =>
    status.value === "complete"
        ? "This request already received everything it needed."
        : status.value === "gone"
            ? "The link may have expired or been deleted."
            : "Type it below — they'll be notified the moment it lands.",
);
const maxLabel = computed(() => (maxBytes.value >= 1048576 ? `${Math.round(maxBytes.value / 1048576)} MB` : "5 MB"));
const size = (b) => (b < 1048576 ? (b / 1024).toFixed(1) + " KB" : (b / 1048576).toFixed(1) + " MB");

onMounted(async () => {
    // Private manage mode: a #m=<token> fragment (or this browser's saved
    // token) opens the creator's inbox instead of the submit form.
    managerToken.value = readManageToken();
    if (managerToken.value) {
        await loadInbox();
        return;
    }
    try {
        const res = await $fetch(`/api/request/${encodeURIComponent(code)}`);
        label.value = res?.label || "";
        files.value = !!res?.files;
        maxBytes.value = Number(res?.maxBytes) || 25 * 1024 * 1024;
        left.value = Number(res?.left) || 0;
        status.value = res?.complete ? "complete" : "ready";
    } catch {
        status.value = "gone";
    }
});

async function sendText() {
    if (!text.value.trim() || sending.value) return;
    sending.value = true;
    error.value = "";
    try {
        await $fetch(`/api/request/${encodeURIComponent(code)}/submit`, {
            method: "POST",
            body: { text: text.value.trim() },
        });
        status.value = "sent";
    } catch (e) {
        if (e?.status === 410) {
            status.value = "complete";
        } else {
            error.value = e?.data?.message || "Couldn't send just now. Try again.";
        }
    } finally {
        sending.value = false;
    }
}

function onPick(e) {
    const f = e?.target?.files?.[0];
    if (!f) return;
    fileError.value = "";
    if (f.size > maxBytes.value) {
        fileError.value = `That's over ${maxLabel.value} — ask the requester for a bigger limit, or paste a link instead.`;
        chosen.value = null;
        return;
    }
    const ext = (f.name.split(".").pop() || "").toLowerCase();
    if (["exe", "msi", "bat", "apk", "app", "dmg", "com", "scr", "ps1"].includes(ext)) {
        fileError.value = "Executable files aren't allowed — send a document, image or archive instead.";
        chosen.value = null;
        return;
    }
    chosen.value = f;
}

async function sendFile() {
    if (!chosen.value || uploading.value) return;
    uploading.value = true;
    fileError.value = "";
    progress.value = 0;
    try {
        const mint = await $fetch(`/api/request/${encodeURIComponent(code)}/mint`, { method: "POST" });
        const form = new FormData();
        form.append("ticket", mint.ticket);
        form.append("expires", String(mint.ttl));
        const manifest = [{ name: chosen.value.name, type: chosen.value.type || "application/octet-stream", size: chosen.value.size, path: chosen.value.name }];
        form.append("manifest", JSON.stringify(manifest));
        form.append("files", chosen.value, chosen.value.name);
        await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", (e) => { if (e.lengthComputable) progress.value = Math.round((e.loaded / e.total) * 100); });
            xhr.addEventListener("load", () => {
                if (xhr.status >= 200 && xhr.status < 300) resolve();
                else {
                    let data = null;
                    try { data = JSON.parse(xhr.responseText); } catch {}
                    reject(new Error(data?.error || data?.message || "Upload failed. Try again."));
                }
            });
            xhr.addEventListener("error", () => reject(new Error("Upload failed. Check your connection.")));
            xhr.open("POST", `${FILES_API_URL}/transfer`);
            xhr.send(form);
        });
        status.value = "sent";
    } catch (e) {
        fileError.value = e?.message || "Upload failed. Try again — or paste a link as text instead.";
    } finally {
        uploading.value = false;
    }
}
</script>
