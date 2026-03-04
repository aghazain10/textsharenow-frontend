<template>
  <div>
    <section class="section">
      <div class="container legal-container">
        <div class="legal-header">
          <span class="section-label">Legal</span>
          <h1 class="section-title">Privacy Policy</h1>
          <p class="section-subtitle">Last updated: January 2025</p>
        </div>

        <div class="legal-body glass-card">
          <section v-for="section in sections" :key="section.title" class="legal-section">
            <h2 class="legal-h2">{{ section.title }}</h2>
            <div v-for="(block, i) in section.content" :key="i">
              <p v-if="block.type === 'p'" class="legal-p">{{ block.text }}</p>
              <ul v-else-if="block.type === 'ul'" class="legal-ul">
                <li v-for="(item, j) in block.items" :key="j">{{ item }}</li>
              </ul>
            </div>
          </section>

          <div class="legal-contact">
            <h2 class="legal-h2">Contact</h2>
            <p class="legal-p">
              For privacy questions or data requests, contact us at
              <span class="highlight">privacy@textsharenow.com</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
useSeo({
  title: 'Privacy Policy',
  description:
    'TextShareNow privacy policy — how we handle your data, what we store, and how your content is deleted after use.',
  pagePath: '/privacy',
})

const sections = [
  {
    title: '1. What We Collect',
    content: [
      { type: 'p', text: 'TextShareNow is designed to collect as little data as possible. Specifically:' },
      {
        type: 'ul',
        items: [
          'Text content you submit is temporarily stored only to fulfil the transfer request.',
          'We do not collect your name, email address, phone number, or any personally identifying information.',
          'We may collect anonymised server metrics such as request counts and response times for performance monitoring.',
          'Standard web server logs (IP addresses, timestamps) may be retained for up to 7 days for security purposes.',
        ],
      },
    ],
  },
  {
    title: '2. How Your Text Is Stored',
    content: [
      { type: 'p', text: 'When you submit text through our Send feature, it is stored in an encrypted temporary data store with a time-to-live (TTL) of 10 minutes.' },
      { type: 'p', text: 'Upon first successful retrieval, the content is immediately and permanently deleted. If not retrieved within 10 minutes, it is automatically deleted by the TTL mechanism.' },
      { type: 'p', text: 'We do not archive, back up, or retain any copies of submitted text beyond the TTL window.' },
    ],
  },
  {
    title: '3. Cookies and Tracking',
    content: [
      { type: 'p', text: 'TextShareNow does not use cookies for tracking or analytics. We do not use third-party analytics services such as Google Analytics.' },
      { type: 'p', text: 'We may use Google AdSense to display advertisements. Google AdSense may use cookies to serve personalised ads. You can opt out of personalised advertising via Google\'s Ad Settings.' },
    ],
  },
  {
    title: '4. Data Security',
    content: [
      { type: 'p', text: 'All data in transit is encrypted using HTTPS/TLS. Stored text is encrypted at rest in our temporary data store.' },
      { type: 'p', text: 'We apply rate limiting to prevent brute-force enumeration of codes. Each code allows a limited number of retrieval attempts per IP address per minute.' },
    ],
  },
  {
    title: '5. Third Parties',
    content: [
      { type: 'p', text: 'We do not sell, rent, or share your submitted text with any third parties. Your content is used solely to fulfil your transfer request and is then deleted.' },
    ],
  },
  {
    title: '6. Children\'s Privacy',
    content: [
      { type: 'p', text: 'TextShareNow is not directed at children under 13. We do not knowingly collect data from children. If you believe a child has submitted content through our service, please contact us immediately.' },
    ],
  },
  {
    title: '7. Changes to This Policy',
    content: [
      { type: 'p', text: 'We may update this privacy policy from time to time. Changes will be reflected by an updated date at the top of this page. Continued use of the service after changes constitutes acceptance of the updated policy.' },
    ],
  },
]
</script>

<style scoped>
.legal-container {
  max-width: 760px;
}

.legal-header {
  margin-bottom: 36px;
}

.legal-body {
  padding: 48px;
  display: flex;
  flex-direction: column;
  gap: 36px;
}

@media (max-width: 640px) {
  .legal-body { padding: 28px 20px; }
}

.legal-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.legal-h2 {
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--accent);
  text-transform: uppercase;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-accent);
}

.legal-p {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.8;
  font-weight: 300;
}

.legal-ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0;
}

.legal-ul li {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.7;
  font-weight: 300;
  padding-left: 18px;
  position: relative;
}

.legal-ul li::before {
  content: '›';
  position: absolute;
  left: 0;
  color: var(--accent);
  font-family: var(--font-mono);
}

.legal-contact {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.highlight {
  font-family: var(--font-mono);
  color: var(--accent);
  font-size: 0.85rem;
}
</style>
