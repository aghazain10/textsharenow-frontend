<template>
    <div>
        <!-- Hero + Tool -->
        <section class="section">
            <div class="container">
                <div class="hero-copy">
                    <span class="section-label">File Sharing</span>
                    <h1 class="section-title animate-fade-up">
                        Share Files Online —<br />
                        <span class="glow-text">Free, No App, No Sign-Up</span>
                    </h1>
                    <p class="section-subtitle animate-fade-up-1">
                        Send photos, videos, and documents between any devices
                        using a short code. No account, no cloud storage, no
                        file sitting on someone else's server. Files auto-delete
                        after the first download.
                    </p>
                </div>

                <!-- Tool -->
                <div class="tool-wrap animate-fade-up-2">
                    <div
                        class="tab-bar tab-bar-main"
                        role="tablist"
                        aria-label="Share files"
                    >
                        <button
                            class="tab-btn active"
                            role="tab"
                            aria-selected="true"
                        >
                            Share Files
                        </button>
                    </div>

                    <div class="tool-card glass-card pulse-glow">
                        <div class="tab-bar tab-bar-sub">
                            <button
                                class="tab-btn tab-btn-sub"
                                :class="{ active: subTab === 'send' }"
                                @click="subTab = 'send'"
                            >
                                ↑ Send File
                            </button>
                            <button
                                class="tab-btn tab-btn-sub"
                                :class="{ active: subTab === 'receive' }"
                                @click="subTab = 'receive'"
                            >
                                ↓ Receive File
                            </button>
                        </div>
                        <div class="sub-tab-content">
                            <LazySendFile v-if="subTab === 'send'" />
                            <LazyReceiveFile v-else />
                        </div>
                    </div>

                    <div class="security-notice">
                        <span class="security-icon">🔒</span>
                        <span>Files auto-delete after first download or 15 min · Scanned for malware</span>
                    </div>
                </div>
            </div>
        </section>

        <hr class="divider" />

        <!-- How It Works -->
        <section class="section">
            <div class="container steps-container">
                <span class="section-label">How It Works</span>
                <h2 class="steps-heading">Share a File in 3 Steps</h2>

                <div class="steps-grid">
                    <div v-for="step in steps" :key="step.num" class="step-card glass-card">
                        <span class="step-num glow-text">{{ step.num }}</span>
                        <h3 class="step-title">{{ step.title }}</h3>
                        <p class="step-desc">{{ step.desc }}</p>
                    </div>
                </div>
            </div>
        </section>

        <hr class="divider" />

        <!-- Why This Beats Alternatives -->
        <section class="section">
            <div class="container compare-container">
                <span class="section-label">Why TextShareNow</span>
                <h2 class="compare-heading">
                    File Sharing That <span class="glow-text">Respects Your Privacy</span>
                </h2>

                <div class="compare-grid">
                    <div v-for="item in advantages" :key="item.title" class="compare-card glass-card">
                        <span class="compare-icon">{{ item.icon }}</span>
                        <h3>{{ item.title }}</h3>
                        <p>{{ item.desc }}</p>
                    </div>
                </div>
            </div>
        </section>

        <hr class="divider" />

        <!-- Supported Formats -->
        <section class="section">
            <div class="container formats-container">
                <span class="section-label">Supported Formats</span>
                <h2 class="formats-heading">What You Can Share</h2>

                <div class="formats-grid">
                    <div v-for="fmt in formats" :key="fmt.type" class="format-card glass-card">
                        <span class="format-icon">{{ fmt.icon }}</span>
                        <span class="format-type">{{ fmt.type }}</span>
                        <span class="format-ext">{{ fmt.ext }}</span>
                    </div>
                </div>

                <p class="formats-note">Maximum file size: 10 MB per file. All files are scanned for malware before becoming available.</p>
            </div>
        </section>

        <hr class="divider" />

        <!-- FAQ -->
        <section class="section" aria-label="File sharing FAQ">
            <div class="container faq-container">
                <span class="section-label">FAQ</span>
                <h2 class="faq-heading">Frequently Asked Questions</h2>

                <div class="faq-list">
                    <div v-for="(item, i) in faqs" :key="i" class="faq-item">
                        <button class="faq-question" @click="toggle(i)">
                            <span class="faq-q-text">{{ item.q }}</span>
                            <span class="faq-icon">{{ openIndex === i ? '−' : '+' }}</span>
                        </button>
                        <div v-show="openIndex === i" class="faq-answer">
                            <p>{{ item.a }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA -->
        <section class="cta-section section">
            <div class="container">
                <div class="cta-card glass-card">
                    <div class="glow-blob cta-blob" aria-hidden="true" />
                    <h2 class="cta-title">
                        Ready to share a file?<br />
                        <span class="glow-text">Takes 10 seconds.</span>
                    </h2>
                    <p class="cta-desc">
                        No sign-up. No app. Just upload, get a code, done.
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
import { ref } from 'vue'
import { defineAsyncComponent } from 'vue'

useSeo({
    title: 'Share Files Online — Free File Sharing Between Devices',
    description:
        'Share files between any devices instantly using a short code. Free, no sign-up. Upload photos, videos, or documents — recipient downloads with a code. Files auto-delete after first download. Malware scanned.',
    pagePath: '/share-files-online',
})

// FAQ Schema for Google rich results
useHead({
    script: [
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: [
                    {
                        '@type': 'Question',
                        name: 'How do I share a file between my phone and laptop?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Open TextShareNow, click Share Files, select Send File, and upload your file. You get a 5-character code. On the other device, switch to Share Files, click Receive File, enter the code, and the file downloads.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'Is file sharing free?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Yes. TextShareNow file sharing is completely free with no sign-up, no account, and no size limits beyond 10 MB per file.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'Are uploaded files scanned for viruses?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Yes. Every uploaded file is scanned with ClamAV antivirus before becoming available for download. Infected files are immediately rejected and deleted.',
                        },
                    },
                ],
            }),
        },
    ],
})

