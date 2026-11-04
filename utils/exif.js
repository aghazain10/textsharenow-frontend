// Read and strip photo metadata entirely in the browser.
//
// JPEG/PNG/WebP are handled at the byte level, so the pixels are never
// re-encoded and no quality is lost. Everything else falls back to a canvas
// re-encode in the component (which rebuilds the image without metadata).

const ASCII = "ascii";
const TEXT_CHUNKS = new Set(["tEXt", "zTXt", "iTXt"]);

function ascii(bytes, start, length) {
    let out = "";
    const end = Math.min(bytes.length, start + length);
    for (let i = start; i < end; i++) {
        const code = bytes[i];
        if (code === 0) break;
        out += String.fromCharCode(code);
    }
    return out.trim();
}

function matches(bytes, start, text) {
    if (start + text.length > bytes.length) return false;
    for (let i = 0; i < text.length; i++) {
        if (bytes[start + i] !== text.charCodeAt(i)) return false;
    }
    return true;
}

function sniff(bytes) {
    if (bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpeg";
    if (bytes.length > 8 && bytes[0] === 0x89 && matches(bytes, 1, "PNG")) return "png";
    if (bytes.length > 12 && matches(bytes, 0, "RIFF") && matches(bytes, 8, "WEBP")) return "webp";
    return "other";
}

// ── TIFF/EXIF parsing ────────────────────────────────────────────────────────

const TYPE_SIZE = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 6: 1, 7: 1, 8: 2, 9: 4, 10: 8 };

function parseTiff(bytes, tiffStart) {
    const out = { fields: new Map(), gpsFields: new Map(), flash: null };
    if (!bytes || tiffStart < 0 || tiffStart + 8 > bytes.length) return out;

    const little = bytes[tiffStart] === 0x49 && bytes[tiffStart + 1] === 0x49;
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const u16 = (offset) => (offset + 2 > bytes.length ? 0 : view.getUint16(offset, little));
    const u32 = (offset) => (offset + 4 > bytes.length ? 0 : view.getUint32(offset, little));
    const i32 = (offset) => (offset + 4 > bytes.length ? 0 : view.getInt32(offset, little));

    if (u16(tiffStart + 2) !== 0x2a) return out;

    function readValues(entryOffset) {
        const type = u16(entryOffset + 2);
        const count = u32(entryOffset + 4);
        const size = TYPE_SIZE[type];
        if (!size || count > 100000) return null;
        const total = size * count;
        const dataStart = total <= 4 ? entryOffset + 8 : tiffStart + u32(entryOffset + 8);
        if (dataStart < tiffStart || dataStart + total > bytes.length) return null;

        if (type === 2) return ascii(bytes, dataStart, count);
        if (type === 1 || type === 7) return Array.from(bytes.slice(dataStart, dataStart + Math.min(count, 64)));
        if (type === 3) {
            const values = [];
            for (let i = 0; i < Math.min(count, 32); i++) values.push(u16(dataStart + i * 2));
            return values.length === 1 ? values[0] : values;
        }
        if (type === 4) {
            const values = [];
            for (let i = 0; i < Math.min(count, 32); i++) values.push(u32(dataStart + i * 4));
            return values.length === 1 ? values[0] : values;
        }
        if (type === 9) {
            const values = [];
            for (let i = 0; i < Math.min(count, 32); i++) values.push(i32(dataStart + i * 4));
            return values.length === 1 ? values[0] : values;
        }
        if (type === 5 || type === 10) {
            const values = [];
            for (let i = 0; i < Math.min(count, 8); i++) {
                const base = dataStart + i * 8;
                const n = type === 5 ? u32(base) : i32(base);
                const d = type === 5 ? u32(base + 4) : i32(base + 4);
                values.push({ n, d });
            }
            return values.length === 1 ? values[0] : values;
        }
        return null;
    }

    function readIfd(offset) {
        const fields = new Map();
        if (offset < 0 || offset + 2 > bytes.length) return fields;
        const count = u16(offset);
        if (count > 2048) return fields;
        for (let i = 0; i < count; i++) {
            const entry = offset + 2 + i * 12;
            if (entry + 12 > bytes.length) break;
            const tag = u16(entry);
            try {
                const value = readValues(entry);
                if (value !== null && value !== "") fields.set(tag, value);
            } catch {}
        }
        return fields;
    }

    const ifd0Offset = tiffStart + u32(tiffStart + 4);
    out.fields = readIfd(ifd0Offset);

    const exifPointer = out.fields.get(0x8769);
    if (typeof exifPointer === "number") {
        const exifFields = readIfd(tiffStart + exifPointer);
        for (const [tag, value] of exifFields) {
            if (!out.fields.has(tag)) out.fields.set(tag, value);
        }
    }

    const gpsPointer = out.fields.get(0x8825);
    if (typeof gpsPointer === "number") {
        out.gpsFields = readIfd(tiffStart + gpsPointer);
    }

    return out;
}

