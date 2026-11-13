<template>
    <div>
        <PageHero
            meta="Author"
            title="Zain Rizvee"
            lead="Web developer based in Skardu, Pakistan — the person who builds and maintains TextShareNow, and who writes the guides on this blog."
        >
            <div class="mt-8 flex items-center gap-5">
                <img
                    src="/zain-rizvee.jpg"
                    alt="Portrait of Zain Rizvee, web developer and creator of TextShareNow"
                    width="96"
                    height="96"
                    loading="lazy"
                    decoding="async"
                    class="h-24 w-24 shrink-0 rounded-full border border-line bg-surface object-cover shadow-card"
                />
                <div>
                    <p class="text-[15px] font-semibold text-ink">Zain Rizvee</p>
                    <p class="text-[14px] text-muted">Web developer · Skardu, Pakistan</p>
                    <p class="text-[14px] text-muted">Laravel · Nuxt · Vue</p>
                </div>
            </div>
        </PageHero>

        <section class="section">
            <div class="wrap grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
                <article class="min-w-0 max-w-[68ch] text-[16px] leading-7 text-muted">
                    <h2 class="text-[26px] font-semibold tracking-[-0.03em] text-ink">Bio</h2>
                    <p class="mt-4">
                        TextShareNow is an independent project built and
                        maintained by <strong class="font-semibold text-ink">Zain Rizvee</strong>,
                        a web developer based in Skardu, Pakistan. Zain runs several
                        e-commerce businesses and builds the custom storefronts and
                        internal tools behind them himself, working primarily with
                        Laravel, Nuxt, and Vue.
                    </p>
                    <p class="mt-4">
                        His main business is
                        <a href="https://organicaprico.com" target="_blank" rel="noopener noreferrer" class="text-link">Organic Aprico</a>
                        — a licensed extractor and online store for pure Himalayan
                        shilajit, hand-harvested above 17,000 ft in Skardu,
                        Gilgit-Baltistan. Every batch is eight-stage purified,
                        sun-dried, and independently lab tested (Micro Quality Lab,
                        PCSIR, Eurofins) before it ships worldwide. Zain built the
                        storefront, the wholesale pipeline, and the content behind it
                        end to end — the same way he builds TextShareNow.
                    </p>
                    <p class="mt-4">
                        The idea for TextShareNow came out of a problem Zain kept
                        running into during his own work: moving a link, a snippet of
                        code, or a quick note between his phone and his laptop, over
                        and over, every single day. Emailing himself got old fast, and
                        every existing tool either needed an app install, an account,
                        or only worked one direction. So he built the tool he actually
                        wanted to use — a short code that works instantly, in both
                        directions, on any device.
                    </p>

                    <h2 class="mt-12 border-t border-line pt-12 text-[26px] font-semibold tracking-[-0.03em] text-ink">Experience</h2>
                    <ul class="mt-4 list-disc space-y-2 pl-5 marker:text-line">
                        <li>Web developer based in Skardu, Pakistan, working independently.</li>
                        <li>Founder of <a href="https://organicaprico.com" target="_blank" rel="noopener noreferrer" class="text-link">Organic Aprico</a> — his main business: lab-tested Himalayan shilajit, from extraction above 17,000 ft to worldwide delivery.</li>
                        <li>Runs several e-commerce businesses and builds their storefronts and internal tools end to end.</li>
                        <li>Primary stack: Laravel on the backend, Nuxt and Vue on the frontend.</li>
                        <li>Creator and sole maintainer of TextShareNow — design, build, infrastructure, and content.</li>
                    </ul>

                    <h2 class="mt-12 border-t border-line pt-12 text-[26px] font-semibold tracking-[-0.03em] text-ink">Free Tools Built by Zain</h2>
                    <p class="mt-4">
                        Beyond TextShareNow, Zain ships small, privacy-first tools that run
                        entirely in your browser — no account, no upload, no cost.
                    </p>
                    <div class="mt-6 grid gap-4 sm:grid-cols-2">
                        <NuxtLink
                            v-for="tool in freeTools"
                            :key="tool.to"
                            :to="tool.to"
                            class="group tile flex flex-col transition-colors hover:bg-surface-2"
                        >
                            <span class="inline-grid h-11 w-11 place-items-center rounded-lg border border-line bg-bg text-ink shadow-card">
                                <TsnIcon :name="tool.icon" class="h-5 w-5" stroke="1.8" />
                            </span>
                            <h3 class="mt-4 text-[17px] font-semibold tracking-[-0.02em] text-ink">{{ tool.title }}</h3>
                            <p class="mt-1.5 text-[13px] leading-relaxed text-muted">{{ tool.desc }}</p>
                            <span class="mt-auto inline-flex items-center gap-1.5 pt-4 text-[13px] font-semibold text-ink">
                                Open tool
                                <span class="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
                            </span>
                        </NuxtLink>
                    </div>
                    <NuxtLink to="/tools" class="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
                        View all free tools
                        <span aria-hidden="true">→</span>
                    </NuxtLink>

                    <h2 class="mt-12 border-t border-line pt-12 text-[26px] font-semibold tracking-[-0.03em] text-ink">Articles by Zain Rizvee</h2>
                    <ul class="mt-4 space-y-2">
                        <li v-for="a in articles" :key="a.slug">
                            <NuxtLink :to="`/blog/${a.slug}`" class="text-link">{{ a.title }}</NuxtLink>
                            <span class="text-[13px] text-muted"> · {{ a.date }}</span>
                        </li>
                    </ul>
                </article>

                <aside class="grid gap-4 lg:sticky lg:top-24">
                    <div class="tile">
                        <h3 class="text-[13px] font-medium text-muted">Main Business</h3>
                        <p class="mt-3 text-[15px] font-semibold leading-6 text-ink">
                            <a href="https://organicaprico.com" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 underline decoration-line underline-offset-4 hover:decoration-ink">
                                Organic Aprico
                                <TsnIcon name="external" class="h-3.5 w-3.5" stroke="1.8" />
                            </a>
                        </p>
                        <p class="mt-2 text-[13px] leading-relaxed text-muted">
                            Pure Himalayan shilajit, hand-harvested above 17,000 ft in Skardu —
                            eight-stage purified, lab tested, shipped worldwide.
                        </p>
                        <a href="https://organicaprico.com" target="_blank" rel="noopener noreferrer" class="btn-ghost mt-4 w-full">
                            Visit organicaprico.com
                        </a>
                    </div>

                    <div class="tile">
                        <h3 class="text-[17px] font-semibold tracking-[-0.02em]">Try the Tool</h3>
                        <p class="mt-2 text-[14px] leading-relaxed text-muted">Share text and files between any devices in seconds.</p>
                        <NuxtLink to="/" class="btn-primary mt-5 w-full">Open Tool</NuxtLink>
                    </div>

                    <div class="tile">
                        <h3 class="text-[17px] font-semibold tracking-[-0.02em]">Questions?</h3>
                        <p class="mt-2 text-[14px] leading-relaxed text-muted">Bug reports, feedback, or anything else — it reaches Zain directly.</p>
                        <NuxtLink to="/contact" class="btn-ghost mt-5 w-full">Get in Touch</NuxtLink>
                    </div>
                </aside>
            </div>
        </section>
    </div>
