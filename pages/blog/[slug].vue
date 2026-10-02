<template>
    <div>
        <template v-if="post">
            <PageHero
                :title="post.title"
                :lead="post.excerpt"
                :meta="`${post.tag} · ${post.date} · ${post.readTime}`"
                :back="{ to: '/blog', label: 'Back to Blog' }"
            >
                <p class="mt-6 text-[14px] text-muted">
                    Written by
                    <NuxtLink to="/author/zain-rizvee" class="text-link">{{ post.author || "Zain Rizvee" }}</NuxtLink>
                    <template v-if="updatedLabel"> · {{ updatedLabel }}</template>
                </p>
            </PageHero>

            <section class="section">
                <div class="wrap grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16">
                    <!-- Main content -->
                    <article class="min-w-0">
                        <div class="max-w-[68ch] space-y-5 text-[16px] leading-7 text-muted">
                            <template v-for="(block, i) in post.content" :key="i">
                                <h2 v-if="block.type === 'h2'" class="!mt-12 text-[26px] font-semibold leading-tight tracking-[-0.03em] text-ink first:!mt-0">{{ block.text }}</h2>
                                <h3 v-else-if="block.type === 'h3'" class="!mt-8 text-[19px] font-semibold leading-snug tracking-[-0.02em] text-ink">{{ block.text }}</h3>
                                <p v-else-if="block.type === 'p'">{{ block.text }}</p>
                                <ul v-else-if="block.type === 'ul'" class="list-disc space-y-2 pl-5 marker:text-line">
                                    <li v-for="(item, j) in block.items" :key="j">{{ item }}</li>
                                </ul>
                                <ol v-else-if="block.type === 'ol'" class="list-decimal space-y-2 pl-5 marker:text-line">
                                    <li v-for="(item, j) in block.items" :key="j">{{ item }}</li>
                                </ol>
                                <figure v-else-if="block.type === 'image'" class="!mt-8">
                                    <img
                                        :src="block.src"
                                        :alt="block.alt"
                                        loading="lazy"
                                        decoding="async"
                                        class="w-full rounded-xl border border-line bg-surface shadow-card"
                                    />
                                    <figcaption v-if="block.caption" class="mt-3 text-[13px] leading-relaxed text-muted">{{ block.caption }}</figcaption>
                                </figure>
                                <div v-else-if="block.type === 'table'" class="!mt-8 overflow-x-auto rounded-xl border border-line bg-surface shadow-card">
                                    <table class="w-full min-w-[520px] border-collapse text-left text-[14px]">
                                        <caption v-if="block.caption" class="border-b border-line bg-surface-2/50 px-4 py-3 text-left text-[13px] text-muted">{{ block.caption }}</caption>
                                        <thead>
                                            <tr>
                                                <th v-for="(head, h) in block.head" :key="h" scope="col" class="bg-surface-2 px-4 py-3 text-[13px] font-medium text-muted">{{ head }}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(row, r) in block.rows" :key="r" class="border-t border-line">
                                                <th v-for="(cell, c) in row" :key="c" :scope="c === 0 ? 'row' : null" class="px-4 py-3 font-medium" :class="c === 0 ? 'text-ink' : 'text-muted'">{{ cell }}</th>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div v-else-if="block.type === 'code'" class="!mt-8 overflow-hidden rounded-xl border border-line bg-surface shadow-card">
                                    <div v-if="block.filename || block.lang" class="flex items-center justify-between gap-4 border-b border-line bg-surface-2 px-4 py-2">
                                        <span v-if="block.filename" class="font-mono text-[12px] text-muted">{{ block.filename }}</span>
                                        <span v-if="block.lang" class="text-[11px] font-medium uppercase tracking-wide text-muted">{{ block.lang }}</span>
                                    </div>
                                    <pre class="overflow-x-auto px-4 py-4 text-[13.5px] leading-6"><code class="font-mono">{{ block.code }}</code></pre>
                                </div>
                                <blockquote v-else-if="block.type === 'blockquote'" class="!mt-8 space-y-1 border-l-2 border-line pl-5">
                                    <p class="italic text-ink">{{ block.text }}</p>
                                    <cite v-if="block.cite" class="block text-[13px] not-italic text-muted">— {{ block.cite }}</cite>
                                </blockquote>
                                <div v-else-if="block.type === 'callout'" class="rounded-lg border border-line bg-surface-2/50 p-5 text-ink">
                                    <p>{{ block.text }}</p>
                                </div>
                                <div v-else-if="block.type === 'links'" class="rounded-lg border border-line p-5">
                                    <p class="text-[13px] font-medium text-muted">{{ block.label || "Related reading" }}</p>
                                    <ul class="mt-3 space-y-2">
                                        <li v-for="(link, k) in block.items" :key="k">
                                            <NuxtLink :to="link.to" class="text-link">{{ link.text }}</NuxtLink>
                                        </li>
                                    </ul>
                                </div>
                            </template>
                        </div>

                        <!-- CTA -->
                        <div class="tile mt-16 max-w-[68ch] text-center sm:p-10">
                            <h3 class="text-[22px] font-semibold tracking-[-0.03em]">Ready to try it?</h3>
                            <p class="mx-auto mt-2 max-w-[44ch] text-[16px] leading-7 text-muted">
                                Share text or files between your phone and laptop in under 10 seconds — no sign-up.
                            </p>
                            <NuxtLink to="/" class="btn-primary mt-6">Use TextShareNow</NuxtLink>
                        </div>
                    </article>

                    <!-- Sidebar -->
                    <aside class="grid gap-4 lg:sticky lg:top-24">
                        <div class="tile">
                            <h2 class="text-[17px] font-semibold tracking-[-0.02em]">Try the Tool</h2>
                            <p class="mt-2 text-[14px] leading-relaxed text-muted">Share text and files between any devices in seconds.</p>
                            <NuxtLink to="/" class="btn-primary mt-5 w-full">Open Tool</NuxtLink>
                        </div>

                        <div class="tile">
                            <h2 class="text-[17px] font-semibold tracking-[-0.02em]">More Articles</h2>
                            <ul class="mt-4 space-y-3">
                                <li v-for="related in relatedPosts" :key="related.slug">
                                    <NuxtLink :to="`/blog/${related.slug}`" class="text-[14px] leading-snug text-muted transition-colors hover:text-ink">{{ related.title }}</NuxtLink>
                                </li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </section>
        </template>

        <!-- 404 fallback -->
        <template v-else>
            <PageHero title="Post Not Found" lead="This article doesn't exist or has been moved.">
                <NuxtLink to="/blog" class="btn-primary mt-8">Back to Blog</NuxtLink>
            </PageHero>
        </template>
    </div>
