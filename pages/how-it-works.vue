<template>
  <div>
    <section class="section">
      <div class="container">
        <span class="section-label">Documentation</span>
        <h1 class="section-title animate-fade-up">
          How <span class="glow-text">TextShareNow</span> Works
        </h1>
        <p class="section-subtitle animate-fade-up-1">
          A complete guide to sharing text between any devices in seconds —
          from phone to laptop, laptop to phone, or any combination.
        </p>
      </div>
    </section>

    <!-- Embeds the shared how-it-works component -->
    <HowItWorks />

    <!-- Extended written guide (for SEO) -->
    <section class="section">
      <div class="container guide-container">
        <div class="guide-body glass-card">
          <h2 class="guide-heading">Step-by-Step: Phone to Laptop</h2>
          <ol class="guide-steps">
            <li v-for="step in phoneToLaptopSteps" :key="step.title">
              <strong>{{ step.title }}</strong> — {{ step.detail }}
            </li>
          </ol>

          <hr class="guide-divider" />

          <h2 class="guide-heading">Step-by-Step: Laptop to Phone</h2>
          <ol class="guide-steps">
            <li v-for="step in laptopToPhoneSteps" :key="step.title">
              <strong>{{ step.title }}</strong> — {{ step.detail }}
            </li>
          </ol>

          <hr class="guide-divider" />

          <h2 class="guide-heading">Online Text Sharing: The Browser-Based Alternative</h2>
          <p class="guide-p">
            Looking for a deeper dive on <strong>online text sharing</strong> — why browser-based tools
            beat apps for cross-platform transfers, comparison tables, and more use cases?
            <NuxtLink to="/online-text-sharing" class="guide-link">
              Read our dedicated online text sharing guide →
            </NuxtLink>
          </p>

        </div>
      </div>
    </section>

    <hr class="divider" />
    <FaqSection />
  </div>
</template>

<script setup>
useSeo({
  title: 'How It Works — Share Text Between Devices',
  description:
    'A complete guide to how TextShareNow transfers text between your phone and laptop using short codes. Step-by-step instructions and technical details.',
  pagePath: '/how-it-works',
})

const phoneToLaptopSteps = [
  { title: 'Open TextShareNow on your phone', detail: 'No app needed — just open textsharenow.com in any mobile browser.' },
  { title: 'Go to the Send tab', detail: 'Tap the "Send Text" tab at the top of the tool.' },
  { title: 'Paste or type your content', detail: 'Paste the link, note, or text you want to transfer. Up to 5,000 characters.' },
  { title: 'Tap Generate Code', detail: 'A unique 5-character code appears (e.g. Z7K4P) — it is valid for 10 minutes.' },
  { title: 'Open the site on your laptop', detail: 'Go to textsharenow.com in your laptop browser.' },
  { title: 'Go to the Receive tab and enter the code', detail: 'Type the 5-character code and click Retrieve. Your text appears instantly.' },
]

const laptopToPhoneSteps = [
  { title: 'Open TextShareNow on your laptop', detail: 'Open textsharenow.com in your desktop browser.' },
  { title: 'Paste your content in the Send tab', detail: 'Paste the text or link you want on your phone.' },
  { title: 'Click Generate Code', detail: 'A 5-character code is created, valid for 10 minutes.' },
  { title: 'Open TextShareNow on your phone', detail: 'Open textsharenow.com in your mobile browser.' },
  { title: 'Go to Receive and type the code', detail: 'Enter the code — the text appears and is automatically copied to your clipboard.' },
]
</script>

<style scoped>
.guide-container {
  max-width: 760px;
}

.guide-body {
  padding: 44px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (max-width: 640px) {
  .guide-body { padding: 28px 20px; }
}

.guide-heading {
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--accent);
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-accent);
}

.guide-steps {
  list-style: none;
  counter-reset: steps;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.guide-steps li {
  counter-increment: steps;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.7;
  font-weight: 300;
  padding-left: 36px;
  position: relative;
}

.guide-steps li::before {
  content: counter(steps, decimal-leading-zero);
  position: absolute;
  left: 0;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--accent);
  font-weight: 600;
  top: 3px;
}

.guide-steps li strong {
  color: var(--text-primary);
  font-weight: 600;
}

.guide-divider {
  border: none;
  border-top: 1px solid var(--border);
}

.guide-p {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.82;
  font-weight: 300;
}

.guide-link {
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;
}
.guide-link:hover {
  opacity: 0.75;
}
</style>
