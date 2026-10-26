// End-to-end encryption for text shares, computed entirely in the browser.
//
// The sender's browser generates a random 256-bit AES-GCM key and encrypts
// the text before it is ever sent to the server. The key travels only in the
// URL fragment (#k=...) — fragments are never transmitted to any server, so
// TextShareNow stores ciphertext it cannot decrypt.
//
// Payload format on the wire and in Redis:
//   v2$<iv-base64url>$<ciphertext-base64url>   (12-byte IV, AES-256-GCM)
//
// Optional passphrase layer (Pro): when the share also has a password, the
// final AES key is derived with HKDF from the fragment key salted by a
// PBKDF2 mix of the password — the recipient needs BOTH the link and the
// password to decrypt. The server keeps only the usual PBKDF2 verifier as
// the gate; it never sees the fragment key.
import { P2_RE } from "./hash.js";

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const INFO = encoder.encode("tsn-e2e-v2");

const CT_RE = /^v2\$([A-Za-z0-9_-]{16})\$([A-Za-z0-9_-]{16,})$/;
const KEY_RE = /^[A-Za-z0-9_-]{43}$/; // 32 bytes, base64url, unpadded

// ── base64url ────────────────────────────────────────────────────────────────

function toB64url(bytes) {
    let bin = "";
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(s) {
    const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const bin = atob(padded);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
}

function hexToBytes(hex) {
    return new Uint8Array(hex.match(/.{2}/g).map((h) => parseInt(h, 16)));
}

// ── fragment key ─────────────────────────────────────────────────────────────
// Captured as a { code, key } pair so a key from one link is never tried
// against a different code typed by hand (that would burn a single-use
// share on a guaranteed decrypt failure).

let pair = null;

/** Read the key out of the URL that opened this page. Safe to call twice. */
export function captureFragmentKey() {
    if (typeof window === "undefined") return pair;
    if (pair) return pair;
    try {
        const query = new URLSearchParams(window.location.search);
        const code = (query.get("code") || "").trim();
        const m = (window.location.hash || "").match(/[#&]k=([A-Za-z0-9_-]+)/);
        if (code && m && KEY_RE.test(m[1])) {
            pair = { code: code.toLowerCase(), key: m[1] };
        }
    } catch {
        // No window / malformed URL — leave the pair unset.
    }
    return pair;
}

/** Remember a key together with the code it belongs to (e.g. pasted link). */
export function rememberShareKey(code, key) {
    if (!code || !key || !KEY_RE.test(key)) return;
    pair = { code: String(code).toLowerCase(), key };
}

/** Drop any remembered key (a bare code was pasted — no key in sight). */
export function forgetShareKey() {
    pair = null;
}

/** The key for this exact code, or "" when there isn't one. */
export function shareKeyFor(code) {
    if (!code) return "";
    const p = captureFragmentKey();
    return p && p.code === String(code).toLowerCase() ? p.key : "";
}

/** Extract a #k= fragment key from an arbitrary pasted string. */
export function keyFromLink(text) {
    const m = String(text || "").match(/[#&]k=([A-Za-z0-9_-]+)/);
    return m && KEY_RE.test(m[1]) ? m[1] : "";
}

/** Generate a fresh random 256-bit share key (base64url). */
export function generateShareKey() {
    return toB64url(crypto.getRandomValues(new Uint8Array(32)));
}

// ── key derivation ───────────────────────────────────────────────────────────

/** PBKDF2(password, salt) as raw bytes — the passphrase mix. */
export async function derivePasswordMix(password, saltHex, iterations) {
    const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits(
        { name: "PBKDF2", salt: hexToBytes(saltHex), iterations, hash: "SHA-256" },
        key,
        256
    );
    return new Uint8Array(bits);
}

/** Derive the mix from a stored p2$ verifier string (same salt, same params). */
export async function mixFromVerifier(password, verifier) {
    const m = P2_RE.exec(String(verifier || ""));
    if (!m) return null;
    return derivePasswordMix(password, m[2], Number(m[1]));
}

// Final AES key: the raw fragment key, or HKDF(fragment key, salt = password mix)
async function aesKey(keyB64, mix) {
    if (!KEY_RE.test(keyB64 || "")) throw new Error("BADKEY");
    const raw = fromB64url(keyB64);
    if (!mix) {
        return crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]);
    }
    const hk = await crypto.subtle.importKey("raw", raw, "HKDF", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits(
        { name: "HKDF", hash: "SHA-256", salt: mix, info: INFO },
        hk,
        256
    );
    return crypto.subtle.importKey("raw", bits, "AES-GCM", false, ["encrypt", "decrypt"]);
}

// ── encrypt / decrypt ────────────────────────────────────────────────────────

/** Encrypt text in the browser → `v2$iv$ct`. */
export async function encryptText(text, keyB64, mix = null) {
    const key = await aesKey(keyB64, mix);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(text)));
    return `v2$${toB64url(iv)}$${toB64url(ct)}`;
}

/**
 * Decrypt a `v2$iv$ct` payload in the browser.
 * Throws Error("BADKEY") on a wrong key/passphrase (GCM auth failure) and
 * Error("BAD_PAYLOAD") when the payload isn't our format.
 */
export async function decryptText(payload, keyB64, mix = null) {
    const m = CT_RE.exec(String(payload || ""));
    if (!m) throw new Error("BAD_PAYLOAD");
    const key = await aesKey(keyB64, mix);
    const iv = fromB64url(m[1]);
    const data = fromB64url(m[2]);
    let plain;
    try {
        plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
    } catch {
        throw new Error("BADKEY");
    }
    return decoder.decode(plain);
}
