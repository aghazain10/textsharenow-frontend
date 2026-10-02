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
                        <li>Runs several e-commerce businesses and builds their storefronts and internal tools end to end.</li>
                        <li>Primary stack: Laravel on the backend, Nuxt and Vue on the frontend.</li>
                        <li>Creator and sole maintainer of TextShareNow — design, build, infrastructure, and content.</li>
                    </ul>

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
        "Zain Rizvee is a web developer based in Skardu, Pakistan, and the creator of TextShareNow. Read his guides on cross-device sharing, productivity, and privacy.",
    pagePath: "/author/zain-rizvee",
});

const articles = blogPosts.map((p) => ({ slug: p.slug, title: p.title, date: p.date }));

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
                worksFor: {
                    "@type": "Organization",
                    name: "TextShareNow",
                    url: "https://www.textsharenow.com",
                },
                knowsAbout: ["Web development", "Laravel", "Nuxt", "Vue", "Cross-device file sharing"],
            }),
        },
    ],
});
</script>
