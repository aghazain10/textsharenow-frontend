<template>
  <section class="section" aria-labelledby="faq-title">
    <div class="container">
      <div class="faq-layout">

        <!-- Left header -->
        <div class="faq-header">
          <span class="section-label">FAQ</span>
          <h2 id="faq-title" class="section-title">
            Common <span class="glow-text">Questions</span>
          </h2>
          <p class="section-subtitle">
            Everything you need to know about sharing text between devices.
          </p>
          <NuxtLink to="/faq" class="view-all-link">View all FAQs →</NuxtLink>
        </div>

        <!-- Right accordion -->
        <div class="faq-list">
          <div v-for="(item, i) in faqs" :key="i" class="faq-item">

            <button class="faq-question" @click="toggle(i)">
              <span class="faq-q-text">{{ item.question }}</span>
              <span class="faq-icon">{{ openIndex === i ? '−' : '+' }}</span>
            </button>

            <div v-show="openIndex === i" class="faq-answer">
              <p>{{ item.answer }}</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
const openIndex = ref(0)

function toggle(i) {
  openIndex.value = openIndex.value === i ? -1 : i
}

const faqs = [
  {
    question: 'How do I transfer text from my phone to my laptop without a cable?',
    answer: 'Open TextShareNow on your phone, paste your text into the Send tab, and tap Generate Code. A short 5-character code appears. On your laptop, open the same website, go to the Receive tab, type the code, and your text shows up instantly — no cable, no app, no sign-up.',
  },
  {
    question: 'Is the shared text stored on your servers?',
    answer: 'Only temporarily. Your text is stored for a maximum of 10 minutes or deleted immediately after it is retrieved — whichever happens first. We do not log, sell, or retain any of your content after deletion.',
  },
  {
    question: 'Do I need to create an account to use TextShareNow?',
    answer: 'No. There are no accounts, no sign-ups, and no email addresses required. The tool is completely anonymous and works the moment you open it in any browser.',
  },
  {
    question: 'Does it work across different Wi-Fi networks or mobile data?',
    answer: 'Yes. Unlike tools that require the same Wi-Fi network, TextShareNow works across any internet connection — mobile data, home broadband, office Wi-Fi, or public hotspots.',
  },
  {
    question: 'Can the same code be used multiple times?',
    answer: 'No. Each code is single-use. Once the text is retrieved on the receiving device, the code and its content are permanently deleted. This is by design to protect your privacy.',
  },
  {
    question: 'What is the maximum text size I can share?',
    answer: 'You can share up to 5,000 characters per transfer — enough for most URLs, notes, code snippets, and short messages.',
  },
]
</script>


