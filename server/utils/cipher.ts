/**
 * Envelope encryption at rest for share payloads (standard / API / MCP shares).
 *
 * Values are stored as `enc:v1:<iv base64url>:<ciphertext+tag base64url>`
 * using AES-256-GCM with a 32-byte key from `CONTENT_ENCRYPTION_KEY`.
 *
 * This protects Redis dumps, backups and logs from containing readable text.
 * It is NOT zero-knowledge: the server holds the key and can decrypt at
 * request time. End-to-end shares are additionally encrypted in the browser
 * with a key that never reaches the server (see utils/e2e.js) — wrapping
 * that ciphertext again here is harmless defense in depth.
 *
 * Values without the prefix are legacy plaintext shares and are returned
 * unchanged so existing links keep working until they expire.
 */
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'

const PREFIX = 'enc:v1:'
const HEX_KEY = /^[a-f0-9]{64}$/i

let cachedKey: Buffer | null = null
let cachedRaw = ''

function contentKey(): Buffer {
  const raw = (process.env.CONTENT_ENCRYPTION_KEY || '').trim()
  if (!raw) throw new Error('CONTENT_ENCRYPTION_KEY is not configured')
  if (cachedKey && raw === cachedRaw) return cachedKey

  const key = HEX_KEY.test(raw)
    ? Buffer.from(raw, 'hex')
    : Buffer.from(raw.replace(/-/g, '+').replace(/_/g, '/'), 'base64')

  if (key.length !== 32) {
    throw new Error('CONTENT_ENCRYPTION_KEY must be 32 bytes (64 hex characters)')
  }
  cachedKey = key
  cachedRaw = raw
  return key
}

export function isEncryptedAtRest(raw: string): boolean {
  return typeof raw === 'string' && raw.startsWith(PREFIX)
}

export function encryptAtRest(plain: string): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', contentKey(), iv)
  const body = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return `${PREFIX}${iv.toString('base64url')}:${Buffer.concat([body, tag]).toString('base64url')}`
}

export function decryptAtRest(raw: string): string {
  if (!isEncryptedAtRest(raw)) return raw

  const parts = raw.slice(PREFIX.length).split(':')
  if (parts.length !== 2) throw new Error('Malformed encrypted share payload')

  const iv = Buffer.from(parts[0], 'base64url')
  const data = Buffer.from(parts[1], 'base64url')
  if (iv.length !== 12 || data.length < 17) {
    throw new Error('Malformed encrypted share payload')
  }

  const decipher = createDecipheriv('aes-256-gcm', contentKey(), iv)
  decipher.setAuthTag(data.subarray(data.length - 16))
  return Buffer.concat([
    decipher.update(data.subarray(0, data.length - 16)),
    decipher.final(),
  ]).toString('utf8')
}
