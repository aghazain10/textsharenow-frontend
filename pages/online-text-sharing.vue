<template>
  <div>
    <!-- ========================
         HERO
    ========================= -->
    <section class="hero section" aria-labelledby="hero-title">
      <div class="glow-blob glow-blob--1" aria-hidden="true" />
      <div class="glow-blob glow-blob--2" aria-hidden="true" />

      <div class="container hero-inner">
        <!-- Left — Copy -->
        <div class="hero-copy">
          <div class="hero-badge animate-fade-up">
            <span class="status-dot" aria-hidden="true" />
            <span>No account · No app · Free forever</span>
          </div>

          <h1 id="hero-title" class="hero-title animate-fade-up-1">
            Online Text Sharing —<br />
            Share Text Between<br />
            <span class="glow-text">Any Devices</span><br />
            In Seconds
          </h1>

          <p class="hero-subtitle animate-fade-up-2">
            TextShareNow is a fast, free tool for <strong>online text sharing</strong> between any two devices. Paste your text, get a 5-character code, type it on the other device — done. Works phone to laptop, laptop to phone, across any network.
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
            <div class="tab-bar" role="tablist" aria-label="Send or receive text">
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

            <div class="tab-content">
              <div v-if="activeTab === 'send'" id="panel-send" role="tabpanel">
                <SendText />
              </div>
              <div v-else id="panel-receive" role="tabpanel">
                <ReceiveText />
              </div>
            </div>
          </div>

          <div class="security-notice">
            <span class="security-icon">🔒</span>
            <span>Text auto-deletes after first read or 10 min</span>
          </div>
        </div>
      </div>
    </section>

    <hr class="divider" />

    <!-- ========================
         WHAT IS ONLINE TEXT SHARING
    ========================= -->
    <section class="section" aria-labelledby="what-is-title">
      <div class="container">
        <div class="section-header">
          <span class="section-label">Concept</span>
          <h2 id="what-is-title" class="section-title">
            What Is <span class="glow-text">Online Text Sharing</span>?
          </h2>
          <p class="section-subtitle">
            A browser-based way to move text, links, and notes between devices — no apps, no accounts, no cables.
          </p>
        </div>

        <div class="prose-content glass-card">
          <p>
            <strong>Online text sharing</strong> means using a web-based tool to transfer text from one device to another over the internet. Unlike AirDrop, Nearby Share, or Pushbullet — which require apps, OS compatibility, or both devices on the same network — an online tool works in any browser, on any operating system, across any connection.
          </p>
          <p>
            You open the site on both devices, paste your text on one, get a short code, type that code on the other, and the text appears. The entire round trip takes under 10 seconds. The content is encrypted in transit, stored temporarily (10 minutes max), and deleted immediately after retrieval.
          </p>
          <p>
            This approach solves the fundamental friction of cross-device text transfer: <strong>you don't need to install anything, sign in anywhere, or be on the same Wi-Fi.</strong> It just works.
          </p>
        </div>
      </div>
    </section>

    <hr class="divider" />

    <!-- ========================
         BROWSER VS APPS COMPARISON
    ========================= -->
    <section class="section" aria-labelledby="compare-title">
      <div class="container">
        <div class="section-header">
          <span class="section-label">Comparison</span>
          <h2 id="compare-title" class="section-title">
            Browser-Based vs. <span class="glow-text">App-Based</span> Sharing
          </h2>
          <p class="section-subtitle">
            Why <em>share text online</em> with a browser tool instead of installing an app?
          </p>
        </div>

        <div class="comparison glass-card">
          <table class="compare-table" aria-label="Browser vs app text sharing comparison">
            <thead>
              <tr>
                <th scope="col">Factor</th>
                <th scope="col" class="highlight-col">TextShareNow (Browser)</th>
                <th scope="col">AirDrop / Nearby Share</th>
                <th scope="col">Pushbullet / Join / KDE Connect</th>
                <th scope="col">Email / Self-Message</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="feature-name">Install required</td>
                <td class="highlight-col"><span class="check">✓ No</span></td>
                <td><span class="cross">✗ Yes (OS-level)</span></td>
                <td><span class="cross">✗ Yes (app + account)</span></td>
                <td><span class="check">✓ No</span></td>
              </tr>
              <tr>
                <td class="feature-name">Account / sign-in</td>
                <td class="highlight-col"><span class="check">✓ None</span></td>
                <td><span class="cross">✗ Apple/Google ID</span></td>
                <td><span class="cross">✗ Required</span></td>
                <td><span class="check">✓ None</span></td>
              </tr>
              <tr>
                <td class="feature-name">Cross-platform (iOS↔Android↔Windows)</td>
                <td class="highlight-col"><span class="check">✓ Universal</span></td>
                <td><span class="cross">✗ Ecosystem-locked</span></td>
                <td><span class="check">✓ Mostly</span></td>
                <td><span class="check">✓ Universal</span></td>
              </tr>
              <tr>
                <td class="feature-name">Same network required</td>
                <td class="highlight-col"><span class="check">✓ No</span></td>
                <td><span class="cross">✗ Yes (local)</span></td>
                <td><span class="check">✓ No</span></td>
                <td><span class="check">✓ No</span></td>
              </tr>
              <tr>
                <td class="feature-name">Transfer speed (text)</td>
                <td class="highlight-col"><span class="check">~8 seconds</span></td>
                <td><span class="neutral">~5-15s</span></td>
                <td><span class="neutral">~10-30s</span></td>
                <td><span class="cross">30-60s</span></td>
              </tr>
              <tr>
                <td class="feature-name">Auto-delete after retrieval</td>
                <td class="highlight-col"><span class="check">✓ Yes</span></td>
                <td><span class="cross">✗ No</span></td>
                <td><span class="cross">✗ No</span></td>
                <td><span class="cross">✗ No</span></td>
              </tr>
              <tr>
                <td class="feature-name">Works on locked-down work devices</td>
                <td class="highlight-col"><span class="check">✓ Yes (browser only)</span></td>
                <td><span class="cross">✗ No</span></td>
                <td><span class="cross">✗ No (install blocked)</span></td>
                <td><span class="check">✓ Yes</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="prose-content glass-card" style="margin-top: 24px;">
          <p>
            The key insight: <strong>apps solve sync; browsers solve transfer.</strong> If you want ongoing clipboard sync across your own daily-driver devices, an app like Pushbullet or KDE Connect makes sense. But for the 90% of transfers that are one-off — a link to a colleague, a note to your laptop, a Wi-Fi password to a guest — a browser-based <em>online text sharing</em> tool is faster, cleaner, and leaves no trace.
          </p>
        </div>
      </div>
    </section>

    <hr class="divider" />

    <!-- ========================
         HOW IT WORKS
    ========================= -->
    <section id="how-it-works" class="section" aria-labelledby="hiw-title">
      <div class="container">
        <div class="section-header">
          <span class="section-label">Process</span>
          <h2 id="hiw-title" class="section-title">
            How <span class="glow-text">Online Text Sharing</span> Works
          </h2>
          <p class="section-subtitle">
            From copy to paste in under 10 seconds — no accounts, no apps, no friction.
          </p>
        </div>

        <div class="steps-grid">
          <div class="step-card glass-card">
            <div class="step-number mono">01</div>
            <div class="step-icon">📋</div>
            <h3 class="step-title">Paste Your Text</h3>
            <p class="step-desc">On your sending device, open TextShareNow and paste your link, note, or any text into the Send tab.</p>
          </div>
          <div class="step-card glass-card">
            <div class="step-number mono">02</div>
            <div class="step-icon">⚡</div>
            <h3 class="step-title">Get a Short Code</h3>
            <p class="step-desc">Hit send — our system instantly generates a unique 5-character code tied to your content.</p>
          </div>
          <div class="step-card glass-card">
            <div class="step-number mono">03</div>
            <div class="step-icon">⌨️</div>
            <h3 class="step-title">Type the Code</h3>
            <p class="step-desc">On your other device, open the same site, go to Receive, and type in the short code.</p>
          </div>
          <div class="step-card glass-card">
            <div class="step-number mono">04</div>
            <div class="step-icon">✅</div>
            <h3 class="step-title">Text Appears Instantly</h3>
            <p class="step-desc">Your content shows up immediately — auto-copied to your clipboard and ready to use.</p>
          </div>
        </div>

        <div class="demo-callout glass-card">
          <div class="demo-example">
            <div class="demo-device">
              <span class="demo-device-label mono">📱 Phone</span>
              <div class="demo-action">Paste → Send → Get code <span class="demo-code">Z7K4P</span></div>
            </div>
            <div class="demo-arrow" aria-hidden="true">→</div>
            <div class="demo-device">
              <span class="demo-device-label mono">💻 Laptop</span>
              <div class="demo-action">Enter <span class="demo-code">Z7K4P</span> → Text appears</div>
            </div>
          </div>
          <p class="demo-time">Average transfer time: <strong class="glow-text">under 8 seconds</strong></p>
        </div>
      </div>
    </section>

    <hr class="divider" />

    <!-- ========================
         USE CASES
    ========================= -->
    <section class="section" aria-labelledby="use-cases-title">
      <div class="container">
        <div class="section-header">
          <span class="section-label">Use Cases</span>
          <h2 id="use-cases-title" class="section-title">
            When <span class="glow-text">Online Text Sharing</span> Wins
          </h2>
          <p class="section-subtitle">
            Real situations where a browser-based tool beats every other option.
          </p>
        </div>

        <div class="use-cases-grid">
          <article class="use-case-card glass-card">
            <span class="use-case-icon">💻</span>
            <h3 class="use-case-title">Developers Moving Code Snippets</h3>
            <p class="use-case-desc">Found a fix on your phone during a commute? Paste the snippet, get a code, and pull it up on your laptop the moment you sit down — no Slack message to yourself, no half-typed gist.</p>
          </article>
          <article class="use-case-card glass-card">
            <span class="use-case-icon">🎓</span>
            <h3 class="use-case-title">Students Sharing Notes & Links</h3>
            <p class="use-case-desc">Copy a research link or a paragraph from a PDF on a library computer, then read it properly later on your phone on the way home, without emailing a locked-down university account.</p>
          </article>
          <article class="use-case-card glass-card">
            <span class="use-case-icon">💼</span>
            <h3 class="use-case-title">Professionals Bridging Work & Personal Devices</h3>
            <p class="use-case-desc">Move a meeting note or a URL from a work laptop to a personal phone (or back) without touching corporate email or a messaging app that syncs your entire chat history across both.</p>
          </article>
          <article class="use-case-card glass-card">
            <span class="use-case-icon">🛠️</span>
            <h3 class="use-case-title">Anyone Setting Up a New Device</h3>
            <p class="use-case-desc">Setting up a new phone or laptop often means retyping Wi-Fi passwords, license keys, and account details from your old device. A short code makes that a few seconds of copy-paste instead.</p>
          </article>
          <article class="use-case-card glass-card">
            <span class="use-case-icon">🔗</span>
            <h3 class="use-case-title">Sharing Long URLs Without Breaking Them</h3>
            <p class="use-case-desc">Modern URLs with tracking params break in SMS, chat apps, or when printed. Paste the full URL here — it transfers character-for-character, no truncation, no preview mangling.</p>
          </article>
          <article class="use-case-card glass-card">
            <span class="use-case-icon">🔐</span>
            <h3 class="use-case-title">Private Text That Doesn't Live in Chat History</h3>
            <p class="use-case-desc">Every self-message sits in a chat log forever. TextShareNow deletes content after one read — nothing stays behind to search, back up, or leak.</p>
          </article>
        </div>
      </div>
    </section>

    <hr class="divider" />

    <!-- ========================
         FAQ
    ========================= -->
    <section class="section" aria-labelledby="faq-title" itemscope itemtype="https://schema.org/FAQPage">
      <div class="container">
        <div class="section-header">
          <span class="section-label">FAQ</span>
          <h2 id="faq-title" class="section-title">
            Common <span class="glow-text">Questions</span>
          </h2>
          <p class="section-subtitle">
            Everything you need to know about <em>online text sharing</em> with TextShareNow.
          </p>
        </div>

        <div class="faq-list">
          <div v-for="(item, i) in faqs" :key="i" class="faq-item" itemprop="mainEntity" itemscope itemtype="https://schema.org/Question">
            <button class="faq-question" @click="toggle(i)">
              <span class="faq-q-text" itemprop="name">{{ item.question }}</span>
              <span class="faq-icon">{{ openIndex === i ? '−' : '+' }}</span>
            </button>
            <div v-show="openIndex === i" class="faq-answer" itemprop="acceptedAnswer" itemscope itemtype="https://schema.org/Answer">
              <p itemprop="text">{{ item.answer }}</p>
            </div>
          </div>
        </div>

        <div class="faq-cta">
          <NuxtLink to="/faq" class="btn-secondary">
            <span>View All FAQs →</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <hr class="divider" />

    <!-- ========================
         CTA
    ========================= -->
    <section class="cta-section section">
      <div class="container">
        <div class="cta-card glass-card">
          <div class="glow-blob cta-blob" aria-hidden="true" />
          <h2 class="cta-title">
            Ready to try <span class="glow-text">online text sharing</span>?
          </h2>
          <p class="cta-desc">
            Open on any device, paste, get code, done. Free, private, no sign-up.
          </p>
          <NuxtLink to="/" class="btn-primary">
            <span>Use the Tool Now →</span>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useSeo, useHead } from '#imports'

