<template>
    <div>
        <PageHero
            title="Free Private Tools for People Who Work Across Devices"
            meta="Tools · Launching now"
            lead="A small, growing set of browser-based tools that solve one specific problem each — and never upload your data. No account, no install, no AI in the loop."
        >
            <div class="mt-8 flex flex-wrap gap-3">
                <NuxtLink to="/#tool" class="btn-primary">
                    <TsnIcon name="clipboard" class="h-4 w-4" stroke="2" />Use the share tool
                </NuxtLink>
                <NuxtLink to="/pricing" class="btn-ghost">See TextShareNow Pro</NuxtLink>
            </div>
        </PageHero>

        <section class="section pt-0" aria-labelledby="what-title">
            <div class="wrap">
                <div class="max-w-2xl">
                    <p class="text-[13px] font-medium text-muted">Why this page exists</p>
                    <h2 id="what-title" class="section-title mt-3">One problem per tool, in your browser</h2>
                    <p class="section-lead">
                        Every tool here does exactly one job, runs entirely in your browser, and never sends your files or text anywhere.
                        That is the point: the things people usually paste into an AI chat — a client file, a secret, a log, a photo — are the things that should never leave your device.
                    </p>
                </div>

                <div class="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <article v-for="t in coming" :key="t.title" class="tile">
                        <div class="flex items-center justify-between gap-3">
                            <h3 class="text-[18px] font-semibold tracking-[-0.02em]">{{ t.title }}</h3>
                            <span class="rounded-full border border-line bg-surface-2 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted">{{ t.status }}</span>
                        </div>
                        <p class="mt-2 text-[14px] leading-relaxed text-muted">{{ t.desc }}</p>
                        <p class="mt-3 text-[12px] font-medium text-brand">{{ t.query }}</p>
                    </article>
                </div>
            </div>
        </section>

        <section class="section" aria-labelledby="available-title">
            <div class="wrap">
                <div class="max-w-2xl">
                    <p class="text-[13px] font-medium text-muted">Available now</p>
                    <h2 id="available-title" class="section-title mt-3">What you can use today</h2>
                    <p class="section-lead">These are part of TextShareNow already — no separate install, no account.</p>
                </div>

                <div class="mt-10 grid gap-4 md:grid-cols-2">
                    <NuxtLink v-for="l in available" :key="l.to" :to="l.to" class="tile block transition-colors hover:border-muted">
                        <h3 class="text-[18px] font-semibold tracking-[-0.02em]">{{ l.title }}</h3>
                        <p class="mt-2 text-[14px] leading-relaxed text-muted">{{ l.desc }}</p>
                        <p class="mt-3 text-[13px] font-medium text-brand">Open →</p>
                    </NuxtLink>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="wrap">
                <div class="tile px-6 py-12 text-center sm:px-12">
                    <h2 class="section-title mx-auto max-w-[22ch]">Want a tool we don't have yet?</h2>
                    <p class="section-lead mx-auto">Tell us which single problem you want solved in the browser — privacy, no uploads, no account.</p>
                    <NuxtLink to="/contact" class="btn-primary mt-8">Suggest a tool</NuxtLink>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
useSeo({
    title: "Free Private Browser Tools",
    description:
        "A growing set of free, browser-based tools that solve one specific problem each and never upload your data. No account, no install. Image compression, PDF tools, webhook testing, domain checks, QR codes and more — launching now.",
    pagePath: "/tools",
});

const coming = [
    { title: "Image Compressor & Converter", status: "Coming", desc: "Compress an image to an exact target size, convert HEIC/WebP/PNG/JPEG. Runs in your browser — your photos never upload.", query: "compress image to 100KB" },
    { title: "PDF Merge / Split / Compress", status: "Coming", desc: "Combine, split, or shrink PDFs locally. No upload, no file sitting on someone else's server.", query: "merge PDF without uploading" },
    { title: "EXIF / Location Remover", status: "Coming", desc: "Strip GPS and metadata from photos before you share them.", query: "remove location from photo" },
    { title: "Webhook Tester", status: "Coming", desc: "Get a public URL that captures live requests so you can inspect payloads and replay them.", query: "test a webhook online" },
    { title: "Domain & Email Health Check", status: "Coming", desc: "DNS, SSL, headers, redirects, SPF/DKIM/DMARC in one report.", query: "check SPF record / SSL expiry" },
    { title: "QR Code Suite", status: "Coming", desc: "WiFi, vCard, WhatsApp, menu and logo QR codes — plus editable dynamic QRs with scan counts.", query: "WiFi QR code generator" },
    { title: "Time Zone Meeting Planner", status: "Coming", desc: "Find a meeting time across time zones with DST handled correctly, and share the link.", query: "meeting planner across time zones" },
    { title: "Secret Scanner", status: "Coming", desc: "Scan .env files and logs for API keys before you share them.", query: "scan .env for secrets" },
];

const available = [
    { title: "Online Text Sharing", to: "/online-text-sharing", desc: "Move text, links, and notes between any devices with a 5-character code. No app, no sign-up." },
    { title: "Share Files Online", to: "/share-files-online", desc: "Send photos, screenshots, and short videos between devices. Files auto-delete after one download." },
    { title: "How It Works", to: "/how-it-works", desc: "The full flow for text and files, plus device-specific tips." },
    { title: "Compare Tools", to: "/compare", desc: "How TextShareNow stacks up against OneTimeSecret, Privnote, and others." },
];
</script>