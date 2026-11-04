<template>
    <div>
        <PageHero
            title="PDF Tools — Merge, Split and Compress PDFs in the Browser"
            meta="PDF tools · Free · No upload"
            lead="Combine several PDFs into one, extract specific pages, or shrink a PDF — all inside your browser. The document never leaves your device."
        >
            <div class="mt-10">
                <PdfToolkit />
            </div>
        </PageHero>

        <section class="section pt-0">
            <div class="wrap">
                <div class="max-w-2xl mx-auto">
                    <h2 class="section-title mt-3">PDF tools, private by default</h2>
                    <p class="section-lead mt-2 text-[15px] leading-relaxed text-muted">
                        Most PDF tools on the web require you to upload your document to their server first. This one runs <em>entirely in your browser</em>.
                        The merging, splitting and re-saving happen locally, and only the finished file is handed back to you.
                    </p>
                    <p class="mt-4 text-[14px] text-muted">
                        That matters for contracts, proposals, invoices, forms and client documents — the files you'd rather not park on a random server
                        just to delete three pages.
                    </p>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="wrap">
                <div class="max-w-xl mx-auto">
                    <h2 class="section-title mt-3">Choose an operation</h2>
                    <div class="mt-6 grid gap-4 sm:grid-cols-3">
                        <article v-for="op in operations" :key="op.title" class="tile p-5">
                            <div class="text-3xl font-bold text-brand mb-3">{{ op.icon }}</div>
                            <h3 class="text-[18px]">{{ op.title }}</h3>
                            <p class="mt-2 text-[14px] leading-relaxed text-muted">{{ op.desc }}</p>
                        </article>
                    </div>
                    <p class="mt-6 text-[13px] leading-relaxed text-muted">
                        Merge keeps each source page exactly as it was. Split copies the pages you list into a new file, in the order you write them.
                        Compress re-saves with optimized object streams and removes document metadata — text stays selectable, and embedded photos
                        are not re-encoded, so image-heavy scans may only shrink slightly.
                    </p>
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
                            <p class="mt-2 text-[14px] leading-relaxed text-muted">Your PDF never leaves your device. No upload, no server copy, no storage. The operation runs in JavaScript inside your browser.</p>
                        </article>
                        <article class="tile">
                            <TsnIcon name="speed" class="h-5 w-5 text-ink" stroke="1.8" />
                            <h3 class="mt-3 text-[18px] text-brand">No account, no watermark</h3>
                            <p class="mt-2 text-[14px] leading-relaxed text-muted">No sign-up wall after the upload, and no branding added to your file. Process a document and download it.</p>
                        </article>
                        <article class="tile">
                            <TsnIcon name="upload" class="h-5 w-5 text-ink" stroke="1.8" />
                            <h3 class="mt-3 text-[18px] text-brand">No server file-size cap</h3>
                            <p class="mt-2 text-[14px] leading-relaxed text-muted">Free sites often block files over 10–20 MB. This one is limited by your own device and browser, not a subscription tier.</p>
                        </article>
                        <article class="tile">
                            <TsnIcon name="download" class="h-5 w-5 text-ink" stroke="1.8" />
                            <h3 class="mt-3 text-[18px] text-brand">Text stays text</h3>
                            <p class="mt-2 text-[14px] leading-relaxed text-muted">Merging and splitting keep the original pages untouched. Compress optimizes the file structure without rasterizing it into unsearchable images.</p>
                        </article>
                    </div>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="wrap">
                <ToolShareCta tool="pdf-tools" path="/pdf-tools" label="the PDF tools" />
                <div class="mt-4 grid gap-4 md:grid-cols-3">
                    <NuxtLink to="/image-compressor" class="tile block transition-colors hover:border-muted">
                        <h3 class="text-[17px] font-semibold tracking-[-0.02em]">Image Compressor & Converter</h3>
                        <p class="mt-2 text-[14px] leading-relaxed text-muted">Hit an exact file size, or convert JPEG/PNG/WebP/HEIC.</p>
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
    title: "PDF Tools — Merge, Split and Compress PDFs in the Browser",
    description:
        "Merge multiple PDFs into one, extract specific pages, or compress PDF file size — all inside your browser. No upload, no server, no account.",
    pagePath: "/pdf-tools",
});

const operations = [
    { icon: "⊕", title: "Merge", desc: "Combine two or more PDFs into one file, in the order you set. Original pages are copied untouched." },
    { icon: "✂", title: "Split", desc: "Extract the pages you list — 1-3,5, for example — into a new PDF. The original is left alone." },
    { icon: "↓", title: "Compress", desc: "Re-save with optimized object streams and metadata removed. Text stays selectable." },
];

useHead({
    script: [
        {
            type: "application/ld+json",
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: "PDF Merge, Split and Compress",
                url: "https://www.textsharenow.com/pdf-tools",
                description:
                    "Merge, split and compress PDF files in the browser without uploading them to a server.",
                applicationCategory: "BusinessApplication",
                operatingSystem: "Any",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            }),
        },
    ],
});
</script>
