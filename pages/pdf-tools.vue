<template>
    <div>
        <PageHero
            title="Combine PDF Files Online — Free, No Upload"
            meta="Combine PDF · Merge · Free · Runs in your browser"
            lead="Combine PDF files into one document, set the page order, or pull out the pages you need. The whole operation runs in your browser — your PDFs never leave your device."
        >
            <div class="mt-10">
                <PdfToolkit />
            </div>
        </PageHero>

        <section class="section pt-0">
            <div class="wrap">
                <div class="max-w-2xl mx-auto">
                    <h2 class="section-title mt-3">Combine PDF files without uploading</h2>
                    <p class="section-lead mt-2 text-[15px] leading-relaxed text-muted">
                        Most free PDF mergers make you upload every document to their server before they will combine them. This one runs
                        <em>entirely in your browser</em>: the merge happens on your device, and the combined file is handed straight back to you.
                    </p>
                    <p class="mt-4 text-[14px] text-muted">
                        That matters for contracts, invoices, proposals, forms and client documents — the files you'd rather not park on a random server
                        just to combine a few PDFs into one.
                    </p>
                    <p class="mt-4 text-[14px] text-muted">
                        Add two PDFs or a dozen, move them up and down until the page sequence is right, then download a single combined PDF. Pages are copied
                        as they are, so text stays selectable, links keep working, and nothing is re-compressed. The same page can also split pages out of a
                        PDF or compress one, but combining is the default.
                    </p>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="wrap">
                <div class="max-w-xl mx-auto">
                    <h2 class="section-title mt-3">How to combine PDF files</h2>
                    <ol class="mt-6 grid gap-6 sm:grid-cols-3">
                        <li class="p-4 border rounded-lg bg-surface shadow-card">
                            <div class="text-3xl font-bold text-brand">1</div>
                            <h3 class="mt-3 text-[18px]">Add your PDFs</h3>
                            <p class="text-muted mt-2">Drag and drop two or more PDF files, or browse to select them. Up to 100 MB total, no page-count limit.</p>
                        </li>
                        <li class="p-4 border rounded-lg bg-surface shadow-card">
                            <div class="text-3xl font-bold text-brand">2</div>
                            <h3 class="mt-3 text-[18px]">Set the page order</h3>
                            <p class="text-muted mt-2">The list order is the order of the combined PDF. Use the arrows to move a file up or down before merging.</p>
                        </li>
                        <li class="p-4 border rounded-lg bg-surface shadow-card">
                            <div class="text-3xl font-bold text-brand">3</div>
                            <h3 class="mt-3 text-[18px]">Combine and download</h3>
                            <p class="text-muted mt-2">Click Combine. One merged PDF downloads from your browser. Nothing was uploaded, stored, or logged.</p>
                        </li>
                    </ol>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="wrap">
                <div class="max-w-xl mx-auto">
                    <h2 class="section-title mt-3">Combine, split or compress</h2>
                    <div class="mt-6 grid gap-4 sm:grid-cols-3">
                        <article v-for="op in operations" :key="op.title" class="tile p-5">
                            <div class="text-3xl font-bold text-brand mb-3">{{ op.icon }}</div>
                            <h3 class="text-[18px]">{{ op.title }}</h3>
                            <p class="mt-2 text-[14px] leading-relaxed text-muted">{{ op.desc }}</p>
                        </article>
                    </div>
                    <p class="mt-6 text-[13px] leading-relaxed text-muted">
                        Combining keeps every source page exactly as it was. Splitting copies the pages you list into a new file, in the order you write them.
                        Compressing re-saves with optimized object streams and removes document metadata — text stays selectable, and embedded photos
                        are not re-encoded, so image-heavy scans may only shrink slightly.
                    </p>
                </div>
            </div>
        </section>

        <section class="section" aria-labelledby="why-pdf-title">
            <div class="wrap">
                <div class="max-w-2xl mx-auto">
                    <h2 id="why-pdf-title" class="section-title mt-3">Why combine PDFs here</h2>
                    <div class="mt-6 grid gap-4 md:grid-cols-2">
                        <article class="tile">
                            <TsnIcon name="shield" class="h-5 w-5 text-ink" stroke="1.8" />
                            <h3 class="mt-3 text-[18px] text-brand">Your files stay yours</h3>
                            <p class="mt-2 text-[14px] leading-relaxed text-muted">A PDF merger is often the last place you want a signed contract. Here the merge runs in JavaScript inside your browser — no upload, no server copy, no storage.</p>
                        </article>
                        <article class="tile">
                            <TsnIcon name="speed" class="h-5 w-5 text-ink" stroke="1.8" />
                            <h3 class="mt-3 text-[18px] text-brand">No account, no watermark</h3>
                            <p class="mt-2 text-[14px] leading-relaxed text-muted">No sign-up wall after the upload, no branding stamped on the result, no daily merge limit to work around.</p>
                        </article>
                        <article class="tile">
                            <TsnIcon name="upload" class="h-5 w-5 text-ink" stroke="1.8" />
                            <h3 class="mt-3 text-[18px] text-brand">No server file-size cap</h3>
                            <p class="mt-2 text-[14px] leading-relaxed text-muted">Free PDF tools often block files over 10–20 MB. This one is limited by your own device and browser, not by a subscription tier.</p>
                        </article>
                        <article class="tile">
                            <TsnIcon name="download" class="h-5 w-5 text-ink" stroke="1.8" />
                            <h3 class="mt-3 text-[18px] text-brand">Quality untouched</h3>
                            <p class="mt-2 text-[14px] leading-relaxed text-muted">Combining PDFs copies the original pages rather than rasterizing them, so the text, images and links in the merged file look exactly like the source documents.</p>
                        </article>
                    </div>
                </div>
            </div>
        </section>

        <section class="section" aria-label="Combining PDFs FAQ">
            <div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
                <div>
                    <h2 class="section-title">Combining PDFs: questions</h2>
                </div>
                <div class="border-t border-line">
                    <details v-for="(item, i) in faqs" :key="i" class="faq border-b border-line" :open="i === 0">
                        <summary class="flex items-center justify-between gap-4 py-4 text-[15px] font-medium hover:underline hover:underline-offset-4">
                            {{ item.q }}
                            <span class="plus grid h-6 w-6 shrink-0 place-items-center text-muted"><TsnIcon name="plus" class="h-3.5 w-3.5" stroke="2.6" /></span>
                        </summary>
                        <p class="max-w-[62ch] pb-4 text-[15px] text-muted">{{ item.a }}</p>
                    </details>
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
    title: "Combine PDF Online — Free PDF Merger",
    description:
        "Combine PDF files into one document in your browser. Merge multiple PDFs, reorder the pages, then download — free, no upload, no account, no watermark.",
    pagePath: "/pdf-tools",
});