function toNumber(value) {
    if (typeof value === "number") return value;
    if (Array.isArray(value)) return toNumber(value[0]);
    if (value && typeof value === "object" && "n" in value) {
        return value.d ? value.n / value.d : value.n;
    }
    return null;
}

function gpsCoordinate(values, ref) {
    if (!Array.isArray(values) || values.length < 3) return null;
    const [deg, min, sec] = values.map((v) => toNumber(v) || 0);
    if (deg === null) return null;
    let decimal = deg + min / 60 + sec / 3600;
    if (typeof ref === "string" && /^[SW]/i.test(ref.trim())) decimal = -decimal;
    return Number.isFinite(decimal) ? Number(decimal.toFixed(6)) : null;
}

function formatExposure(value) {
    const n = toNumber(value);
    if (!n) return null;
    if (n < 0.5) {
        const denom = Math.round(1 / n);
        return `1/${denom} s`;
    }
    return `${Number(n.toFixed(1))} s`;
}

const ORIENTATION = {
    1: "Normal",
    2: "Mirrored horizontally",
    3: "Rotated 180°",
    4: "Mirrored vertically",
    5: "Mirrored and rotated 90°",
    6: "Rotated 90° clockwise",
    7: "Mirrored and rotated 270°",
    8: "Rotated 270° clockwise",
};

function exifSummary(tiff, entries) {
    const f = tiff.fields || new Map();
    const text = (tag) => {
        const value = f.get(tag);
        return typeof value === "string" && value.trim() ? value.trim() : null;
    };
    const push = (label, value, sensitive = false) => {
        if (value === null || value === undefined || value === "") return;
        entries.push({ label, value: String(value), sensitive });
    };

    const make = text(0x010f);
    const model = text(0x0110);
    push("Camera", [make, model].filter(Boolean).join(" ") || null);
    push("Lens", text(0xa434));
    push("Date taken", text(0x9003) || text(0x0132));
    push("Software", text(0x0131));
    push("Artist", text(0x013b));
    push("Copyright", text(0x8298));

    const orientation = toNumber(f.get(0x0112));
    if (orientation && orientation !== 1) push("Orientation", ORIENTATION[orientation] || `Value ${orientation}`);

    const exposure = formatExposure(f.get(0x829a));
    const fNumber = toNumber(f.get(0x829d));
    const iso = toNumber(f.get(0x8827));
    const focal = toNumber(f.get(0x920a));
    const cameraSettings = [
        exposure,
        fNumber ? `f/${Number(fNumber.toFixed(1))}` : null,
        iso ? `ISO ${Math.round(iso)}` : null,
        focal ? `${Math.round(focal)} mm` : null,
    ].filter(Boolean);
    push("Settings", cameraSettings.length ? cameraSettings.join(" · ") : null);

    const width = toNumber(f.get(0xa002));
    const height = toNumber(f.get(0xa003));
    if (width && height) push("Original pixels", `${width} × ${height}`);

    state.lastOrientation = orientation && orientation !== 1 ? orientation : null;
    return entries;
}

let state = { lastOrientation: null };

function gpsFrom(tiff) {
    const g = tiff.gpsFields || new Map();
    if (!g.size) return null;
    const lat = gpsCoordinate(g.get(2), g.get(1));
    const lon = gpsCoordinate(g.get(4), g.get(3));
    if (lat === null || lon === null) return null;
    const altitude = toNumber(g.get(6));
    return {
        lat,
        lon,
        altitude: altitude === null ? null : Number(((toNumber(g.get(5)) === 1 ? -1 : 1) * altitude).toFixed(1)),
        timestamp: typeof g.get(7) !== "undefined" ? g.get(7) : null,
        datestamp: typeof g.get(29) === "string" ? g.get(29) : null,
    };
}

// ── JPEG ─────────────────────────────────────────────────────────────────────

function jpegScan(bytes) {
    const info = { hasExif: false, hasXmp: false, hasIptc: false, hasComment: false, exifStart: -1, segments: [] };
    let i = 2;
    while (i + 1 < bytes.length) {
        if (bytes[i] !== 0xff) {
            i++;
            continue;
        }
        const marker = bytes[i + 1];
        if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
            i += 2;
            continue;
        }
        if (marker === 0xd9 || marker === 0xda) {
            // EOI or start of scan: everything from here is pixel data.
            info.segments.push({ marker, start: i, length: bytes.length - i });
            break;
        }
        if (i + 4 > bytes.length) break;
        const length = (bytes[i + 2] << 8) | bytes[i + 3];
        if (length < 2) break;
        const dataStart = i + 4;
        info.segments.push({ marker, start: i, length: 2 + length });

        if (marker === 0xe1) {
            if (matches(bytes, dataStart, "Exif\0\0")) {
                info.hasExif = true;
                info.exifStart = dataStart + 6;
            } else if (matches(bytes, dataStart, "http://ns.adobe.com/xap/1.0/\0")) {
                info.hasXmp = true;
            }
        }
        if (marker === 0xed) info.hasIptc = true;
        if (marker === 0xfe) info.hasComment = true;

        i += 2 + length;
    }
    return info;
}

