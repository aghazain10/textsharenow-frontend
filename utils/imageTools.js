// Client-side image decoding, resizing and compression.
// Everything here runs in the browser: no bytes ever leave the device.

export const IMAGE_MIME = {
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
};

export const IMAGE_EXT = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
};

export const MAX_INPUT_BYTES = 60 * 1024 * 1024;

export function formatBytes(bytes) {
    const n = Number(bytes) || 0;
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(n < 10 * 1024 ? 1 : 0)} KB`;
    return `${(n / (1024 * 1024)).toFixed(n < 10 * 1024 * 1024 ? 1 : 0)} MB`;
}

export function isHeic(file) {
    return /hei[cf]/i.test(file.type || "") || /\.(heic|heif)$/i.test(file.name || "");
}

export function isImageFile(file) {
    return !!(file && (String(file.type || "").startsWith("image/") || isHeic(file)));
}

/**
 * Decode a File/Blob into something drawable on a canvas.
 * HEIC/HEIF is converted with heic2any first, so iPhones photos work in
 * Chrome and Firefox too (Safari can already decode them natively).
 */
export async function decodeImage(file) {
    let source = file;
    if (isHeic(file)) {
        let heic2any;
        try {
            ({ default: heic2any } = await import("heic2any"));
        } catch {
            throw new Error("Couldn't load the HEIC decoder. Check your connection and try again.");
        }
        try {
            const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.92 });
            source = Array.isArray(converted) ? converted[0] : converted;
        } catch {
            throw new Error("This HEIC photo couldn't be decoded. Try converting it on your device first.");
        }
    }

    if (typeof createImageBitmap === "function") {
        try {
            return await createImageBitmap(source, { imageOrientation: "from-image" });
        } catch {
            // Older browsers don't accept the options object; retry plainly.
            try {
                return await createImageBitmap(source);
            } catch {}
        }
    }

    const url = URL.createObjectURL(source);
    try {
        return await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error("This file isn't an image the browser can open."));
            img.src = url;
        });
    } finally {
        URL.revokeObjectURL(url);
    }
}

export function imageSize(img) {
    return {
        width: img.width || img.naturalWidth || 0,
        height: img.height || img.naturalHeight || 0,
    };
}

/** Draw the decoded image onto a fresh canvas, optionally capping the longest side. */
export function drawToCanvas(img, maxDimension) {
    const { width, height } = imageSize(img);
    if (!width || !height) throw new Error("This image has no readable dimensions.");
    let scale = 1;
    if (maxDimension && Math.max(width, height) > maxDimension) {
        scale = maxDimension / Math.max(width, height);
    }
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Your browser blocked canvas drawing on this page.");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas;
}

export function canvasToBlob(canvas, type, quality) {
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => (blob ? resolve(blob) : reject(new Error("The browser couldn't encode this image."))),
            type,
            quality,
        );
    });
}

/** Pick the output MIME type for a requested format. */
export function resolveMime(format, file) {
    if (format === "jpeg" || format === "png" || format === "webp") return IMAGE_MIME[format];
    const incoming = String(file?.type || "").toLowerCase();
    if (incoming === "image/png") return "image/png";
    if (incoming === "image/webp") return "image/webp";
    // HEIC/HEIF and anything else becomes JPEG, which every device can open.
    return "image/jpeg";
}

async function shrinkCanvas(img, maxDimension, scale) {
    const canvas = drawToCanvas(img, maxDimension);
    if (scale >= 1) return canvas;
    const out = document.createElement("canvas");
    out.width = Math.max(1, Math.round(canvas.width * scale));
    out.height = Math.max(1, Math.round(canvas.height * scale));
    const ctx = out.getContext("2d");
    if (!ctx) throw new Error("Your browser blocked canvas drawing on this page.");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(canvas, 0, 0, out.width, out.height);
    return out;
}

/**
 * Compress one image.
 * - JPEG/WebP: binary-search the quality that lands just under targetBytes.
 * - PNG: quality isn't a thing, so shrink the pixel dimensions instead.
 * - No targetBytes: encode once at `quality`.
 * Always re-draws from the decoded source, so repeated attempts don't
 * compound compression artifacts.
 */
export async function compressImage({ img, file, format = "auto", targetBytes = 0, quality = 0.8, maxDimension = 0 }) {
    const mime = resolveMime(format, file);
    const target = Number(targetBytes) > 0 ? Number(targetBytes) : 0;
    const maxDim = Number(maxDimension) > 0 ? Number(maxDimension) : 0;

    if (!target) {
        const canvas = drawToCanvas(img, maxDim);
        const q = mime === "image/jpeg" || mime === "image/webp" ? clamp(quality, 0.05, 1) : undefined;
        const blob = await canvasToBlob(canvas, mime, q);
        return { blob, width: canvas.width, height: canvas.height, mime, quality: q ?? null };
    }

    if (mime === "image/png") {
        // Lossless format: the only lever is pixel count.
        let lo = 0.08;
        let hi = 1;
        let best = null;
        for (let i = 0; i < 9; i++) {
            const scale = (lo + hi) / 2;
            const canvas = await shrinkCanvas(img, maxDim, scale);
            const blob = await canvasToBlob(canvas, mime);
            if (blob.size <= target) {
                best = { blob, width: canvas.width, height: canvas.height, mime, quality: null };
                lo = scale;
            } else {
                hi = scale;
            }
        }
        if (best) return best;
        // Even the smallest useful size is over target: return the smallest we made.
        const canvas = await shrinkCanvas(img, maxDim, 0.08);
        const blob = await canvasToBlob(canvas, mime);
        return { blob, width: canvas.width, height: canvas.height, mime, quality: null };
    }

    // JPEG / WebP: try the full size first, then step the dimensions down if
    // even the lowest sensible quality can't reach the target.
    let dimensionScale = 1;
    for (let attempt = 0; attempt < 6; attempt++) {
        const canvas = await shrinkCanvas(img, maxDim, dimensionScale);
        let lo = 0.05;
        let hi = 0.95;
        let best = null;
        for (let i = 0; i < 8; i++) {
            const q = (lo + hi) / 2;
            const blob = await canvasToBlob(canvas, mime, q);
            if (blob.size <= target) {
                best = { blob, width: canvas.width, height: canvas.height, mime, quality: Number(q.toFixed(2)) };
                lo = q;
            } else {
                hi = q;
            }
        }
        if (best) return best;
        dimensionScale *= 0.8;
    }

    const canvas = await shrinkCanvas(img, maxDim, dimensionScale);
    const blob = await canvasToBlob(canvas, mime, 0.05);
    return { blob, width: canvas.width, height: canvas.height, mime, quality: 0.05 };
}

function clamp(n, min, max) {
    return Math.min(max, Math.max(min, Number(n) || min));
}

export function outputName(file, mime) {
    const ext = IMAGE_EXT[mime] || "jpg";
    const base = String(file?.name || "image").replace(/\.[^./\\]+$/, "").slice(0, 80) || "image";
    return `${base}-compressed.${ext}`;
}
