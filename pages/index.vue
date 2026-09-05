<template>
    <div>
        <!-- ========================
         HERO
    ========================= -->
        <section class="hero section" aria-labelledby="hero-title">
            <!-- Ambient glow blobs -->
            <div class="glow-blob glow-blob--1" aria-hidden="true" />
            <div class="glow-blob glow-blob--2" aria-hidden="true" />

            <div class="container hero-inner">
                <!-- Left — Copy -->
                <div class="hero-copy">
                    <div class="hero-badge animate-fade-up">
                        <span class="status-dot" />
                        <span>No account · No app · Free forever</span>
                    </div>

                    <h1 id="hero-title" class="hero-title animate-fade-up-1">
                        Share Text Between<br />
                        <span class="glow-text">Any Devices</span><br />
                        In Seconds
                    </h1>

                    <p class="hero-subtitle animate-fade-up-2">
                        Stop emailing yourself. Paste your link or note, get a
                        short code, type it on your other device — done. Works
                        phone to laptop, laptop to phone, across any network.
                    </p>

                    <div class="hero-stats animate-fade-up-3">
                        <div class="stat">
                            <span class="stat-value glow-text"><UsageCounter /></span>
                            <span class="stat-label">texts shared using textsharenow</span>
                        </div>
                        <div class="stat-divider" />
                        <div class="stat">
                            <span class="stat-value glow-text">~8s</span>
                            <span class="stat-label">avg. transfer time</span>
                        </div>
                        <div class="stat-divider" />
                        <div class="stat">
                            <span class="stat-value glow-text">5 chars</span>
                            <span class="stat-label">short code</span>
                        </div>
                        <div class="stat-divider" />
                        <div class="stat">
                            <span class="stat-value glow-text">0</span>
                            <span class="stat-label">sign-ups needed</span>
                        </div>
                    </div>
                </div>

                <!-- Right — Tool Widget -->
                <div class="hero-tool animate-fade-up-3">
                    <div class="tool-card glass-card pulse-glow">
                        <!-- Tabs -->
                        <div
                            class="tab-bar"
                            role="tablist"
                            aria-label="Send or receive text"
                        >
                            <button
                                class="tab-btn"
                                :class="{ active: activeTab === 'send' }"
                                role="tab"
                                :aria-selected="activeTab === 'send'"
                                aria-controls="panel-send"
                                @click="activeTab = 'send'"
                            >
                                ↑ Send Text
                            </button>
                            <button
                                class="tab-btn"
                                :class="{ active: activeTab === 'receive' }"
                                role="tab"
                                :aria-selected="activeTab === 'receive'"
                                aria-controls="panel-receive"
                                @click="activeTab = 'receive'"
                            >
                                ↓ Receive Text
                            </button>
                        </div>

                        <!-- Tab Panels -->
                        <div class="tab-content">
                            <div
                                v-if="activeTab === 'send'"
                                id="panel-send"
                                role="tabpanel"
                            >
                                <SendText />
                            </div>
                            <div v-else id="panel-receive" role="tabpanel">
                                <ReceiveText :initial-code="scannedCode" />
                            </div>
                        </div>
                    </div>

                    <!-- Security notice -->
                    <div class="security-notice">
                        <span class="security-icon">🔒</span>
                        <span
                            >Text auto-deletes after first read or 10 min</span
                        >
                    </div>
                </div>
            </div>
        </section>

        <hr class="divider" />

        <!-- How It Works -->
        <HowItWorks />

        <hr class="divider" />

        <!-- About This Tool (prose) -->
        <AboutTool />

        <hr class="divider" />

        <!-- Features -->
        <FeaturesSection />

        <hr class="divider" />

        <!-- Use Cases (prose) -->
        <UseCases />

        <hr class="divider" />

        <!-- Blog Preview -->
        <BlogPreview />

        <hr class="divider" />

        <!-- FAQ -->
        <FaqSection />

        <!-- CTA Banner -->
        <section class="cta-section section">
            <div class="container">
                <div class="cta-card glass-card">
                    <div class="glow-blob cta-blob" aria-hidden="true" />
                    <h2 class="cta-title">
                        Ready to share?<br />
                        <span class="glow-text">Takes 8 seconds.</span>
                    </h2>
                    <p class="cta-desc">
                        Open on any device, paste, get code, done.
                    </p>
                    <button class="btn-primary" @click="scrollToTool">
                        <span>Use the Tool Now →</span>
                    </button>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
