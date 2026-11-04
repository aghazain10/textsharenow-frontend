<template>
    <div class="tool-glow rounded-xl border border-line bg-surface p-3 text-left sm:p-5">
        <div class="grid grid-cols-3 gap-1 rounded-lg bg-surface-2 p-1" role="tablist" aria-label="Choose a PDF operation">
            <button
                v-for="t in TABS"
                :key="t.id"
                type="button"
                role="tab"
                :aria-selected="tab === t.id"
                class="rounded-md px-2 py-1.5 text-[14px] font-medium transition-colors"
                :class="tab === t.id ? 'bg-surface text-ink shadow-card' : 'text-muted'"
                @click="switchTab(t.id)"
            >
                {{ t.label }}
            </button>
        </div>

        <!-- MERGE -->
        <div v-if="tab === 'merge'" class="mt-4">
            <label
                for="merge-input"
                class="drop flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-line px-6 py-10 text-center transition-colors"
                :class="{ 'is-over': dragging === 'merge' }"
                @dragenter.prevent="dragging = 'merge'"
                @dragover.prevent="dragging = 'merge'"
                @dragleave.prevent="dragging = ''"
                @drop.prevent="onDrop($event, 'merge')"
            >
                <span class="grid h-12 w-12 place-items-center rounded-lg border border-line bg-bg text-ink shadow-card">
                    <TsnIcon name="upload" class="h-7 w-7" />
                </span>
                <span class="mt-4 text-[17px] font-semibold tracking-[-0.01em]">
                    Drop PDFs here, or <span class="underline underline-offset-4">browse</span>
                </span>
                <span class="mt-1 text-[14px] text-muted">Two or more PDFs, up to {{ maxLabel }} total</span>
                <input id="merge-input" type="file" class="sr-only" accept="application/pdf,.pdf" multiple @change="onMergePick" />
            </label>

            <template v-if="mergeFiles.length">
                <div class="mt-3 flex items-center justify-between gap-3 text-[13px]">
                    <span class="font-medium text-ink">{{ mergeFiles.length }} file{{ mergeFiles.length === 1 ? "" : "s" }}</span>
                    <span class="text-muted">{{ formatPdfSize(mergeTotal) }} total</span>
                </div>
                <ul class="mt-2 grid gap-2" aria-label="PDFs to merge, in order">
                    <li v-for="(item, i) in mergeFiles" :key="item.id" class="flex items-center gap-2 rounded-lg border border-line px-3 py-2">
                        <span class="w-5 shrink-0 text-[12px] font-semibold text-muted">{{ i + 1 }}</span>
                        <span class="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-surface-2 text-ink"><TsnIcon name="file" class="h-4 w-4" stroke="1.9" /></span>
                        <span class="min-w-0 flex-1">
                            <span class="block truncate text-[14px] font-medium">{{ item.file.name }}</span>
                            <span class="block text-[12px] text-muted">{{ formatPdfSize(item.file.size) }}</span>
                        </span>
                        <button type="button" class="btn-icon" :disabled="i === 0" aria-label="Move up" @click="move(i, -1)">↑</button>
                        <button type="button" class="btn-icon" :disabled="i === mergeFiles.length - 1" aria-label="Move down" @click="move(i, 1)">↓</button>
                        <button type="button" class="btn-icon" :aria-label="`Remove ${item.file.name}`" @click="removeMerge(item.id)">
                            <TsnIcon name="x" class="h-4 w-4" stroke="2.2" />
                        </button>
                    </li>
                </ul>
                <div class="mt-4 flex flex-wrap items-center gap-3">
                    <button type="button" class="btn-primary" :disabled="mergeFiles.length < 2 || !!busy" @click="runMerge">
                        {{ busy === "merge" ? "Merging…" : `Merge ${mergeFiles.length} PDFs` }}
                    </button>
                    <span class="text-[13px] text-muted">Order above is the page order in the result.</span>
                </div>
            </template>
        </div>

        <!-- SPLIT -->
        <div v-else-if="tab === 'split'" class="mt-4">
            <label
                v-if="!splitFile"
                for="split-input"
                class="drop flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-line px-6 py-10 text-center transition-colors"
                :class="{ 'is-over': dragging === 'split' }"
                @dragenter.prevent="dragging = 'split'"
                @dragover.prevent="dragging = 'split'"
                @dragleave.prevent="dragging = ''"
                @drop.prevent="onDrop($event, 'split')"
            >
                <span class="grid h-12 w-12 place-items-center rounded-lg border border-line bg-bg text-ink shadow-card">
                    <TsnIcon name="upload" class="h-7 w-7" />
                </span>
                <span class="mt-4 text-[17px] font-semibold tracking-[-0.01em]">
                    Drop a PDF here, or <span class="underline underline-offset-4">browse</span>
                </span>
                <span class="mt-1 text-[14px] text-muted">One PDF, up to {{ maxLabel }}</span>
                <input id="split-input" type="file" class="sr-only" accept="application/pdf,.pdf" @change="onSinglePick($event, 'split')" />
            </label>

            <template v-else>
                <div class="flex items-center gap-3 rounded-lg border border-line bg-bg p-3">
                    <span class="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-surface-2 text-ink"><TsnIcon name="file" class="h-5 w-5" stroke="1.8" /></span>
                    <div class="min-w-0 flex-1">
                        <p class="truncate text-[15px] font-semibold">{{ splitFile.name }}</p>
                        <p class="mt-0.5 text-[13px] text-muted">
                            {{ formatPdfSize(splitFile.size) }}
                            <template v-if="splitPages"> · {{ splitPages }} page{{ splitPages === 1 ? "" : "s" }}</template>
                            <template v-if="busy === 'split-load'"> · reading…</template>
                        </p>
                    </div>
                    <button type="button" class="btn-icon" aria-label="Choose a different PDF" @click="clearSplit">
                        <TsnIcon name="x" class="h-4 w-4" stroke="2.2" />
                    </button>
                </div>

                <label class="mt-4 flex flex-col gap-1.5">
                    <span class="text-[13px] font-medium text-muted">Pages to extract</span>
                    <input
                        v-model="rangeText"
                        type="text"
                        inputmode="numeric"
                        placeholder="e.g. 1-3,5"
                        class="rounded-md border border-line bg-bg px-3 py-2 text-[14px] text-ink placeholder:text-muted/70 !outline-none"
                    />
                    <span class="text-[12px] text-muted">Use commas for single pages and dashes for ranges. The order you write is the order in the new file.</span>
                </label>

                <div class="mt-4 flex flex-wrap items-center gap-3">
                    <button type="button" class="btn-primary" :disabled="!splitPages || !!busy" @click="runSplit">
                        <TsnIcon name="download" class="h-[18px] w-[18px]" />
                        {{ busy === "split" ? "Extracting…" : "Extract pages" }}
                    </button>
                    <span class="text-[13px] text-muted">The original PDF stays untouched.</span>
                </div>
            </template>
        </div>

        <!-- COMPRESS -->
        <div v-else class="mt-4">
            <label
                v-if="!compressFile"
                for="compress-input"
                class="drop flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-line px-6 py-10 text-center transition-colors"
                :class="{ 'is-over': dragging === 'compress' }"
                @dragenter.prevent="dragging = 'compress'"
                @dragover.prevent="dragging = 'compress'"
                @dragleave.prevent="dragging = ''"
                @drop.prevent="onDrop($event, 'compress')"
            >
                <span class="grid h-12 w-12 place-items-center rounded-lg border border-line bg-bg text-ink shadow-card">
                    <TsnIcon name="upload" class="h-7 w-7" />
                </span>
                <span class="mt-4 text-[17px] font-semibold tracking-[-0.01em]">
                    Drop a PDF here, or <span class="underline underline-offset-4">browse</span>
                </span>
                <span class="mt-1 text-[14px] text-muted">One PDF, up to {{ maxLabel }}</span>
                <input id="compress-input" type="file" class="sr-only" accept="application/pdf,.pdf" @change="onSinglePick($event, 'compress')" />
            </label>

            <template v-else>
                <div class="flex items-center gap-3 rounded-lg border border-line bg-bg p-3">
                    <span class="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-surface-2 text-ink"><TsnIcon name="file" class="h-5 w-5" stroke="1.8" /></span>
                    <div class="min-w-0 flex-1">
                        <p class="truncate text-[15px] font-semibold">{{ compressFile.name }}</p>
                        <p class="mt-0.5 text-[13px] text-muted">{{ formatPdfSize(compressFile.size) }}</p>
                    </div>
                    <button type="button" class="btn-icon" aria-label="Choose a different PDF" @click="clearCompress">
                        <TsnIcon name="x" class="h-4 w-4" stroke="2.2" />
                    </button>
                </div>

                <p class="mt-3 text-[13px] leading-relaxed text-muted">
                    Re-saves the PDF with compressed object streams and removes document metadata. Text, links and form fields stay intact.
                    Embedded photos are not re-encoded, so image-heavy scans can shrink only slightly.
                </p>

                <div class="mt-4 flex flex-wrap items-center gap-3">
                    <button type="button" class="btn-primary" :disabled="!!busy" @click="runCompress">
                        <TsnIcon name="download" class="h-[18px] w-[18px]" />
                        {{ busy === "compress" ? "Compressing…" : "Compress PDF" }}
                    </button>
                    <span class="text-[13px] text-muted">Free, no upload.</span>
                </div>
            </template>
        </div>

        <p v-if="error" class="mt-3 flex items-start gap-2 text-[14px] text-bad" role="alert">
            <TsnIcon name="alert" class="mt-0.5 h-4 w-4 shrink-0" />{{ error }}
        </p>

        <div v-if="result" class="mt-4 rounded-lg border border-line p-4">
            <div class="flex flex-wrap items-center justify-between gap-2">
                <p class="text-[15px] font-semibold">{{ result.note }}</p>
                <span class="rounded-full border border-line px-2.5 py-0.5 text-[12px] font-semibold text-ink">
                    {{ result.size <= result.before ? `${formatPdfSize(result.before - result.size)} saved` : "No size savings" }}
                </span>
            </div>
            <p class="mt-1 text-[13px] text-muted">
                {{ formatPdfSize(result.before) }} → {{ formatPdfSize(result.size) }}
                <template v-if="result.detail"> · {{ result.detail }}</template>
            </p>
            <div class="mt-4 flex flex-wrap items-center gap-2">
                <a :href="result.url" :download="result.name" class="btn-primary">
                    <TsnIcon name="download" class="h-[18px] w-[18px]" />Download {{ result.name }}
                </a>
                <button type="button" class="btn-ghost" @click="resetTab">Start over</button>
            </div>
            <p v-if="result.size > result.before" class="mt-3 text-[12px] text-muted">
                This file is already well optimised. The original is the smaller choice — keep it.
            </p>
        </div>
    </div>
