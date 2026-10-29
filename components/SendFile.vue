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
                <span class="mt-4 text-[17px] font-semibold tracking-[-0.01em]">
                    Drop {{ isPro ? "files" : "a file" }} here, or <span class="underline underline-offset-4">browse</span>
                </span>
                <span class="mt-1 text-[14px] text-muted">{{ dropHint }}</span>
                <span class="mt-3 inline-flex flex-wrap items-center justify-center gap-1.5 text-[12px] font-medium">
                    <span class="rounded-md border border-line bg-bg px-2 py-0.5">{{ isPro ? `Up to ${PRO_MAX_FILES} files` : "1 file at a time" }}</span>
                    <span class="rounded-md border border-line bg-bg px-2 py-0.5">{{ isPro ? "100 MB total" : `Up to ${maxSizeLabel}` }}</span>
                    <span class="rounded-md border border-line bg-bg px-2 py-0.5">{{ typeLabel }}</span>
                    <button
                        v-if="!isPro"
                        type="button"
                        class="inline-flex cursor-pointer items-center gap-1 rounded-md border border-line bg-bg px-2 py-0.5 text-muted transition-colors hover:text-ink"
                        title="Go Pro for up to 20 files and 100 MB total (executables stay blocked)"
                        @click="openProModal('file')"
                    >
                        <TsnIcon name="lock" class="h-3 w-3" stroke="2.2" />
                        Up to 20 files with Pro
                    </button>
                </span>
                <span class="mt-3 hidden text-[12px] text-muted sm:block">Tip: you can also paste a screenshot anywhere on this page</span>
                <input id="file-input" ref="input" type="file" class="sr-only" :accept="accept" :multiple="isPro" @change="onPick" />
            </label>

            <div v-if="isPro" class="mt-3 flex flex-wrap items-center gap-3">
                <button type="button" class="btn-ghost !h-9 !px-3 !text-[13px]" @click="pickFolder">
                    <TsnIcon name="folder" class="h-4 w-4" stroke="1.8" />Choose a folder
                </button>
                <span class="text-[12px] text-muted">{{ encryptFiles ? "Folder paths stay visible; encrypted files download one at a time." : "Folder paths are kept in the download." }}</span>
                <input ref="folderInput" type="file" class="sr-only" webkitdirectory directory multiple @change="onFolderPick" />
            </div>

            <template v-if="items.length">
                <div class="mt-3 flex items-center justify-between gap-3 text-[13px]">
                    <span class="font-medium text-ink">{{ items.length }} file{{ items.length === 1 ? "" : "s" }}</span>
                    <span class="text-muted">{{ size(totalBytes) }} total</span>
                </div>
                <ul class="mt-2 grid max-h-64 gap-2 overflow-y-auto pr-1" aria-label="Selected files">
                    <li v-for="item in items" :key="item.id" class="flex items-center gap-3 rounded-lg border border-line px-3 py-2.5">
                        <span class="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-surface-2 text-ink"><TsnIcon name="file" class="h-5 w-5" stroke="1.9" /></span>
                        <span class="min-w-0 flex-1">
                            <span class="block truncate text-[15px] font-medium">{{ item.file.name }}</span>
                            <span class="block truncate text-[13px] text-muted">{{ item.path !== item.file.name ? `${item.path} · ${size(item.file.size)}` : size(item.file.size) }}</span>
                        </span>
                        <button type="button" class="btn-icon" :aria-label="`Remove ${item.path}`" @click="removeItem(item.id)"><TsnIcon name="x" class="h-4 w-4" stroke="2.2" /></button>
                    </li>
                </ul>
            </template>

            <p v-if="encryptFiles && items.length" class="mt-3 flex items-start gap-1.5 text-[12px] text-muted">
                <TsnIcon name="lock" class="mt-0.5 h-3.5 w-3.5 shrink-0" stroke="1.8" />
                <span>
                    Contents are encrypted in your browser. File names and sizes stay visible, and encrypted files are
                    <strong class="font-medium text-ink">not virus-scanned</strong> — share only with people you trust.
                    Recipients must open the full link, not the 5-character code.
                </span>
            </p>

            <div v-if="uploading" class="mt-3 rounded-lg border border-line p-4">
                <div class="flex justify-between text-[13px] font-medium"><span>{{ phase === "encrypting" ? "Encrypting files" : isTransferSelection ? "Uploading files" : "Uploading" }}</span><span class="tabular-nums text-muted">{{ progress }}%</span></div>
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
                <p class="text-[13px] text-muted lg:hidden">{{ isTransferSelection ? "Each file is deleted after its first download" : "Deleted after one download" }}, or after {{ expiryLabel(expires) }}.</p>
                <div class="hidden items-center gap-3 lg:flex">
                    <p class="text-[13px] text-muted">{{ isTransferSelection ? "Each file is deleted after its first download." : "Deleted after one download." }}</p>
                    <ExpirySelect v-model="expires" :options="FILE_EXPIRY_OPTIONS" />
                </div>
                <div class="ml-auto flex flex-wrap items-center justify-end gap-2.5">
                    <button
                        type="button"
                        role="switch"
                        :aria-checked="encryptFiles"
                        :disabled="uploading"
                        title="Encrypt file contents in your browser. Recipients must open the full link; encrypted files cannot be virus-scanned."
                        class="inline-flex items-center gap-2 rounded-md border border-line px-2.5 py-1.5 text-[13px] font-medium text-muted transition-colors hover:text-ink disabled:opacity-60"
                        @click="encryptFiles = !encryptFiles"
                    >
                        <span
                            class="relative inline-block h-4 w-7 shrink-0 rounded-full transition-colors"
                            :class="encryptFiles ? 'bg-ink' : 'bg-line'"
                            aria-hidden="true"
                        >
                            <span
                                class="absolute left-[2px] top-[2px] h-3 w-3 rounded-full transition-transform"
                                :class="encryptFiles ? 'translate-x-[14px] bg-bg' : 'translate-x-0 bg-muted'"
                            />
                        </span>
                        <span :class="encryptFiles ? 'text-ink' : ''">Encrypt files</span>
                    </button>
                    <button type="button" class="btn-primary" :disabled="!items.length || uploading" @click="upload">
                        {{ uploading ? (phase === "encrypting" ? "Encrypting…" : "Uploading…") : (encryptFiles ? "Encrypt & share" : "Generate code") }}
                    </button>
                </div>
            </div>
        </div>

        <CodeResult
            v-else
            :code="code"
            :ttl="resultTtl"
            :qr-url="qrUrl"
            :kind="resultKind"
            :file-count="resultCount"
            :encrypted="resultEncrypted"
            @reset="reset"
        />
    </div>
