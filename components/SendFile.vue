<template>
    <div>
        <div v-if="!code">
            <label
                for="file-input"
                class="drop flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-line px-6 py-12 text-center transition-colors"
                :class="{ 'is-over': dragging }"
                @dragenter.prevent="dragging = true"
                @dragover.prevent="dragging = true"
                @dragleave.prevent="dragging = false"
                @drop.prevent="onDrop"
            >
                <span class="grid h-12 w-12 place-items-center rounded-lg border border-line bg-bg text-ink shadow-card">
                    <TsnIcon name="upload" class="h-7 w-7" />
                </span>
                <span class="mt-4 text-[17px] font-semibold tracking-[-0.01em]">Drop a file here, or <span class="underline underline-offset-4">browse</span></span>
                <span class="mt-1 text-[14px] text-muted">{{ dropHint }}</span>
                <span class="mt-3 inline-flex flex-wrap items-center justify-center gap-1.5 text-[12px] font-medium">
                    <span class="rounded-md border border-line bg-bg px-2 py-0.5">1 file at a time</span>
                    <span class="rounded-md border border-line bg-bg px-2 py-0.5">Up to {{ maxSizeLabel }}</span>
                    <span class="rounded-md border border-line bg-bg px-2 py-0.5">{{ typeLabel }}</span>
                    <button
                        v-if="!isPro"
                        type="button"
                        class="inline-flex cursor-pointer items-center gap-1 rounded-md border border-line bg-bg px-2 py-0.5 text-muted transition-colors hover:text-ink"
                        title="Go Pro for files up to 100 MB (executables stay blocked)"
                        @click="openProModal('file')"
                    >
                        <TsnIcon name="lock" class="h-3 w-3" stroke="2.2" />
                        100 MB files with Pro
                    </button>
                </span>
                <span class="mt-3 hidden text-[12px] text-muted sm:block">Tip: you can also paste a screenshot anywhere on this page</span>
                <input id="file-input" ref="input" type="file" class="sr-only" :accept="accept" @change="onPick" />
            </label>

            <ul v-if="file" class="mt-3 grid gap-2" aria-label="Selected file">
                <li class="flex items-center gap-3 rounded-lg border border-line px-3 py-2.5">
                    <span class="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-surface-2 text-ink"><TsnIcon name="file" class="h-5 w-5" stroke="1.9" /></span>
                    <span class="min-w-0 flex-1">
                        <span class="block truncate text-[15px] font-medium">{{ file.name }}</span>
                        <span class="text-[13px] text-muted">{{ size(file.size) }}</span>
                    </span>
                    <button type="button" class="btn-icon" :aria-label="`Remove ${file.name}`" @click="clear"><TsnIcon name="x" class="h-4 w-4" stroke="2.2" /></button>
                </li>
            </ul>

            <div v-if="uploading" class="mt-3 rounded-lg border border-line p-4">
                <div class="flex justify-between text-[13px] font-medium"><span>Uploading</span><span class="tabular-nums text-muted">{{ progress }}%</span></div>
                <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
                    <div class="h-full origin-left rounded-full bg-brand transition-transform" :style="{ transform: `scaleX(${progress / 100})` }" />
                </div>
            </div>

            <p v-if="error" class="mt-3 flex items-center gap-2 text-[14px] text-bad" role="alert">
                <TsnIcon name="alert" class="h-4 w-4 shrink-0" />{{ error }}
            </p>

            <div class="mt-3 rounded-lg border border-line px-4 py-2.5 lg:hidden">
                <ExpirySelect v-model="expires" :options="FILE_EXPIRY_OPTIONS" />
            </div>

            <div class="mt-3 flex flex-wrap items-center gap-3 pl-2">
                <p class="text-[13px] text-muted lg:hidden">Deleted after one download, or after {{ expiryLabel(expires) }}.</p>
                <div class="hidden items-center gap-3 lg:flex">
                    <p class="text-[13px] text-muted">Deleted after one download.</p>
                    <ExpirySelect v-model="expires" :options="FILE_EXPIRY_OPTIONS" />
                </div>
                <button type="button" class="btn-primary ml-auto" :disabled="!file || uploading" @click="upload">
                    {{ uploading ? "Uploading…" : "Generate code" }}
                </button>
            </div>
        </div>

        <CodeResult v-else :code="code" :ttl="resultTtl" :qr-url="qrUrl" @reset="reset" />
    </div>
</template>

<script setup>
import { DEFAULT_EXPIRY, FILE_EXPIRY_OPTIONS, expiryLabel } from "~/utils/expiry.js";
import { FREE_MAX_FILE, PRO_MAX_FILE, FREE_FILE_ACCEPT, FREE_FILE_LABEL, PRO_FILE_LABEL } from "~/utils/premium.js";
import { isBlockedFile } from "~/utils/filePolicy.js";

const config = useRuntimeConfig();
const API_URL = config.public.FILES_API_URL;
const { isPro } = usePremium();
const { open: openProModal } = useProModal();

