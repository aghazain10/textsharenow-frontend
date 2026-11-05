<template>
    <div>
        <ToolPageHero
            eyebrow="PDF tools"
            title="Combine PDF files online — free, no upload"
            lead="Combine PDF files into one document, reorder them, extract pages or shrink a PDF. The whole operation runs in your browser — your documents never leave your device."
            :badges="badges"
            footnote="Processed on this device · Nothing is uploaded or stored"
        >
            <PdfToolkit />
        </ToolPageHero>

        <ToolCompare
            eyebrow="Why combine here"
            title="A PDF merger is often the last place you want a signed contract"
            local-label="This merger"
            typical-label="Typical online merger"
            :rows="compareRows"
        >
            <p class="mt-4 text-[15px] leading-relaxed text-muted">
                Most free PDF mergers make you upload every document to their server before they will combine them. This one runs
                entirely in your browser: the merge happens on your device, and the combined file is handed straight back to you.
            </p>
            <p class="mt-3 text-[15px] leading-relaxed text-muted">
                That matters for contracts, invoices, proposals, forms and client documents — the files you would rather not park on
                a random server just to put a few PDFs together.
            </p>
            <ul class="mt-5 space-y-2.5 text-[14px] leading-relaxed text-muted">
                <li class="flex items-start gap-2">
                    <TsnIcon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-ink" stroke="2.4" />
                    Pages are copied, not rasterized — text stays selectable and links keep working.
                </li>
                <li class="flex items-start gap-2">
                    <TsnIcon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-ink" stroke="2.4" />
                    No watermark, no sign-up wall, no daily merge limit.
                </li>
                <li class="flex items-start gap-2">
                    <TsnIcon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-ink" stroke="2.4" />
                    Up to 100 MB in total, limited by your device rather than a subscription tier.
                </li>
            </ul>
        </ToolCompare>

        <section class="border-t border-line px-4 py-12 sm:py-16" aria-labelledby="pdf-jobs-title">
            <div class="tool-wrap">
                <p class="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">One tool, three jobs</p>
                <h2 id="pdf-jobs-title" class="mt-2 max-w-[26ch] text-[clamp(1.6rem,3.2vw,2.25rem)] font-bold leading-[1.1] tracking-[-0.03em]">
                    Combine, split or compress — without changing apps
                </h2>
                <p class="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-muted">
                    Switch tabs inside the tool above. The default is Combine, because that is what most people come here for.
                </p>

                <div class="mt-7 grid gap-px overflow-hidden rounded-xl border border-line bg-line shadow-card sm:grid-cols-3">
                    <article v-for="op in operations" :key="op.title" class="bg-surface p-5 sm:p-6">
                        <span class="grid h-9 w-9 place-items-center rounded-lg border border-line bg-bg text-ink shadow-card">
                            <TsnIcon :name="op.icon" class="h-4 w-4" stroke="1.9" />
                        </span>
                        <h3 class="mt-4 text-[16px] font-semibold tracking-[-0.01em]">{{ op.title }}</h3>
                        <p class="mt-2 text-[14px] leading-relaxed text-muted">{{ op.desc }}</p>
                    </article>
                </div>

                <p class="mt-5 max-w-[72ch] text-[13px] leading-relaxed text-muted">
                    Combining and splitting copy the original pages, so text, links and images are unchanged. Compression helps most
                    with text-heavy files; image-heavy scans may only shrink slightly because embedded photos are not re-encoded.
                </p>
            </div>
        </section>

        <section class="border-t border-line px-4 py-12 sm:py-16" aria-labelledby="pdf-steps-title">
            <div class="tool-wrap">
                <p class="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">How to combine PDF files</p>
                <h2 id="pdf-steps-title" class="mt-2 max-w-[26ch] text-[clamp(1.6rem,3.2vw,2.25rem)] font-bold leading-[1.1] tracking-[-0.03em]">
                    Three steps, one download
                </h2>
                <ToolSteps :steps="steps" :cols="3" />
            </div>
        </section>

        <ToolFaq
            title="Combining PDFs: questions"
            lead="What people check before putting a contract, invoice or client file into a PDF merger."
            :items="faqs"
        />

        <ToolFooter
            tool="pdf-tools"
            path="/pdf-tools"
            label="the PDF tools"
            :items="related"
        />
    </div>
</template>

<script setup>
useSeo({
    title: "Combine PDF Online — Free PDF Merger",
    description:
        "Combine PDF files into one document in your browser. Merge multiple PDFs, reorder the pages, then download — free, no upload, no account, no watermark.",
    pagePath: "/pdf-tools",
});

const badges = [
    { icon: "lock", label: "No upload" },
    { icon: "pdf", label: "Combine · Split · Compress" },
    { icon: "download", label: "Up to 100 MB" },
    { icon: "check", label: "No watermark" },
];

const compareRows = [
    { label: "File leaves your device", local: "Never", typical: "Uploaded first" },
    { label: "Signed contracts and invoices", local: "Stay on your device", typical: "Sit on their server" },
    { label: "Watermark on the result", local: "None", typical: "Common on free tiers" },
    { label: "Daily merge limit", local: "None", typical: "Often 2–3 files" },
    { label: "Original page quality", local: "Copied, not rasterized", typical: "Sometimes re-rendered" },
];

const operations = [
    {
        icon: "copy",
        title: "Combine / Merge",
        desc: "Two or more PDFs become one document, in the order you set. Source pages are copied as-is, so nothing is re-compressed.",
    },
    {
        icon: "expand",
        title: "Split",
        desc: "Extract a range like 1-3,5 into a new PDF, in the order you write it. The original file is left untouched.",
    },
    {
        icon: "download",
        title: "Compress",
        desc: "Re-save with optimized object streams and strip document metadata. Text stays selectable and links stay intact.",
    },
];

const steps = [
    {
        icon: "upload",
        title: "Add your PDFs",
        body: "Drop two or more PDFs, or browse to select them. Up to 100 MB total, with no page-count limit.",
    },
    {
        icon: "swap",
        title: "Set the order",
        body: "Use the arrows to move files up or down. The list order becomes the page order in the combined document.",
    },
    {
        icon: "download",
        title: "Combine and download",
        body: "Press Combine. One merged PDF is generated on your device and saved straight to your downloads.",
    },
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

const related = [
    { to: "/image-compressor", icon: "image", title: "Image Compressor", desc: "Hit an exact file size, or convert JPEG, PNG, WebP and HEIC locally." },
    { to: "/exif-remover", icon: "map-pin", title: "EXIF / Location Remover", desc: "Strip GPS and camera data from a photo before you share it." },
    { to: "/tools", icon: "lock", title: "All Free Tools", desc: "Every browser-only tool in one place — no account, no uploads." },
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