</template>

<script setup>
import { DEFAULT_EXPIRY, FILE_EXPIRY_OPTIONS, expiryLabel } from "~/utils/expiry.js";
import {
    FREE_MAX_FILE,
    PRO_MAX_FILE,
    PRO_MAX_FILES,
    PRO_MAX_TRANSFER,
    FREE_FILE_ACCEPT,
    FREE_FILE_LABEL,
    PRO_FILE_LABEL,
} from "~/utils/premium.js";
import { isBlockedFile, normalizeTransferPath } from "~/utils/filePolicy.js";
import { encryptFile } from "~/utils/fileE2e.js";
import { generateShareKey } from "~/utils/e2e.js";

const config = useRuntimeConfig();
const API_URL = config.public.FILES_API_URL;
const { isPro } = usePremium();
const { open: openProModal } = useProModal();

const input = ref(null);
const folderInput = ref(null);
const items = ref([]);
const dragging = ref(false);
const uploading = ref(false);
const progress = ref(0);
const code = ref("");
const qrUrl = ref("");
const error = ref("");
const expires = ref(DEFAULT_EXPIRY);
const resultTtl = ref(DEFAULT_EXPIRY);
const resultKind = ref("file");
const resultCount = ref(1);
const resultEncrypted = ref(false);
const encryptFiles = ref(false);
const phase = ref("");
let itemSeq = 0;

const maxSize = computed(() => (isPro.value ? PRO_MAX_FILE : FREE_MAX_FILE));
const maxTotal = computed(() => (isPro.value ? PRO_MAX_TRANSFER : FREE_MAX_FILE));
const maxFiles = computed(() => (isPro.value ? PRO_MAX_FILES : 1));
const totalBytes = computed(() => items.value.reduce((sum, item) => sum + item.file.size, 0));
const maxSizeLabel = computed(() => (isPro.value ? "100 MB" : "10 MB"));
const accept = computed(() => (isPro.value ? "" : FREE_FILE_ACCEPT));
const typeLabel = computed(() => (isPro.value ? PRO_FILE_LABEL : FREE_FILE_LABEL));
const isTransferSelection = computed(
    () => isPro.value && (items.value.length > 1 || items.value.some((item) => item.path.includes("/"))),
);
const dropHint = computed(() =>
    isPro.value
        ? "Any non-executable files, up to 100 MB total, in original quality"
        : "Screenshots, photos and short videos, in original quality",
);

