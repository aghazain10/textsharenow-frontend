<template>
    <div class="tool-glow rounded-xl border border-line bg-surface p-3 text-left sm:p-5">
        <!-- Empty state -->
        <div v-if="!file">
            <label
                for="image-input"
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
                    Drop a photo here, or <span class="underline underline-offset-4">browse</span>
                </span>
                <span class="mt-1 text-[14px] text-muted">JPEG, PNG, WebP, HEIC — up to {{ maxLabel }}</span>
                <span class="mt-3 inline-flex flex-wrap items-center justify-center gap-1.5 text-[12px] font-medium">
                    <span class="rounded-md border border-line bg-bg px-2 py-0.5">Compress to a target size</span>
                    <span class="rounded-md border border-line bg-bg px-2 py-0.5">Convert format</span>
                    <span class="rounded-md border border-line bg-bg px-2 py-0.5">No upload</span>
                </span>
                <input id="image-input" ref="input" type="file" class="sr-only" accept="image/*,.heic,.heif" @change="onPick" />
            </label>
            <p v-if="error" class="mt-3 flex items-start gap-2 text-[14px] text-bad" role="alert">
                <TsnIcon name="alert" class="mt-0.5 h-4 w-4 shrink-0" />{{ error }}
            </p>
        </div>

        <!-- Selected image -->
        <template v-else>
            <div class="flex items-center gap-3 rounded-lg border border-line bg-bg p-3">
                <img v-if="preview" :src="preview" alt="Selected image preview" class="h-16 w-16 shrink-0 rounded-md object-cover" />
                <span v-else class="grid h-16 w-16 shrink-0 place-items-center rounded-md bg-surface-2 text-ink">
                    <TsnIcon name="file" class="h-6 w-6" stroke="1.8" />
                </span>
                <div class="min-w-0 flex-1">
                    <p class="truncate text-[15px] font-semibold">{{ file.name }}</p>
                    <p class="mt-0.5 text-[13px] text-muted">
                        {{ formatBytes(file.size) }}
                        <template v-if="dimensions"> · {{ dimensions.width }} × {{ dimensions.height }} px</template>
                        <template v-if="isHeicFile"> · HEIC</template>
                    </p>
                </div>
                <button type="button" class="btn-icon" aria-label="Choose a different image" @click="reset">
                    <TsnIcon name="x" class="h-4 w-4" stroke="2.2" />
                </button>
            </div>

            <p v-if="busy === 'reading'" class="mt-3 flex items-center gap-2 text-[13px] text-muted" role="status">
                <span class="live-dot" aria-hidden="true" />Reading image…
            </p>

            <div class="mt-4 grid gap-4 sm:grid-cols-2">
                <label class="flex flex-col gap-1.5">
                    <span class="text-[13px] font-medium text-muted">Output format</span>
                    <select v-model="format" class="rounded-md border border-line bg-bg px-3 py-2 text-[14px] text-ink !outline-none">
                        <option value="auto">Keep original (HEIC → JPEG)</option>
                        <option value="jpeg">JPEG — photos, smallest</option>
                        <option value="webp">WebP — smaller, modern</option>
                        <option value="png">PNG — lossless</option>
                    </select>
                </label>
                <label class="flex flex-col gap-1.5">
                    <span class="text-[13px] font-medium text-muted">Resize (longest side, px)</span>
                    <input
                        v-model.number="maxDimension"
                        type="number"
                        min="16"
                        max="10000"
                        placeholder="Original size"
                        class="rounded-md border border-line bg-bg px-3 py-2 text-[14px] text-ink placeholder:text-muted/70 !outline-none"
                    />
                </label>
            </div>

            <fieldset class="mt-4">
                <legend class="text-[13px] font-medium text-muted">How should it be compressed?</legend>
                <div class="mt-2 grid grid-cols-2 gap-2 rounded-lg bg-surface-2 p-1">
                    <button
                        type="button"
                        class="rounded-md px-3 py-1.5 text-[14px] font-medium transition-colors"
                        :class="mode === 'target' ? 'bg-surface text-ink shadow-card' : 'text-muted'"
                        @click="mode = 'target'"
                    >
                        Target file size
                    </button>
                    <button
                        type="button"
                        class="rounded-md px-3 py-1.5 text-[14px] font-medium transition-colors"
                        :class="mode === 'quality' ? 'bg-surface text-ink shadow-card' : 'text-muted'"
                        @click="mode = 'quality'"
                    >
                        Quality
                    </button>
                </div>

                <div v-if="mode === 'target'" class="mt-3">
                    <div class="flex flex-wrap items-center gap-2">
                        <button
                            v-for="p in PRESETS"
                            :key="p.kb"
                            type="button"
                            class="rounded-md border px-2.5 py-1 text-[13px] font-medium transition-colors"
                            :class="targetKb === p.kb ? 'border-brand bg-brand-soft text-ink' : 'border-line text-muted hover:text-ink'"
                            @click="targetKb = p.kb"
                        >
                            {{ p.label }}
                        </button>
                        <span class="inline-flex items-center gap-1.5">
                            <input
                                v-model.number="targetKb"
                                type="number"
                                min="10"
                                max="50000"
                                aria-label="Custom target size"
                                class="w-24 rounded-md border border-line bg-bg px-2.5 py-1 text-[13px] text-ink !outline-none"
                            />
                            <select v-model="unit" aria-label="Target size unit" class="rounded-md border border-line bg-bg px-2 py-1 text-[13px] text-ink !outline-none">
                                <option value="KB">KB</option>
                                <option value="MB">MB</option>
                            </select>
                        </span>
                    </div>
                    <p class="mt-2 text-[12px] text-muted">
                        For JPEG and WebP the quality is tuned automatically to land just under this size. For PNG the pixel dimensions are reduced instead.
                    </p>
                </div>

                <div v-else class="mt-3">
                    <label class="flex items-center gap-3">
                        <input v-model.number="quality" type="range" min="10" max="100" step="1" class="w-full accent-current" aria-label="Output quality" />
                        <span class="w-12 shrink-0 text-right text-[13px] font-medium tabular-nums">{{ quality }}%</span>
                    </label>
                    <p class="mt-1 text-[12px] text-muted">Lower quality means a smaller file. 75–85% is usually indistinguishable from the original.</p>
                </div>
            </fieldset>

            <div class="mt-4 flex flex-wrap items-center gap-3">
                <button type="button" class="btn-primary" :disabled="!decoded || !!busy" @click="run">
                    <TsnIcon name="download" class="h-[18px] w-[18px]" />
                    {{ busy === "working" ? "Compressing…" : "Compress image" }}
                </button>
                <span class="text-[13px] text-muted">Runs on this device. Nothing is uploaded.</span>
            </div>

            <p v-if="error" class="mt-3 flex items-start gap-2 text-[14px] text-bad" role="alert">
                <TsnIcon name="alert" class="mt-0.5 h-4 w-4 shrink-0" />{{ error }}
            </p>

            <!-- Result -->
            <div v-if="result" class="mt-4 rounded-lg border border-line p-4">
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <p class="text-[15px] font-semibold">{{ result.note || "Compressed image ready" }}</p>
                    <span v-if="result.savedPct !== null" class="rounded-full border border-line px-2.5 py-0.5 text-[12px] font-semibold text-ink">
                        {{ result.savedPct >= 0 ? `${result.savedPct}% smaller` : `${Math.abs(result.savedPct)}% larger` }}
                    </span>
                </div>
                <dl class="mt-3 grid grid-cols-3 gap-2 text-[13px]">
                    <div class="rounded-md bg-surface-2 px-3 py-2">
                        <dt class="text-muted">Before</dt>
                        <dd class="mt-0.5 font-semibold">{{ formatBytes(file.size) }}</dd>
                    </div>
                    <div class="rounded-md bg-surface-2 px-3 py-2">
                        <dt class="text-muted">After</dt>
                        <dd class="mt-0.5 font-semibold">{{ formatBytes(result.size) }}</dd>
                    </div>
                    <div class="rounded-md bg-surface-2 px-3 py-2">
                        <dt class="text-muted">Pixels</dt>
                        <dd class="mt-0.5 font-semibold">{{ result.width }} × {{ result.height }}</dd>
                    </div>
                </dl>
                <div class="mt-4 flex flex-wrap items-center gap-2">
                    <a :href="result.url" :download="result.name" class="btn-primary">
                        <TsnIcon name="download" class="h-[18px] w-[18px]" />Download {{ result.name }}
                    </a>
                    <button type="button" class="btn-ghost" @click="reset">Compress another image</button>
                </div>
                <p class="mt-3 text-[12px] text-muted">
                    The download is generated locally from your file. The original on your device is untouched.
                </p>
            </div>
        </template>
    </div>
