// Files that are blocked on every plan, including Pro. These are the
// formats that execute code on the recipient's device or install software,
// which would let a $5 license turn the files domain into a malware host.
export const BLOCKED_EXTENSIONS = [
    "svg",
    "exe", "dll", "msi", "msp", "msix", "appx",
    "bat", "cmd", "com", "scr", "pif", "hta", "cpl", "msc", "reg",
    "vbs", "vbe", "js", "jse", "wsf", "wsh", "ps1", "psm1", "sh", "bash",
    "jar", "apk", "aab", "deb", "rpm", "dmg", "pkg", "app", "run",
    "lnk", "url", "desktop", "service",
];

export const BLOCKED_MIME = [
    "image/svg+xml",
    "application/x-msdownload",
    "application/x-msdos-program",
    "application/x-ms-installer",
    "application/vnd.microsoft.portable-executable",
    "application/x-msi",
    "application/java-archive",
    "application/vnd.android.package-archive",
    "application/vnd.debian.binary-package",
    "application/x-rpm",
    "application/x-apple-diskimage",
    "application/x-sh",
    "application/x-bat",
    "application/x-ms-shortcut",
    "application/x-executable",
    "application/x-elf",
];

export function fileExtension(name) {
    const clean = String(name || "").toLowerCase().trim();
    const dot = clean.lastIndexOf(".");
    return dot === -1 ? "" : clean.slice(dot + 1);
}

export function isBlockedFile(name, mime) {
    if (mime && BLOCKED_MIME.includes(String(mime).toLowerCase())) return true;
    return BLOCKED_EXTENSIONS.includes(fileExtension(name));
}

export function normalizeTransferPath(value, fallbackName = "") {
    const source = String(value || "").trim() || String(fallbackName || "").trim();
    if (!source) return "";
    const normalized = source.replace(/\\/g, "/").normalize("NFC");
    if (normalized.startsWith("/") || /^[a-zA-Z]:/.test(normalized)) return "";
    const parts = normalized.split("/").filter((part) => part && part !== ".");
    if (!parts.length) return "";
    if (parts.some((part) => part === ".." || /[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/.test(part))) return "";
    const path = parts.join("/");
    return path.length <= 512 ? path : "";
}
