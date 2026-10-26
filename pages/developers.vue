<template>
    <div>
        <PageHero
            title="API & MCP for Developers and AI Agents"
            meta="Developers"
            lead="TextShareNow Pro includes a small HTTP API and an MCP server, so scripts and AI agents can create and receive shares without a browser. Your license key is the only credential — no extra account, no OAuth."
        >
            <div class="mt-7 flex flex-wrap gap-3">
                <a :href="checkoutHref" class="btn-primary">Get Pro — $5/month</a>
                <NuxtLink to="/pricing" class="btn-ghost">See what Pro includes</NuxtLink>
            </div>
        </PageHero>

        <section class="section">
            <div class="wrap grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] lg:gap-16">
                <aside class="h-fit lg:sticky lg:top-24">
                    <h2 class="section-title !text-[28px]">Two Ways In</h2>
                    <p class="mt-4 text-[16px] leading-7 text-muted">
                        Use the MCP server to give Claude, opencode, Cursor, or any MCP client a native
                        share tool. Use the HTTP API when you want to script it yourself.
                    </p>
                    <nav class="mt-6 grid gap-2 text-[14px]" aria-label="On this page">
                        <a href="#key" class="text-link">1. Your license key</a>
                        <a href="#mcp" class="text-link">2. MCP server</a>
                        <a href="#api" class="text-link">3. HTTP API</a>
                        <a href="#limits" class="text-link">4. Limits and errors</a>
                    </nav>
                    <div class="tile mt-8">
                        <h3 class="text-[15px] font-semibold text-ink">Good to know</h3>
                        <ul class="mt-3 grid gap-2 text-[14px] text-muted">
                            <li>Works with the same $5/month Pro key as the website.</li>
                            <li>Free-plan limits apply to unauthenticated API calls.</li>
                            <li>Files are not available through the API or MCP yet.</li>
                        </ul>
                    </div>
                </aside>

                <div class="min-w-0 space-y-16">
                    <!-- 1. Key -->
                    <section id="key" class="scroll-mt-24">
                        <p class="text-[13px] font-medium text-brand">Step 1</p>
                        <h2 class="mt-2 text-[30px] font-semibold tracking-[-0.03em] text-ink">Your license key is the API key</h2>
                        <p class="mt-3 text-[16px] leading-7 text-muted">
                            There is no separate token to generate. Subscribe to Pro, copy the license key from your
                            Gumroad receipt, and send it as a Bearer token. The same key unlocks the website and the API,
                            and it works on every device you own.
                        </p>
                        <div class="mt-5 rounded-lg border border-line bg-surface-2/40 p-4 text-[14px] leading-6 text-muted">
                            Treat the key like a password. It is sent only to <code class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[12.5px]">textsharenow.com</code>
                            over HTTPS, stored in your client config, and cached server-side only as a SHA-256 hash. Never commit it to a public repo.
                        </div>
                        <div class="mt-5 flex flex-wrap gap-3">
                            <a :href="checkoutHref" class="btn-primary">Get a license key</a>
                            <NuxtLink to="/pricing" class="btn-ghost">How activation works</NuxtLink>
                        </div>
                    </section>

                    <!-- 2. MCP -->
                    <section id="mcp" class="scroll-mt-24">
                        <p class="text-[13px] font-medium text-brand">Step 2</p>
                        <h2 class="mt-2 text-[30px] font-semibold tracking-[-0.03em] text-ink">Add the MCP server</h2>
                        <p class="mt-3 text-[16px] leading-7 text-muted">
                            <code class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px]">textsharenow-mcp</code>
                            is a local stdio MCP server. It talks to the TextShareNow API with your key and exposes four
                            tools to the agent. Requires Node 18 or newer.
                        </p>

                        <h3 class="mt-8 text-[20px] font-semibold text-ink">opencode</h3>
                        <p class="mt-2 text-[15px] leading-7 text-muted">
                            Add this to <code class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px]">~/.config/opencode/opencode.json</code>
                            (or a project-level <code class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px]">opencode.json</code>):
                        </p>
                        <pre class="mt-3 overflow-x-auto rounded-lg border border-line bg-surface-2/60 p-4 text-[12.5px] leading-6"><code>{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "textsharenow": {
      "type": "local",
      "command": ["npx", "-y", "textsharenow-mcp@latest"],
      "enabled": true,
      "environment": {
        "TEXTSHARENOW_LICENSE_KEY": "YOUR-LICENSE-KEY"
      }
    }
  }
}</code></pre>

                        <h3 class="mt-8 text-[20px] font-semibold text-ink">Claude Code</h3>
                        <pre class="mt-3 overflow-x-auto rounded-lg border border-line bg-surface-2/60 p-4 text-[12.5px] leading-6"><code>claude mcp add textsharenow \
  --env TEXTSHARENOW_LICENSE_KEY=YOUR-LICENSE-KEY \
  -- npx -y textsharenow-mcp@latest</code></pre>

                        <h3 class="mt-8 text-[20px] font-semibold text-ink">Claude Desktop and Cursor</h3>
                        <p class="mt-2 text-[15px] leading-7 text-muted">
                            Both use an <code class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px]">mcpServers</code>
                            block. For Claude Desktop, edit <code class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px]">claude_desktop_config.json</code>;
                            for Cursor, use <code class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px]">.cursor/mcp.json</code>.
                        </p>
                        <pre class="mt-3 overflow-x-auto rounded-lg border border-line bg-surface-2/60 p-4 text-[12.5px] leading-6"><code>{
  "mcpServers": {
    "textsharenow": {
      "command": "npx",
      "args": ["-y", "textsharenow-mcp@latest"],
      "env": {
        "TEXTSHARENOW_LICENSE_KEY": "YOUR-LICENSE-KEY"
      }
    }
  }
}</code></pre>

                        <h3 class="mt-8 text-[20px] font-semibold text-ink">What the agent can do</h3>
                        <div class="mt-4 overflow-x-auto rounded-lg border border-line">
                            <table class="w-full min-w-[560px] border-collapse text-left text-[14px]">
                                <thead>
                                    <tr class="bg-surface-2/60">
                                        <th scope="col" class="px-4 py-3 font-semibold text-ink">Tool</th>
                                        <th scope="col" class="px-4 py-3 font-semibold text-ink">Purpose</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="t in tools" :key="t.name" class="border-t border-line">
                                        <td class="whitespace-nowrap px-4 py-3 font-mono text-[13px] text-ink">{{ t.name }}</td>
                                        <td class="px-4 py-3 text-muted">{{ t.desc }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="mt-5 rounded-lg border border-line bg-surface-2/40 p-4">
                            <p class="text-[14px] font-medium text-ink">Example prompts</p>
                            <ul class="mt-2 grid gap-1.5 text-[14px] text-muted">
                                <li>“Share this JSON as a link that expires in 10 minutes, then give me the URL.”</li>
                                <li>“Peek at code K7Q2P — has it been read yet?”</li>
                                <li>“Receive code K7Q2P. The password is hunter2.”</li>
                                <li>“Delete the share you just created.”</li>
                            </ul>
                        </div>
                        <p class="mt-4 text-[14px] text-muted">
                            Package: <a href="https://www.npmjs.com/package/textsharenow-mcp" class="text-link" target="_blank" rel="noopener noreferrer">textsharenow-mcp</a>
                            · Set <code class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[12.5px]">TEXTSHARENOW_API_BASE</code>
                            only if you self-host the API.
                        </p>
                    </section>

                    <!-- 3. API -->
                    <section id="api" class="scroll-mt-24">
                        <p class="text-[13px] font-medium text-brand">Step 3</p>
                        <h2 class="mt-2 text-[30px] font-semibold tracking-[-0.03em] text-ink">Or call the HTTP API</h2>
                        <p class="mt-3 text-[16px] leading-7 text-muted">
                            Every endpoint is the same one the website uses. Send
                            <code class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px]">Authorization: Bearer &lt;license-key&gt;</code>
                            for Pro limits; omit it for free-plan limits. Retrieving and peeking need no auth — the code itself is the capability.
                        </p>

                        <div class="mt-5 overflow-x-auto rounded-lg border border-line">
                            <table class="w-full min-w-[640px] border-collapse text-left text-[14px]">
                                <thead>
                                    <tr class="bg-surface-2/60">
                                        <th scope="col" class="px-4 py-3 font-semibold text-ink">Method</th>
                                        <th scope="col" class="px-4 py-3 font-semibold text-ink">Path</th>
                                        <th scope="col" class="px-4 py-3 font-semibold text-ink">Auth</th>
                                        <th scope="col" class="px-4 py-3 font-semibold text-ink">Purpose</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="e in endpoints" :key="e.method + e.path" class="border-t border-line">
                                        <td class="whitespace-nowrap px-4 py-3 font-mono text-[12.5px] text-ink">{{ e.method }}</td>
                                        <td class="whitespace-nowrap px-4 py-3 font-mono text-[12.5px] text-ink">{{ e.path }}</td>
                                        <td class="whitespace-nowrap px-4 py-3 text-muted">{{ e.auth }}</td>
                                        <td class="px-4 py-3 text-muted">{{ e.desc }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <h3 class="mt-8 text-[20px] font-semibold text-ink">Create a share</h3>
                        <pre class="mt-3 overflow-x-auto rounded-lg border border-line bg-surface-2/60 p-4 text-[12.5px] leading-6"><code>export TSN_KEY="YOUR-LICENSE-KEY"

curl -X POST https://www.textsharenow.com/api/share \
  -H "Authorization: Bearer $TSN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text":"hello from the API","ttl":600,"maxReads":5}'</code></pre>
                        <pre class="mt-3 overflow-x-auto rounded-lg border border-line bg-surface-2/60 p-4 text-[12.5px] leading-6"><code>{
  "code": "K7Q2P",
  "ttl": 600
}</code></pre>
                        <p class="mt-3 text-[15px] leading-7 text-muted">
                            The share opens at <code class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px]">https://www.textsharenow.com/r?code=K7Q2P</code>.
                        </p>

                        <h3 class="mt-8 text-[20px] font-semibold text-ink">Request body</h3>
                        <ul class="mt-3 grid gap-2 text-[14px] leading-6 text-muted">
                            <li><code class="font-mono text-[13px] text-ink">text</code> — required, up to 100,000 characters on Pro (10,000 free).</li>
                            <li><code class="font-mono text-[13px] text-ink">ttl</code> — seconds: 600, 1800, 3600 on free; Pro adds 86400, 604800, 2592000, or 0 (never). Default 600.</li>
                            <li><code class="font-mono text-[13px] text-ink">maxReads</code> — 1, 5, 10, or 0 (unlimited). Pro only. Default 1.</li>
                            <li><code class="font-mono text-[13px] text-ink">customCode</code> — 3–30 characters (letters, numbers, - and _). Pro only.</li>
                            <li><code class="font-mono text-[13px] text-ink">passwordHash</code> — Pro only; a PBKDF2 verifier in the form <code class="font-mono text-[12.5px]">p2$210000$&lt;salt-hex&gt;$&lt;derived-hex&gt;</code>. (The browser's private mode uses a p3 verifier for zero-knowledge shares — p3 is not needed for API shares.)</li>
                        </ul>

                        <h3 class="mt-8 text-[20px] font-semibold text-ink">Read, peek, delete</h3>
                        <pre class="mt-3 overflow-x-auto rounded-lg border border-line bg-surface-2/60 p-4 text-[12.5px] leading-6"><code># Read — consumes one read
curl https://www.textsharenow.com/api/share/K7Q2P

# Peek — no read consumed, no content returned
curl https://www.textsharenow.com/api/share/K7Q2P/meta

# Delete — only shares created with the same license key
curl -X DELETE https://www.textsharenow.com/api/share/K7Q2P \
  -H "Authorization: Bearer $TSN_KEY"</code></pre>
                        <p class="mt-3 text-[15px] leading-7 text-muted">
                            Reading returns <code class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px]">{"text":"…","readsLeft":4}</code>.
                            Peeking returns expiry, read counts, and whether a password is required. Deleting returns <code class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px]">{"ok":true}</code>.
                        </p>

                        <h3 class="mt-8 text-[20px] font-semibold text-ink">Passwords</h3>
                        <p class="mt-2 text-[15px] leading-7 text-muted">
                            Plaintext passwords never reach the server. Derive the hash client-side with PBKDF2-HMAC-SHA256
                            (210,000 iterations, a random 16-byte salt, 32-byte output), then send it at creation:
                        </p>
                        <pre class="mt-3 overflow-x-auto rounded-lg border border-line bg-surface-2/60 p-4 text-[12.5px] leading-6"><code>import { pbkdf2Sync, randomBytes } from "node:crypto";

