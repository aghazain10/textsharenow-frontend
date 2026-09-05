<template>
  <section id="how-it-works" class="section" aria-labelledby="hiw-title">
    <div class="container">
      <div class="section-header">
        <span class="section-label">Process</span>
        <h2 id="hiw-title" class="section-title">
          How It <span class="glow-text">Works</span>
        </h2>
        <p class="section-subtitle">
          From copy to paste in under 10 seconds — no accounts, no apps, no friction.
        </p>
      </div>

      <div class="steps-grid">
        <div
          v-for="(step, i) in steps"
          :key="step.id"
          class="step-card glass-card"
          :style="{ animationDelay: `${i * 0.1}s` }"
        >
          <div class="step-number mono">{{ String(step.id).padStart(2, '0') }}</div>
          <div class="step-icon">{{ step.icon }}</div>
          <h3 class="step-title">{{ step.title }}</h3>
          <p class="step-desc">{{ step.description }}</p>
          <div v-if="i < steps.length - 1" class="step-connector" aria-hidden="true" />
        </div>
      </div>

      <!-- Demo callout -->
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
</template>

<script setup>
const steps = [
  {
    id: 1,
    icon: '📋',
    title: 'Paste Your Text',
    description: 'On your sending device, open TextShareNow and paste your link, note, or any text into the Send tab.',
  },
  {
    id: 2,
    icon: '⚡',
    title: 'Get a Short Code',
    description: 'Hit send — our system instantly generates a unique 5-character code tied to your content.',
  },
  {
    id: 3,
    icon: '⌨️',
    title: 'Receive It',
    description: 'On your other device, scan the QR code with your phone camera — or open the site and type the short code.',
  },
  {
    id: 4,
    icon: '✅',
    title: 'Text Appears Instantly',
    description: 'Your content shows up immediately — auto-copied to your clipboard and ready to use.',
  },
]
</script>

<style scoped>
.section-header {
  margin-bottom: 48px;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
  position: relative;
}

@media (max-width: 900px) {
  .steps-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 520px) {
  .steps-grid { grid-template-columns: 1fr; }
}

.step-card {
  padding: 28px 22px;
  position: relative;
  animation: fadeInUp 0.6s ease both;
}

.step-number {
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  color: var(--accent);
  margin-bottom: 14px;
}

.step-icon {
  font-size: 1.8rem;
  margin-bottom: 14px;
  display: block;
}

.step-title {
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  margin-bottom: 10px;
  color: var(--text-primary);
}

.step-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.65;
  font-weight: 300;
}

/* Demo callout */
.demo-callout {
  padding: 28px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
}

.demo-example {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.demo-device {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.demo-device-label {
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.demo-action {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.demo-code {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--accent-green);
  font-weight: 600;
}

.demo-arrow {
  font-size: 1.4rem;
  color: var(--accent);
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
}

.demo-time {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.mono {
  font-family: var(--font-mono);
}
</style>
