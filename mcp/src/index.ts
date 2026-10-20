#!/usr/bin/env node
/**
 * TextShareNow MCP server (stdio).
 *
 * Lets an AI agent share text/links/code as a short TextShareNow link and
 * receive text from one. Auth is the TextShareNow Pro license key sent as
 * `Authorization: Bearer <key>` — the same API the website uses, so limits,
 * password protection, expiry, and multi-read behave identically.
 *
 * Env:
 *   TEXTSHARENOW_LICENSE_KEY  required — Gumroad license key from textsharenow.com/pricing
 *   TEXTSHARENOW_API_BASE     optional — defaults to https://www.textsharenow.com
 */
import { createHash, pbkdf2Sync, randomBytes } from 'node:crypto'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import { z } from 'zod'

const API_BASE = (process.env.TEXTSHARENOW_API_BASE || 'https://www.textsharenow.com').replace(/\/+$/, '')
const LICENSE_KEY = (process.env.TEXTSHARENOW_LICENSE_KEY || '').trim()
const PBKDF2_ITERATIONS = 210000

if (!LICENSE_KEY) {
  console.error('textsharenow-mcp: TEXTSHARENOW_LICENSE_KEY is required. Get your key at https://www.textsharenow.com/pricing')
  process.exit(1)
}

type Json = Record<string, any>

function derivePassword(password: string, salt = randomBytes(16).toString('hex'), iterations = PBKDF2_ITERATIONS): string {
  const hash = pbkdf2Sync(password, Buffer.from(salt, 'hex'), iterations, 32, 'sha256').toString('hex')
  return `p2$${iterations}$${salt}$${hash}`
}

function sha256hex(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

function apiError(status: number, data: Json | null): Error {
  const message = data?.message || data?.statusMessage || `TextShareNow request failed (HTTP ${status}).`
  return new Error(String(message))
}

async function api(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<{ status: number; data: Json | null }> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (options.body !== undefined) headers['Content-Type'] = 'application/json'
  if (options.auth !== false) headers.Authorization = `Bearer ${LICENSE_KEY}`

  let response: Response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    })
  } catch {
    throw new Error(`Could not reach TextShareNow at ${API_BASE}. Check your internet connection.`)
  }

  let data: Json | null = null
  try {
    data = (await response.json()) as Json
  } catch {
    // Non-JSON response — status is enough for the error path.
  }
  return { status: response.status, data }
}

function reply(value: unknown): CallToolResult {
  const text = typeof value === 'string' ? value : JSON.stringify(value, null, 2)
  return { content: [{ type: 'text', text }] }
}

async function guard(fn: () => Promise<CallToolResult>): Promise<CallToolResult> {
  try {
    return await fn()
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { content: [{ type: 'text', text: `Error: ${message}` }], isError: true }
  }
}

const EXPIRY_VALUES = [600, 1800, 3600, 86400, 604800, 2592000, 0] as const
const READ_VALUES = [1, 5, 10, 0] as const

const server = new McpServer(
  { name: 'textsharenow', version: '1.0.0' },
  {
    instructions:
      'TextShareNow Pro tools move text between devices through short-lived links. ' +
      'Use share_text to create a link for the user to open on their phone or another machine; ' +
      'it returns a 5-character code and a URL. Use peek_share to check a code without consuming a read, ' +
      'receive_text to fetch its content (this consumes a read), and delete_share to remove a share ' +
      'created with the same license key. Password-protected shares need the password supplied to receive_text.',
  },
)