const operations = [
    { icon: "⊕", title: "Combine / Merge", desc: "Combine two or more PDFs into one file, in the order you set. Original pages are copied untouched." },
    { icon: "✂", title: "Split", desc: "Extract the pages you list — 1-3,5, for example — into a new PDF. The original is left alone." },
    { icon: "↓", title: "Compress", desc: "Re-save with optimized object streams and metadata removed. Text stays selectable." },
];

const faqs = [
    {
        q: "How do I combine PDF files for free?",
        a: "Open this page, drag two or more PDFs into the box (or browse for them), put them in the order you want, and click Combine. One merged PDF downloads immediately. It is free, needs no account, and adds no watermark.",
    },
    {
        q: "Can I combine PDFs without uploading them?",
        a: "Yes. The merge runs in your browser, so the PDF files are read and combined on your own device. Nothing is sent to a server, stored, or logged — which is why this is safe for contracts, invoices and other private documents.",
    },
    {
        q: "How many PDFs can I combine at once?",
        a: "There is no fixed limit on the number of files or pages. The selection is capped at 100 MB in total, and very large documents also depend on your device's memory. For huge batches, combine in groups of ten or so.",
    },
    {
        q: "Does combining PDFs reduce quality?",
        a: "No. The original pages are copied into the new document rather than converted to images or re-compressed. Text stays selectable and searchable, links keep working, and the layout is unchanged.",
    },
    {
        q: "How do I change the order of the PDFs?",
        a: "The order of the file list is the order of the combined PDF. Use the up and down arrows beside each file to move it before you click Combine. Pages inside each PDF keep their original order.",
    },
    {
        q: "Can I combine password-protected PDFs?",
        a: "Not while they are locked. This tool cannot decrypt a protected PDF, so it will tell you which file is protected. Open that PDF in your usual reader, remove its password, then add it again.",
    },
    {
        q: "Can I combine PDFs on my phone?",
        a: "Yes. The tool works in mobile browsers on Android and iPhone, including Safari and Chrome. The interface is the same: add the PDFs from Files, set the order, combine, and save the result.",
    },
];

useHead({
    script: [
        {
            type: "application/ld+json",
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: "Combine PDF — Merge, Split and Compress",
                url: "https://www.textsharenow.com/pdf-tools",
                description:
                    "Combine PDF files into one document in the browser, merge multiple PDFs, split pages or compress a PDF without uploading it.",
                applicationCategory: "BusinessApplication",
                operatingSystem: "Any",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            }),
        },
        {
            type: "application/ld+json",
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: faqs.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
            }),
        },
    ],
});
</script>
