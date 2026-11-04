<template>
    <div class="tool-glow rounded-xl border border-line bg-surface p-3 text-left sm:p-5">
        <div v-if="!file">
            <label
                for="exif-input"
                class="drop flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-line px-6 py-12 text-center transition-colors"
                :class="{ 'is-over': dragging }"
                @dragenter.prevent="dragging = true"
                @dragover.prevent="dragging = true"
                @dragleave.prevent="dragging = false"
                @drop.prevent="onDrop"
            >
                <span class="grid h-12 w-12 place-items-center rounded-lg border border-line bg-bg text-ink shadow-card">
                    <TsnIcon name="shield" class="h-7 w-7" stroke="1.8" />
                </span>
                <span class="mt-4 text-[17px] font-semibold tracking-[-0.01em]">
                    Drop a photo here, or <span class="underline underline-offset-4">browse</span>
                </span>
                <span class="mt-1 text-[14px] text-muted">JPEG, PNG, WebP, HEIC — up to {{ maxLabel }}</span>
                <span class="mt-3 inline-flex flex-wrap items-center justify-center gap-1.5 text-[12px] font-medium">
                    <span class="rounded-md border border-line bg-bg px-2 py-0.5">Shows GPS before removing</span>
                    <span class="rounded-md border border-line bg-bg px-2 py-0.5">Lossless on JPEG / PNG / WebP</span>
                    <span class="rounded-md border border-line bg-bg px-2 py-0.5">No upload</span>
                </span>
                <input id="exif-input" ref="input" type="file" class="sr-only" accept="image/*,.heic,.heif" @change="onPick" />
            </label>
            <p v-if="error" class="mt-3 flex items-start gap-2 text-[14px] text-bad" role="alert">
                <TsnIcon name="alert" class="mt-0.5 h-4 w-4 shrink-0" />{{ error }}
            </p>
        </div>

        <template v-else>
            <div class="flex items-center gap-3 rounded-lg border border-line bg-bg p-3">
                <img v-if="preview && !previewFailed" :src="preview" alt="Photo preview" class="h-16 w-16 shrink-0 rounded-md object-cover" @error="previewFailed = true" />
                <span v-else class="grid h-16 w-16 shrink-0 place-items-center rounded-md bg-surface-2 text-ink">
                    <TsnIcon name="file" class="h-6 w-6" stroke="1.8" />
                </span>
                <div class="min-w-0 flex-1">
                    <p class="truncate text-[15px] font-semibold">{{ file.name }}</p>
                    <p class="mt-0.5 text-[13px] text-muted">{{ formatBytes(file.size) }} · {{ kindLabel }}</p>
                </div>
                <button type="button" class="btn-icon" aria-label="Choose a different photo" @click="reset">
                    <TsnIcon name="x" class="h-4 w-4" stroke="2.2" />
                </button>
            </div>

            <p v-if="busy === 'reading'" class="mt-3 flex items-center gap-2 text-[13px] text-muted" role="status">
                <span class="live-dot" aria-hidden="true" />Reading metadata…
            </p>

            <div v-if="info" class="mt-3">
                <!-- GPS alarm -->
                <div v-if="info.gps" class="rounded-lg border border-bad/40 bg-bad/5 p-3">
                    <p class="flex items-center gap-2 text-[14px] font-semibold text-bad">
                        <TsnIcon name="alert" class="h-4 w-4 shrink-0" stroke="2.2" />This photo contains its GPS location
                    </p>
                    <p class="mt-1 text-[13px] text-muted">
                        {{ info.gps.lat }}, {{ info.gps.lon }}<template v-if="info.gps.altitude !== null"> · {{ info.gps.altitude }} m</template>
                        — anyone who receives the file can read exactly where it was taken.
                    </p>
                </div>

                <div v-if="info.entries.length" class="mt-3 overflow-hidden rounded-lg border border-line">
                    <p class="border-b border-line bg-surface-2 px-3 py-2 text-[13px] font-semibold">
                        Hidden metadata found
                    </p>
                    <dl class="divide-y divide-line text-[13px]">
                        <div v-for="(entry, i) in info.entries" :key="i" class="flex items-start gap-3 px-3 py-2">
                            <dt class="w-28 shrink-0 text-muted">{{ entry.label }}</dt>
                            <dd class="min-w-0 break-words font-medium" :class="{ 'text-bad': entry.sensitive }">{{ entry.value }}</dd>
                        </div>
                    </dl>
                </div>

                <p v-else class="mt-3 rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-[13px] text-muted">
                    <template v-if="info.hasMetadata">
                        Metadata blocks are present, but their contents aren't readable here. Removing them still strips everything.
                    </template>
                    <template v-else>
                        No readable metadata found in this file. Removing it anyway is harmless and guarantees nothing hidden is left behind.
                    </template>
                </p>

                <p v-if="info.orientation" class="mt-3 flex items-start gap-2 text-[12px] text-muted">
                    <TsnIcon name="alert" class="mt-0.5 h-3.5 w-3.5 shrink-0" stroke="1.8" />
                    <span>
                        This photo uses an orientation tag ({{ info.orientation }}). Removing metadata keeps the pixels unchanged, so some viewers
                        may display it rotated. Open the result and check before sharing.
                    </span>
                </p>

                <div class="mt-4 flex flex-wrap items-center gap-3">
                    <button type="button" class="btn-primary" :disabled="!!busy" @click="clean">
                        <TsnIcon name="shield" class="h-[18px] w-[18px]" stroke="1.9" />
                        {{ busy === "cleaning" ? "Removing metadata…" : "Remove metadata" }}
                    </button>
                    <span class="text-[13px] text-muted">The original file is never modified.</span>
                </div>
            </div>

            <p v-if="error" class="mt-3 flex items-start gap-2 text-[14px] text-bad" role="alert">
                <TsnIcon name="alert" class="mt-0.5 h-4 w-4 shrink-0" />{{ error }}
            </p>

            <div v-if="result" class="mt-4 rounded-lg border border-line p-4">
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <p class="text-[15px] font-semibold">Clean photo ready</p>
                    <span class="rounded-full border border-line px-2.5 py-0.5 text-[12px] font-semibold text-ink">
                        {{ result.removed }} field{{ result.removed === 1 ? "" : "s" }} removed
                    </span>
                </div>
                <dl class="mt-3 grid grid-cols-2 gap-2 text-[13px]">
                    <div class="rounded-md bg-surface-2 px-3 py-2">
                        <dt class="text-muted">Before</dt>
                        <dd class="mt-0.5 font-semibold">{{ formatBytes(file.size) }}</dd>
                    </div>
                    <div class="rounded-md bg-surface-2 px-3 py-2">
                        <dt class="text-muted">After</dt>
                        <dd class="mt-0.5 font-semibold">{{ formatBytes(result.size) }}</dd>
                    </div>
                </dl>
                <p class="mt-3 text-[13px] text-muted">{{ result.note }}</p>
                <div class="mt-4 flex flex-wrap items-center gap-2">
                    <a :href="result.url" :download="result.name" class="btn-primary">
                        <TsnIcon name="download" class="h-[18px] w-[18px]" />Download {{ result.name }}
                    </a>
                    <button type="button" class="btn-ghost" @click="reset">Check another photo</button>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { cleanedName, readImageMetadata, stripImageMetadata } from "~/utils/exif.js";