// SEO
useSeo({
  title: 'Online Text Sharing — Share Text Between Devices Instantly (Free, No App)',
  description: 'Free online text sharing tool to transfer text, links, and notes between any devices in seconds using a short code. No app, no sign-up, works cross-platform. Try now.',
  pagePath: '/online-text-sharing',
})

// WebPage + FAQPage structured data
const faqs = [
  {
    question: 'What is online text sharing and how does it differ from AirDrop?',
    answer: 'Online text sharing uses a browser-based tool to transfer text between any devices over the internet — no apps, no OS restrictions, no same-network requirement. AirDrop only works between Apple devices on the same local network.',
  },
  {
    question: 'Is TextShareNow free for online text sharing?',
    answer: 'Yes. TextShareNow is completely free for everyday use. No subscription, no credits, no hidden fees. The service is supported by a small number of non-intrusive ads.',
  },
  {
    question: 'Can I share text online between iPhone and Windows?',
    answer: 'Yes. That is exactly what TextShareNow is built for. Open the site on your iPhone, paste the text, get a code, type the code on your Windows PC — the text appears instantly. No iCloud, no Apple ID, no companion app needed.',
  },
  {
    question: 'Does the text get stored on your servers?',
    answer: 'Only temporarily — maximum 10 minutes, and deleted immediately after the first successful retrieval. We do not log, sell, or retain any content after deletion.',
  },
  {
    question: 'Is there a limit on how much text I can share online?',
    answer: 'Up to 5,000 characters per transfer — enough for long URLs, code snippets, notes, and short messages.',
  },
  {
    question: 'Do I need to create an account to use online text sharing?',
    answer: 'No. There are no accounts, no sign-ups, and no email addresses required. The tool works the moment you open it in any browser.',
  },
]

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Online Text Sharing — Share Text Between Devices Instantly',
        description: 'Free online text sharing tool to transfer text, links, and notes between any devices in seconds using a short code. No app, no sign-up, works cross-platform.',
        url: 'https://www.textsharenow.com/online-text-sharing',
        publisher: {
          '@type': 'Organization',
          name: 'TextShareNow',
          url: 'https://www.textsharenow.com',
        },
        mainEntity: {
          '@type': 'FAQPage',
          mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        },
      }),
    },
  ],
})