// SEO
useSeo({
    title: "Share Text Between Phone and Laptop Instantly",
    description:
        "Transfer text, links, and notes between any devices in seconds using a short code. No app, no sign-up, completely free. Works phone to laptop and back.",
    pagePath: "/",
});

// Structured data for Google
useHead({
    script: [
        {
            type: "application/ld+json",
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: "TextShareNow",
                url: "https://textsharenow.com",
                description:
                    "Instantly share text, links, and notes between any devices using a short code. No account needed.",
                applicationCategory: "UtilitiesApplication",
                operatingSystem: "Any",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            }),
        },
    ],
});

const activeTab = ref("send");

const route = useRoute();
const router = useRouter();

// Code captured from a scanned QR (`/?code=XXXXX`) — kept in a local ref
// so it survives the URL cleanup below.
const scannedCode = ref("");

onMounted(() => {
    const c = (route.query.code || "").toString();
    const code = c.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (code.length >= 4) {
        scannedCode.value = code;
        activeTab.value = "receive";
        // Clean the URL so a manual refresh doesn't re-run the flow.
        router.replace({ query: {} });
    }
});

const scrollToTool = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<style scoped>
/* ========================
   Hero
========================= */
.hero {
    padding-top: 80px;
    padding-bottom: 80px;
    overflow: hidden;
    position: relative;
}

.hero-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
}

@media (max-width: 900px) {
    .hero-inner {
        grid-template-columns: 1fr;
        gap: 48px;
    }
}

/* Glow blobs */
.glow-blob {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(80px);
    opacity: 0.12;
}

.glow-blob--1 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, #00d4ff, transparent);
    top: -100px;
    left: -100px;
}

.glow-blob--2 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, #7c3aed, transparent);
    bottom: -80px;
    right: 0;
}

/* Copy side */
.hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-mono);
    font-size: 0.68rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-secondary);
    background: rgba(0, 212, 255, 0.06);
    border: 1px solid var(--border-accent);
    padding: 6px 14px;
    border-radius: 100px;
    margin-bottom: 24px;
}

.hero-title {
    font-size: clamp(2rem, 4vw, 3.2rem);
    font-weight: 900;
    line-height: 1.15;
    margin-bottom: 20px;
    letter-spacing: 0.01em;
}

.hero-subtitle {
    font-size: 1rem;
    color: var(--text-secondary);
    line-height: 1.75;
    font-weight: 300;
    margin-bottom: 36px;
    max-width: 480px;
}

/* Stats */
.hero-stats {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
}

.stat {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.stat-value {
    font-family: var(--font-display);
    font-size: 1.3rem;
    font-weight: 700;
    letter-spacing: 0.05em;
}

.stat-label {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
}

.stat-divider {
    width: 1px;
    height: 32px;
    background: var(--border-accent);
}

/* Tool widget */
.hero-tool {
    position: relative;
}

.tool-card {
    padding: 28px;
}

.tab-content {
    margin-top: 24px;
}

/* Security notice */
.security-notice {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 12px;
    font-family: var(--font-mono);
    font-size: 0.65rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
}

/* Tab transition */
.tab-fade-enter-active,
.tab-fade-leave-active {
    transition: all 0.2s ease;
}
.tab-fade-enter-from {
    opacity: 0;
    transform: translateY(8px);
}
.tab-fade-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}

/* CTA */
.cta-section {
    padding-bottom: 100px;
}

.cta-card {
    padding: 60px;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.cta-blob {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, #00d4ff, transparent);
    top: -150px;
    left: 50%;
    transform: translateX(-50%);
    filter: blur(80px);
    opacity: 0.08;
}

.cta-title {
    font-size: clamp(1.6rem, 3vw, 2.4rem);
    margin-bottom: 16px;
    position: relative;
    z-index: 1;
}

.cta-desc {
    color: var(--text-secondary);
    margin-bottom: 32px;
    position: relative;
    z-index: 1;
}
</style>