const LazySendFile = defineAsyncComponent(() => import('~/components/SendFile.vue'))
const LazyReceiveFile = defineAsyncComponent(() => import('~/components/ReceiveFile.vue'))

const subTab = ref('send')
const openIndex = ref(0)

function toggle(i) {
    openIndex.value = openIndex.value === i ? null : i
}

function scrollToTool() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

const steps = [
    {
        num: '01',
        title: 'Upload your file',
        desc: 'Drag and drop or click to browse. Supported: PNG, JPEG, WebP, MP4, WebM. Max 10 MB.',
    },
    {
        num: '02',
        title: 'Get a short code',
        desc: 'A unique 5-character code is generated instantly. Valid for 15 minutes.',
    },
    {
        num: '03',
        title: 'Download on the other device',
        desc: 'Open the site on the receiving device, enter the code, and the file downloads. Done.',
    },
]

const advantages = [
    {
        icon: '⚡',
        title: 'No Upload to Cloud',
        desc: 'Files are stored temporarily on our server, not in someone\'s cloud drive. No account needed, no shared links floating around.',
    },
    {
        icon: '🔒',
        title: 'Auto-Delete After Download',
        desc: 'Each file is single-use. After the first download or 15 minutes, it\'s permanently deleted. No archives, no backups.',
    },
    {
        icon: '🛡',
        title: 'Malware Scanned',
        desc: 'Every file is scanned with ClamAV before it becomes available. Infected files are rejected immediately.',
    },
    {
        icon: '📱',
        title: 'Works on Any Device',
        desc: 'Phone to laptop, laptop to phone, Android to iPhone — any combination. Just a browser, no app needed.',
    },
]

const formats = [
    { icon: '🖼', type: 'PNG', ext: '.png' },
    { icon: '📷', type: 'JPEG', ext: '.jpg' },
    { icon: '🌐', type: 'WebP', ext: '.webp' },
    { icon: '🎬', type: 'MP4', ext: '.mp4' },
    { icon: '🎥', type: 'WebM', ext: '.webm' },
]

