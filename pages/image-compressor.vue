<template>
    <div>
        <ToolPageHero
            eyebrow="Image compressor"
            title="Image Compressor — compress to an exact size, without uploading"
            lead="Compress a photo to 100 KB, 500 KB, 1 MB or any target you type. Resize it, convert between JPEG, PNG and WebP, and turn iPhone HEIC photos into files every site accepts — all on your device."
            :badges="badges"
            footnote="Processed on this device · Nothing is uploaded or stored"
        >
            <ImageCompressor />
        </ToolPageHero>

        <ToolCompare
            eyebrow="Why this one"
            title="Compression without the upload step"
            local-label="This compressor"
            typical-label="Typical uploader"
            :rows="compareRows"
        >
            <p class="mt-4 text-[15px] leading-relaxed text-muted">
                Most “compress image” sites are upload sites. You pick a file, it goes to their server, and a smaller copy comes back —
                often with a copy left behind that you cannot see. This one does the work in the tab you already have open.
            </p>
            <p class="mt-3 text-[15px] leading-relaxed text-muted">
                That matters for client photos, screenshots from a work laptop, scans of documents, and any picture with something
                in the background you would rather not hand over.
            </p>
            <ul class="mt-5 space-y-2.5 text-[14px] leading-relaxed text-muted">
                <li class="flex items-start gap-2">
                    <TsnIcon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-ink" stroke="2.4" />
                    Forms and job portals that cap uploads at 100 KB, 500 KB or 2 MB.
                </li>
                <li class="flex items-start gap-2">
                    <TsnIcon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-ink" stroke="2.4" />
                    iPhone HEIC photos that need to become JPEG for a website or email.
                </li>
                <li class="flex items-start gap-2">
                    <TsnIcon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-ink" stroke="2.4" />
                    Portfolio and marketplace images that still need to look sharp after shrinking.
                </li>
            </ul>
        </ToolCompare>

        <section class="border-t border-line px-4 py-12 sm:py-16" aria-labelledby="image-steps-title">
            <div class="tool-wrap">
                <p class="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">How it works</p>
                <h2 id="image-steps-title" class="mt-2 max-w-[28ch] text-[clamp(1.6rem,3.2vw,2.25rem)] font-bold leading-[1.1] tracking-[-0.03em]">
                    From camera roll to upload-ready in four steps
                </h2>
                <p class="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-muted">
                    No queue and no upload progress bar. The only wait is your own device doing the maths.
                </p>
                <ToolSteps :steps="steps" :cols="4" />
            </div>
        </section>

        <ToolFaq
            title="Compressing images: questions"
            lead="Short answers to the things people ask before they trust a file to a compressor."
            :items="faqs"
        />

        <ToolFooter
            tool="image-compressor"
            path="/image-compressor"
            label="the image compressor"
            :items="related"
        />
    </div>
</template>

<script setup>
useSeo({
    title: "Image Compressor — Compress & Convert Photos in the Browser",
    description:
        "Compress photos to an exact target size or convert HEIC, JPEG, PNG and WebP in your browser. No upload — your images never leave your device.",
    pagePath: "/image-compressor",
});

const badges = [
    { icon: "lock", label: "No upload" },
    { icon: "download", label: "Exact target size" },
    { icon: "image", label: "HEIC supported" },
    { icon: "user-x", label: "Free, no sign-up" },
];

const compareRows = [
    { label: "File leaves your device", local: "Never", typical: "Uploaded first" },
    { label: "Compress to an exact KB size", local: "Yes — 100 KB to 2 MB or custom", typical: "Quality slider only" },
    { label: "HEIC straight from iPhone", local: "Yes", typical: "Usually not supported" },
    { label: "Account or daily limit", local: "None", typical: "Often required" },
    { label: "Watermark on the result", local: "None", typical: "Sometimes" },
];

const steps = [
    {
        icon: "upload",
        title: "Drop the photo",
        body: "JPEG, PNG, WebP or HEIC, up to 60 MB. The browser decodes it locally; the file never goes anywhere.",
    },
    {
        icon: "download",
        title: "Pick a target",
        body: "Choose 100 KB, 500 KB, 1 MB or 2 MB, or type any value. Quality is tuned automatically — PNG reduces dimensions instead — to land just under it.",
    },
    {
        icon: "image",
        title: "Resize or convert",
        body: "Optional: cap the longest side, switch to JPEG, WebP or PNG, or let an iPhone HEIC photo come out as JPEG.",
    },
    {
        icon: "check",
        title: "Download",
        body: "The result is generated on your device. Compare before and after, then save it. The original is untouched.",
    },
];

const faqs = [
    {
        q: "How do I compress an image to 100 KB?",
        a: "Choose the 100 KB preset — or type 100 and pick KB — leave the format on JPEG or WebP, and press Compress image. The tool lowers quality step by step until the file lands just under the target. If it cannot get there without visible damage, set a smaller longest side under Resize and run it again.",
    },
    {
        q: "Are my photos uploaded or stored?",
        a: "No. The photo is decoded, resized and re-encoded by your browser using the Canvas API. The file never reaches a server, so there is nothing to store, log or delete. Only the HEIC decoder is downloaded as code — never the photo itself.",
    },
    {
        q: "Does compressing an image reduce quality?",
        a: "Lossy formats trade some detail for size. Target mode starts from high quality and steps down only as far as it needs, so 75–85% is usually indistinguishable on screen. PNG is lossless, so its dimensions are reduced instead of its quality.",
    },
    {
        q: "Can I convert HEIC to JPEG here?",
        a: "Yes. Pick JPEG under Output format, or keep “Keep original (HEIC → JPEG)”. The HEIC file is decoded in your browser and saved as a normal JPEG that every website, form and email client accepts.",
    },
    {
        q: "What is the maximum file size?",
        a: "60 MB per image. Very large photos can still be slow on a phone because all the work happens in the browser; close other tabs or resize first if it stalls.",
    },
    {
        q: "Can I use this on my phone?",
        a: "Yes. It works in Safari on iPhone and Chrome on Android. Pick a photo from your camera roll, set a target or quality, compress it, and save the result back to your device.",
    },
];

const related = [
    { to: "/pdf-tools", icon: "pdf", title: "Combine PDF Files", desc: "Combine, extract pages or shrink PDFs locally, with no upload." },
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
                name: "Image Compressor & Converter",
                url: "https://www.textsharenow.com/image-compressor",
                description:
                    "Compress an image to an exact target size, resize it, and convert HEIC, JPEG, PNG or WebP in the browser. No upload.",
                applicationCategory: "MultimediaApplication",
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