import { MAX_INPUT_BYTES, decodeImage, drawToCanvas, formatBytes, isImageFile } from "~/utils/imageTools.js";
import { trackToolComplete, trackToolView } from "~/composables/useAnalytics.js";

const TOOL = "exif-remover";
const maxLabel = formatBytes(MAX_INPUT_BYTES);

const input = ref(null);
const file = ref(null);
const preview = ref("");
const previewFailed = ref(false);
const dragging = ref(false);
const error = ref("");
const busy = ref("");
const info = ref(null);
const result = ref(null);

const KIND_LABELS = { jpeg: "JPEG", png: "PNG", webp: "WebP", other: "image" };
const kindLabel = computed(() => KIND_LABELS[info.value?.kind] || "image");

onMounted(() => trackToolView(TOOL));
onBeforeUnmount(() => {
    if (preview.value) URL.revokeObjectURL(preview.value);
    revokeResult();
});

function revokeResult() {
    if (result.value?.url) URL.revokeObjectURL(result.value.url);
}

function onPick(e) {
    const picked = e.target.files?.[0];
    e.target.value = "";
    if (picked) load(picked);
}

function onDrop(e) {
    dragging.value = false;
    const picked = e.dataTransfer.files?.[0];
    if (picked) load(picked);
}

async function load(picked) {
    reset();
    if (!isImageFile(picked)) {
        error.value = "That isn't an image. Choose a JPEG, PNG, WebP, HEIC or HEIF photo.";
        return;
    }
    if (picked.size > MAX_INPUT_BYTES) {
        error.value = `${picked.name} is ${formatBytes(picked.size)}. The limit is ${maxLabel}.`;
        return;
    }
    file.value = picked;
    preview.value = URL.createObjectURL(picked);
    busy.value = "reading";
    try {
        info.value = await readImageMetadata(picked);
    } catch {
        error.value = "Couldn't read this image in your browser.";
        file.value = null;
    } finally {
        busy.value = "";
    }
}

