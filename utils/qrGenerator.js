// QR helpers shared by the QR studio. The heavy lifting (encoding, SVG and
// PNG generation) comes from the vendored MIT-licensed generator in ./qr.js.
// Everything here runs in the browser — no payload ever leaves the device.
import qrcode from "./qr.js";

const QUIET_ZONE = 4; // modules, per the QR spec

export function createQr(text, errorCorrection = "M") {
    const qr = qrcode(0, errorCorrection);
    qr.addData(text);
    qr.make();
    return qr;
}

/** Inline SVG for the tool preview. Scales to its container. */
export function qrPreviewSvg(qr, label = "QR code preview") {
    return qr.createSvgTag({
        cellSize: 8,
        margin: 8 * QUIET_ZONE,
        scalable: true,
        alt: label,
    });
}

/**
 * Download-ready SVG. `size` is the nominal pixel size; modules stay whole so
 * the real output can be a few pixels smaller.
 */
export function qrSvg(qr, size = 1024, label = "QR code") {
    const cellSize = qrCellSize(qr, size);
    return qr.createSvgTag({
        cellSize,
        margin: cellSize * QUIET_ZONE,
        alt: label,
    });
}

/** PNG blob at (approximately) the requested size. Client-only. */
export async function qrPngBlob(qr, size = 1024) {
    if (typeof document === "undefined") {
        throw new Error("PNG export needs a browser");
    }

    const count = qr.getModuleCount();
    const cellSize = qrCellSize(qr, size);
    const total = (count + QUIET_ZONE * 2) * cellSize;
    const canvas = document.createElement("canvas");
    canvas.width = total;
    canvas.height = total;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, total, total);
    ctx.fillStyle = "#000000";

    for (let row = 0; row < count; row += 1) {
        for (let col = 0; col < count; col += 1) {
            if (!qr.isDark(row, col)) continue;
            ctx.fillRect(
                (col + QUIET_ZONE) * cellSize,
                (row + QUIET_ZONE) * cellSize,
                cellSize,
                cellSize,
            );
        }
    }

    return await new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => (blob ? resolve(blob) : reject(new Error("Could not encode PNG"))),
            "image/png",
        );
    });
}

export function qrCellSize(qr, target) {
    return Math.max(1, Math.floor(target / (qr.getModuleCount() + QUIET_ZONE * 2)));
}

export function qrOutputSize(qr, target) {
    return (qr.getModuleCount() + QUIET_ZONE * 2) * qrCellSize(qr, target);
}

export function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ── Payload builders ──────────────────────────────────────────────────────

/** Escape the characters the Wi-Fi QR spec treats as syntax. */
function wifiEscape(value) {
    return String(value).replace(/([\\;,":])/g, "\\$1");
}

export function wifiPayload({ ssid, password, security = "WPA", hidden = false }) {
    const type = security === "nopass" ? "nopass" : security;
    let out = `WIFI:T:${type};S:${wifiEscape(ssid)};`;
    if (type !== "nopass") out += `P:${wifiEscape(password)};`;
    if (hidden) out += "H:true;";
    return out + ";";
}

/** Escape vCard 3.0 text values (backslash, newline, comma, semicolon). */
function vcardEscape(value) {
    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/\n/g, "\\n")
        .replace(/,/g, "\\,")
        .replace(/;/g, "\\;");
}

export function vcardPayload({ firstName, lastName, org, title, phone, email, url }) {
    const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
    const lines = ["BEGIN:VCARD", "VERSION:3.0"];
    lines.push(`N:${vcardEscape(lastName)};${vcardEscape(firstName)};;;`);
    lines.push(`FN:${vcardEscape(fullName || org || "")}`);
    if (org) lines.push(`ORG:${vcardEscape(org)}`);
    if (title) lines.push(`TITLE:${vcardEscape(title)}`);
    if (phone) lines.push(`TEL;TYPE=CELL:${vcardEscape(phone)}`);
    if (email) lines.push(`EMAIL:${vcardEscape(email)}`);
    if (url) lines.push(`URL:${vcardEscape(url)}`);
    lines.push("END:VCARD");
    return lines.join("\n");
}

export function messagePayload({ channel, email, phone, subject, body }) {
    if (channel === "email") {
        const params = [];
        if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
        if (body) params.push(`body=${encodeURIComponent(body)}`);
        return `mailto:${email}${params.length ? `?${params.join("&")}` : ""}`;
    }
    if (channel === "sms") {
        const digits = phone.replace(/[^\d+]/g, "");
        return `sms:${digits}${body ? `?body=${encodeURIComponent(body)}` : ""}`;
    }
    if (channel === "whatsapp") {
        const digits = phone.replace(/[^\d]/g, "");
        return `https://wa.me/${digits}${body ? `?text=${encodeURIComponent(body)}` : ""}`;
    }
    if (channel === "phone") {
        return `tel:${phone.replace(/[^\d+]/g, "")}`;
    }
    return "";
}
