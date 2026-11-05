<template>
    <div>
        <ToolPageHero
            eyebrow="EXIF remover"
            title="EXIF Remover — strip location and metadata before you share"
            lead="See the GPS coordinates, camera model and timestamps hidden in a photo, then remove them. JPEG, PNG and WebP pixels are copied exactly; the file never leaves your browser."
            :badges="badges"
            footnote="Processed on this device · Nothing is uploaded or stored"
        >
            <ExifCleaner />
        </ToolPageHero>

        <ToolCompare
            eyebrow="Why it matters"
            title="A photo can reveal where you live, work or shoot"
            local-label="This remover"
            typical-label="Typical metadata remover"
            :rows="compareRows"
        >
            <p class="mt-4 text-[15px] leading-relaxed text-muted">
                A phone photo usually carries more than pixels: GPS coordinates, camera make and model, lens, ISO, shutter speed and
                the exact time it was taken. Send the file by email, chat, marketplace or cloud link and that data travels with it.
            </p>
            <p class="mt-3 text-[15px] leading-relaxed text-muted">
                Social networks are inconsistent — some strip metadata, some keep it, and it depends on the upload path. If you want
                the location gone, strip it before the file leaves your device.
            </p>
            <ul class="mt-5 space-y-2.5 text-[14px] leading-relaxed text-muted">
                <li class="flex items-start gap-2">
                    <TsnIcon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-ink" stroke="2.4" />
                    The GPS alarm shows the coordinates before anything is removed.
                </li>
                <li class="flex items-start gap-2">
                    <TsnIcon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-ink" stroke="2.4" />
                    The output is scanned again, so you can verify the result instead of trusting a claim.
                </li>
                <li class="flex items-start gap-2">
                    <TsnIcon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-ink" stroke="2.4" />
                    On JPEG, PNG and WebP the compressed image data is copied byte for byte — no re-compression.
                </li>
            </ul>
        </ToolCompare>

        <section class="border-t border-line px-4 py-12 sm:py-16" aria-labelledby="exif-steps-title">
            <div class="tool-wrap">
                <p class="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">How it works</p>
                <h2 id="exif-steps-title" class="mt-2 max-w-[28ch] text-[clamp(1.6rem,3.2vw,2.25rem)] font-bold leading-[1.1] tracking-[-0.03em]">
                    See it, strip it, verify it
                </h2>
                <p class="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-muted">
                    The photo is read in the browser, cleaned in the browser, and checked again before you download it.
                </p>
                <ToolSteps :steps="steps" :cols="4" />
            </div>
        </section>

        <ToolFaq
            title="Removing photo metadata: questions"
            lead="What the GPS tag contains, what happens to image quality, and why a cleaned photo sometimes looks rotated."
            :items="faqs"
        />

        <ToolFooter
            tool="exif-remover"
            path="/exif-remover"
            label="the EXIF remover"
            :items="related"
        />
    </div>
</template>

<script setup>
useSeo({
    title: "EXIF Remover — Strip Location & Metadata from Photos",
    description:
        "See and remove GPS coordinates, camera data and other metadata from photos before sharing. Runs entirely in your browser — your photos never upload.",
    pagePath: "/exif-remover",
});

const badges = [
    { icon: "lock", label: "No upload" },
    { icon: "map-pin", label: "GPS shown first" },
    { icon: "check", label: "Lossless on JPEG" },
    { icon: "shield", label: "Output verified" },
];

const compareRows = [
    { label: "File leaves your device", local: "Never", typical: "Uploaded first" },
    { label: "Shows hidden metadata first", local: "Yes — including GPS", typical: "Rarely" },
    { label: "Lossless on JPEG / PNG / WebP", local: "Yes", typical: "Usually re-encodes" },
    { label: "Verifies the cleaned file", local: "Yes — rescanned", typical: "No" },
    { label: "Account required", local: "None", typical: "Often" },
];

const steps = [
    {
        icon: "upload",
        title: "Drop the photo",
        body: "JPEG, PNG, WebP or HEIC, up to 60 MB. The file is read locally; nothing is sent to a server.",
    },
    {
        icon: "eye",
        title: "Read what's hidden",
        body: "GPS coordinates, camera make and model, lens, ISO, shutter speed and the date taken are read from the EXIF block.",
    },
    {
        icon: "shield",
        title: "Remove everything",
        body: "One click strips EXIF, XMP, IPTC, comments, text chunks and GPS data. Pixels are not touched on JPEG, PNG and WebP.",
    },
    {
        icon: "check",
        title: "Verify and download",
        body: "The cleaned file is scanned again before download. The original photo stays untouched on your device.",
    },
];

const faqs = [
    {
        q: "How do I remove location from a photo?",
        a: "Drop the photo above. If it contains GPS data, the tool shows the coordinates before changing anything. Press Remove metadata, then download the clean file. On JPEG, PNG and WebP the metadata blocks are cut out at the byte level, so the image itself is unchanged.",
    },
    {
        q: "Does removing metadata reduce image quality?",
        a: "Not on JPEG, PNG or WebP. Those formats store the compressed image data separately from metadata, so the pixels are copied exactly. HEIC and other containers are rebuilt through a canvas and saved as JPEG at 92% quality, which does re-encode the image.",
    },
    {
        q: "Why is my photo rotated after cleaning it?",
        a: "Some photos store their orientation in a metadata tag instead of rotating the pixels. Removing metadata removes that instruction, so a few viewers may show the image rotated. The tool warns you when this applies — open the result and check before sharing.",
    },
    {
        q: "Are my photos uploaded?",
        a: "No. The metadata scan, removal and verification all run in JavaScript inside your browser. The photo never reaches a server, so there is no copy to retain, log or delete.",
    },
    {
        q: "Which file formats are supported?",
        a: "JPEG, PNG and WebP are handled losslessly. HEIC and HEIF photos from an iPhone are decoded in the browser and saved as a clean JPEG. Raw camera formats depend on whether your browser can decode them — if the preview fails, convert the file to JPEG first.",
    },
    {
        q: "Do social networks remove EXIF automatically?",
        a: "Some do, some don't, and it can vary by upload path. If you are sending the original file directly — email, chat, a marketplace listing, a cloud link — assume the metadata is still inside. Strip it first if the location should not travel with the photo.",
    },
];

const related = [
    { to: "/image-compressor", icon: "image", title: "Image Compressor", desc: "Hit an exact file size, or convert JPEG, PNG, WebP and HEIC locally." },
    { to: "/pdf-tools", icon: "pdf", title: "Combine PDF Files", desc: "Combine, extract pages or shrink PDFs locally, with no upload." },
    { to: "/tools", icon: "lock", title: "All Free Tools", desc: "Every browser-only tool in one place — no account, no uploads." },
];

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
