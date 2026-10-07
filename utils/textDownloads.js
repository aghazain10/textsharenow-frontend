/**
 * Download a received text as a file — .txt, .md, .json, or a hand-built .pdf.
 *
 * The PDF writer is a minimal, dependency-free generator: Helvetica, one
 * page size (US Letter), word-wrapped lines, as many pages as needed.
 * Everything written is plain ASCII so byte offsets in the xref table
 * stay exact.
 */

const FORMATS = {
    txt: { ext: "txt", mime: "text/plain;charset=utf-8" },
    md: { ext: "md", mime: "text/markdown;charset=utf-8" },
    json: { ext: "json", mime: "application/json;charset=utf-8" },
    pdf: { ext: "pdf", mime: "application/pdf" },
};

// ── Plain-text formats ───────────────────────────────────────────────────────

function contentFor(text, format, code) {
    if (format === "json") {
        const payload = code ? { code, text } : { text };
        return JSON.stringify(payload, null, 2);
    }
    // .txt and .md carry the text exactly as it was shared
    return text;
}

// ── PDF ──────────────────────────────────────────────────────────────────────

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN = 54;
const FONT_SIZE = 10;
const LEADING = 14;
const CHARS_PER_LINE = 92;
const LINES_PER_PAGE = Math.floor((PAGE_H - MARGIN - MARGIN) / LEADING);

// Map typographic characters to ASCII, then drop anything outside Latin-1
// (which WinAnsiEncoding can represent) — it becomes "?". The result only
// contains chars <= 0xFF, so string length === byte length in latin1.
function toLatin1(str) {
    return str
        .replace(/[\u2018\u2019\u201A\u2032\u2035]/g, "'")
        .replace(/[\u201C\u201D\u201E\u2033\u2036]/g, '"')
        .replace(/[\u2013\u2014\u2015\u2212]/g, "-")
        .replace(/\u2026/g, "...")
        .replace(/\u00A0/g, " ")
        .replace(/\u20AC/g, "EUR")
        .replace(/[\u2022\u25CF\u25E6\u25CB]/g, "-")
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
        .replace(/[\u0100-\uFFFF]/g, "?");
}

function wrapLine(line) {
    if (line.length <= CHARS_PER_LINE) return [line];
    const out = [];
    let rest = line;
    while (rest.length > CHARS_PER_LINE) {
        let cut = rest.lastIndexOf(" ", CHARS_PER_LINE);
        if (cut <= 0) cut = CHARS_PER_LINE;
        out.push(rest.slice(0, cut));
        rest = rest.slice(cut).replace(/^ +/, "");
    }
    if (rest) out.push(rest);
    return out;
}

function pdfEscape(str) {
    return str.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

export function buildPdf(text) {
    const lines = toLatin1(text.replace(/\r\n?/g, "\n"))
        .split("\n")
        .flatMap((l) => wrapLine(l.replace(/\t/g, "    ")));
    const safeLines = lines.length ? lines : [""];

    const pageChunks = [];
    for (let i = 0; i < safeLines.length; i += LINES_PER_PAGE) {
        pageChunks.push(safeLines.slice(i, i + LINES_PER_PAGE));
    }

    const pageCount = pageChunks.length;
    const firstPageObj = 4;
    const kids = pageChunks.map((_, i) => `${firstPageObj + i * 2} 0 R`).join(" ");

    const chunks = ["%PDF-1.4\n"];
    const offsets = []; // offsets[i] = byte offset of object i+1
    const push = (s) => chunks.push(s);

    const beginObj = (n) => {
        offsets[n - 1] = chunks.join("").length;
        push(`${n} 0 obj\n`);
    };
    const endObj = () => push("endobj\n");

    beginObj(1);
    push("<< /Type /Catalog /Pages 2 0 R >>\n");
    endObj();

    beginObj(2);
    push(`<< /Type /Pages /Kids [${kids}] /Count ${pageCount} >>\n`);
    endObj();

    beginObj(3);
    push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\n");
    endObj();

    pageChunks.forEach((pageLines, i) => {
        const pageObj = firstPageObj + i * 2;
        const contentObj = pageObj + 1;

        beginObj(pageObj);
        push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentObj} 0 R >>\n`);
        endObj();

        const stream =
            `BT /F1 ${FONT_SIZE} Tf ${LEADING} TL ${MARGIN} ${PAGE_H - MARGIN} Td\n` +
            pageLines.map((l) => `(${pdfEscape(l)}) Tj T*\n`).join("") +
            "ET";
        beginObj(contentObj);
        push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\n`);
        endObj();
    });

    const objCount = 3 + pageCount * 2;
    const xrefOffset = chunks.join("").length;
    let xref = `xref\n0 ${objCount + 1}\n0000000000 65535 f \n`;
    for (let i = 1; i <= objCount; i++) {
        xref += `${String(offsets[i - 1]).padStart(10, "0")} 00000 n \n`;
    }
    push(xref);
    push(`trailer\n<< /Size ${objCount + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`);

    return chunks.join("");
}

// ── Saving ───────────────────────────────────────────────────────────────────

function saveBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/**
 * Download `text` in the given format ("txt" | "md" | "json" | "pdf").
 * `code` (optional) is baked into the file name for easy filing.
 */
export function downloadText(text, format, { code = "" } = {}) {
    const fmt = FORMATS[format];
    if (!fmt) return false;

    const base = code ? `textsharenow-${code.toLowerCase()}` : "textsharenow-text";
    const filename = `${base}.${fmt.ext}`;
    if (format === "pdf") {
        // buildPdf output is latin1-clean: one char = one byte
        const bytes = Uint8Array.from(buildPdf(text), (c) => c.charCodeAt(0));
        saveBlob(new Blob([bytes], { type: fmt.mime }), filename);
    } else {
        saveBlob(new Blob([contentFor(text, format, code)], { type: fmt.mime }), filename);
    }
    return true;
}