/** Remove metadata segments from a JPEG without touching the compressed pixels. */
function stripJpeg(bytes) {
    const parts = [bytes.slice(0, 2)];
    let i = 2;
    while (i + 1 < bytes.length) {
        if (bytes[i] !== 0xff) {
            parts.push(bytes.slice(i));
            break;
        }
        const marker = bytes[i + 1];
        if (marker === 0xd9 || marker === 0xda) {
            parts.push(bytes.slice(i));
            break;
        }
        if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
            parts.push(bytes.slice(i, i + 2));
            i += 2;
            continue;
        }
        if (i + 4 > bytes.length) {
            parts.push(bytes.slice(i));
            break;
        }
        const length = (bytes[i + 2] << 8) | bytes[i + 3];
        if (length < 2) {
            parts.push(bytes.slice(i));
            break;
        }
        // APP1 (EXIF/XMP), APP12, APP13 (IPTC) and COM carry metadata.
        // APP2 is kept: it usually holds the ICC colour profile, which keeps
        // colours looking the same. APP14 (Adobe) is kept for colour transforms.
        const drop = marker === 0xe1 || marker === 0xec || marker === 0xed || marker === 0xfe;
        if (!drop) parts.push(bytes.slice(i, i + 2 + length));
        i += 2 + length;
    }
    return concat(parts);
}

// ── PNG ──────────────────────────────────────────────────────────────────────

function pngChunks(bytes) {
    const chunks = [];
    let i = 8;
    while (i + 8 <= bytes.length) {
        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        const length = view.getUint32(i);
        const type = String.fromCharCode(bytes[i + 4], bytes[i + 5], bytes[i + 6], bytes[i + 7]);
        const end = i + 12 + length;
        if (end > bytes.length || end < i) break;
        chunks.push({ type, start: i, end, dataStart: i + 8, length });
        i = end;
        if (type === "IEND") break;
    }
    return chunks;
}

function pngMetadata(bytes, chunks) {
    const entries = [];
    let hasMetadata = false;
    let tiff = null;

    for (const chunk of chunks) {
        if (TEXT_CHUNKS.has(chunk.type)) {
            hasMetadata = true;
            const keyword = ascii(bytes, chunk.dataStart, Math.min(79, chunk.length));
            let value = "";
            if (chunk.type === "tEXt") {
                let pos = chunk.dataStart;
                while (pos < chunk.dataStart + chunk.length && bytes[pos] !== 0) pos++;
                value = ascii(bytes, pos + 1, chunk.dataStart + chunk.length - pos - 1);
            }
            entries.push({ label: keyword || "Text", value: value ? value.slice(0, 160) : `${chunk.type} chunk`, sensitive: /author|comment|location|gps/i.test(keyword || "") });
        } else if (chunk.type === "eXIf") {
            hasMetadata = true;
            tiff = parseTiff(bytes, chunk.dataStart);
        } else if (chunk.type === "tIME") {
            hasMetadata = true;
            entries.push({ label: "Last modified", value: "PNG tIME chunk", sensitive: false });
        }
    }

    if (tiff) exifSummary(tiff, entries);
    return { entries, gps: tiff ? gpsFrom(tiff) : null, hasMetadata, orientation: state.lastOrientation };
}

function stripPng(bytes, chunks) {
    const remove = new Set(["tEXt", "zTXt", "iTXt", "eXIf", "tIME"]);
    const parts = [bytes.slice(0, 8)];
    for (const chunk of chunks) {
        if (remove.has(chunk.type)) continue;
        parts.push(bytes.slice(chunk.start, chunk.end));
    }
    return concat(parts);
}

// ── WebP ─────────────────────────────────────────────────────────────────────

function webpChunks(bytes) {
    const chunks = [];
    let i = 12;
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    while (i + 8 <= bytes.length) {
        const type = String.fromCharCode(bytes[i], bytes[i + 1], bytes[i + 2], bytes[i + 3]);
        const length = view.getUint32(i + 4, true);
        const dataStart = i + 8;
        const end = dataStart + length;
        if (end > bytes.length) break;
        chunks.push({ type, start: i, dataStart, length, end: end + (length % 2) });
        i = end + (length % 2);
    }
    return chunks;
}

