<template>
    <div>
        <template v-if="post">
            <article class="section">
                <div class="container blog-layout">
                    <!-- Main content -->
                    <div class="blog-main">
                        <!-- Back link -->
                        <NuxtLink to="/blog" class="back-link"
                            >← Back to Blog</NuxtLink
                        >

                        <!-- Header -->
                        <header class="post-header">
                            <div class="post-meta">
                                <span class="post-tag">{{ post.tag }}</span>
                                <span class="post-date mono">{{
                                    post.date
                                }}</span>
                                <span class="post-read mono">{{
                                    post.readTime
                                }}</span>
                            </div>
                            <h1 class="post-title">{{ post.title }}</h1>
                            <p class="post-byline">
                                Written by
                                <NuxtLink to="/about" class="byline-link">{{
                                    post.author || "Zain Rizvee"
                                }}</NuxtLink>
                            </p>
                            <p class="post-lead">{{ post.excerpt }}</p>
                        </header>

                        <!-- Content -->
                        <div class="post-body">
                            <div
                                v-for="(block, i) in post.content"
                                :key="i"
                                class="content-block"
                            >
                                <h2
                                    v-if="block.type === 'h2'"
                                    class="content-h2"
                                >
                                    {{ block.text }}
                                </h2>
                                <h3
                                    v-else-if="block.type === 'h3'"
                                    class="content-h3"
                                >
                                    {{ block.text }}
                                </h3>
                                <p
                                    v-else-if="block.type === 'p'"
                                    class="content-p"
                                >
                                    {{ block.text }}
                                </p>
                                <ul
                                    v-else-if="block.type === 'ul'"
                                    class="content-ul"
                                >
                                    <li
                                        v-for="(item, j) in block.items"
                                        :key="j"
                                    >
                                        {{ item }}
                                    </li>
                                </ul>
                                <div
                                    v-else-if="block.type === 'callout'"
                                    class="content-callout"
                                >
                                    <span class="callout-icon">{{
                                        block.icon
                                    }}</span>
                                    <p>{{ block.text }}</p>
                                </div>
                                <div
                                    v-else-if="block.type === 'links'"
                                    class="content-links"
                                >
                                    <span class="content-links-label">{{
                                        block.label || "Related reading"
                                    }}</span>
                                    <NuxtLink
                                        v-for="(link, k) in block.items"
                                        :key="k"
                                        :to="link.to"
                                        class="content-link"
                                        >{{ link.text }} →</NuxtLink
                                    >
                                </div>
                            </div>
                        </div>

                        <!-- CTA -->
                        <div class="post-cta glass-card">
                            <h3>Ready to try it?</h3>
                            <p>
                                Share text between your phone and laptop in
                                under 10 seconds — no sign-up.
                            </p>
                            <NuxtLink to="/" class="btn-primary">
                                <span>Use TextShareNow →</span>
                            </NuxtLink>
                        </div>
                    </div>

                    <!-- Sidebar -->
                    <aside class="blog-sidebar">
                        <div class="sidebar-widget glass-card">
                            <h4 class="widget-title">Try the Tool</h4>
                            <p class="widget-desc">
                                Share text between any devices in seconds.
                            </p>
                            <NuxtLink to="/" class="btn-primary sidebar-btn">
                                <span>Open Tool →</span>
                            </NuxtLink>
                        </div>

                        <div class="sidebar-widget glass-card">
                            <h4 class="widget-title">More Articles</h4>
                            <div class="related-list">
                                <NuxtLink
                                    v-for="related in relatedPosts"
                                    :key="related.slug"
                                    :to="`/blog/${related.slug}`"
                                    class="related-link"
                                >
                                    {{ related.title }}
                                </NuxtLink>
                            </div>
                        </div>
                    </aside>
                </div>
            </article>
        </template>

        <!-- 404 fallback -->
        <template v-else>
            <section class="section">
                <div class="container">
                    <h1 class="section-title">Post Not Found</h1>
                    <NuxtLink to="/blog" class="btn-primary"
                        ><span>← Back to Blog</span></NuxtLink
                    >
                </div>
            </section>
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