</template>

<script setup>
import { blogPosts } from "~/data/blog-posts";

const route = useRoute();

// One file per post lives in ~/data/posts/ and is registered in ~/data/blog-posts.js.
const post = computed(
    () => blogPosts.find((p) => p.slug === route.params.slug) || null,
);

const postWordCount = (p) => {
    let n = 0;
    for (const block of p.content) {
        if (block.text) n += block.text.split(/\s+/).filter(Boolean).length;
        if (Array.isArray(block.items)) n += block.items.reduce((a, i) => a + String(i).split(/\s+/).filter(Boolean).length, 0);
        if (block.code) n += block.code.split(/\s+/).filter(Boolean).length;
    }
    return n;
};

const authorName = computed(() => post.value?.author || "Zain Rizvee");

const fmtMonth = (iso) =>
    new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

// "Updated …" only when the post was actually touched after publishing.
const updatedLabel = computed(() => {
    const p = post.value;
    if (!p?.dateModified || !p.datePublished || p.dateModified === p.datePublished) return "";
    return `Updated ${fmtMonth(p.dateModified)}`;
});

const relatedPosts = computed(() => {
    return blogPosts
        .filter((p) => p.slug !== route.params.slug)
        .slice(0, 3)
        .map((p) => ({ slug: p.slug, title: p.title }));
});

// SEO
watchEffect(() => {
    if (post.value) {
        useSeo({
            title: post.value.title,
            description: post.value.excerpt,
            pagePath: `/blog/${post.value.slug}`,
        });

        useHead({
            script: [
                {
                    type: "application/ld+json",
                    innerHTML: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        headline: post.value.title,
                        description: post.value.excerpt,
                        datePublished: post.value.datePublished || undefined,
                        dateModified: post.value.dateModified || post.value.datePublished || undefined,
                        wordCount: postWordCount(post.value),
                        author: {
                            "@type": "Person",
                            name: authorName.value,
                            url: "https://www.textsharenow.com/author/zain-rizvee",
                        },
                        mainEntityOfPage: {
                            "@type": "WebPage",
                            "@id": `https://www.textsharenow.com/blog/${post.value.slug}`,
                        },
                        publisher: {
                            "@type": "Organization",
                            name: "TextShareNow",
                            url: "https://www.textsharenow.com",
                        },
                    }),
                },
            ],
        });
    }
});
</script>
