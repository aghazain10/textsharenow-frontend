// Client-side PDF operations. pdf-lib is loaded on demand so it never lands
// in the initial page bundle; the files themselves are read and written
// entirely in the browser.

export const MAX_PDF_BYTES = 100 * 1024 * 1024;

export function formatPdfSize(bytes) {
    const n = Number(bytes) || 0;
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(n < 10 * 1024 ? 1 : 0)} KB`;
    return `${(n / (1024 * 1024)).toFixed(n < 10 * 1024 * 1024 ? 1 : 0)} MB`;
}

export function isPdfFile(file) {
    return !!file && (file.type === "application/pdf" || /\.pdf$/i.test(file.name || ""));
}

async function getPdfLib() {
    try {
        return await import("pdf-lib");
    } catch {
        throw new Error("Couldn't load the PDF engine. Check your connection and try again.");
    }
}

async function loadDocument(file) {
    const { PDFDocument } = await getPdfLib();
    let bytes;
    try {
        bytes = new Uint8Array(await file.arrayBuffer());
    } catch {
        throw new Error(`Couldn't read ${file.name}. Try selecting it again.`);
    }
    try {
        return await PDFDocument.load(bytes);
    } catch (e) {
        const message = String(e?.message || "");
        if (/encrypt|password/i.test(message)) {
            throw new Error(`${file.name} is password-protected. Remove the password, then try again.`);
        }
        throw new Error(`${file.name} doesn't look like a valid PDF, or it's damaged.`);
    }
}

export async function pdfPageCount(file) {
    const doc = await loadDocument(file);
    return doc.getPageCount();
}

/** "1-3, 5, 8-" → [1,2,3,5,8,9,...]. Throws a human-readable error. */
export function parsePageRanges(input, pageCount) {
    const raw = String(input || "").trim();
    if (!raw) throw new Error("Enter the pages you want, for example 1-3,5.");
    const pages = [];
    const seen = new Set();

    for (const part of raw.split(",")) {
        const token = part.trim();
        if (!token) continue;
        const match = token.match(/^(\d+)\s*(?:-\s*(\d+)?)?$/);
        if (!match) throw new Error(`"${token}" isn't a page or range. Use numbers like 1-3,5.`);
        const start = Number(match[1]);
        const end = match[2] === undefined ? start : Number(match[2]);
        if (start < 1 || end < 1) throw new Error("Page numbers start at 1.");
        if (end < start) throw new Error(`"${token}" runs backwards — the last page should be higher.`);
        if (end > pageCount) throw new Error(`This PDF only has ${pageCount} page${pageCount === 1 ? "" : "s"}, so page ${end} doesn't exist.`);
        for (let p = start; p <= end; p++) {
            if (!seen.has(p)) {
                seen.add(p);
                pages.push(p);
            }
        }
    }

    if (!pages.length) throw new Error("Enter at least one page or range.");
    return pages;
}

/** Merge files in the given order. */
export async function mergePdfs(files) {
    const { PDFDocument } = await getPdfLib();
    const out = await PDFDocument.create();
    for (const file of files) {
        const source = await loadDocument(file);
        const pages = await out.copyPages(source, source.getPageIndices());
        for (const page of pages) out.addPage(page);
    }
    return await out.save();
}

/** Extract the selected pages (in the order written) into a new PDF. */
export async function extractPdfPages(file, rangeText) {
    const { PDFDocument } = await getPdfLib();
    const source = await loadDocument(file);
    const pageCount = source.getPageCount();
    const pages = parsePageRanges(rangeText, pageCount);
    const out = await PDFDocument.create();
    const copied = await out.copyPages(source, pages.map((p) => p - 1));
    for (const page of copied) out.addPage(page);
    return { bytes: await out.save(), pageCount: pages.length };
}

/**
 * Re-save the PDF with object streams and metadata stripped. This is real
 * structural optimisation, not a rasterizer: text stays text, but embedded
 * images are not re-encoded, so image-heavy scans may barely shrink.
 */
export async function compressPdf(file) {
    const { PDFDocument } = await getPdfLib();
    const source = await loadDocument(file);
    const pageCount = source.getPageCount();
    try {
        source.setTitle("");
        source.setAuthor("");
        source.setSubject("");
        source.setKeywords([]);
        source.setCreator("");
        source.setProducer("");
    } catch {}
    const bytes = await source.save({ useObjectStreams: true, addDefaultPage: false });
    return { bytes, pageCount };
}

export function pdfBlob(bytes) {
    return new Blob([bytes], { type: "application/pdf" });
}

export function pdfOutputName(file, suffix) {
    const base = String(file?.name || "document").replace(/\.pdf$/i, "").slice(0, 80) || "document";
    return `${base}-${suffix}.pdf`;
}

export function rangesLabel(rangeText) {
    return String(rangeText || "")
        .replace(/[^0-9,-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 40) || "extracted";
}
