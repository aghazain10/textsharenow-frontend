// Password hashing for share links, computed in the browser so the
// plaintext never leaves the device (secure context required).
//
// New shares use PBKDF2-HMAC-SHA256 with a random 16-byte salt:
//   p2$<iterations>$<salt-hex>$<derived-hex>
// Legacy shares created before this format store a bare SHA-256 hex digest;
// hashLegacyPassword() exists only so those shares can still be unlocked.
export const PBKDF2_ITERATIONS = 210000;
export const P2_RE = /^p2\$(\d{4,7})\$([a-f0-9]{32})\$([a-f0-9]{64})$/;

const enc = new TextEncoder();

const toHex = (buf) =>
    Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

const fromHex = (hex) =>
    new Uint8Array(hex.match(/.{2}/g).map((h) => parseInt(h, 16)));

function randomSalt() {
    return toHex(crypto.getRandomValues(new Uint8Array(16)));
}

export async function hashPassword(password, salt = randomSalt(), iterations = PBKDF2_ITERATIONS) {
    const key = await crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        "PBKDF2",
        false,
        ["deriveBits"]
    );
    const bits = await crypto.subtle.deriveBits(
        { name: "PBKDF2", salt: fromHex(salt), iterations, hash: "SHA-256" },
        key,
        256
    );
    return `p2$${iterations}$${salt}$${toHex(bits)}`;
}

// Legacy unsalted SHA-256 — kept for unlocking pre-PBKDF2 shares only.
export async function hashLegacyPassword(password) {
    const data = enc.encode(password);
    const buf = await crypto.subtle.digest("SHA-256", data);
    return toHex(buf);
}