const input = ref(null);
const file = ref(null);
const dragging = ref(false);
const uploading = ref(false);
const progress = ref(0);
const code = ref("");
const qrUrl = ref("");
const error = ref("");
const expires = ref(DEFAULT_EXPIRY); // seconds
const resultTtl = ref(DEFAULT_EXPIRY); // server-confirmed TTL for the countdown

const maxSize = computed(() => (isPro.value ? PRO_MAX_FILE : FREE_MAX_FILE));
const maxSizeLabel = computed(() => (isPro.value ? "100 MB" : "10 MB"));
const accept = computed(() => (isPro.value ? "" : FREE_FILE_ACCEPT));
const typeLabel = computed(() => (isPro.value ? PRO_FILE_LABEL : FREE_FILE_LABEL));
const dropHint = computed(() =>
    isPro.value
        ? "Any non-executable file, up to 100 MB, in original quality"
        : "Screenshots, photos and short videos, in original quality"
);

// Turning Pro off resets a premium-only expiry choice
watch(isPro, (pro) => {
    if (!pro && ![600, 1800, 3600].includes(expires.value)) {
        expires.value = DEFAULT_EXPIRY;
    }
});

const size = (b) => (b < 1024 ? b + " B" : b < 1048576 ? (b / 1024).toFixed(1) + " KB" : (b / 1048576).toFixed(1) + " MB");

function take(f) {
    error.value = "";
    if (!f) return;
    // SVGs are blocked on every tier — they can carry scripts and file
    // shares are served from the files domain.
    if (f.type === "image/svg+xml" || /\.svg$/i.test(f.name)) {
        error.value = "SVG files aren't supported because they can carry scripts. Convert to PNG and try again.";
        return;
    }
    // Executables and installers are blocked on every plan, including Pro.
    if (isBlockedFile(f.name, f.type)) {
        error.value = "Executable files and installers (.exe, .msi, .bat, .apk and similar) aren't supported on any plan. Zip the file or share it another way.";
        return;
    }
    // Free tier only accepts the whitelisted image/video types
    if (!isPro.value && !FREE_FILE_ACCEPT.split(",").includes(f.type)) {
        error.value = `This file type isn't supported on free. Use ${FREE_FILE_LABEL} — or go Pro for any non-executable type.`;
        openProModal("file");
        return;
    }
    if (f.size > maxSize.value) {
        error.value = `This file is ${size(f.size)}. The free limit is ${maxSizeLabel.value} — Pro goes up to 100 MB.`;
        openProModal("file");
        return;
    }
    file.value = f;
}
const onPick = (e) => take(e.target.files?.[0]);
function onDrop(e) {
    dragging.value = false;
    take(e.dataTransfer.files?.[0]);
}
defineExpose({ take: (f) => { if (!code.value && !uploading.value) take(f); } });

function clear() {
    file.value = null;
    error.value = "";
    if (input.value) input.value.value = "";
}

async function upload() {
    if (!file.value || uploading.value) return;
    uploading.value = true;
    error.value = "";
    progress.value = 0;
    try {
        const form = new FormData();
        form.append("file", file.value);
        form.append("expires", String(expires.value));
        // Pro uploads need a single-use ticket minted by our API; the files
        // service redeems it to authorize the larger size / longer TTL.
        if (isPro.value) {
            const t = await $fetch(`${config.public.API_BASE}/api/pro/upload-ticket`, {
                method: "POST",
                body: {
                    expires: expires.value,
                    size: file.value.size,
                    name: file.value.name,
                    type: file.value.type,
                },
            });
            form.append("ticket", t.ticket);
        }
        const result = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", (e) => {
                if (e.lengthComputable) progress.value = Math.round((e.loaded / e.total) * 100);
            });
            xhr.addEventListener("load", () => {
                try {
                    const data = JSON.parse(xhr.responseText);
                    xhr.status >= 200 && xhr.status < 300 ? resolve(data) : reject(new Error(data.message || data.error || "Upload failed. Please try again."));
                } catch {
                    reject(new Error("Upload failed. Please try again."));
                }
            });
            xhr.addEventListener("error", () => reject(new Error("Upload failed. Check your connection and try again.")));
            xhr.open("POST", `${API_URL}/upload`);
            xhr.send(form);
        });
        resultTtl.value = Number(result.expires_in) || expires.value;
        code.value = result.code;
        qrUrl.value = `${window.location.origin}/r?fcode=${result.code}`;
        // Record the file share in the aggregate counter (best-effort).
        $fetch(`${config.public.API_BASE}/api/file-share`, { method: "POST" }).catch(() => {});
    } catch (e) {
        error.value = e?.data?.message || e?.message || "Upload failed. Please try again.";
    } finally {
        uploading.value = false;
    }
}

function reset() {
    clear();
    code.value = "";
    qrUrl.value = "";
    progress.value = 0;
    resultTtl.value = expires.value;
}
</script>