watch(isPro, (pro) => {
    if (!pro && ![600, 1800, 3600].includes(expires.value)) {
        expires.value = DEFAULT_EXPIRY;
    }
    if (!pro && items.value.length > 1) {
        items.value = items.value.slice(0, 1);
        error.value = "Free shares one file at a time. Go Pro for up to 20 files in one transfer.";
    }
});

const size = (b) => (b < 1024 ? b + " B" : b < 1048576 ? (b / 1024).toFixed(1) + " KB" : (b / 1048576).toFixed(1) + " MB");

function validateFile(f) {
    if (!f.size) return `${f.name} is empty. Empty files can't be shared.`;
    if (f.type === "image/svg+xml" || /\.svg$/i.test(f.name)) {
        return "SVG files aren't supported because they can carry scripts. Convert to PNG and try again.";
    }
    if (isBlockedFile(f.name, f.type)) {
        return "Executable files and installers (.exe, .msi, .bat, .apk and similar) aren't supported on any plan.";
    }
    if (!isPro.value && !FREE_FILE_ACCEPT.split(",").includes(f.type)) {
        return `This file type isn't supported on free. Use ${FREE_FILE_LABEL} — or go Pro for any non-executable type.`;
    }
    if (f.size > maxSize.value) {
        return `${f.name} is ${size(f.size)}. The limit is ${maxSizeLabel.value} per file.`;
    }
    return "";
}

function addFiles(fileList, replace = true) {
    const incoming = Array.from(fileList || []);
    if (!incoming.length) return;
    error.value = "";

    if (!isPro.value && incoming.length > 1) {
        error.value = "Free shares one file at a time. Go Pro to send up to 20 files in one transfer.";
        openProModal("file");
        return;
    }

    const next = replace ? [] : [...items.value];
    const seen = new Set(next.map((item) => item.path.toLowerCase()));
    let total = next.reduce((sum, item) => sum + item.file.size, 0);

    for (const f of incoming) {
        if (next.length >= maxFiles.value) {
            error.value = `You can send up to ${maxFiles.value} files in one transfer.`;
            return;
        }
        const path = normalizeTransferPath(f.webkitRelativePath || f.name, f.name);
        if (!path) {
            error.value = `${f.name} has an unsafe file path. Rename it or choose a different folder.`;
            return;
        }
        const problem = validateFile(f);
        if (problem) {
            error.value = problem;
            if (!isPro.value) openProModal("file");
            return;
        }
        if (seen.has(path.toLowerCase())) {
            error.value = `Two selected files use the same path: ${path}.`;
            return;
        }
        if (total + f.size > maxTotal.value) {
            error.value = `This selection is ${size(total + f.size)}. ${isPro.value ? "Pro transfers are limited to 100 MB total." : "The free limit is 10 MB."} Remove a file and try again.`;
            return;
        }
        next.push({ id: ++itemSeq, file: f, path });
        seen.add(path.toLowerCase());
        total += f.size;
    }

    items.value = next;
}

function onPick(e) {
    addFiles(e.target.files, true);
    e.target.value = "";
}

function onFolderPick(e) {
    addFiles(e.target.files, true);
    e.target.value = "";
}

function onDrop(e) {
    dragging.value = false;
    addFiles(e.dataTransfer.files, true);
}

function pickFolder() {
    if (!isPro.value) {
        openProModal("file");
        return;
    }
    folderInput.value?.click();
}

defineExpose({
    take: (f) => {
        if (!code.value && !uploading.value) addFiles([f], !isPro.value);
    },
});

function removeItem(id) {
    items.value = items.value.filter((item) => item.id !== id);
    error.value = "";
}

function clear() {
    items.value = [];
    error.value = "";
    if (input.value) input.value.value = "";
    if (folderInput.value) folderInput.value.value = "";
}

function sendForm(form, url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) progress.value = Math.round((e.loaded / e.total) * 100);
        });
        xhr.timeout = 5 * 60 * 1000;
        xhr.addEventListener("load", () => {
            let data = null;
            try { data = JSON.parse(xhr.responseText); } catch {}
            if (xhr.status >= 200 && xhr.status < 300 && data) {
                resolve(data);
                return;
            }
            const err = new Error(data?.message || data?.error || "Upload failed. Please try again.");
            err.status = xhr.status;
            reject(err);
        });
        xhr.addEventListener("error", () => reject(new Error("Upload failed. Check your connection and try again.")));
        xhr.addEventListener("timeout", () => reject(new Error("The upload timed out. Check your connection and try again.")));
        xhr.open("POST", url);
        xhr.send(form);
    });
}

