<template>
    <div>
        <PageHero
            title="Image Compressor — Compress & Convert Photos in the Browser"
            meta="Image tools · Free · Runs in your browser"
            lead="Compress a photo to an exact target size, resize it, or convert between JPEG, PNG and WebP — including HEIC photos from an iPhone. Everything happens on your device; your images are never uploaded."
        >
            <div class="mt-10">
                <ImageCompressor />
            </div>
        </PageHero>

        <section class="section pt-0">
            <div class="wrap">
                <div class="max-w-2xl mx-auto">
                    <h2 class="section-title mt-3">Compress images without uploading</h2>
                    <p class="section-lead mt-2 text-[15px] leading-relaxed text-muted">
                        Most online compressors require you to upload your photo to their server first. This one runs <em>entirely in your browser</em>.
                        The image never leaves your device — the compression math happens locally, and only the finished file is handed back to you.
                    </p>
                    <p class="mt-4 text-[14px] text-muted">
                        That matters for client photos, screenshots from a work laptop, scanned documents, and any picture that carries information
                        you don't want sitting on someone else's server.
                    </p>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="wrap">
                <div class="max-w-xl mx-auto">
                    <h2 class="section-title mt-3">How it works</h2>
                    <ol class="mt-6 grid gap-6 sm:grid-cols-2">
                        <li class="p-4 border rounded-lg bg-surface shadow-card">
                            <div class="text-3xl font-bold text-brand">1</div>
                            <h3 class="mt-3 text-[18px]">Select an image</h3>
                            <p class="text-muted mt-2">Drag and drop or browse. JPEG, PNG, WebP and HEIC/HEIF all work — HEIC is decoded in the browser and converted for you.</p>
                        </li>
                        <li class="p-4 border rounded-lg bg-surface shadow-card">
                            <div class="text-3xl font-bold text-brand">2</div>
                            <h3 class="mt-3 text-[18px]">Choose a target size</h3>
                            <p class="text-muted mt-2">Pick 100 KB, 200 KB, 500 KB, 1 MB, 2 MB, or type your own. The quality is tuned automatically to land just under it.</p>
                        </li>
                        <li class="p-4 border rounded-lg bg-surface shadow-card">
                            <div class="text-3xl font-bold text-brand">3</div>
                            <h3 class="mt-3 text-[18px]">Convert or resize (optional)</h3>
                            <p class="text-muted mt-2">Switch to JPEG, PNG or WebP, or cap the longest side in pixels. PNG has no quality setting, so its dimensions are reduced to hit the target.</p>
                        </li>
                        <li class="p-4 border rounded-lg bg-surface shadow-card">
                            <div class="text-3xl font-bold text-brand">4</div>
                            <h3 class="mt-3 text-[18px]">Download</h3>
                            <p class="text-muted mt-2">One click. The compressed file downloads to your device. Nothing was uploaded, stored, or logged.</p>
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
                            <p class="mt-2 text-[14px] leading-relaxed text-muted">Your photos never leave your device. No upload, no server, no storage. The compression runs in JavaScript inside your browser.</p>
                        </article>
                        <article class="tile">
                            <TsnIcon name="speed" class="h-5 w-5 text-ink" stroke="1.8" />
                            <h3 class="mt-3 text-[18px] text-brand">Fast & free</h3>
                            <p class="mt-2 text-[14px] leading-relaxed text-muted">No account, no sign-up, no waiting queue. Open the page, compress, download.</p>
                        </article>
                        <article class="tile">
                            <TsnIcon name="upload" class="h-5 w-5 text-ink" stroke="1.8" />
                            <h3 class="mt-3 text-[18px] text-brand">No server file-size cap</h3>
                            <p class="mt-2 text-[14px] leading-relaxed text-muted">Server-based compressors cap you at what their infrastructure can handle. This one is limited only by your own device.</p>
                        </article>
                        <article class="tile">
                            <TsnIcon name="download" class="h-5 w-5 text-ink" stroke="1.8" />
                            <h3 class="mt-3 text-[18px] text-brand">Fit the upload limit</h3>
                            <p class="mt-2 text-[14px] leading-relaxed text-muted">Forms, job portals and email attachments usually cap files at 100 KB–2 MB. Compress to that number directly instead of guessing at quality.</p>
                        </article>
                    </div>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="wrap">
                <ToolShareCta tool="image-compressor" path="/image-compressor" label="the image compressor" />
                <div class="mt-4 grid gap-4 md:grid-cols-3">
                    <NuxtLink to="/pdf-tools" class="tile block transition-colors hover:border-muted">
                        <h3 class="text-[17px] font-semibold tracking-[-0.02em]">Combine PDF Files</h3>
                        <p class="mt-2 text-[14px] leading-relaxed text-muted">Combine, extract or shrink PDFs locally.</p>
                    </NuxtLink>
                    <NuxtLink to="/exif-remover" class="tile block transition-colors hover:border-muted">
                        <h3 class="text-[17px] font-semibold tracking-[-0.02em]">EXIF / Location Remover</h3>
                        <p class="mt-2 text-[14px] leading-relaxed text-muted">Strip GPS and camera data before sharing a photo.</p>
                    </NuxtLink>
                    <NuxtLink to="/tools" class="tile block transition-colors hover:border-muted">
                        <h3 class="text-[17px] font-semibold tracking-[-0.02em]">Free Tools Hub</h3>
                        <p class="mt-2 text-[14px] leading-relaxed text-muted">All the browser-only tools in one place.</p>
                    </NuxtLink>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
useSeo({
    title: "Image Compressor — Compress & Convert Photos in the Browser",
    description:
        "Compress photos to an exact target size or convert HEIC, JPEG, PNG and WebP in your browser. No upload — your images never leave your device.",
    pagePath: "/image-compressor",
});

useHead({
    script: [
        {
            type: "application/ld+json",
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: "Image Compressor & Converter",
                url: "https://www.textsharenow.com/image-compressor",
                description:
                    "Compress an image to an exact target size, resize it, and convert HEIC, JPEG, PNG or WebP in the browser. No upload.",
                applicationCategory: "MultimediaApplication",
                operatingSystem: "Any",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            }),
        },
    ],
});
</script>
