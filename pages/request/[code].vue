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

const status = ref("loading"); // loading | ready | complete | gone | sent
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
