<template>
    <div>
        <PageHero
            title="EXIF Remover — Strip Location & Metadata from Photos"
            meta="Privacy tools · Launching now"
            lead="Remove GPS coordinates, camera data, and other metadata from photos before you share them. Runs entirely in your browser — your photos never upload."
        >
            <div class="mt-8">
                <p class="text-[13px] font-medium text-muted">How it works</p>
                <ol class="mt-4 grid gap-4 md:grid-cols-2">
                    <li>
                        <strong>Select photo</strong> — choose a photo from your device. JPEG and most RAW formats supported.
                    </li>
                    <li>
                        <strong>Analyze metadata</strong> — one click to scan for GPS coordinates, camera make/model, date/time, and other EXIF data.
                    </li>
                    <li>
                        <strong>Remove metadata</strong> — choose which tags to strip: location only, all EXIF, or custom selection.
                    </li>
                    <li>
                        <strong>Download clean photo</strong> — the photo with metadata removed downloads to your device. Original remains untouched.
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
                    <h2 class="section-title mt-3">Strip location from photos before sharing</h2>
                    <p class="section-lead mt-2 text-[15px] leading-relaxed text-muted">
                        Photos taken with a smartphone or camera often contain hidden GPS coordinates and other metadata (camera model, date/time, settings). When you share these photos — via email, messaging apps, or social media — that location data goes with them. This tool strips that metadata entirely in your browser, so only the image remains.
                    </p>
                    <p class="mt-4 text-[14px] text-muted">
                        This matters because: sharing screenshots from a work laptop, photos from a client site, or images posted online — you usually don't want the GPS location embedded in the file to be visible to anyone who receives it.
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
                            <h3 class="mt-3 text-[18px]">Select a photo</h3>
                            <p class="text-muted mt-2">Choose a JPEG or compatible photo from your device. Supports most camera formats including HEIC/HEIF where the browser allows.</p>
                        </li>
                        <li class="p-4 border rounded-lg bg-surface shadow-card">
                            <div class="text-3xl font-bold text-brand">2</div>
                            <h3 class="mt-3 text-[18px]">Analyze metadata</h3>
                            <p class="text-muted mt-2">Click "Scan" to detect all EXIF tags: GPS location, camera make/model, date/time, exposure settings, and more.</p>
                        </li>
                        <li class="p-4 border rounded-lg bg-surface shadow-card">
                            <div class="text-3xl font-bold text-brand">3</div>
                            <h3 class="mt-3 text-[18px]">Remove metadata</h3>
                            <p class="text-muted mt-2">Choose what to strip: location only, all EXIF data, or a custom selection. The photo is processed locally.</p>
                        </li>
                        <li class="p-4 border rounded-lg bg-surface shadow-card">
                            <div class="text-3xl font-bold text-brand">4</div>
                            <h3 class="mt-3 text-[18px]">Download clean photo</h3>
                            <p class="text-muted mt-2">The photo with metadata removed downloads to your device. The original file is untouched and stays on your device.</p>
                        </li>
                    </ol>
                </div>
            </div>
        </section>

        <section class="section" aria-labelledby="why-exif-title">
            <div class="wrap">
                <div class="max-w-2xl mx-auto">
                    <h2 id="why-exif-title" class="section-title mt-3">Why this matters</h2>
                    <div class="mt-6 grid gap-4">
                        <article class="tile">
                            <TsnIcon name="shield" class="h-5 w-5 text-ink" stroke="1.8" />
                            <h3 class="mt-3 text-[18px] text-brand">Privacy first</h3>
                            <p class="mt-2 text-[14px] leading-relaxed text-muted">Your photos never leave your device. No upload, no server, no storage. The metadata scanning and removal runs in JavaScript inside your browser.</p>
                        </article>
                        <article class="tile">
                            <TsnIcon name="speed" class="h-5 w-5 text-ink" stroke="1.8" />
                            <h3 class="mt-3 text-[18px] text-brand">Fast & free</h3>
                            <p class="mt-2 text-[14px] leading-relaxed text-muted">No account, no sign-up, no waiting. Open the page, scan, download. Instant.</p>
                        </article>
                        <article class="tile">
                            <TsnIcon name="upload" class="h-5 w-5 text-ink" stroke="1.8" />
                            <h3 class="mt-3 text-[18px] text-brand">No file size limits from a server</h3>
                            <p class="mt-2 text-[14px] leading-relaxed text-muted">Server-based tools cap you at what their infrastructure can handle. This one respects your device's capability.</p>
                        </article>
                        <article class="tile">
                            <TsnIcon name="download" class="h-5 w-5 text-ink" stroke="1.8" />
                            <h3 class="mt-3 text-[18px] text-brand">Download clean photo</h3>
                            <p class="mt-2 text-[14px] leading-relaxed text-muted">The photo with metadata removed is yours. Use it on your website, send it to a client, post it online, or email it — without the hidden location data.</p>
                        </article>
                    </div>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="wrap">
                <div class="tile px-6 py-12 text-center sm:px-12">
                    <h2 class="section-title mx-auto max-w-[22ch]">Ready to remove EXIF data?</h2>
                    <p class="section-lead mx-auto">Open in any browser, select your photo, scan, remove, download. Private, fast, free.</p>
                    <NuxtLink to="/" class="btn-primary mt-8">Use the share tool now</NuxtLink>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
useSeo({
    title: "EXIF Remover — Strip Location & Metadata from Photos",
    description:
        "Remove GPS coordinates, camera data, and other metadata from photos before sharing. Runs entirely in your browser — your photos never upload.",
    pagePath: "/exif-remover",
})

import { trackEvent, trackToolView, trackToolComplete, trackToolToShare } from "~/composables/useAnalytics.js"

trackToolView("exif-remover")

const finished = ref(false)

function finishTool() {
    trackToolComplete("exif-remover", { finished: finished.value })
    finished.value = true
}
</script>