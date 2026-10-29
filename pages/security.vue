<template>
    <div>
        <PageHero
            title="Security You Can Verify"
            meta="Security · Last reviewed October 2026"
            lead="Private mode encrypts your text or file contents in the browser with a key our servers never receive. Standard shares are encrypted in transit and at rest. Here is exactly how both work, what we store, and what we cannot see."
        >
            <div class="mt-8 flex flex-wrap gap-3">
                <NuxtLink to="/#tool" class="btn-primary">
                    <TsnIcon name="lock" class="h-4 w-4" stroke="2" />Try Private mode
                </NuxtLink>
                <NuxtLink to="/compare" class="btn-ghost">Compare tools</NuxtLink>
                <NuxtLink to="/privacy" class="btn-ghost">Privacy policy</NuxtLink>
            </div>
        </PageHero>

        <!-- Two modes -->
        <section class="section" aria-labelledby="modes-title">
            <div class="wrap">
                <div class="max-w-2xl">
                    <p class="text-[13px] font-medium text-muted">Two modes</p>
                    <h2 id="modes-title" class="section-title mt-3">Standard or zero-knowledge</h2>
                    <p class="section-lead">Same tool and the same 5-character code. Ticking “Encrypt Now” adds a layer where the decryption key never reaches our servers.</p>
                </div>

                <div class="mt-12 grid gap-4 md:grid-cols-2">
                    <article class="tile">
                        <div class="flex items-center gap-2">
                            <span class="grid h-9 w-9 place-items-center rounded-md border border-line bg-surface-2/60"><TsnIcon name="link" class="h-4 w-4" stroke="1.9" /></span>
                            <h3 class="text-[22px] font-semibold tracking-[-0.03em]">Standard (default)</h3>
                        </div>
                        <p class="mt-3 text-muted">The code works on its own. Content is encrypted in transit and at rest, and deleted when its read limit or timer is reached.</p>
                        <ul class="mt-4 grid gap-2 text-[14px] text-muted">
                            <li class="flex gap-2"><TsnIcon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-ok" stroke="2.4" />Open with the 5-character code or the link</li>
                            <li class="flex gap-2"><TsnIcon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-ok" stroke="2.4" />TLS in transit, AES-256-GCM at rest</li>
                            <li class="flex gap-2"><TsnIcon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-ok" stroke="2.4" />Our server can decrypt to deliver it</li>
                        </ul>
                    </article>

                    <article class="tile !border-brand">
                        <div class="flex items-center gap-2">
                            <span class="grid h-9 w-9 place-items-center rounded-md border border-line bg-surface-2/60"><TsnIcon name="lock" class="h-4 w-4" stroke="1.9" /></span>
                            <h3 class="text-[22px] font-semibold tracking-[-0.03em]">Private (Encrypt Now)</h3>
                        </div>
                        <p class="mt-3 text-muted">Your browser encrypts the text before it is uploaded. We store ciphertext we cannot read — the key exists only in the link you share.</p>
                        <ul class="mt-4 grid gap-2 text-[14px] text-muted">
                            <li class="flex gap-2"><TsnIcon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-ok" stroke="2.4" />AES-256-GCM encryption in your browser</li>
                            <li class="flex gap-2"><TsnIcon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-ok" stroke="2.4" />Key lives after the # in the link, never on our servers</li>
                            <li class="flex gap-2"><TsnIcon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-ok" stroke="2.4" />Optional Pro passphrase adds a second secret</li>
                        </ul>
                    </article>
                </div>
            </div>
        </section>

        <!-- How private mode works -->
        <section class="section" aria-labelledby="how-title">
            <div class="wrap">
                <div class="max-w-2xl">
                    <p class="text-[13px] font-medium text-muted">Private mode</p>
                    <h2 id="how-title" class="section-title mt-3">How the encryption works</h2>
                    <p class="section-lead">Four steps, all of them in your browser. The server never receives the plaintext or the key.</p>
                </div>

                <ol class="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <li v-for="(step, i) in steps" :key="step.title" class="tile">
                        <p class="text-[13px] font-semibold text-muted">{{ String(i + 1).padStart(2, "0") }}</p>
                        <h3 class="mt-2 text-[17px] font-semibold tracking-[-0.02em]">{{ step.title }}</h3>
                        <p class="mt-2 text-[14px] leading-6 text-muted">{{ step.body }}</p>
                    </li>
                </ol>

                <div class="mt-6 rounded-xl border border-line bg-surface-2/60 p-5 text-[14px] leading-6 text-muted">
                    <p class="flex gap-2"><TsnIcon name="lock" class="mt-0.5 h-4 w-4 shrink-0" stroke="1.9" />
                        <span>
                            With the optional Pro passphrase, the AES key is derived with HKDF from the link key and a PBKDF2 mix of your password (210,000 iterations). We store only a SHA-256 hash of that mix — never the mix itself — so a database dump plus a leaked link still cannot decrypt the text.
                        </span>
                    </p>
                </div>
            </div>
        </section>

        <!-- What we can see -->
        <section class="section" aria-labelledby="visibility-title">
            <div class="wrap">
                <div class="max-w-2xl">
                    <p class="text-[13px] font-medium text-muted">Visibility</p>
                    <h2 id="visibility-title" class="section-title mt-3">What we can and cannot see</h2>
                    <p class="section-lead">No vague promises — here is the honest table, mode by mode.</p>
                </div>

                <div class="mt-10 overflow-x-auto rounded-xl border border-line bg-surface shadow-card">
                    <table class="w-full min-w-[680px] border-collapse text-left text-[15px]" aria-label="Data visibility by share type">
                        <thead>
                            <tr>
                                <th scope="col" class="px-5 py-5 font-medium text-muted">Share type</th>
                                <th scope="col" class="px-5 py-5 font-medium text-muted">What our server stores</th>
                                <th scope="col" class="bg-surface-2 px-5 py-5 font-semibold text-ink">Can we read it?</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in visibilityRows" :key="row[0]" class="border-t border-line">
                                <th scope="row" class="px-5 py-4 font-medium">{{ row[0] }}</th>
                                <td class="px-5 py-4 text-muted">{{ row[1] }}</td>
                                <td class="bg-surface-2/60 px-5 py-4">
                                    <span class="inline-flex items-center gap-1.5 font-medium" :class="row[2].startsWith('No') ? 'text-ok' : 'text-ink'">
                                        <TsnIcon :name="row[2].startsWith('No') ? 'check' : 'alert'" class="h-4 w-4 shrink-0" :stroke="row[2].startsWith('No') ? '2.4' : '2'" />
                                        {{ row[2] }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p class="mt-4 max-w-[68ch] text-[14px] leading-6 text-muted">
                    API and MCP shares are created server-side, so they always use Standard mode. Every share — private or standard — also stores metadata: the code, timestamps, expiry, read counts, and file sizes.
                </p>
            </div>
        </section>

        <!-- Retention -->
        <section class="section" aria-labelledby="retention-title">
            <div class="wrap">
                <div class="max-w-2xl">
                    <p class="text-[13px] font-medium text-muted">Retention</p>
                    <h2 id="retention-title" class="section-title mt-3">What is kept, and for how long</h2>
                    <p class="section-lead">We delete content on a timer or on read, and we do not keep backups of it.</p>
                </div>

                <div class="mt-10 overflow-x-auto rounded-xl border border-line bg-surface shadow-card">
                    <table class="w-full min-w-[620px] border-collapse text-left text-[15px]" aria-label="Data retention">
                        <thead>
                            <tr>
                                <th scope="col" class="px-5 py-5 font-medium text-muted">Data</th>
                                <th scope="col" class="px-5 py-5 font-medium text-muted">Retention</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in retentionRows" :key="row[0]" class="border-t border-line">
                                <th scope="row" class="px-5 py-4 font-medium">{{ row[0] }}</th>
                                <td class="px-5 py-4 text-muted">{{ row[1] }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        <!-- Why the full link -->
        <section class="section" aria-labelledby="link-title">
            <div class="wrap grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                    <p class="text-[13px] font-medium text-muted">Private links</p>
                    <h2 id="link-title" class="section-title mt-3">Why the code alone can’t open a Private share</h2>
                </div>
                <div class="space-y-4 text-[16px] leading-7 text-muted">
                    <p>
                        A 5-character code has about 33 million possible values. If the code were also the decryption key, anyone who obtained the stored ciphertext could try every combination offline in minutes. That would defeat the point of encryption.
                    </p>
                    <p>
                        So the key travels in the part of the link after the <code class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px]">#</code>. Browsers never send that part to any server — it stays between the sender and the recipient. The trade-off is simple: a Private share must be opened with the full link, not just the code. When the toggle is on, the result card shows only the link.
                    </p>
                    <p>
                        If someone types only the code, we stop before fetching anything, so the share is not consumed. Ask the sender to copy the full link (or use the QR code) instead.
                    </p>
                </div>
            </div>
        </section>

        <!-- Protections -->
        <section class="section" aria-labelledby="protections-title">
            <div class="wrap">
                <div class="max-w-2xl">
                    <p class="text-[13px] font-medium text-muted">Protections</p>
                    <h2 id="protections-title" class="section-title mt-3">Guards on every request</h2>
                </div>
                <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <article v-for="item in protections" :key="item.title" class="tile">
                        <h3 class="text-[17px] font-semibold tracking-[-0.02em]">{{ item.title }}</h3>
                        <p class="mt-2 text-[14px] leading-6 text-muted">{{ item.body }}</p>
                    </article>
                </div>
            </div>
        </section>

        <!-- Files -->
        <section class="section" aria-labelledby="files-title">
            <div class="wrap">
                <div class="max-w-2xl">
                    <p class="text-[13px] font-medium text-muted">Files</p>
                    <h2 id="files-title" class="section-title mt-3">How file transfers are protected</h2>
                </div>
                <div class="mt-8 grid gap-6 md:grid-cols-2">
                    <ul class="grid gap-3 text-[15px] leading-6 text-muted">
                        <li class="flex gap-2"><TsnIcon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-ok" stroke="2.4" />TLS in transit and strict access controls on the storage server.</li>
                        <li class="flex gap-2"><TsnIcon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-ok" stroke="2.4" />Standard uploads are scanned with ClamAV before they become downloadable; failing files are deleted.</li>
                        <li class="flex gap-2"><TsnIcon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-ok" stroke="2.4" />Executables and installers are blocked on every plan.</li>
                        <li class="flex gap-2"><TsnIcon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-ok" stroke="2.4" />Standard images are re-encoded from raw pixels, which strips EXIF metadata.</li>
                    </ul>
                    <div class="rounded-xl border border-line bg-surface-2/60 p-5 text-[14px] leading-6 text-muted">
                        <p class="font-medium text-ink">Private file mode</p>
                        <p class="mt-2">
                            Turn on “Encrypt files” and the browser encrypts the contents with AES-256-GCM before upload; the key stays in the link after the # and never reaches us. File names, MIME types, sizes, and folder paths remain visible. Encrypted contents cannot be virus-scanned, so only open files from people you trust. Standard uploads are scanned. Encrypted transfers download one file at a time because the server cannot build a plaintext ZIP. Lose the link and the file cannot be recovered.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Verify -->
        <section class="section" aria-labelledby="verify-title">
            <div class="wrap">
                <div class="max-w-2xl">
                    <p class="text-[13px] font-medium text-muted">Verify it yourself</p>
                    <h2 id="verify-title" class="section-title mt-3">Don’t take our word for it</h2>
                    <p class="section-lead">You can check the important claims with browser developer tools, no account needed.</p>
                </div>
                <ol class="mt-8 grid gap-4 md:grid-cols-2">
                    <li class="tile text-[14px] leading-6 text-muted">
                        <p class="font-semibold text-ink">1. Watch the request</p>
                        <p class="mt-2">Open DevTools → Network, create a Private share, and inspect the <code class="font-mono text-[12.5px]">POST /api/share</code> body. It contains ciphertext (<code class="font-mono text-[12.5px]">ct</code>) and metadata — never your text or the key.</p>
                    </li>
                    <li class="tile text-[14px] leading-6 text-muted">
                        <p class="font-semibold text-ink">2. Look at the address bar</p>
                        <p class="mt-2">The key is after the <code class="font-mono text-[12.5px]">#</code> in the share link. Fragments are never included in HTTP requests, so no server, CDN, or log receives it.</p>
                    </li>
                    <li class="tile text-[14px] leading-6 text-muted">
                        <p class="font-semibold text-ink">3. Read it once</p>
                        <p class="mt-2">Open the full link in a private window, read the text, then reload. A single-use share is gone — the ciphertext was deleted after the first read.</p>
                    </li>
                    <li class="tile text-[14px] leading-6 text-muted">
                        <p class="font-semibold text-ink">4. Check the headers</p>
                        <p class="mt-2">Responses carry HSTS, <code class="font-mono text-[12.5px]">X-Content-Type-Options: nosniff</code>, frame denial, a referrer policy, and a restrictive permissions policy.</p>
                    </li>
                </ol>
            </div>
        </section>

        <!-- Contact -->
        <section class="section" aria-labelledby="contact-title">
            <div class="wrap">
                <div class="max-w-[68ch]">
                    <h2 id="contact-title" class="section-title">Report a security issue</h2>
                    <p class="section-lead">
                        Found a flaw, or think a claim on this page is wrong? Email
                        <a href="mailto:info@textsharenow.com?subject=Security%20report" class="text-link">info@textsharenow.com</a>
                        with the subject “Security report”. Include the steps to reproduce it. We read every report and will not take legal action against good-faith research.
                    </p>
                    <p class="mt-6 text-[14px] leading-6 text-muted">
                        Keep sensitive findings out of public posts until we have had a chance to fix them. There is no paid bounty program, but we are happy to credit responsible reports.
                    </p>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
useSeo({
    title: "Security & Zero-Knowledge Encryption",
    description:
        "How TextShareNow protects your text: browser-side AES-256-GCM in Private mode, encryption at rest, deletion rules, and exactly what our servers can see.",
    pagePath: "/security",
});

const steps = [
    {
        title: "A key is generated",
        body: "Your browser creates a random 256-bit key using the Web Crypto API. It never leaves the device.",
    },
    {
        title: "Text is encrypted",
        body: "AES-256-GCM encrypts the text locally. GCM also authenticates it, so a wrong key fails loudly instead of showing garbage.",
    },
    {
        title: "Only ciphertext is stored",
        body: "The encrypted blob and metadata go to our server. The key goes into the link after the # symbol — a part browsers never transmit.",
    },
    {
        title: "The recipient decrypts",
        body: "Their browser reads the key from the link, fetches the ciphertext, and decrypts it locally. The content is then deleted on schedule.",
    },
];

const visibilityRows = [
    ["Standard text", "AES-256-GCM ciphertext at rest; decrypted at request time", "Yes — to deliver it"],
    ["Private text", "Ciphertext only; the key never reaches us", "No"],
    ["Private text + passphrase", "Ciphertext plus a salted hash of the key mix", "No — even with the database"],
    ["Standard files", "File bytes on an access-controlled server, scanned before serving", "Yes — for scanning and serving"],
    ["Private files", "Ciphertext only; the key never reaches us. Names, types, sizes, and paths remain visible", "No"],
    ["API / MCP text", "Standard-mode ciphertext at rest", "Yes — while processing"],
];

const retentionRows = [
    ["Text shares (standard and private)", "Deleted at the read limit or when the timer ends — 10 minutes to 30 days, or never if the sender chooses"],
    ["Files", "Standard: deleted after download. Private: deleted after download + decryption acknowledgement. Either way, also when the timer ends (10 minutes to 30 days)"],
    ["Pro receipts", "Event times only (no IP or content) — 90 days after a share closes; never-expiring shares keep a one-year window"],
    ["Security events", "Event type, share code, and timestamp — 7 days"],
    ["Server logs", "IP address and timestamp — up to 7 days"],
    ["Content backups", "None — we do not back up shared text or files"],
];

const protections = [
    {
        title: "TLS everywhere",
        body: "HTTPS on every page and API call, with HSTS so browsers refuse to fall back to plain HTTP.",
    },
    {
        title: "Rate limits",
        body: "Every endpoint is rate-limited per IP — for example 10 shares per minute and 20 reads per minute. Code enumeration is not practical.",
    },
    {
        title: "Password burn",
        body: "Ten wrong passwords within 15 minutes permanently deletes the share, so guessing destroys the target instead of unlocking it.",
    },
    {
        title: "No plaintext verifiers",
        body: "Passwords are derived in the browser with PBKDF2-HMAC-SHA256 (210,000 iterations). Private-mode shares store only a hash of the key mix.",
    },
    {
        title: "Hardened headers",
        body: "Content-type sniffing, framing, referrer leaks, and unnecessary browser permissions are blocked at the edge.",
    },
    {
        title: "Scoped API",
        body: "No wildcard CORS. License keys are hashed in storage, Pro sessions use signed http-only cookies, and ownership is checked on every delete or receipt request.",
    },
];
</script>
