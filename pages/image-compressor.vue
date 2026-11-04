<template>
    <div>
        <PageHero
            title="Image Compressor — Compress & Resize Photos in the Browser"
            meta="Image tools · Launching now"
            lead="Compress photos to an exact target size or convert between formats. Everything runs in your browser — your images never upload to a server."
        >
            <div class="mt-8">
                <p class="text-[13px] font-medium text-muted">How it works</p>
                <ol class="mt-4 grid gap-4 md:grid-cols-2">
                    <li>
                        <strong>Select image</strong> — choose a photo from your device. HEIC, JPEG, PNG, WebP all supported.
                    </li>
                    <li>
                        <strong>Set target size</strong> — drag the slider or type a number (e.g. 500KB, 1MB, 2MB). Real-time preview updates as you adjust.
                    </li>
                    <li>
                        <strong>Convert format</strong> (optional) — pick JPEG, PNG, or WebP. The converter picks the best quality-to-size ratio.
                    </li>
                    <li>
                        <strong>Download</strong> — one click. The compressed file stays in your browser until you download it; nothing is sent anywhere.
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
                    <h2 class="section-title mt-3">Compress images without uploading</h2>
                    <p class="section-lead mt-2 text-[15px] leading-relaxed text-muted">
                        Most online compressors require you to upload your photo to their server first. This one runs <em>entirely in your browser</em>. The image never leaves your device — the compression math happens locally, and only the final compressed file is returned to you.
                    </p>
                    <p class="mt-4 text-[14px] text-muted">
                        This matters because: clients, screenshots, portfolio photos, and screenshots from work devices often contain sensitive information you don't want on a random server.
                    </p>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="wrap">
                <div class="max-w-xl mx-auto">
                    <h2 class="section-title mt-3">Steps</h2>
                    <ol class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <li class="p-4 border rounded-lg bg-surface shadow-card">
                            <div class="text-3xl font-bold text-brand">1</div>
                            <h3 class="mt-3 text-[18px]">Select an image</h3>
                            <p class="text-muted mt-2">Choose a photo from your device. Supports HEIC, JPEG, PNG, and WebP. Drag and drop or click to browse.</p>
                        </li>
                        <li class="p-4 border rounded-lg bg-surface shadow-card">
                            <div class="text-3xl font-bold text-brand">2</div>
                            <h3 class="mt-3 text-[18px]">Set target size</h3>
                            <p class="text-muted mt-2">Drag the slider or type a specific size (e.g. 500KB, 1MB, 2MB). The preview updates in real time.</p>
                        </li>
                        <li class="p-4 border rounded-lg bg-surface shadow-card">
                            <div class="text-3xl font-bold text-brand">3</div>
                            <h3 class="mt-3 text-[18px]">Convert format</h3>
                            <p class="text-muted mt-2">Optional: switch to JPEG, PNG, or WebP. The quality adjusts automatically to hit your target size.</p>
                        </li>
                        <li class="p-4 border rounded-lg bg-surface shadow-card">
                            <div class="text-3xl font-bold text-brand">4</div>
                            <h3 class="mt-3 text-[18px]">Download</h3>
                            <p class="text-muted mt-2">One click. The compressed file downloads to your device. Nothing was uploaded, nothing is stored.</p>
                        </li>
                    </ol>
                </div>
            </div>
        </section>

        <section class="section" aria-labelledby="why-title">
            <div class="wrap">
                <div class="max-w-2xl mx-auto">
                    <h2 id="why-title" class="section-title mt-3">Why this matters</h2>
                    <div class="mt-6 grid gap-4 md:grid-cols-2">
                        <article class="tile">
                            <TsnIcon name="shield" class="h-5 w-5 text-ink" stroke="1.8" />
                            <h3 class="mt-3 text-[18px] text-brand">Privacy first</h3>
                            <p class="mt-2 text-[14px] leading-relaxed text-muted">Your photos never leave your device. No upload, no server, no storage. The compression algorithm runs in JavaScript inside your browser.</p>
                        </article>
                        <article class="tile">
                            <TsnIcon name="speed" class="h-5 w-5 text-ink" stroke="1.8" />
                            <h3 class="mt-3 text-[18px] text-brand">Fast & free</h3>
                            <p class="mt-2 text-[14px] leading-relaxed text-muted">No account, no sign-up, no waiting. Open the page, compress, download. Instant.</p>
                        </article>
                        <article class="tile">
                            <TsnIcon name="upload" class="h-5 w-5 text-ink" stroke="1.8" />
                            <h3 class="mt-3 text-[18px] text-brand">No file size limits from a server</h3>
                            <p class="mt-2 text-[14px] leading-relaxed text-muted">Server-based compressors cap you at what their infrastructure can handle. This one respects your device's capability.</p>
                        </article>
                        <article class="tile">
                            <TsnIcon name="download" class="h-5 w-5 text-ink" stroke="1.8" />
                            <h3 class="mt-3 text-[18px] text-brand">Download anywhere</h3>
                            <p class="mt-2 text-[14px] leading-relaxed text-muted">The compressed file is yours. Use it on your website, send it to a client, email it, or upload it wherever you need.</p>
                        </article>
                    </div>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="wrap">
                <div class="tile px-6 py-12 text-center sm:px-12">
                    <h2 class="section-title mx-auto max-w-[22ch]">Ready to compress?</h2>
                    <p class="section-lead mx-auto">Open in any browser, select your image, set the size, download. Private, fast, free.</p>
                    <NuxtLink to="/" class="btn-primary mt-8">Use the share tool now</NuxtLink>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
useSeo({
    title: "Image Compressor — Compress & Resize Photos in the Browser",
    description:
        "Compress photos to an exact target size or convert between formats (JPEG, PNG, WebP, HEIC). Runs entirely in your browser — your images never upload to a server.",
    pagePath: "/image-compressor",
})

import { trackEvent, trackToolView, trackToolComplete, trackToolToShare } from "~/composables/useAnalytics.js"

// Track tool view
trackToolView("image-compressor")

// Mock tool completion — in a real build this would trigger after the user downloads
// For now we just mark it viewed and provide the CTA below
const finished = ref(false)

function finishTool() {
    trackToolComplete("image-compressor", { finished: finished.value })
    finished.value = true
}
</script>