</template>

<script setup>
import {
    MAX_INPUT_BYTES,
    compressImage,
    decodeImage,
    drawToCanvas,
    formatBytes,
    imageSize,
    isHeic,
    isImageFile,
    outputName,
    resolveMime,
} from "~/utils/imageTools.js";
import { trackToolComplete, trackToolView } from "~/composables/useAnalytics.js";

const PRESETS = [
    { kb: 100, label: "100 KB" },
    { kb: 200, label: "200 KB" },
    { kb: 500, label: "500 KB" },
    { kb: 1024, label: "1 MB" },
    { kb: 2048, label: "2 MB" },
];

const TOOL = "image-compressor";
const maxLabel = formatBytes(MAX_INPUT_BYTES);

const input = ref(null);
const file = ref(null);
const decoded = ref(null);
const preview = ref("");
const dimensions = ref(null);
const dragging = ref(false);
const error = ref("");
const busy = ref("");
const mode = ref("target");
const targetKb = ref(500);
const unit = ref("KB");
const quality = ref(80);
const format = ref("auto");
const maxDimension = ref(null);
const result = ref(null);
const isHeicFile = computed(() => !!file.value && isHeic(file.value));

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
        error.value = "That file isn't an image. Choose a JPEG, PNG, WebP, HEIC or HEIF file.";
        return;
    }
    if (picked.size > MAX_INPUT_BYTES) {
        error.value = `${picked.name} is ${formatBytes(picked.size)}. The limit is ${maxLabel} — try resizing it first.`;
        return;
    }
    file.value = picked;
    busy.value = "reading";
    try {
        decoded.value = await decodeImage(picked);
        dimensions.value = imageSize(decoded.value);
        // A canvas thumbnail works for HEIC too, where blob URLs may not render.
        const thumb = drawToCanvas(decoded.value, 320);
        preview.value = thumb.toDataURL("image/jpeg", 0.8);
    } catch (e) {
        error.value = e?.message || "This image couldn't be opened in your browser.";
        file.value = null;
        decoded.value = null;
    } finally {
        busy.value = "";
    }
}

