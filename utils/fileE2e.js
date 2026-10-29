// End-to-end encryption for file shares.
//
// Each file is encrypted in the browser with AES-256-GCM before it is sent.
// The key travels only in the URL fragment (#k=...), never in a request. The
// ciphertext is self-describing so the receiver can decrypt a single file
// without any server-side metadata or key escrow.
//
// Container format (all integers big-endian):
//   "TSNF1"             5 bytes
//   version             1 byte  (currently 1)
//   chunk size          4 bytes (plaintext bytes per chunk, 1 MiB)
//   nonce prefix        8 bytes (random per file)
//   payload length      8 bytes (authenticated with every chunk)
//   chunks               each: AES-256-GCM(chunk, IV = prefix || index, AAD = header)
//
// The encrypted payload starts with a 4-byte metadata length and JSON
// { name, type }, followed by the original file bytes. That keeps the
// filename recoverable for single-file links while the server only ever
// sees ciphertext. File names/paths are still sent as share metadata
// (they are visible by design); the encryption protects contents.
import { fromB64url } from "./e2e.js";

const MAGIC = new Uint8Array([0x54, 0x53, 0x4e, 0x46, 0x31]); // TSNF1
const VERSION = 1;
const CHUNK_SIZE = 1024 * 1024;
const HEADER_SIZE = 26;
const TAG_SIZE = 16;
const KEY_RE = /^[A-Za-z0-9_-]{43}$/;
const MAX_PLAINTEXT = 256 * 1024 * 1024;


function writeU32(bytes, offset, value) {
    new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).setUint32(offset, value >>> 0, false);
}

function readU32(bytes, offset) {
    return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(offset, false);
}

function writeU64(bytes, offset, value) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    view.setUint32(offset, Math.floor(value / 0x100000000), false);
    view.setUint32(offset + 4, value >>> 0, false);
}

function readU64(bytes, offset) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    return view.getUint32(offset, false) * 0x100000000 + view.getUint32(offset + 4, false);
}

function chunkIv(prefix, index) {
    const iv = new Uint8Array(12);
    iv.set(prefix, 0);
    writeU32(iv, 8, index);
    return iv;
}

async function importKey(keyB64, usage) {
    if (!KEY_RE.test(keyB64 || "")) throw new Error("BADKEY");
    return crypto.subtle.importKey("raw", fromB64url(keyB64), "AES-GCM", false, [usage]);
}

function safeName(name) {
    const base = String(name || "download.bin").split(/[\\/]/).pop() || "download.bin";
    return base.replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 255) || "download.bin";
}

/**
 * Encrypt a File/Blob in the browser.
 * Returns a Blob containing the TSNF1 container.
 */
export async function encryptFile(file, keyB64, meta = null) {
    if (!file || !file.size) throw new Error("EMPTY_FILE");
    if (!KEY_RE.test(keyB64 || "")) throw new Error("BADKEY");

    const metadata = new TextEncoder().encode(JSON.stringify({
        name: safeName(meta?.name ?? file.name),
        type: String(meta?.type ?? file.type ?? "application/octet-stream").slice(0, 100),
    }));
    if (metadata.length > 65535) throw new Error("META_TOO_LARGE");

    const prefix = crypto.getRandomValues(new Uint8Array(8));
    const metaLength = new Uint8Array(4);
    writeU32(metaLength, 0, metadata.length);
    const payload = new Blob([metaLength, metadata, file]);
    const total = payload.size;
    if (total > MAX_PLAINTEXT) throw new Error("FILE_TOO_LARGE");

    const header = new Uint8Array(HEADER_SIZE);
    header.set(MAGIC, 0);
    header[5] = VERSION;
    writeU32(header, 6, CHUNK_SIZE);
    header.set(prefix, 10);
    writeU64(header, 18, total);

    const key = await importKey(keyB64, "encrypt");
    const parts = [header];
    for (let offset = 0, index = 0; offset < total; offset += CHUNK_SIZE, index++) {
        const plain = new Uint8Array(await payload.slice(offset, Math.min(offset + CHUNK_SIZE, total)).arrayBuffer());
        const ct = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv: chunkIv(prefix, index), additionalData: header },
            key,
            plain
        );
        parts.push(new Uint8Array(ct));
    }
    return new Blob(parts, { type: "application/octet-stream" });
}

/**
 * Decrypt a TSNF1 container. Returns { blob, name, type }.
 * Throws Error("BADKEY") for a wrong key/corrupt tag and
 * Error("BAD_PAYLOAD") for malformed input.
 */
export async function decryptFile(blob, keyB64) {
    if (!KEY_RE.test(keyB64 || "")) throw new Error("BADKEY");
    if (!blob || blob.size < HEADER_SIZE + TAG_SIZE) throw new Error("BAD_PAYLOAD");

    const header = new Uint8Array(await blob.slice(0, HEADER_SIZE).arrayBuffer());
    for (let i = 0; i < MAGIC.length; i++) {
        if (header[i] !== MAGIC[i]) throw new Error("BAD_PAYLOAD");
    }
    if (header[5] !== VERSION) throw new Error("BAD_PAYLOAD");

    const chunkSize = readU32(header, 6);
    const total = readU64(header, 18);
    if (!chunkSize || chunkSize > 8 * 1024 * 1024 || !total || total > MAX_PLAINTEXT) {
        throw new Error("BAD_PAYLOAD");
    }
    const chunks = Math.ceil(total / chunkSize);
    if (blob.size !== HEADER_SIZE + total + chunks * TAG_SIZE) throw new Error("BAD_PAYLOAD");

    const prefix = header.slice(10, 18);
    const key = await importKey(keyB64, "decrypt");
    const parts = [];
    let offset = HEADER_SIZE;
    let remaining = total;

    for (let index = 0; remaining > 0; index++) {
        const plainLength = Math.min(chunkSize, remaining);
        const ctLength = plainLength + TAG_SIZE;
        const ct = await blob.slice(offset, offset + ctLength).arrayBuffer();
        let plain;
        try {
            plain = await crypto.subtle.decrypt(
                { name: "AES-GCM", iv: chunkIv(prefix, index), additionalData: header },
                key,
                ct
            );
        } catch {
            throw new Error("BADKEY");
        }
        parts.push(new Uint8Array(plain));
        offset += ctLength;
        remaining -= plainLength;
    }

    const payload = new Blob(parts);
    if (payload.size < 4) throw new Error("BAD_PAYLOAD");
    const metaLength = readU32(new Uint8Array(await payload.slice(0, 4).arrayBuffer()), 0);
    if (metaLength < 2 || metaLength > payload.size - 4) throw new Error("BAD_PAYLOAD");

    let meta = null;
    try {
        meta = JSON.parse(new TextDecoder().decode(await payload.slice(4, 4 + metaLength).arrayBuffer()));
    } catch {
        throw new Error("BAD_PAYLOAD");
    }
    if (!meta || typeof meta !== "object") throw new Error("BAD_PAYLOAD");

    return {
        blob: payload.slice(4 + metaLength),
        name: safeName(meta.name),
        type: typeof meta.type === "string" && meta.type ? meta.type : "application/octet-stream",
    };
}
