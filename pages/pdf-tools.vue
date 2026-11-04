<template>
    <div>
        <PageHero
            title="PDF Tools — Merge, Split, and Compress PDFs in the Browser"
            meta="PDF tools · Launching now"
            lead="Combine multiple PDFs into one, extract specific pages, or shrink a PDF's size — all within your browser. No upload, no server, no account."
        >
            <div class="mt-8">
                <p class="text-[13px] font-medium text-muted">How it works</p>
                <ol class="mt-4 grid gap-4 md:grid-cols-2">
                    <li>
                        <strong>Select PDFs</strong> — choose up to 5 PDF files from your device. Maximum total size 100MB.
                    </li>
                    <li>
                        <strong>Choose operation</strong> — <strong>Merge</strong> combines all PDFs into one, <strong>Split</strong> extracts specific pages, or <strong>Compress</strong> reduces file size.
                    </li>
                    <li>
                        <strong>Adjust settings</strong> — for Split: select which pages to extract. For Compress: drag the size slider (Small, Medium, Large, Custom).
                    </li>
                    <li>
                        <strong>Process & download</strong> — the operation runs entirely in your browser. Click download when ready.
                    </li>
                </ol>
            </div>

            <div class="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <NuxtLink to="/online-text-sharing" class="tile block transition-colors hover:border-muted">
                    <h3 class="text-[18px] font-semibold tracking-[-0.02em]">← Back: Online Text Sharing</h3>
                    <p class="mt-2 text-[14px] leading-relaxed text-muted">Move text, links, and notes between devices.</p>
                </NuxtLink>
                <NuxtLink to="/share-files-online" class="tile block transition-colors hover:border-muted">
                    <h3 class="text-[18px] font-semibold tracking-[-0.02em]">← Share Files Online</h3>
                    <p class="mt-2 text-[14px] leading-relaxed text-muted">Send photos and short videos between devices.</p>
                </NuxtLink>
                <NuxtLink to="/tools" class="tile block transition-colors hover:border-muted">
                    <h3 class="text-[18px] font-semibold tracking-[-0.02em]">← Free Tools Hub</h3>
                    <p class="mt-2 text-[14px] leading-relaxed text-muted">More browser-only tools coming soon.</p>
                </NuxtLink>
            </div>
        </PageHero>

        <section class="section pt-0">
            <div class="wrap">
                <div class="max-w-2xl mx-auto">
                    <h2 class="section-title mt-3">PDF tools, private by default</h2>
                    <p class="section-lead mt-2 text-[15px] leading-relaxed text-muted">
                        Most PDF tools on the web require you to upload your document to their server first. This one runs <em>entirely in your browser</em>. Your PDF never leaves your device — the merging, splitting, or compressing happens locally, and only the final result is returned to you.
                    </p>
                    <p class="mt-4 text-[14px] text-muted">
                        This matters because: contracts, proposals, forms, and presentations often contain sensitive business information you don't want on a random server.
                    </p>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="wrap">
                <div class="max-w-xl mx-auto">
                    <h2 class="section-title mt-3">Choose an operation</h2>
                    <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <article v-for="(op, i) in operations" :key="i" class="tile p-6 text-center">
                            <div class="text-4xl font-bold text-brand mb-3">{{ op.icon }}</div>
                            <h3 class="mt-3 text-[18px]">{{ op.title }}</h3>
                            <p class="mt-2 text-muted line-clamp-2">{{ op.desc }}</p>
                            <NuxtLink :to="op.path" class="mt-4 inline-block text-brand font-medium">Go →</NuxtLink>
                        </article>
                    </div>
                </div>
            </div>
        </section>

        <section class="section" aria-labelledby="why-pdf-title">
            <div class="wrap">
                <div class="max-w-2xl mx-auto">
                    <h2 id="why-pdf-title" class="section-title mt-3">Why this matters</h2>
                    <div class="mt-6 grid gap-4 md:grid-cols-2">
                        <article class="tile">
                            <TsnIcon name="shield" class="h-5 w-5 text-ink" stroke="1.8" />
                            <h3 class="mt-3 text-[18px] text-brand">Privacy first</h3>
                            <p class="mt-2 text-[14px] leading-relaxed text-muted">Your PDF never leaves your device. No upload, no server, no storage. The operation runs in JavaScript inside your browser.</p>
                        </article>
                        <article class="tile">
                            <TsnIcon name="speed" class="h-5 w-5 text-ink" stroke="1.8" />
                            <h3 class="mt-3 text-[18px] text-brand">Fast & free</h3>
                            <p class="mt-2 text-[14px] leading-relaxed text-muted">No account, no sign-up, no waiting. Open the page, process, download. Instant.</p>
                        </article>
                        <article class="tile">
                            <TsnIcon name="upload" class="h-5 w-5 text-ink" stroke="1.8" />
                            <h3 class="mt-3 text-[18px] text-brand">No file size limits from a server</h3>
                            <p class="mt-2 text-[14px] leading-relaxed text-muted">Server-based tools cap you at what their infrastructure can handle. This one respects your device's capability.</p>
                        </article>
                        <article class="tile">
                            <TsnIcon name="download" class="h-5 w-5 text-ink" stroke="1.8" />
                            <h3 class="mt-3 text-[18px] text-brand">Download anywhere</h3>
                            <p class="mt-2 text-[14px] leading-relaxed text-muted">The processed PDF is yours. Use it on your website, send it to a client, print it, or upload it wherever you need.</p>
                        </article>
                    </div>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="wrap">
                <div class="tile px-6 py-12 text-center sm:px-12">
                    <h2 class="section-title mx-auto max-w-[22ch]">Ready to process PDFs?</h2>
                    <p class="section-lead mx-auto">Open in any browser, select your PDFs, choose an operation, download. Private, fast, free.</p>
                    <NuxtLink to="/" class="btn-primary mt-8">Use the share tool now</NuxtLink>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
useSeo({
    title: "PDF Tools — Merge, Split, and Compress PDFs in the Browser",
    description:
        "Merge multiple PDFs into one, extract specific pages, or compress PDF file size — all within your browser. No upload, no server, no account.",
    pagePath: "/pdf-tools",
})

import { trackEvent, trackToolView, trackToolComplete, trackToolToShare } from "~/composables/useAnalytics.js"

trackToolView("pdf-tools")

const finished = ref(false)

function finishTool() {
    trackToolComplete("pdf-tools", { finished: finished.value })
    finished.value = true
}
</script>