</template>

<script setup>
import {
    MAX_PDF_BYTES,
    compressPdf,
    extractPdfPages,
    formatPdfSize,
    isPdfFile,
    mergePdfs,
    pdfBlob,
    pdfOutputName,
    pdfPageCount,
    rangesLabel,
} from "~/utils/pdfTools.js";
import { trackToolComplete, trackToolView } from "~/composables/useAnalytics.js";

const TABS = [
    { id: "merge", label: "Merge" },
    { id: "split", label: "Split" },
    { id: "compress", label: "Compress" },
];
const TOOL = "pdf-tools";
const maxLabel = formatPdfSize(MAX_PDF_BYTES);

const tab = ref("merge");
const dragging = ref("");
const error = ref("");
const busy = ref("");
const result = ref(null);

const mergeFiles = ref([]);
let seq = 0;
const mergeTotal = computed(() => mergeFiles.value.reduce((sum, item) => sum + item.file.size, 0));

const splitFile = ref(null);
const splitPages = ref(0);
const rangeText = ref("1-3");

const compressFile = ref(null);

onMounted(() => trackToolView(TOOL));
onBeforeUnmount(revokeResult);

watch(tab, () => {
    error.value = "";
});

function switchTab(id) {
    tab.value = id;
    clearResult();
}