</template>

<script setup>
import { blogPosts } from "~/data/blog-posts";

useSeo({
    title: "Zain Rizvee — Web Developer & Author of the TextShareNow Blog",
    description:
        "Zain Rizvee is a web developer based in Skardu, Pakistan, and the creator of TextShareNow and Organic Aprico. Read his guides on cross-device sharing, productivity, and privacy.",
    pagePath: "/author/zain-rizvee",
});

const articles = blogPosts.map((p) => ({ slug: p.slug, title: p.title, date: p.date }));

const freeTools = [
    {
        to: "/qr-code-generator",
        icon: "qr",
        title: "QR Code Generator",
        desc: "QR codes for links, Wi-Fi, vCards and messages — generated in your browser.",
    },
    {
        to: "/image-compressor",
        icon: "image",
        title: "Image Compressor",
        desc: "Hit an exact file size or convert photos — JPEG, PNG, WebP, HEIC.",
    },
    {
        to: "/pdf-tools",
        icon: "pdf",
        title: "Combine PDF",
        desc: "Combine, split and compress PDFs locally — files never leave your device.",
    },
    {
        to: "/exif-remover",
        icon: "map-pin",
        title: "EXIF / Location Remover",
        desc: "See and strip the GPS and camera metadata hidden in your photos.",
    },
];

useHead({
    script: [
        {
            type: "application/ld+json",
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                name: "Zain Rizvee",
                jobTitle: "Web developer",
                url: "https://www.textsharenow.com/author/zain-rizvee",
                image: "https://www.textsharenow.com/zain-rizvee.jpg",
                address: {
                    "@type": "PostalAddress",
                    addressLocality: "Skardu",
                    addressCountry: "PK",
                },
                worksFor: [
                    {
                        "@type": "Organization",
                        name: "TextShareNow",
                        url: "https://www.textsharenow.com",
                    },
                    {
                        "@type": "Organization",
                        name: "Organic Aprico",
                        url: "https://organicaprico.com",
                    },
                ],
                sameAs: [
                    "https://organicaprico.com",
                ],
                knowsAbout: ["Web development", "Laravel", "Nuxt", "Vue", "Cross-device file sharing", "E-commerce", "Himalayan shilajit"],
            }),
        },
    ],
});
</script>