async function run() {
    if (!decoded.value || !file.value || busy.value) return;
    error.value = "";
    busy.value = "working";
    revokeResult();
    result.value = null;

    const mime = resolveMime(format.value, file.value);
    const requestedBytes = mode.value === "target" ? Math.round(targetKb.value * (unit.value === "MB" ? 1024 * 1024 : 1024)) : 0;

    try {
        if (!requestedBytes && mode.value === "target") {
            error.value = "Enter a target size above 0, or switch to Quality mode.";
            return;
        }

        // Already smaller than the target and no format change: don't inflate it.
        const sameFormat = mime === (file.value.type || "");
        if (requestedBytes && file.value.size <= requestedBytes && sameFormat && !isHeicFile.value) {
            result.value = {
                url: URL.createObjectURL(file.value),
                name: file.value.name,
                size: file.value.size,
                width: dimensions.value.width,
                height: dimensions.value.height,
                note: "Already smaller than your target",
                savedPct: 0,
            };
            trackToolComplete(TOOL, { skipped: true, target_bytes: requestedBytes });
            return;
        }

        const out = await compressImage({
            img: decoded.value,
            file: file.value,
            format: format.value,
            targetBytes: requestedBytes,
            quality: quality.value / 100,
            maxDimension: maxDimension.value,
        });

        const savedPct = file.value.size ? Math.round(((file.value.size - out.blob.size) / file.value.size) * 100) : null;
        result.value = {
            url: URL.createObjectURL(out.blob),
            name: outputName(file.value, out.mime),
            size: out.blob.size,
            width: out.width,
            height: out.height,
            note: "",
            savedPct,
        };
        trackToolComplete(TOOL, {
            from: file.value.type || "unknown",
            to: out.mime,
            original_bytes: file.value.size,
            output_bytes: out.blob.size,
            saved_pct: savedPct,
            target_bytes: requestedBytes,
            quality: out.quality,
        });
    } catch (e) {
        error.value = e?.message || "Compression failed in this browser. Try a smaller image or another format.";
    } finally {
        busy.value = "";
    }
}

function reset() {
    if (preview.value) URL.revokeObjectURL(preview.value);
    revokeResult();
    file.value = null;
    decoded.value = null;
    preview.value = "";
    dimensions.value = null;
    result.value = null;
    error.value = "";
    busy.value = "";
    if (input.value) input.value.value = "";
}
</script>
