<template>
    <div>
        <!-- Compact intro: small text, then straight into the tools -->
        <section class="px-4 pb-10 pt-12 sm:pb-12 sm:pt-16">
            <div class="wrap">
                <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p class="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">Free tools</p>
                        <h1 class="mt-3 max-w-[24ch] text-[clamp(1.9rem,4vw,2.75rem)] font-bold leading-[1.08] tracking-[-0.04em]">
                            Free tools that never upload your files
                        </h1>
                        <p class="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-muted">
                            Compress an image, combine PDFs, or strip a photo's metadata — right here in the browser.
                            No account, no install, no copy on a server.
                        </p>
                    </div>
                    <ul class="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-muted lg:shrink-0 lg:justify-end">
                        <li class="inline-flex items-center gap-1.5"><TsnIcon name="lock" class="h-3.5 w-3.5" stroke="1.8" />Runs locally</li>
                        <li class="inline-flex items-center gap-1.5"><TsnIcon name="user-x" class="h-3.5 w-3.5" stroke="1.8" />No account</li>
                        <li class="inline-flex items-center gap-1.5"><TsnIcon name="download" class="h-3.5 w-3.5" stroke="1.8" />Free downloads</li>
                    </ul>
                </div>
            </div>
        </section>

        <!-- Live tools -->
        <section class="px-4 pb-14 sm:pb-16" aria-labelledby="live-title">
            <div class="wrap">
                <div class="flex items-baseline justify-between gap-4">
                    <h2 id="live-title" class="text-[15px] font-semibold tracking-[-0.01em]">
                        Available now <span class="ml-1 font-normal text-muted">{{ live.length }}</span>
                    </h2>
                    <p class="hidden text-[12px] text-muted sm:block">Files are processed on your device</p>
                </div>

                <div class="mt-4 grid gap-px overflow-hidden rounded-xl border border-line bg-line shadow-card md:grid-cols-3">
                    <NuxtLink
                        v-for="t in live"
                        :key="t.path"
                        :to="t.path"
                        class="group flex flex-col bg-surface p-6 transition-colors hover:bg-surface-2"
                    >
                        <div class="flex items-start justify-between gap-3">
                            <span class="grid h-10 w-10 place-items-center rounded-lg border border-line bg-bg text-ink shadow-card">
                                <TsnIcon :name="t.icon" class="h-5 w-5" stroke="1.8" />
                            </span>
                            <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-ok">
                                <i class="live-dot" aria-hidden="true" />Live
                            </span>
                        </div>

                        <h3 class="mt-5 text-[19px] font-semibold leading-snug tracking-[-0.02em]">{{ t.title }}</h3>
                        <p class="mt-2 text-[14px] leading-relaxed text-muted">{{ t.tagline }}</p>

                        <ul class="mt-4 space-y-1.5 text-[13px] text-muted">
                            <li v-for="f in t.features" :key="f" class="flex items-start gap-2">
                                <TsnIcon name="check" class="mt-[3px] h-3.5 w-3.5 shrink-0 text-ink" stroke="2.4" />{{ f }}
                            </li>
                        </ul>

                        <div class="mt-auto pt-6">
                            <div class="flex flex-wrap gap-1.5">
                                <span v-for="tag in t.tags" :key="tag" class="rounded-md border border-line bg-bg px-1.5 py-0.5 text-[11px] font-medium text-muted">
                                    {{ tag }}
                                </span>
                            </div>
                            <span class="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                                Open tool
                                <span class="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
                            </span>
                        </div>
                    </NuxtLink>
                </div>
            </div>
        </section>

        <!-- Roadmap -->
        <section class="border-t border-line px-4 py-12 sm:py-14" aria-labelledby="coming-title">
            <div class="wrap">
                <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 id="coming-title" class="text-[22px] font-semibold tracking-[-0.03em]">In development</h2>
                        <p class="mt-1.5 text-[14px] text-muted">Same rule for each of these: local processing, or no tool at all.</p>
                    </div>
                    <NuxtLink to="/contact" class="text-[13px] font-medium text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
                        Suggest a tool
                    </NuxtLink>
                </div>

                <ul class="mt-6 grid border-y border-line sm:grid-cols-2 sm:gap-x-10">
                    <li
                        v-for="t in coming"
                        :key="t.title"
                        class="flex items-start justify-between gap-4 border-b border-line py-4 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0"
                    >
                        <div class="min-w-0">
                            <p class="text-[14px] font-medium">{{ t.title }}</p>
                            <p class="mt-0.5 text-[13px] leading-relaxed text-muted">{{ t.desc }}</p>
                        </div>
                        <span class="shrink-0 rounded-full border border-line bg-surface-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
                            Planned
                        </span>
                    </li>
                </ul>
            </div>
        </section>

        <!-- Core sharing tools -->
        <section class="border-t border-line px-4 py-12 sm:py-14" aria-labelledby="sharing-title">
            <div class="wrap">
                <h2 id="sharing-title" class="text-[22px] font-semibold tracking-[-0.03em]">The core sharing tools</h2>
                <p class="mt-1.5 max-w-[58ch] text-[14px] text-muted">
                    Text and files moving between your own devices — the features these utilities sit alongside.
                </p>

                <div class="mt-6 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
                    <NuxtLink
                        v-for="l in available"
                        :key="l.to"
                        :to="l.to"
                        class="group flex items-center justify-between gap-4 bg-surface px-5 py-4 transition-colors hover:bg-surface-2"
                    >
                        <div class="min-w-0">
                            <p class="text-[15px] font-semibold">{{ l.title }}</p>
                            <p class="mt-0.5 text-[13px] leading-relaxed text-muted">{{ l.desc }}</p>
                        </div>
                        <span class="shrink-0 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
                    </NuxtLink>
                </div>
            </div>
        </section>

        <!-- Small footer CTA -->
        <section class="border-t border-line px-4 py-10">
            <div class="wrap flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p class="text-[14px] text-muted">
                    <span class="font-medium text-ink">Missing a tool?</span>
                    Tell us the one problem you want solved in the browser.
                </p>
                <NuxtLink to="/contact" class="btn-ghost shrink-0">Get in touch</NuxtLink>
            </div>
        </section>
    </div>