const openIndex = ref(0)
function toggle(i) {
  openIndex.value = openIndex.value === i ? -1 : i
}
const activeTab = ref('send')
</script>

<style scoped>
/* Reuse hero styles from index.vue */
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
  .hero-inner { grid-template-columns: 1fr; gap: 48px; }
}
.glow-blob {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(80px);
  opacity: 0.12;
}
.glow-blob--1 { width: 500px; height: 500px; background: radial-gradient(circle, #00d4ff, transparent); top: -100px; left: -100px; }
.glow-blob--2 { width: 400px; height: 400px; background: radial-gradient(circle, #7c3aed, transparent); bottom: -80px; right: 0; }

.hero-badge { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-secondary); background: rgba(0, 212, 255, 0.06); border: 1px solid var(--border-accent); padding: 6px 14px; border-radius: 100px; margin-bottom: 24px; }
.hero-title { font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 900; line-height: 1.15; margin-bottom: 20px; letter-spacing: 0.01em; }
.hero-subtitle { font-size: 1rem; color: var(--text-secondary); line-height: 1.75; font-weight: 300; margin-bottom: 36px; max-width: 480px; }
.hero-stats { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
.stat { display: flex; flex-direction: column; gap: 4px; }
.stat-value { font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; letter-spacing: 0.05em; }
.stat-label { font-family: var(--font-mono); font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); }
.stat-divider { width: 1px; height: 32px; background: var(--border-accent); }

.hero-tool { position: relative; }
.tool-card { padding: 28px; }
.tab-content { margin-top: 24px; }
.security-notice { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 12px; font-family: var(--font-mono); font-size: 0.65rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); }

/* Section helpers */
.section { padding: 80px 0; position: relative; z-index: 1; }
.section-header { margin-bottom: 48px; }
.section-label { font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); display: inline-flex; align-items: center; gap: 8px; margin-bottom: 16px; }
.section-label::before { content: ""; width: 20px; height: 1px; background: var(--accent); }
.section-title { font-size: clamp(1.6rem, 3vw, 2.4rem); margin-bottom: 16px; }
.section-subtitle { font-size: 1rem; color: var(--text-secondary); font-weight: 300; max-width: 540px; line-height: 1.7; }

.prose-content { padding: 32px 40px; max-width: 800px; }
.prose-content p { font-size: 0.95rem; color: var(--text-secondary); line-height: 1.85; font-weight: 300; margin-bottom: 16px; }
.prose-content p:last-child { margin-bottom: 0; }
.prose-content strong { color: var(--text-primary); font-weight: 600; }
.prose-content em { color: var(--accent); font-style: italic; }

/* Comparison table */
.comparison { padding: 36px; }
.compare-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
.compare-table th { font-family: var(--font-mono); font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted); padding: 8px 16px; text-align: center; border-bottom: 1px solid var(--border); }
.compare-table th:first-child { text-align: left; }
.compare-table td { padding: 12px 16px; text-align: center; border-bottom: 1px solid var(--border); color: var(--text-secondary); }
.feature-name { text-align: left !important; color: var(--text-primary); font-weight: 500; }
.highlight-col { background: rgba(0, 212, 255, 0.04); border-left: 1px solid var(--border-accent); border-right: 1px solid var(--border-accent); font-weight: 600; }
.compare-table th.highlight-col { color: var(--accent); }
.check { color: var(--accent-green); font-weight: 700; }
.cross { color: #ff4d6d; }
.neutral { color: var(--text-muted); }

/* Steps */
.steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; position: relative; }
@media (max-width: 900px) { .steps-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 520px) { .steps-grid { grid-template-columns: 1fr; } }
.step-card { padding: 28px 22px; position: relative; animation: fadeInUp 0.6s ease both; }
.step-number { font-size: 0.65rem; letter-spacing: 0.15em; color: var(--accent); margin-bottom: 14px; }
.step-icon { font-size: 1.8rem; margin-bottom: 14px; display: block; }
.step-title { font-family: var(--font-display); font-size: 0.8rem; font-weight: 600; letter-spacing: 0.06em; margin-bottom: 10px; color: var(--text-primary); }
.step-desc { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.65; font-weight: 300; }

