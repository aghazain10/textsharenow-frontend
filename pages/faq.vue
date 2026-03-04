<template>
  <div>
    <section class="faq-hero section">
      <div class="container">
        <span class="section-label">Knowledge Base</span>
        <h1 class="section-title animate-fade-up">
          Frequently Asked <span class="glow-text">Questions</span>
        </h1>
        <p class="section-subtitle animate-fade-up-1">
          Everything you need to know about sharing text between devices with TextShareNow.
        </p>
      </div>
    </section>

    <section class="section" aria-label="FAQ answers">
      <div class="container faq-container">
        <div
          v-for="(category, ci) in categories"
          :key="ci"
          class="faq-category"
        >
          <h2 class="category-title">{{ category.title }}</h2>

          <div class="faq-list">
            <div
              v-for="(item, i) in category.items"
              :key="i"
              class="faq-item"
            >
              <button
                class="faq-question"
                @click="toggle(`${ci}-${i}`)"
              >
                <span class="faq-q-text">{{ item.question }}</span>
                <span class="faq-icon">{{ openKey === `${ci}-${i}` ? '−' : '+' }}</span>
              </button>
              <div v-show="openKey === `${ci}-${i}`" class="faq-answer">
                <p>{{ item.answer }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="faq-cta glass-card">
          <h3>Still have a question?</h3>
          <p>The best way to understand TextShareNow is to try it — it takes under 10 seconds.</p>
          <NuxtLink to="/" class="btn-primary">
            <span>Try the Tool →</span>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
useSeo({
  title: 'FAQ — How to Share Text Between Devices',
  description:
    'Answers to common questions about TextShareNow — how to transfer text from phone to laptop, how codes work, privacy, security, and more.',
  pagePath: '/faq',
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
            name: 'How do I transfer text from my phone to my laptop?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Open TextShareNow on your phone, paste your text and tap Generate Code. Then open the same site on your laptop, go to Receive, enter the code, and your text appears instantly.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is TextShareNow free?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, TextShareNow is completely free with no sign-up required.',
            },
          },
        ],
      }),
    },
  ],
})

const openKey = ref('0-0')

function toggle(key) {
  openKey.value = openKey.value === key ? null : key
}

const categories = [
  {
    title: 'Getting Started',
    items: [
      {
        question: 'How do I transfer text from my phone to my laptop without a cable?',
        answer:
          'Open TextShareNow on your phone, paste your text into the Send tab, and tap Generate Code. A short 5-character code appears. On your laptop, open the site, go to Receive, type the code, and your text shows up instantly — no cable, no app, no sign-up.',
      },
      {
        question: 'Do I need to create an account?',
        answer:
          'No account required. There is no sign-up, no email, no password. You open the site and start using it immediately on any device.',
      },
      {
        question: 'Does it work from laptop to phone as well?',
        answer:
          'Yes. The tool works in both directions — phone to laptop, laptop to phone, tablet to desktop, or between any two devices with a browser. The short code is designed to be easy to type regardless of the direction.',
      },
      {
        question: 'Do both devices need to be on the same Wi-Fi network?',
        answer:
          'No. TextShareNow works across any internet connection. The sending device and receiving device can be on completely different networks — mobile data, home broadband, office Wi-Fi, or public hotspots.',
      },
    ],
  },
  {
    title: 'How Codes Work',
    items: [
      {
        question: 'What does a share code look like?',
        answer:
          'A share code is a 5-character string of uppercase letters and numbers, for example "Z7K4P". It is short enough to type quickly on any keyboard or phone keypad.',
      },
      {
        question: 'How long does a code last?',
        answer:
          'Each code is valid for a maximum of 10 minutes from the time it was generated. If no one retrieves the text within 10 minutes, the code and its content are permanently deleted from our servers.',
      },
      {
        question: 'Can the same code be used more than once?',
        answer:
          'No. Each code is single-use. Once the content is retrieved, the code is immediately invalidated and the text is deleted. This is by design to protect your privacy.',
      },
      {
        question: 'What happens if I type the wrong code?',
        answer:
          'You will see an error message saying the code was not found or has expired. Double-check that you typed it correctly — codes are uppercase letters and numbers only. If the code has expired, ask the sender to generate a new one.',
      },
    ],
  },
  {
    title: 'Privacy & Security',
    items: [
      {
        question: 'Is my text stored on your servers?',
        answer:
          'Only briefly and temporarily. Your text is stored only long enough to be retrieved — up to 10 minutes maximum, or deleted immediately upon first retrieval. We do not log, analyse, or retain the content of your messages.',
      },
      {
        question: 'Can someone else guess my code and read my text?',
        answer:
          'The odds are extremely low. Our 5-character alphanumeric codes have over 60 million possible combinations, and we apply rate limiting to prevent brute-force attempts. For sensitive content, we still recommend using end-to-end encrypted alternatives.',
      },
      {
        question: 'Do you collect personal data?',
        answer:
          'We do not collect any personally identifiable information. No name, email, phone number, or account details are required or stored. We may log basic anonymised server metrics (like request counts) for performance purposes only.',
      },
    ],
  },
  {
    title: 'Limitations',
    items: [
      {
        question: 'What is the maximum amount of text I can share?',
        answer:
          'You can share up to 5,000 characters per transfer. This covers most URLs, short notes, code snippets, and messages. For larger content, split it into multiple transfers.',
      },
      {
        question: 'Can I share files or images?',
        answer:
          'Currently TextShareNow supports plain text only — including links, notes, and code snippets. File and image sharing is not supported at this time.',
      },
      {
        question: 'Does it work without an internet connection?',
        answer:
          'No. Both devices need an active internet connection to communicate through our servers. It does not work offline or over local Bluetooth.',
      },
    ],
  },
]
</script>

<style scoped>
.faq-hero {
  padding-bottom: 40px;
}

.faq-container {
  max-width: 780px;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.faq-category {}

.category-title {
  font-family: var(--font-display);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-accent);
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
.faq-cta {
  padding: 40px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.faq-cta h3 {
  font-family: var(--font-display);
  font-size: 1rem;
  letter-spacing: 0.04em;
}

.faq-cta p {
  font-size: 0.88rem;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

/* Accordion */
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.28s ease;
  overflow: hidden;
}
.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
}
.accordion-enter-to,
.accordion-leave-from {
  opacity: 1;
  max-height: 400px;
}
</style>
