<template>
    <div>
        <PageHero
            meta="Blog"
            title="Guides & Tips"
            lead="Practical guides on sharing text between devices, productivity shortcuts, and getting the most out of TextShareNow."
        />

        <section class="section">
            <div class="wrap">
                <div class="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                    <article v-for="(post, i) in posts" :key="post.slug">
                        <NuxtLink :to="`/blog/${post.slug}`" class="group block">
                            <div :class="COVERS[i % 3]" class="aspect-[16/10] max-w-full rounded-xl transition-opacity group-hover:opacity-90" />
                            <p class="mt-4 text-[13px] font-medium text-muted">{{ post.tag }} · {{ post.readTime.replace(" read", "") }}</p>
                            <h2 class="mt-1 text-[19px] font-semibold leading-snug tracking-[-0.025em] group-hover:underline group-hover:underline-offset-4">{{ post.title }}</h2>
                            <p class="mt-2 text-[15px] leading-relaxed text-muted">{{ post.excerpt }}</p>
                            <span class="mt-4 inline-block text-[14px] font-medium text-ink underline decoration-line underline-offset-4">Read article</span>
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
const COVERS = ["cover-a", "cover-b", "cover-c"];
</script>
