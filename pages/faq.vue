<template>
  <div>
    <PageHero
      meta="Knowledge Base"
      title="Frequently Asked Questions"
      lead="Everything you need to know about sharing text and files between devices with TextShareNow."
    />

    <section class="section" aria-label="FAQ answers">
      <div class="wrap">
        <div class="grid gap-14">
          <div
            v-for="(category, ci) in categories"
            :key="ci"
            class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-10"
          >
            <h2 class="text-[26px] font-semibold tracking-[-0.03em] text-ink">{{ category.title }}</h2>

            <div class="border-t border-line">
              <div
                v-for="(item, i) in category.items"
                :key="i"
                class="border-b border-line"
              >
                <button
                  type="button"
                  class="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left text-[15px] font-medium text-ink hover:underline hover:underline-offset-4"
                  :aria-expanded="openKey === `${ci}-${i}`"
                  @click="toggle(`${ci}-${i}`)"
                >
                  <span>{{ item.question }}</span>
                  <span
                    class="grid h-6 w-6 shrink-0 place-items-center text-muted transition-transform duration-200"
                    :class="{ 'rotate-45': openKey === `${ci}-${i}` }"
                    aria-hidden="true"
                  ><TsnIcon name="plus" class="h-3.5 w-3.5" stroke="2.6" /></span>
                </button>
                <div v-show="openKey === `${ci}-${i}`" class="pb-4">
                  <p class="max-w-[68ch] text-[15px] leading-7 text-muted">{{ item.answer }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="tile mt-16 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 class="text-[19px] font-semibold tracking-[-0.02em] text-ink">Still have a question?</h3>
            <p class="mt-1 text-[15px] text-muted">The best way to understand TextShareNow is to try it — it takes under 10 seconds.</p>
          </div>
          <NuxtLink to="/" class="btn-primary shrink-0">Try the Tool</NuxtLink>
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
          {
            '@type': 'Question',
            name: 'Can I share files with TextShareNow?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. TextShareNow supports file sharing for PNG, JPEG, WebP, MP4, and WebM files up to 10 MB. Upload a file, get a short code, and the recipient downloads it with that code. Files auto-delete after the first download or 15 minutes.',
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
    title: 'File Sharing',
    items: [
      {
        question: 'What file types can I share?',
        answer:
          'TextShareNow supports PNG, JPEG, WebP, MP4, and WebM files. Images are re-encoded from raw pixels for security before being stored. SVG files are explicitly rejected.',
      },
      {
        question: 'What is the maximum file size?',
        answer:
          'Files can be up to 10 MB. If your file is larger, try compressing it or splitting it into smaller parts before sharing.',
      },
      {
        question: 'How long do files stay on the server?',
        answer:
          'Files are available for 15 minutes or until the first download — whichever comes first. After that, both the file and its metadata are permanently deleted. Files are never archived or backed up.',
      },
      {
        question: 'Are files scanned for malware?',
        answer:
          'Yes. Every uploaded file is scanned with ClamAV before becoming available for download. Files that fail the scan are immediately rejected and deleted — they are never stored or served.',
      },
      {
        question: 'Can I download the same file more than once?',
        answer:
          'No. File codes are single-use. After the first successful download, the file and its code are immediately deleted. Ask the sender to generate a new code if you need the file again.',
      },
    ],
  },
  {
    title: 'Limitations',
    items: [
      {
        question: 'What is the maximum amount of text I can share?',
        answer:
          'You can share up to 10,000 characters per transfer. This covers most URLs, short notes, code snippets, and messages. For larger content, split it into multiple transfers.',
      },
      {
        question: 'Can I share files or images?',
        answer:
          'Yes. TextShareNow supports file sharing alongside text. You can upload PNG, JPEG, WebP, MP4, and WebM files up to 10 MB. Switch to the "Share Files" tab to send a file, and use the "Receive File" tab on the other device to download it with a short code.',
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