<style scoped>
.blog-layout {
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: 48px;
    align-items: start;
}

@media (max-width: 900px) {
    .blog-layout {
        grid-template-columns: 1fr;
    }
}

.back-link {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    text-decoration: none;
    display: inline-block;
    margin-bottom: 28px;
    transition: color 0.2s;
}
.back-link:hover {
    color: var(--accent);
}

/* Header */
.post-header {
    margin-bottom: 40px;
}

.post-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    flex-wrap: wrap;
}

.post-tag {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--accent);
    background: var(--accent-dim);
    border: 1px solid var(--accent-border);
    padding: 3px 10px;
    border-radius: 100px;
}

.post-date,
.post-read {
    font-size: 0.65rem;
    color: var(--text-muted);
    letter-spacing: 0.08em;
}

.post-title {
    font-size: clamp(1.4rem, 3vw, 2rem);
    margin-bottom: 12px;
    line-height: 1.3;
}

.post-byline {
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-bottom: 18px;
}

.byline-link {
    color: var(--accent);
    text-decoration: none;
}
.byline-link:hover {
    opacity: 0.75;
}

.post-lead {
    font-size: 1.05rem;
    color: var(--text-secondary);
    line-height: 1.75;
    font-weight: 300;
    border-left: 2px solid var(--accent);
    padding-left: 20px;
}

/* Body */
.post-body {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 48px;
}

.content-h2 {
    font-family: var(--font-display);
    font-size: 0.88rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: var(--accent);
    text-transform: uppercase;
    margin-top: 12px;
}

.content-h3 {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-primary);
}

.content-p {
    font-size: 0.92rem;
    color: var(--text-secondary);
    line-height: 1.82;
    font-weight: 300;
}

.content-ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.content-ul li {
    font-size: 0.9rem;
    color: var(--text-secondary);
    line-height: 1.7;
    font-weight: 300;
    padding-left: 18px;
    position: relative;
}

.content-ul li::before {
    content: "›";
    position: absolute;
    left: 0;
    color: var(--accent);
    font-family: var(--font-mono);
}

.content-callout {
    display: flex;
    gap: 14px;
    padding: 18px 20px;
    background: var(--accent-dim);
    border: 1px solid var(--accent-border);
    border-radius: var(--radius);
    align-items: flex-start;
}

.callout-icon {
    font-size: 1.2rem;
    flex-shrink: 0;
    margin-top: 2px;
}

.content-callout p {
    font-size: 0.88rem;
    color: var(--text-primary);
    line-height: 1.7;
}

.content-links {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 18px 20px;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
}

.content-links-label {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 4px;
}

.content-link {
    font-size: 0.86rem;
    color: var(--accent);
    text-decoration: none;
    line-height: 1.6;
}
.content-link:hover {
    opacity: 0.75;
}

/* Post CTA */
.post-cta {
    padding: 32px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
}

.post-cta h3 {
    font-family: var(--font-display);
    font-size: 0.9rem;
    letter-spacing: 0.04em;
}

.post-cta p {
    font-size: 0.87rem;
    color: var(--text-secondary);
}

/* Sidebar */
.blog-sidebar {
    position: sticky;
    top: 90px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.sidebar-widget {
    padding: 24px;
}

.widget-title {
    font-family: var(--font-display);
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-secondary);
    margin-bottom: 12px;
}

.widget-desc {
    font-size: 0.82rem;
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 14px;
}

.sidebar-btn {
    width: 100%;
    display: flex;
    justify-content: center;
}

.related-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.related-link {
    font-size: 0.8rem;
    color: var(--text-secondary);
    text-decoration: none;
    line-height: 1.5;
    transition: color 0.2s;
    padding-left: 12px;
    position: relative;
}
.related-link::before {
    content: "›";
    position: absolute;
    left: 0;
    color: var(--accent);
    font-family: var(--font-mono);
}
.related-link:hover {
    color: var(--accent);
}

.mono {
    font-family: var(--font-mono);
}
</style>
