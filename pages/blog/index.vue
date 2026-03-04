<template>
  <div>
    <section class="section blog-hero">
      <div class="container">
        <span class="section-label">Blog</span>
        <h1 class="section-title animate-fade-up">
          Guides & <span class="glow-text">Tips</span>
        </h1>
        <p class="section-subtitle animate-fade-up-1">
          Practical guides on sharing text between devices, productivity shortcuts,
          and getting the most out of TextShareNow.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="blog-grid">
          <article
            v-for="post in posts"
            :key="post.slug"
            class="post-card glass-card"
          >
            <div class="post-meta">
              <span class="post-tag">{{ post.tag }}</span>
              <span class="post-date mono">{{ post.date }}</span>
            </div>
            <h2 class="post-title">
              <NuxtLink :to="`/blog/${post.slug}`" class="post-link">
                {{ post.title }}
              </NuxtLink>
            </h2>
            <p class="post-excerpt">{{ post.excerpt }}</p>
            <NuxtLink :to="`/blog/${post.slug}`" class="read-more">
              Read article →
            </NuxtLink>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
useSeo({
  title: 'Blog — Device Sharing Tips & Guides',
  description:
    'Guides and tips for sharing text between phone and laptop, cross-device productivity, and making device transfers faster.',
  pagePath: '/blog',
})

// In a real project, fetch these from your Laravel API or a headless CMS.
// They are hardcoded here as a starting point.
const posts = [
  {
    slug: 'how-to-share-text-from-phone-to-laptop',
    title: 'The Fastest Way to Share Text From Your Phone to Your Laptop (No Cables)',
    excerpt:
      'Tired of emailing yourself URLs? Here are the five best methods for getting text off your phone and onto your laptop quickly — with a clear winner.',
    tag: 'Guide',
    date: 'Jan 2025',
  },
  {
    slug: 'why-you-should-stop-emailing-yourself',
    title: 'Why You Should Stop Emailing Yourself (And What to Use Instead)',
    excerpt:
      'Self-emailing is a productivity anti-pattern that wastes 30–60 seconds per transfer. Here is what professional users do instead.',
    tag: 'Productivity',
    date: 'Jan 2025',
  },
  {
    slug: 'airdrop-alternative-cross-platform',
    title: 'The Best AirDrop Alternatives That Work Across Windows, Android, and iPhone',
    excerpt:
      'AirDrop is great — if you are in the Apple ecosystem. For everyone else, here are the real cross-platform alternatives.',
    tag: 'Guide',
    date: 'Jan 2025',
  },
  {
    slug: 'qr-codes-vs-short-codes-device-sharing',
    title: 'QR Codes vs Short Codes: Which Is Better for Phone-to-Laptop Sharing?',
    excerpt:
      'QR codes are everywhere — but they have a significant flaw when sharing from phone to laptop. Here is why short codes often win.',
    tag: 'Comparison',
    date: 'Jan 2025',
  },
]
</script>

<style scoped>
.blog-hero { padding-bottom: 40px; }

.blog-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

@media (max-width: 680px) {
  .blog-grid { grid-template-columns: 1fr; }
}

.post-card {
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: transform 0.25s ease;
}

.post-card:hover {
  transform: translateY(-3px);
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 12px;
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

.post-date {
  font-size: 0.65rem;
  color: var(--text-muted);
  letter-spacing: 0.08em;
}

.post-title {
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.45;
  letter-spacing: 0.02em;
}

.post-link {
  color: var(--text-primary);
  text-decoration: none;
  transition: color 0.2s;
}
.post-link:hover { color: var(--accent); }

.post-excerpt {
  font-size: 0.86rem;
  color: var(--text-secondary);
  line-height: 1.7;
  font-weight: 300;
  flex: 1;
}

.read-more {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  color: var(--accent);
  text-decoration: none;
  transition: opacity 0.2s;
}
.read-more:hover { opacity: 0.7; }

.mono { font-family: var(--font-mono); }
</style>