.demo-callout { padding: 28px 32px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px; }
.demo-example { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
.demo-device { display: flex; flex-direction: column; gap: 8px; }
.demo-device-label { font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted); }
.demo-action { font-size: 0.85rem; color: var(--text-secondary); }
.demo-code { font-family: var(--font-mono); font-size: 0.85rem; color: var(--accent-green); font-weight: 600; }
.demo-arrow { font-size: 1.4rem; color: var(--accent); text-shadow: 0 0 10px rgba(0, 212, 255, 0.5); }
.demo-time { font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); letter-spacing: 0.05em; }

/* Use cases */
.use-cases-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
@media (max-width: 700px) { .use-cases-grid { grid-template-columns: 1fr; } }
.use-case-card { padding: 30px 26px; }
.use-case-icon { font-size: 1.6rem; display: block; margin-bottom: 14px; }
.use-case-title { font-family: var(--font-display); font-size: 0.85rem; font-weight: 600; letter-spacing: 0.04em; margin-bottom: 12px; color: var(--text-primary); }
.use-case-desc { font-size: 0.88rem; color: var(--text-secondary); line-height: 1.75; font-weight: 300; }

/* FAQ */
.faq-list { display: flex; flex-direction: column; gap: 8px; }
.faq-item { border-bottom: 1px solid var(--border); }
.faq-question { width: 100%; background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 20px 0; text-align: left; }
.faq-q-text { font-size: 0.95rem; font-weight: 500; color: var(--text-primary); line-height: 1.5; }
.faq-icon { font-family: var(--font-mono); font-size: 1.2rem; color: var(--accent); flex-shrink: 0; width: 20px; text-align: center; }
.faq-answer { padding-bottom: 20px; }
.faq-answer p { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.75; font-weight: 300; }
.faq-cta { display: flex; justify-content: center; margin-top: 24px; }

/* CTA */
.cta-section { padding-bottom: 100px; }
.cta-card { padding: 60px; text-align: center; position: relative; overflow: hidden; }
.cta-blob { width: 400px; height: 400px; background: radial-gradient(circle, #00d4ff, transparent); top: -150px; left: 50%; transform: translateX(-50%); filter: blur(80px); opacity: 0.08; }
.cta-title { font-size: clamp(1.6rem, 3vw, 2.4rem); margin-bottom: 16px; position: relative; z-index: 1; }
.cta-desc { color: var(--text-secondary); margin-bottom: 32px; position: relative; z-index: 1; }

.divider { height: 1px; background: linear-gradient(90deg, transparent, var(--border-accent), transparent); margin: 0; border: none; }
.mono { font-family: var(--font-mono); }
</style>