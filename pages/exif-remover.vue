<template>
    <div>
        <PageHero
            title="EXIF Remover — Strip Location & Metadata from Photos"
            meta="Privacy tools · Free · No upload"
            lead="See the GPS coordinates and camera details hidden in a photo, then remove them before you share it. The file is processed entirely in your browser."
        >
            <div class="mt-10">
                <ExifCleaner />
            </div>
        </PageHero>

        <section class="section pt-0">
            <div class="wrap">
                <div class="max-w-2xl mx-auto">
                    <h2 class="section-title mt-3">Strip location from photos before sharing</h2>
                    <p class="section-lead mt-2 text-[15px] leading-relaxed text-muted">
                        Photos taken with a phone or camera usually contain hidden metadata: GPS coordinates, the camera model, and the exact date and time.
                        When you send the file — over email, a messaging app, or a marketplace listing — that data travels with it. This tool removes it locally,
                        leaving only the image.
                    </p>
                    <p class="mt-4 text-[14px] text-muted">
                        On JPEG, PNG and WebP the metadata blocks are cut out at the byte level, so the pixels are copied exactly and no quality is lost.
                        HEIC and other formats are rebuilt through a canvas, which produces a clean JPEG.
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
                            <h3 class="mt-3 text-[18px]">Select a photo</h3>
                            <p class="text-muted mt-2">JPEG, PNG, WebP and HEIC/HEIF. The file is read in the browser — nothing is uploaded.</p>
                        </li>
                        <li class="p-4 border rounded-lg bg-surface shadow-card">
                            <div class="text-3xl font-bold text-brand">2</div>
                            <h3 class="mt-3 text-[18px]">See what's hidden</h3>
                            <p class="text-muted mt-2">GPS coordinates, camera make and model, lens, ISO, shutter speed, and the date taken are read out of the EXIF block.</p>
                        </li>
                        <li class="p-4 border rounded-lg bg-surface shadow-card">
                            <div class="text-3xl font-bold text-brand">3</div>
                            <h3 class="mt-3 text-[18px]">Remove the metadata</h3>
                            <p class="text-muted mt-2">One click strips EXIF, XMP, IPTC, comments, text chunks and GPS data. The pixels are not touched on JPEG, PNG and WebP.</p>
                        </li>
                        <li class="p-4 border rounded-lg bg-surface shadow-card">
                            <div class="text-3xl font-bold text-brand">4</div>
                            <h3 class="mt-3 text-[18px]">Download the clean photo</h3>
                            <p class="text-muted mt-2">The new file is checked again before download, so you can see that no readable metadata remains. The original stays untouched.</p>
                        </li>
                    </ol>
                </div>
            </div>
        </section>

        <section class="section" aria-labelledby="why-exif-title">
            <div class="wrap">
                <div class="max-w-2xl mx-auto">
                    <h2 id="why-exif-title" class="section-title mt-3">Why this matters</h2>
                    <div class="mt-6 grid gap-4 md:grid-cols-2">
                        <article class="tile">
                            <TsnIcon name="shield" class="h-5 w-5 text-ink" stroke="1.8" />
                            <h3 class="mt-3 text-[18px] text-brand">Location privacy</h3>
                            <p class="mt-2 text-[14px] leading-relaxed text-muted">A photo taken at home can carry the exact coordinates of your home. Stripping GPS before posting or selling something removes that leak.</p>
                        </article>
                        <article class="tile">
                            <TsnIcon name="eye" class="h-5 w-5 text-ink" stroke="1.8" />
                            <h3 class="mt-3 text-[18px] text-brand">See it before you trust it</h3>
                            <p class="mt-2 text-[14px] leading-relaxed text-muted">The tool shows what it found before removing anything, and verifies the output afterwards. You don't have to take a claim on faith.</p>
                        </article>
                        <article class="tile">
                            <TsnIcon name="lock" class="h-5 w-5 text-ink" stroke="1.8" />
                            <h3 class="mt-3 text-[18px] text-brand">No upload, ever</h3>
                            <p class="mt-2 text-[14px] leading-relaxed text-muted">The metadata scan and removal run in JavaScript inside your browser. The photo never reaches a server, so there's nothing to retain.</p>
                        </article>
                        <article class="tile">
                            <TsnIcon name="download" class="h-5 w-5 text-ink" stroke="1.8" />
                            <h3 class="mt-3 text-[18px] text-brand">No quality loss</h3>
                            <p class="mt-2 text-[14px] leading-relaxed text-muted">On the common web formats the compressed image data is copied byte for byte — removing metadata doesn't re-compress your photo.</p>
                        </article>
                    </div>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="wrap">
                <ToolShareCta tool="exif-remover" path="/exif-remover" label="the EXIF remover" />
                <div class="mt-4 grid gap-4 md:grid-cols-3">
                    <NuxtLink to="/image-compressor" class="tile block transition-colors hover:border-muted">
                        <h3 class="text-[17px] font-semibold tracking-[-0.02em]">Image Compressor & Converter</h3>
                        <p class="mt-2 text-[14px] leading-relaxed text-muted">Hit an exact file size, or convert JPEG/PNG/WebP/HEIC.</p>
                    </NuxtLink>
                    <NuxtLink to="/pdf-tools" class="tile block transition-colors hover:border-muted">
                        <h3 class="text-[17px] font-semibold tracking-[-0.02em]">Combine PDF Files</h3>
                        <p class="mt-2 text-[14px] leading-relaxed text-muted">Combine, extract or shrink PDFs locally.</p>
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
    title: "EXIF Remover — Strip Location & Metadata from Photos",
    description:
        "See and remove GPS coordinates, camera data and other metadata from photos before sharing. Runs entirely in your browser — your photos never upload.",
    pagePath: "/exif-remover",
});

useHead({
    script: [
        {
            type: "application/ld+json",
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: "EXIF / Location Remover",
                url: "https://www.textsharenow.com/exif-remover",
                description:
                    "Remove GPS location, camera details and other EXIF metadata from photos in the browser. No upload.",
                applicationCategory: "SecurityApplication",
                operatingSystem: "Any",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            }),
        },
    ],
});
</script>