function hasUnextractableMetadata() {
    return info.value && !info.value.canStrip;
}

async function clean() {
    if (!file.value || busy.value) return;
    error.value = "";
    busy.value = "cleaning";
    revokeResult();
    result.value = null;

    try {
        let blob;
        let name;
        let lossless = false;

        const stripped = await stripImageMetadata(file.value);
        if (stripped) {
            blob = new Blob([stripped.bytes], { type: stripped.mime });
            name = cleanedName(file.value, stripped.mime);
            lossless = true;
        } else {
            // HEIC and other containers: rebuild the image through a canvas,
            // which produces a file with pixels only.
            if (hasUnextractableMetadata() && !String(file.value.type).startsWith("image/") && !/hei[cf]/i.test(file.value.name)) {
                throw new Error("This file type isn't supported. Use a JPEG, PNG, WebP or HEIC photo.");
            }
            const decoded = await decodeImage(file.value);
            const canvas = drawToCanvas(decoded, 0);
            blob = await new Promise((resolve, reject) =>
                canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("The browser couldn't rebuild this image."))), "image/jpeg", 0.92),
            );
            name = cleanedName(file.value, "image/jpeg");
        }

        // Verify on the actual output, not just by trust.
        let verified = "";
        try {
            const check = await readImageMetadata(new File([blob], name, { type: blob.type }));
            verified = check.hasMetadata
                ? "Some metadata may remain — check the result before sharing."
                : "Verified: the new file contains no readable metadata.";
        } catch {
            verified = "The new file was created without any metadata blocks.";
        }

        const removed = (info.value?.entries.length || 0) + (info.value?.gps ? 1 : 0);
        result.value = {
            url: URL.createObjectURL(blob),
            name,
            size: blob.size,
            removed,
            note: lossless
                ? `Pixels were copied exactly — no re-encoding, no quality loss. ${verified}`
                : `Converted to JPEG at 92% quality to rebuild the file without metadata. ${verified}`,
        };
        trackToolComplete(TOOL, {
            kind: info.value?.kind || "other",
            gps: !!info.value?.gps,
            fields: removed,
            lossless,
            original_bytes: file.value.size,
            output_bytes: blob.size,
        });
    } catch (e) {
        error.value = e?.message || "Couldn't remove metadata from this photo.";
    } finally {
        busy.value = "";
    }
}

function reset() {
    if (preview.value) URL.revokeObjectURL(preview.value);
    revokeResult();
    file.value = null;
    preview.value = "";
    previewFailed.value = false;
    info.value = null;
    result.value = null;
    error.value = "";
    busy.value = "";
    if (input.value) input.value.value = "";
}
</script>