</template>

<script setup>
useSeo({
    title: "Free Browser Tools — Images, PDF & EXIF",
    description:
        "Free browser-based tools that never upload your files. Compress images to a target size, combine and split PDFs, strip photo GPS and EXIF metadata — no account, no install.",
    pagePath: "/tools",
});

// Target queries these tool pages are built around (kept out of the UI on purpose):
// /image-compressor → "compress image to 100KB"; /pdf-tools → "combine pdf";
// /exif-remover → "remove location from photo".
const live = [
    {
        title: "Image Compressor & Converter",
        path: "/image-compressor",
        icon: "image",
        tagline: "Hit an exact file size, or convert a photo — without uploading it first.",
        features: ["Exact target from 100 KB to 2 MB", "JPEG, PNG, WebP and HEIC", "Optional longest-side resize"],
        tags: ["JPEG", "PNG", "WebP", "HEIC"],
    },
    {
        title: "Combine PDF",
        path: "/pdf-tools",
        icon: "pdf",
        tagline: "Combine PDF files into one document, or split and compress a PDF locally.",
        features: ["Combine in any page order", "Extract pages by range", "Compress without rasterizing"],
        tags: ["Combine", "Split", "Compress"],
    },
    {
        title: "EXIF / Location Remover",
        path: "/exif-remover",
        icon: "map-pin",
        tagline: "See the GPS and camera data hidden in a photo, then remove it before sharing.",
        features: ["GPS shown before removal", "Lossless on JPEG, PNG, WebP", "Output verified clean"],
        tags: ["GPS", "EXIF", "Metadata"],
    },
];

const coming = [
    { title: "Webhook Tester", desc: "A public URL that captures live requests so you can inspect and replay payloads." },
    { title: "Domain & Email Health Check", desc: "DNS, SSL, headers, redirects and SPF/DKIM/DMARC in one report." },
    { title: "QR Code Suite", desc: "WiFi, vCard, WhatsApp and menu QR codes, plus dynamic QRs with scan counts." },
    { title: "Time Zone Meeting Planner", desc: "Find a meeting time across time zones with DST handled correctly." },
    { title: "Secret Scanner", desc: "Scan .env files and logs for API keys before you share them." },
];

const available = [
    { title: "Online Text Sharing", to: "/online-text-sharing", desc: "Move text, links and notes between devices with a 5-character code." },
    { title: "Share Files Online", to: "/share-files-online", desc: "Send photos, screenshots and short videos; files delete after download." },
    { title: "How It Works", to: "/how-it-works", desc: "The full text and file flow, with device-specific tips." },
    { title: "Compare Tools", to: "/compare", desc: "How TextShareNow stacks up against OneTimeSecret, Privnote and others." },
];
</script>