async function upload() {
    if (!items.value.length || uploading.value) return;
    uploading.value = true;
    error.value = "";
    progress.value = 0;
    phase.value = "";
    const encrypt = encryptFiles.value;

    try {
        const transfer = isTransferSelection.value;
        const shareKey = encrypt ? generateShareKey() : "";
        const prepared = [];

        if (encrypt) {
            phase.value = "encrypting";
            let done = 0;
            let encryptedTotal = 0;
            for (const item of items.value) {
                let blob;
                try {
                    blob = await encryptFile(item.file, shareKey);
                } catch {
                    error.value = "Couldn't encrypt that file in this browser. Try a smaller file or a different browser.";
                    return;
                }
                // The ticket allows a little ciphertext overhead on top of the
                // normal plaintext caps (64 KB per file, 1 MB per transfer).
                if (blob.size > maxSize.value + 65536 || encryptedTotal + blob.size > maxTotal.value + 1048576) {
                    error.value = "This encrypted selection is slightly over the limit. Remove a file and try again.";
                    return;
                }
                prepared.push({ item, blob, csize: blob.size });
                encryptedTotal += blob.size;
                done += item.file.size;
                progress.value = Math.round((done / Math.max(1, totalBytes.value)) * 100);
            }
            phase.value = "uploading";
            progress.value = 0;
        } else {
            for (const item of items.value) prepared.push({ item, blob: item.file, csize: item.file.size });
        }

        const manifest = prepared.map(({ item, csize }) => ({
            name: item.file.name,
            type: item.file.type || "application/octet-stream",
            size: item.file.size,
            ...(encrypt ? { csize } : {}),
            path: item.path,
        }));

        let result;
        if (transfer) {
            const ticket = await $fetch(`${config.public.API_BASE}/api/pro/transfer-ticket`, {
                method: "POST",
                body: { expires: expires.value, enc: encrypt, files: manifest },
            });

            const form = new FormData();
            form.append("ticket", ticket.ticket);
            form.append("expires", String(expires.value));
            form.append("manifest", JSON.stringify(manifest));
            if (encrypt) form.append("enc", "1");
            for (const file of prepared) form.append("files", file.blob, file.item.file.name);
            result = await sendForm(form, `${API_URL}/transfer`);
        } else {
            const file = prepared[0];
            const form = new FormData();
            form.append("file", file.blob, file.item.file.name);
            form.append("expires", String(expires.value));
            if (encrypt) form.append("enc", "1");

            if (isPro.value) {
                const ticket = await $fetch(`${config.public.API_BASE}/api/pro/upload-ticket`, {
                    method: "POST",
                    body: {
                        expires: expires.value,
                        size: file.csize,
                        name: file.item.file.name,
                        type: file.item.file.type,
                        enc: encrypt,
                    },
                });
                form.append("ticket", ticket.ticket);
            } else if (encrypt) {
                // Free E2E still needs a server-issued ticket so the files
                // service can trust the mode instead of the form field.
                const ticket = await $fetch(`${config.public.API_BASE}/api/e2e-upload-ticket`, {
                    method: "POST",
                    body: {
                        expires: expires.value,
                        size: file.csize,
                        name: file.item.file.name,
                        type: file.item.file.type,
                    },
                });
                form.append("ticket", ticket.ticket);
            }
            result = await sendForm(form, `${API_URL}/upload`);
        }

        const count = transfer ? Number(result.count) || items.value.length : 1;
        resultTtl.value = Number(result.expires_in) || expires.value;
        resultKind.value = transfer ? "transfer" : "file";
        resultCount.value = count;
        resultEncrypted.value = !!shareKey;
        code.value = result.code;
        qrUrl.value = `${window.location.origin}/r?${transfer ? "tcode" : "fcode"}=${result.code}${shareKey ? `#k=${shareKey}` : ""}`;
        $fetch(`${config.public.API_BASE}/api/file-share`, {
            method: "POST",
            body: { count },
        }).catch(() => {});
    } catch (e) {
        if (e?.status === 404 && isTransferSelection.value) {
            error.value = "Multi-file transfers aren't available just yet. Try again shortly, or send one file for now.";
        } else {
            error.value = e?.data?.message || e?.message || "Upload failed. Please try again.";
        }
    } finally {
        uploading.value = false;
        phase.value = "";
    }
}
function reset() {
    clear();
    code.value = "";
    qrUrl.value = "";
    progress.value = 0;
    resultTtl.value = expires.value;
    resultKind.value = "file";
    resultCount.value = 1;
    resultEncrypted.value = false;
    encryptFiles.value = false;
}
</script>
