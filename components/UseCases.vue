<template>
    <section class="section use-cases" aria-labelledby="use-cases-title">
        <div class="container">
            <div class="section-header">
                <span class="section-label">Who It's For</span>
                <h2 id="use-cases-title" class="section-title">
                    Built for <span class="glow-text">Everyday Moments</span>
                </h2>
                <p class="section-subtitle">
                    A few real situations where a short code beats every other
                    option.
                </p>
            </div>

            <div class="use-cases-grid">
                <article
                    v-for="uc in useCases"
                    :key="uc.title"
                    class="use-case-card glass-card"
                >
                    <span class="use-case-icon">{{ uc.icon }}</span>
                    <h3 class="use-case-title">{{ uc.title }}</h3>
                    <p class="use-case-desc">{{ uc.description }}</p>
                </article>
            </div>
        </div>
    </section>
</template>

<script setup>
const useCases = [
    {
        icon: "💻",
        title: "Developers Moving Code Snippets",
        description:
            "Found a fix on your phone during a commute? Paste the snippet, get a code, and pull it up on your laptop the moment you sit down — no Slack message to yourself, no half-typed gist.",
    },
    {
        icon: "🎓",
        title: "Students Sharing Notes and Links",
        description:
            "Copy a research link or a paragraph from a PDF on a library computer, then read it properly later on your phone on the way home, without emailing a locked-down university account.",
    },
    {
        icon: "💼",
        title: "Professionals Bridging Work and Personal Devices",
        description:
            "Move a meeting note or a URL from a work laptop to a personal phone (or back) without touching corporate email or a messaging app that syncs your entire chat history across both.",
    },
    {
        icon: "🛠️",
        title: "Anyone Setting Up a New Device",
        description:
            "Setting up a new phone or laptop often means retyping Wi-Fi passwords, license keys, and account details from your old device. A short code makes that a few seconds of copy-paste instead.",
    },
];
</script>

<style scoped>
.section-header {
    margin-bottom: 48px;
}

.use-cases-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
}

@media (max-width: 700px) {
    .use-cases-grid {
        grid-template-columns: 1fr;
    }
}

.use-case-card {
    padding: 30px 26px;
}

.use-case-icon {
    font-size: 1.6rem;
    display: block;
    margin-bottom: 14px;
}

.use-case-title {
    font-family: var(--font-display);
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    margin-bottom: 12px;
    color: var(--text-primary);
}

.use-case-desc {
    font-size: 0.88rem;
    color: var(--text-secondary);
    line-height: 1.75;
    font-weight: 300;
}
</style>