function clearResult() {
    revokeResult();
    result.value = null;
    error.value = "";
}

function revokeResult() {
    if (result.value?.url) URL.revokeObjectURL(result.value.url);
}

function validate(file) {
    if (!isPdfFile(file)) return `${file.name} isn't a PDF.`;
    if (!file.size) return `${file.name} is empty.`;
    if (file.size > MAX_PDF_BYTES) return `${file.name} is ${formatPdfSize(file.size)}. The limit is ${maxLabel}.`;
    return "";
}

function onMergePick(e) {
    addMerge(e.target.files);
    e.target.value = "";
}

function addMerge(fileList) {
    clearResult();
    const incoming = Array.from(fileList || []);
    if (!incoming.length) return;
    let total = mergeTotal.value;
    const next = [...mergeFiles.value];
    for (const file of incoming) {
        const problem = validate(file);
        if (problem) {
            error.value = problem;
            continue;
        }
        if (total + file.size > MAX_PDF_BYTES) {
            error.value = `That would make ${formatPdfSize(total + file.size)} total. Merge is limited to ${maxLabel}.`;
            break;
        }
        if (next.some((item) => item.file.name === file.name && item.file.size === file.size)) continue;
        next.push({ id: ++seq, file });
        total += file.size;
    }
    mergeFiles.value = next;
}

