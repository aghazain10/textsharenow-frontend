<template>
  <div>
    <section class="about-hero section">
      <div class="container">
        <span class="section-label">About</span>
        <h1 class="section-title animate-fade-up">
          Built for the <span class="glow-text">Frictionless</span> Transfer
        </h1>
        <p class="section-subtitle animate-fade-up-1">
          TextShareNow was created to solve a single, frustrating problem — why is it so hard
          to move a piece of text from your phone to your laptop?
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container about-content">
        <article class="about-body glass-card">
          <h2 class="about-section-heading">The Problem We Solved</h2>
          <p>
            Every day, millions of people email themselves URLs. They message their own WhatsApp.
            They screenshot notes, then retype them. The workflow is absurd — and yet it persists,
            because no simple, universal tool existed to bridge the gap between devices.
          </p>
          <p>
            QR codes work well from laptop to phone (easy to scan), but the reverse is awkward —
            your laptop doesn't have a camera pointed at a screen. Long shareable links require
            you to type a full URL, which defeats the purpose. Apps require accounts.
          </p>
          <p>
            TextShareNow is the answer: a short, typeable code that works in both directions,
            across any network, on any device, with zero setup.
          </p>

          <hr class="content-divider" />

          <h2 class="about-section-heading">How It Works (Technically)</h2>
          <p>
            When you submit text, it is stored in an encrypted temporary key-value store with a
            time-to-live (TTL) of 10 minutes. A unique 5-character alphanumeric code is generated
            and tied to your content as the key. The code space gives over 60 million combinations,
            and our rate-limiting prevents brute-force enumeration.
          </p>
          <p>
            When the receiving device submits the code, the content is retrieved and the entry is
            immediately deleted — a single-read guarantee. The entire round trip takes under 500ms
            on a typical connection.
          </p>

          <hr class="content-divider" />

          <h2 class="about-section-heading">Our Principles</h2>
          <div class="principles-grid">
            <div v-for="p in principles" :key="p.title" class="principle">
              <span class="principle-icon">{{ p.icon }}</span>
              <h3>{{ p.title }}</h3>
              <p>{{ p.desc }}</p>
            </div>
          </div>
        </article>

        <!-- Sidebar stats -->
        <aside class="about-sidebar">
          <div class="sidebar-card glass-card">
            <h3 class="sidebar-title">By the Numbers</h3>
            <div class="sidebar-stats">
              <div v-for="stat in sidebarStats" :key="stat.label" class="sidebar-stat">
                <span class="sidebar-stat-value glow-text">{{ stat.value }}</span>
                <span class="sidebar-stat-label">{{ stat.label }}</span>
              </div>
            </div>
          </div>

          <div class="sidebar-card glass-card">
            <h3 class="sidebar-title">Ready to try it?</h3>
            <p class="sidebar-desc">No sign-up. No app. Just open and share.</p>
            <NuxtLink to="/" class="btn-primary sidebar-btn">
              <span>Use the Tool →</span>
            </NuxtLink>
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>

<script setup>
useSeo({
  title: 'About — Why We Built TextShareNow',
  description:
    'Learn why TextShareNow was built — to solve the frustrating problem of transferring text between phone and laptop without cables, apps, or accounts.',
  pagePath: '/about',
})

const principles = [
  { icon: '⚡', title: 'Speed First', desc: 'Every design decision prioritises getting your text from device A to device B as fast as possible.' },
  { icon: '🔒', title: 'Privacy by Default', desc: 'We delete your content immediately after retrieval. There is no archive, no history, no logging of what you share.' },
  { icon: '🎯', title: 'One Thing, Done Well', desc: 'We are not building a platform. We solve one problem: quick text sharing between devices.' },
  { icon: '🌍', title: 'Universal Access', desc: 'Works on any device with a browser. No OS restrictions, no app installs, no carrier dependencies.' },
]

const sidebarStats = [
  { value: '~8s', label: 'Average transfer time' },
  { value: '5', label: 'Characters in every code' },
  { value: '10 min', label: 'Maximum data retention' },
  { value: '0', label: 'Accounts needed' },
  { value: '5,000', label: 'Max characters per transfer' },
]
</script>

<style scoped>
.about-hero { padding-bottom: 40px; }

.about-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 32px;
  align-items: start;
}

@media (max-width: 900px) {
  .about-content { grid-template-columns: 1fr; }
}

/* Body */
.about-body {
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.about-section-heading {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--accent);
  text-transform: uppercase;
  margin-top: 8px;
}

.about-body p {
  font-size: 0.92rem;
  color: var(--text-secondary);
  line-height: 1.8;
  font-weight: 300;
}

.content-divider {
  border: none;
  border-top: 1px solid var(--border);
  margin: 8px 0;
}

/* Principles */
.principles-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 8px;
}

@media (max-width: 600px) {
  .principles-grid { grid-template-columns: 1fr; }
}

.principle {
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.principle-icon {
  font-size: 1.4rem;
  display: block;
  margin-bottom: 10px;
}

.principle h3 {
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.principle p {
  font-size: 0.82rem !important;
  color: var(--text-muted) !important;
}

/* Sidebar */
.about-sidebar {
  position: sticky;
  top: 90px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sidebar-card {
  padding: 28px 24px;
}

.sidebar-title {
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.sidebar-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sidebar-stat {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.sidebar-stat-value {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 700;
}

.sidebar-stat-label {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.sidebar-desc {
  font-size: 0.84rem;
  color: var(--text-secondary);
  margin-bottom: 16px;
  line-height: 1.6;
}

.sidebar-btn {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