function webpMetadata(bytes, chunks) {
    const entries = [];
    let hasMetadata = false;
    let tiff = null;
    for (const chunk of chunks) {
        if (chunk.type === "EXIF") {
            hasMetadata = true;
            tiff = parseTiff(bytes, chunk.dataStart);
        } else if (chunk.type === "XMP ") {
            hasMetadata = true;
            entries.push({ label: "XMP metadata", value: "Adobe XMP packet", sensitive: false });
        } else if (chunk.type === "ICCP") {
            entries.push({ label: "Colour profile", value: "ICC profile (kept — not personal data)", sensitive: false });
        }
    }
    if (tiff) exifSummary(tiff, entries);
    return { entries, gps: tiff ? gpsFrom(tiff) : null, hasMetadata, orientation: state.lastOrientation };
}

function stripWebp(bytes, chunks) {
    const remove = new Set(["EXIF", "XMP "]);
    const body = [];
    for (const chunk of chunks) {
        if (remove.has(chunk.type)) continue;
        if (chunk.type === "VP8X" && chunk.length >= 1) {
            const copy = bytes.slice(chunk.start, chunk.end);
            // Clear the EXIF (0x08) and XMP (0x04) feature-flag bits.
            copy[8] &= ~0x0c;
            body.push(copy);
            continue;
        }
        body.push(bytes.slice(chunk.start, chunk.end));
    }
    const payload = concat(body);
    const header = new Uint8Array(12);
    header.set([0x52, 0x49, 0x46, 0x46], 0); // RIFF
    const size = payload.length + 4;
    header[4] = size & 0xff;
    header[5] = (size >> 8) & 0xff;
    header[6] = (size >> 16) & 0xff;
    header[7] = (size >> 24) & 0xff;
    header.set([0x57, 0x45, 0x42, 0x50], 8); // WEBP
    return concat([header, payload]);
}

function concat(parts) {
    const total = parts.reduce((sum, part) => sum + part.length, 0);
    const out = new Uint8Array(total);
    let offset = 0;
    for (const part of parts) {
        out.set(part, offset);
        offset += part.length;
    }
    return out;
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Inspect a file's metadata. Returns readable entries (what a person would
 * recognise) plus GPS coordinates when present.
 */
export async function readImageMetadata(file) {
    state = { lastOrientation: null };
    const bytes = new Uint8Array(await file.arrayBuffer());
    const kind = sniff(bytes);

    if (kind === "jpeg") {
        const scan = jpegScan(bytes);
        const entries = [];
        let gps = null;
        let orientation = null;
        if (scan.hasExif && scan.exifStart >= 0) {
            const tiff = parseTiff(bytes, scan.exifStart);
            exifSummary(tiff, entries);
            gps = gpsFrom(tiff);
            orientation = state.lastOrientation;
        }
        if (scan.hasXmp) entries.push({ label: "XMP metadata", value: "Adobe XMP packet", sensitive: false });
        if (scan.hasIptc) entries.push({ label: "IPTC metadata", value: "Captions, keywords, credits", sensitive: false });
        if (scan.hasComment) entries.push({ label: "JPEG comment", value: "Comment segment", sensitive: false });
        return {
            kind,
            entries,
            gps,
            orientation,
            hasMetadata: scan.hasExif || scan.hasXmp || scan.hasIptc || scan.hasComment,
            canStrip: true,
        };
    }

    if (kind === "png") {
        const chunks = pngChunks(bytes);
        const meta = pngMetadata(bytes, chunks);
        return { kind, ...meta, canStrip: true };
    }

    if (kind === "webp") {
        const chunks = webpChunks(bytes);
        const meta = webpMetadata(bytes, chunks);
        return { kind, ...meta, canStrip: true };
    }

    return { kind, entries: [], gps: null, orientation: null, hasMetadata: false, canStrip: false };
}

/** Strip metadata losslessly. Returns null when the format needs a re-encode. */
export async function stripImageMetadata(file) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const kind = sniff(bytes);
    if (kind === "jpeg") return { bytes: stripJpeg(bytes), kind, mime: "image/jpeg", lossless: true };
    if (kind === "png") return { bytes: stripPng(bytes, pngChunks(bytes)), kind, mime: "image/png", lossless: true };
    if (kind === "webp") return { bytes: stripWebp(bytes, webpChunks(bytes)), kind, mime: "image/webp", lossless: true };
    return null;
}

export function cleanedName(file, mime) {
    const ext = mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";
    const base = String(file?.name || "photo").replace(/\.[^./\\]+$/, "").slice(0, 80) || "photo";
    return `${base}-clean.${ext}`;
}
