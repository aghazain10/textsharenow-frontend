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
                <span class="mt-4 text-[17px] font-semibold tracking-[-0.01em]">Drop files here, or <span class="underline underline-offset-4">browse</span></span>
                <span class="mt-1 text-[14px] text-muted">Screenshots, photos and short videos, in original quality</span>
                <span class="mt-1 text-[13px] text-muted">PNG, JPEG, WebP, MP4 or WebM, up to 10 MB</span>
                <input id="file-input" ref="input" type="file" class="sr-only" :accept="ACCEPT" @change="onPick" />
            </label>

            <ul v-if="file" class="mt-3 grid gap-2" aria-label="Selected files">
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

            <div class="mt-3 flex flex-wrap items-center justify-between gap-3 pl-2">
                <p class="text-[13px] text-muted">Deleted after one download, or after 15 minutes.</p>
                <button type="button" class="btn-primary" :disabled="!file || uploading" @click="upload">
                    {{ uploading ? "Uploading…" : "Generate code" }}
                </button>
            </div>
        </div>

        <CodeResult v-else :code="code" :ttl="900" :qr-url="qrUrl" @reset="reset" />
    </div>
</template>

<script setup>
const config = useRuntimeConfig();
const API_URL = config.public.FILES_API_URL;

const ACCEPT = "image/png,image/jpeg,image/webp,video/mp4,video/webm";
const MAX_SIZE = 10 * 1024 * 1024;

const input = ref(null);
const file = ref(null);
const dragging = ref(false);
const uploading = ref(false);
const progress = ref(0);
const code = ref("");
const qrUrl = ref("");
const error = ref("");

const size = (b) => (b < 1024 ? b + " B" : b < 1048576 ? (b / 1024).toFixed(1) + " KB" : (b / 1048576).toFixed(1) + " MB");

function take(f) {
    error.value = "";
    if (!f) return;
    if (!ACCEPT.split(",").includes(f.type)) {
        error.value = "This file type isn't supported. Use PNG, JPEG, WebP, MP4 or WebM.";
        return;
    }
    if (f.size > MAX_SIZE) {
        error.value = `This file is ${size(f.size)}. The limit is 10 MB.`;
        return;
    }
    file.value = f;
}
const onPick = (e) => take(e.target.files?.[0]);
function onDrop(e) {
    dragging.value = false;
    take(e.dataTransfer.files?.[0]);
}
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
        const result = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", (e) => {
                if (e.lengthComputable) progress.value = Math.round((e.loaded / e.total) * 100);
            });
            xhr.addEventListener("load", () => {
                try {
                    const data = JSON.parse(xhr.responseText);
                    xhr.status >= 200 && xhr.status < 300 ? resolve(data.code) : reject(new Error(data.message || "Upload failed. Please try again."));
                } catch {
                    reject(new Error("Upload failed. Please try again."));
                }
            });
            xhr.addEventListener("error", () => reject(new Error("Upload failed. Check your connection and try again.")));
            xhr.open("POST", `${API_URL}/upload`);
            xhr.send(form);
        });
        code.value = result;
        qrUrl.value = `${window.location.origin}/?fcode=${result}`;
    } catch (e) {
        error.value = e?.message || "Upload failed. Please try again.";
    } finally {
        uploading.value = false;
    }
}

function reset() {
    clear();
    code.value = "";
    qrUrl.value = "";
    progress.value = 0;
}
</script>
