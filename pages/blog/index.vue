<template>
    <div>
        <PageHero
            meta="Blog"
            title="Guides & Tips"
            lead="Practical guides on sharing text between devices, productivity shortcuts, and getting the most out of TextShareNow."
        />

        <section class="section">
            <div class="wrap">
                <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <article v-for="post in posts" :key="post.slug">
                        <NuxtLink :to="`/blog/${post.slug}`" class="group tile flex h-full flex-col transition-colors hover:border-muted">
                            <p class="text-[13px] font-medium text-muted">{{ post.tag }} · {{ post.readTime.replace(" read", "") }}</p>
                            <h2 class="mt-1 text-[19px] font-semibold leading-snug tracking-[-0.025em] group-hover:underline group-hover:underline-offset-4">{{ post.title }}</h2>
                            <p class="mt-2 text-[15px] leading-relaxed text-muted">{{ post.excerpt }}</p>
                            <span class="mt-auto inline-block pt-4 text-[14px] font-medium text-ink underline decoration-line underline-offset-4">Read article</span>
                        </NuxtLink>
                    </article>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { blogPosts } from "~/data/blog-posts";

useSeo({
    title: "Blog — Device Sharing Tips & Guides",
    description:
        "Guides and tips for sharing text between phone and laptop, cross-device productivity, and making device transfers faster.",
    pagePath: "/blog",
});

// Sorted newest-first; falls back to source order if dates are equal.
// All post data lives in ~/data/blog-posts.js — add new posts there only.
const posts = [...blogPosts].reverse();
</script>