const salt = randomBytes(16).toString("hex");
const derived = pbkdf2Sync(password, Buffer.from(salt, "hex"), 210000, 32, "sha256").toString("hex");
const passwordHash = `p2$210000$${salt}$${derived}`;</code></pre>
                        <p class="mt-3 text-[15px] leading-7 text-muted">
                            A read without a password returns <code class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px]">401</code>
                            with the salt and iteration count. Derive the same value and retry with the
                            <code class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px]">x-share-password</code> header —
                            not the URL, so the verifier never lands in access logs:
                        </p>
                        <pre class="mt-3 overflow-x-auto rounded-lg border border-line bg-surface-2/60 p-4 text-[12.5px] leading-6"><code>curl https://www.textsharenow.com/api/share/K7Q2P \
  -H "x-share-password: $PASSWORD_HASH"</code></pre>
                        <p class="mt-3 text-[15px] leading-7 text-muted">The MCP server does this for you.</p>
                    </section>

                    <!-- 4. Limits -->
                    <section id="limits" class="scroll-mt-24">
                        <p class="text-[13px] font-medium text-brand">Step 4</p>
                        <h2 class="mt-2 text-[30px] font-semibold tracking-[-0.03em] text-ink">Limits, errors, and safety</h2>
                        <p class="mt-3 text-[16px] leading-7 text-muted">
                            The API is intentionally small and bounded. Shares behave exactly like website shares:
                            same expiry, same read limits, same password rules, same auto-deletion.
                        </p>

                        <div class="mt-6 grid gap-4 sm:grid-cols-2">
                            <div class="tile">
                                <h3 class="text-[15px] font-semibold text-ink">Rate limits</h3>
                                <ul class="mt-3 grid gap-2 text-[14px] text-muted">
                                    <li>Create: 10/min per IP and 20/min per license.</li>
                                    <li>Read: 20/min per IP.</li>
                                    <li>Peek: 60/min per IP.</li>
                                    <li>Delete: 20/min per IP.</li>
                                </ul>
                            </div>
                            <div class="tile">
                                <h3 class="text-[15px] font-semibold text-ink">Error codes</h3>
                                <ul class="mt-3 grid gap-2 text-[14px] text-muted">
                                    <li><span class="font-mono text-[13px] text-ink">401</span> — password required (includes KDF params).</li>
                                    <li><span class="font-mono text-[13px] text-ink">403</span> — not Pro, wrong password, or not your share.</li>
                                    <li><span class="font-mono text-[13px] text-ink">404</span> — code expired or never existed.</li>
                                    <li><span class="font-mono text-[13px] text-ink">422</span> — invalid input or plan limit exceeded.</li>
                                    <li><span class="font-mono text-[13px] text-ink">429</span> — rate limited; retry after a minute.</li>
                                </ul>
                            </div>
                        </div>

                        <div class="mt-6 space-y-3 text-[15px] leading-7 text-muted">
                            <p>
                                <strong class="text-ink">Ownership.</strong> Delete only works for shares created with the
                                same license key. Anyone with the code can read a share, but only the key that created it
                                can remove it early.
                            </p>
                            <p>
                                <strong class="text-ink">Dashboard.</strong> Prefer a UI? Open
                                <NuxtLink to="/my-shares" class="text-link">My Shares</NuxtLink> with the same license key
                                to list, copy, and delete active text shares.
                            </p>
                            <p>
                                <strong class="text-ink">Key handling.</strong> The raw key is never logged; the server
                                caches a SHA-256 hash for 24 hours and re-verifies with Gumroad daily. Invalid Bearer keys
                                fail closed if Gumroad is unreachable.
                            </p>
                            <p>
                                <strong class="text-ink">Files.</strong> API and MCP are text-only for now (up to 100,000
                                characters). File transfers still go through the website.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="wrap">
                <div class="tile px-6 py-14 text-center sm:px-12">
                    <h2 class="section-title mx-auto max-w-[24ch]">Give your agent a share tool.</h2>
                    <p class="section-lead mx-auto">One license key, one npm package, four tools. Works with any MCP client.</p>
                    <div class="mt-8 flex flex-wrap justify-center gap-3">
                        <a :href="checkoutHref" class="btn-primary">Get Pro — $5/month</a>
                        <NuxtLink to="/#tool" class="btn-ghost">Try the free web tool</NuxtLink>
                    </div>
                    <p class="mt-4 text-[13px] text-muted">Node 18+ · <code class="font-mono">npx -y textsharenow-mcp@latest</code></p>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { proCheckoutPath } from "~/utils/checkout.js";

