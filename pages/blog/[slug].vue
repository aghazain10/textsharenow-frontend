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
                    <NuxtLink to="/about" class="text-link">{{ post.author || "Zain Rizvee" }}</NuxtLink>
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

// All post data lives in ~/data/blog-posts.js — add new posts there only.
const post = computed(
    () => blogPosts.find((p) => p.slug === route.params.slug) || null,
);

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
                        datePublished: post.value.date,
                        publisher: {
                            "@type": "Organization",
                            name: "TextShareNow",
                            url: "https://textsharenow.com",
                        },
                    }),
                },
            ],
        });
    }
});
</script>