const faqs = [
    {
        q: 'How do I share a file between my phone and laptop?',
        a: 'Open TextShareNow, click "Share Files", select "Send File", and upload your file. You get a 5-character code. On the other device, switch to "Share Files", click "Receive File", enter the code, and the file downloads.',
    },
    {
        q: 'What file types are supported?',
        a: 'We support PNG, JPEG, WebP, MP4, and WebM. Images are re-encoded from raw pixels for security. SVG files are explicitly rejected.',
    },
    {
        q: 'What is the maximum file size?',
        a: 'Files can be up to 10 MB. If your file is larger, try compressing it before sharing.',
    },
    {
        q: 'How long does a file stay on the server?',
        a: 'Files are available for 15 minutes or until the first download — whichever comes first. After that, the file and its metadata are permanently deleted.',
    },
    {
        q: 'Are files scanned for malware?',
        a: 'Yes. Every uploaded file is scanned with ClamAV antivirus before becoming available for download. Files that fail the scan are immediately rejected and deleted.',
    },
    {
        q: 'Can I download the same file more than once?',
        a: 'No. File codes are single-use. After the first successful download, the file and its code are permanently deleted. Ask the sender to generate a new code if you need the file again.',
    },
    {
        q: 'Is this really free?',
        a: 'Yes. No account, no subscription, no hidden fees. The site may show a small number of ads to cover server costs.',
    },
]
</script>

<style scoped>
.hero-copy {
    text-align: center;
    margin-bottom: 40px;
}

.tool-wrap {
    max-width: 600px;
    margin: 0 auto;
}

.tab-bar-main {
    margin-bottom: 16px;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
}

.tab-bar-sub {
    margin-top: 16px;
    background: rgba(0, 0, 0, 0.15);
}

.tab-btn-sub {
    font-size: 0.65rem;
    padding: 8px 16px;
}

.sub-tab-content {
    margin-top: 16px;
}

.tool-card {
    padding: 28px;
}

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

/* Steps */
.steps-container {
    max-width: 900px;
}

.steps-heading {
    font-size: clamp(1.4rem, 3vw, 2rem);
    margin-bottom: 36px;
}

.steps-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

@media (max-width: 700px) {
    .steps-grid { grid-template-columns: 1fr; }
}

.step-card {
    padding: 28px;
    text-align: center;
}

.step-num {
    font-family: var(--font-display);
    font-size: 2rem;
    font-weight: 700;
    display: block;
    margin-bottom: 12px;
}

.step-title {
    font-family: var(--font-display);
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 10px;
}

.step-desc {
    font-size: 0.85rem;
    color: var(--text-secondary);
    line-height: 1.7;
    font-weight: 300;
}

/* Compare */
.compare-container {
    max-width: 900px;
}

.compare-heading {
    font-size: clamp(1.4rem, 3vw, 2rem);
    margin-bottom: 36px;
}

.compare-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

@media (max-width: 700px) {
    .compare-grid { grid-template-columns: 1fr; }
}

.compare-card {
    padding: 28px;
}

.compare-icon {
    font-size: 1.6rem;
    display: block;
    margin-bottom: 12px;
}

.compare-card h3 {
    font-family: var(--font-display);
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 10px;
}

.compare-card p {
    font-size: 0.85rem;
    color: var(--text-secondary);
    line-height: 1.7;
    font-weight: 300;
}

/* Formats */
.formats-container {
    max-width: 700px;
    text-align: center;
}

.formats-heading {
    font-size: clamp(1.4rem, 3vw, 2rem);
    margin-bottom: 36px;
}

.formats-grid {
    display: flex;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 20px;
}

.format-card {
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    min-width: 100px;
}

.format-icon { font-size: 1.6rem; }

.format-type {
    font-family: var(--font-display);
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}

.format-ext {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: var(--text-muted);
}

.formats-note {
    font-size: 0.82rem;
    color: var(--text-muted);
    margin-top: 8px;
}

/* FAQ */
.faq-container {
    max-width: 700px;
}

.faq-heading {
    font-size: clamp(1.4rem, 3vw, 2rem);
    margin-bottom: 32px;
}

.faq-list {
    display: flex;
    flex-direction: column;
}

.faq-item {
    border-bottom: 1px solid var(--border);
}

.faq-question {
    width: 100%;
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 18px 0;
    text-align: left;
}

.faq-q-text {
    font-size: 0.92rem;
    font-weight: 500;
    color: var(--text-primary);
    line-height: 1.5;
}

.faq-icon {
    font-family: var(--font-mono);
    font-size: 1.2rem;
    color: var(--accent);
    flex-shrink: 0;
    width: 20px;
    text-align: center;
}

.faq-answer {
    padding-bottom: 18px;
}

.faq-answer p {
    font-size: 0.88rem;
    color: var(--text-secondary);
    line-height: 1.75;
    font-weight: 300;
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