useSeo({
    title: "API & MCP for Developers and AI Agents",
    description:
        "TextShareNow Pro includes an HTTP API and an MCP server for Claude, opencode, Cursor, and other AI agents. Use your license key as a Bearer token to share and receive text programmatically.",
    pagePath: "/developers",
});

const checkoutHref = proCheckoutPath({ plan: "monthly", location: "developers" });

const tools = [
    { name: "share_text", desc: "Create a share link with optional expiry, read limit, password, and custom code." },
    { name: "peek_share", desc: "Check expiry, remaining reads, and password status without consuming a read." },
    { name: "receive_text", desc: "Fetch the text behind a code. Consumes one read; single-use shares are deleted." },
    { name: "delete_share", desc: "Delete a share created with the same license key." },
];

const endpoints = [
    { method: "POST", path: "/api/share", auth: "Optional key", desc: "Create a share. Pro limits with a license key, free limits without." },
    { method: "GET", path: "/api/share/:code", auth: "None", desc: "Read the text. Consumes one read." },
    { method: "GET", path: "/api/share/:code/meta", auth: "None", desc: "Peek at expiry, reads, and password status." },
    { method: "DELETE", path: "/api/share/:code", auth: "License key", desc: "Delete a share you created." },
    { method: "GET", path: "/api/pro/status", auth: "License key", desc: "Validate a key; returns { pro, via }." },
];
</script>
