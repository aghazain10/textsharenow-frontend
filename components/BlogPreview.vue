<template>
    <section class="section blog-preview" aria-labelledby="blog-preview-title">
        <div class="container">
            <div class="section-header">
                <span class="section-label">From the Blog</span>
                <h2 id="blog-preview-title" class="section-title">
                    Guides & <span class="glow-text">Tips</span>
                </h2>
                <p class="section-subtitle">
                    Practical reading on cross-device sharing, productivity, and
                    getting the most out of TextShareNow.
                </p>
            </div>

            <div class="preview-grid">
                <article
                    v-for="post in latestPosts"
                    :key="post.slug"
                    class="preview-card glass-card"
                >
                    <div class="preview-meta">
                        <span class="preview-tag">{{ post.tag }}</span>
                        <span class="preview-date mono">{{ post.date }}</span>
                    </div>
                    <h3 class="preview-title">
                        <NuxtLink
                            :to="`/blog/${post.slug}`"
                            class="preview-link"
                        >
                            {{ post.title }}
                        </NuxtLink>
                    </h3>
                    <p class="preview-excerpt">{{ post.excerpt }}</p>
                    <NuxtLink
                        :to="`/blog/${post.slug}`"
                        class="preview-read-more"
                    >
                        Read article →
                    </NuxtLink>
                </article>
            </div>

            <div class="preview-cta">
                <NuxtLink to="/blog" class="btn-secondary">
                    <span>View All Articles →</span>
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup>
import { blogPosts } from "~/data/blog-posts";

// Latest 3 posts, newest first (source array is oldest-first).
const latestPosts = [...blogPosts].reverse().slice(0, 3);
</script>

<style scoped>
.section-header {
    margin-bottom: 48px;
}

.preview-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 36px;
}

@media (max-width: 900px) {
    .preview-grid {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 600px) {
    .preview-grid {
        grid-template-columns: 1fr;
    }
}

.preview-card {
    padding: 26px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: transform 0.25s ease;
}

.preview-card:hover {
    transform: translateY(-3px);
}

.preview-meta {
    display: flex;
    align-items: center;
    gap: 12px;
}

.preview-tag {
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

.preview-date {
    font-size: 0.65rem;
    color: var(--text-muted);
    letter-spacing: 0.08em;
}

.preview-title {
    font-family: var(--font-display);
    font-size: 0.85rem;
    font-weight: 600;
    line-height: 1.45;
    letter-spacing: 0.02em;
}

.preview-link {
    color: var(--text-primary);
    text-decoration: none;
    transition: color 0.2s;
}
.preview-link:hover {
    color: var(--accent);
}

.preview-excerpt {
    font-size: 0.83rem;
    color: var(--text-secondary);
    line-height: 1.68;
    font-weight: 300;
    flex: 1;
}

.preview-read-more {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    letter-spacing: 0.08em;
    color: var(--accent);
    text-decoration: none;
    transition: opacity 0.2s;
}
.preview-read-more:hover {
    opacity: 0.7;
}

.preview-cta {
    display: flex;
    justify-content: center;
}

.mono {
    font-family: var(--font-mono);
}
</style>