server.registerTool(
  'share_text',
  {
    title: 'Share text',
    description:
      'Create a temporary TextShareNow link. Returns a short code and URL the user can open on another device. ' +
      'Supports expiry, read limits, passwords, and custom codes (Pro). Content can be up to 100,000 characters.',
    inputSchema: {
      text: z.string().min(1).max(100000).describe('The exact text, URL, or code to share'),
      expires_in: z
        .union([
          z.literal(600),
          z.literal(1800),
          z.literal(3600),
          z.literal(86400),
          z.literal(604800),
          z.literal(2592000),
          z.literal(0),
        ])
        .optional()
        .describe('Seconds until expiry: 600, 1800, 3600, 86400, 604800, 2592000, or 0 for never. Default 600.'),
      max_reads: z
        .union([z.literal(1), z.literal(5), z.literal(10), z.literal(0)])
        .optional()
        .describe('Reads before deletion: 1, 5, 10, or 0 for unlimited. Default 1.'),
      password: z.string().min(1).max(200).optional().describe('Optional password the receiver must enter'),
      custom_code: z
        .string()
        .min(3)
        .max(30)
        .optional()
        .describe('Optional memorable code (3–30 characters: letters, numbers, - and _)'),
    },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
  },
  async ({ text, expires_in, max_reads, password, custom_code }) =>
    guard(async () => {
      const body: Json = { text }
      if (expires_in !== undefined) body.ttl = expires_in
      if (max_reads !== undefined) body.maxReads = max_reads
      if (custom_code) body.customCode = custom_code
      if (password) body.passwordHash = derivePassword(password)

      const { status, data } = await api('/api/share', { method: 'POST', body })
      if (status !== 200 || !data?.code) throw apiError(status, data)

      const code = String(data.code)
      return reply({
        code,
        url: `${API_BASE}/r?code=${encodeURIComponent(code)}`,
        expires_in: data.ttl || null,
        password_protected: Boolean(password),
        next: 'Share the URL with the user. On another device they can open it in a browser, or an agent can call receive_text.',
      })
    }),
)

server.registerTool(
  'peek_share',
  {
    title: 'Peek at a share',
    description:
      'Check whether a TextShareNow code exists and see its expiry, remaining reads, and whether it needs a password. ' +
      'Does not consume a read and never returns the content.',
    inputSchema: {
      code: z.string().min(3).max(300).describe('The share code or full /r?code= URL'),
    },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  },
  async ({ code }) =>
    guard(async () => {
      const normalized = normalizeCode(code)
      const { status, data } = await api(`/api/share/${encodeURIComponent(normalized)}/meta`, { auth: false })
      if (status !== 200) throw apiError(status, data)
      return reply(data)
    }),
)

server.registerTool(
  'receive_text',
  {
    title: 'Receive text',
    description:
      'Fetch the text behind a TextShareNow code. This consumes one read and single-use shares are deleted after it. ' +
      'If the share is password protected, pass the password.',
    inputSchema: {
      code: z.string().min(3).max(300).describe('The share code or full /r?code= URL'),
      password: z.string().min(1).max(200).optional().describe('Password for protected shares'),
    },
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false, openWorldHint: true },
  },
  async ({ code, password }) =>
    guard(async () => {
      const normalized = normalizeCode(code)
      let result = await api(`/api/share/${encodeURIComponent(normalized)}`, { auth: false })

      if (result.status === 401 && password) {
        const info = result.data?.data
        let derived: string
        if (info?.kdf === 'pbkdf2') {
          const iterations = Number(info.iterations)
          const salt = String(info.salt || '')
          if (!/^[a-f0-9]{32}$/i.test(salt) || !Number.isFinite(iterations) || iterations < 1000 || iterations > 1000000) {
            throw new Error('The server returned unsupported password parameters.')
          }
          derived = derivePassword(password, salt, iterations)
        } else {
          derived = sha256hex(password)
        }
        result = await api(`/api/share/${encodeURIComponent(normalized)}?pw=${encodeURIComponent(derived)}`, { auth: false })
      }

      if (result.status !== 200 || typeof result.data?.text !== 'string') throw apiError(result.status, result.data)
      return reply({
        text: result.data.text,
        reads_left: result.data.readsLeft ?? null,
      })
    }),
)

server.registerTool(
  'delete_share',
  {
    title: 'Delete a share',
    description:
      'Delete a TextShareNow share created with the same Pro license key. Shares created by other licenses cannot be deleted.',
    inputSchema: {
      code: z.string().min(3).max(300).describe('The share code or full /r?code= URL'),
    },
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: true },
  },
  async ({ code }) =>
    guard(async () => {
      const normalized = normalizeCode(code)
      const { status, data } = await api(`/api/share/${encodeURIComponent(normalized)}`, { method: 'DELETE' })
      if (status !== 200) throw apiError(status, data)
      return reply({ deleted: true, code: normalized })
    }),
)

function normalizeCode(input: string): string {
  const value = input.trim()
  // Accept a full share link and pull the code out of it.
  const match = /[?&]code=([^&\s]+)/.exec(value)
  return decodeURIComponent(match ? match[1] : value)
}

const transport = new StdioServerTransport()
await server.connect(transport)
