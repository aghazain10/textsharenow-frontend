<template>
    <section id="blog" class="section" aria-labelledby="blog-preview-title">
        <div class="wrap">
            <div class="flex flex-wrap items-end justify-between gap-6">
                <div class="max-w-2xl">
                    <p class="text-[13px] font-medium text-muted">From the Blog</p>
                    <h2 id="blog-preview-title" class="section-title mt-3">Guides &amp; Tips</h2>
                    <p class="section-lead">Practical reading on cross-device sharing, productivity, and getting the most out of TextShareNow.</p>
                </div>
                <NuxtLink to="/blog" class="btn-ghost">View All Articles</NuxtLink>
            </div>
            <div class="mt-12 grid gap-5 md:grid-cols-3">
                <article v-for="post in latestPosts" :key="post.slug" class="group tile relative flex flex-col transition-colors hover:border-muted">
                    <p class="text-[13px] font-medium text-muted">{{ post.tag }} · {{ post.date }}</p>
                    <h3 class="mt-1 text-[19px] font-semibold leading-snug tracking-[-0.025em]">
                        <NuxtLink :to="`/blog/${post.slug}`" class="after:absolute after:inset-0 group-hover:underline group-hover:underline-offset-4">{{ post.title }}</NuxtLink>
                    </h3>
                    <p class="mt-2 text-[15px] leading-relaxed text-muted">{{ post.excerpt }}</p>
                    <span class="mt-auto pt-4 text-[14px] font-medium text-ink underline decoration-line underline-offset-4 group-hover:decoration-ink">Read article</span>
                </article>
            </div>
        </div>
    </section>
</template>

<script setup>
import { blogPosts } from "~/data/blog-posts";

// Latest 3 posts, newest first (source array is oldest-first)
const latestPosts = [...blogPosts].reverse().slice(0, 3);
</script>