function move(i, direction) {
    const next = [...mergeFiles.value];
    const target = i + direction;
    if (target < 0 || target >= next.length) return;
    [next[i], next[target]] = [next[target], next[i]];
    mergeFiles.value = next;
}

function removeMerge(id) {
    mergeFiles.value = mergeFiles.value.filter((item) => item.id !== id);
    clearResult();
}

function onSinglePick(e, which) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) setSingle(file, which);
}

function onDrop(e, which) {
    dragging.value = "";
    const files = Array.from(e.dataTransfer.files || []);
    if (!files.length) return;
    if (which === "merge") addMerge(files);
    else setSingle(files[0], which);
}

async function setSingle(file, which) {
    clearResult();
    const problem = validate(file);
    if (problem) {
        error.value = problem;
        return;
    }
    if (which === "split") {
        splitFile.value = file;
        splitPages.value = 0;
        rangeText.value = "1-3";
        busy.value = "split-load";
        try {
            splitPages.value = await pdfPageCount(file);
        } catch (e) {
            error.value = e?.message || "Couldn't read that PDF.";
            splitFile.value = null;
        } finally {
            busy.value = "";
        }
    } else {
        compressFile.value = file;
    }
}

function clearSplit() {
    splitFile.value = null;
    splitPages.value = 0;
    clearResult();
}

function clearCompress() {
    compressFile.value = null;
    clearResult();
}

function resetTab() {
    clearResult();
    if (tab.value === "merge") mergeFiles.value = [];
    if (tab.value === "split") clearSplit();
    if (tab.value === "compress") clearCompress();
}

async function runMerge() {
    if (mergeFiles.value.length < 2 || busy.value) return;
    clearResult();
    busy.value = "merge";
    try {
        const bytes = await mergePdfs(mergeFiles.value.map((item) => item.file));
        const blob = pdfBlob(bytes);
        const size = blob.size;
        const before = mergeTotal.value;
        result.value = {
            url: URL.createObjectURL(blob),
            name: pdfOutputName(mergeFiles.value[0].file, "merged"),
            size,
            before,
            note: `${mergeFiles.value.length} PDFs merged`,
            detail: `${mergeFiles.value.length} files`,
        };
        trackToolComplete(TOOL, { mode: "merge", files: mergeFiles.value.length, original_bytes: before, output_bytes: size });
    } catch (e) {
        error.value = e?.message || "Couldn't merge those PDFs.";
    } finally {
        busy.value = "";
    }
}

async function runSplit() {
    if (!splitFile.value || !splitPages.value || busy.value) return;
    clearResult();
    busy.value = "split";
    try {
        const { bytes, pageCount } = await extractPdfPages(splitFile.value, rangeText.value);
        const blob = pdfBlob(bytes);
        const size = blob.size;
        result.value = {
            url: URL.createObjectURL(blob),
            name: pdfOutputName(splitFile.value, rangesLabel(rangeText.value)),
            size,
            before: splitFile.value.size,
            note: `${pageCount} page${pageCount === 1 ? "" : "s"} extracted`,
            detail: `pages ${rangeText.value.trim()}`,
        };
        trackToolComplete(TOOL, { mode: "split", pages: pageCount, original_bytes: splitFile.value.size, output_bytes: size });
    } catch (e) {
        error.value = e?.message || "Couldn't extract those pages.";
    } finally {
        busy.value = "";
    }
}

async function runCompress() {
    if (!compressFile.value || busy.value) return;
    clearResult();
    busy.value = "compress";
    try {
        const { bytes, pageCount } = await compressPdf(compressFile.value);
        const blob = pdfBlob(bytes);
        const size = blob.size;
        const before = compressFile.value.size;
        result.value = {
            url: URL.createObjectURL(blob),
            name: pdfOutputName(compressFile.value, "compressed"),
            size,
            before,
            note: size < before ? "Compressed PDF ready" : "This PDF is already optimized",
            detail: `${pageCount} page${pageCount === 1 ? "" : "s"} · metadata removed`,
        };
        trackToolComplete(TOOL, { mode: "compress", pages: pageCount, original_bytes: before, output_bytes: size });
    } catch (e) {
        error.value = e?.message || "Couldn't compress that PDF.";
    } finally {
        busy.value = "";
    }
}
</script>
