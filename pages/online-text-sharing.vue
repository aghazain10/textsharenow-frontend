<template>
  <div>
    <!-- Hero -->
    <section class="relative isolate overflow-hidden px-4 pb-16 pt-14 sm:pb-20 sm:pt-20" aria-labelledby="hero-title">
      <div class="hero-grid absolute inset-0 -z-10" aria-hidden="true" />

      <div class="mx-auto max-w-4xl text-center">
        <p class="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-full border border-line bg-bg px-3 py-1 text-[13px] font-medium text-muted shadow-card">
          <span><span class="font-semibold text-ink"><UsageCounter /></span> texts shared using textsharenow</span>
          <span class="h-3.5 w-px bg-line" aria-hidden="true" />
          <span><span class="font-semibold text-ink">~8s</span> avg. transfer time</span>
        </p>

        <h1 id="hero-title" class="mx-auto mt-7 max-w-[18ch] text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.06] tracking-[-0.05em]">
          Online Text Sharing — Share Text Between Any Devices In Seconds
        </h1>
        <p class="mx-auto mt-6 max-w-[56ch] text-[18px] leading-relaxed text-muted">
          TextShareNow is a fast, free tool for <strong class="font-semibold text-ink">online text sharing</strong> between any two devices. Paste your text, get a 5-character code, type it on the other device — done. Works phone to laptop, laptop to phone, across any network.
        </p>
      </div>

      <div class="mt-12">
        <ShareTool initial-tab="text" />
      </div>

      <ul class="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-muted">
        <li class="inline-flex items-center gap-1.5"><TsnIcon name="user-x" class="h-4 w-4" stroke="1.8" />0 sign-ups needed</li>
        <li class="inline-flex items-center gap-1.5"><TsnIcon name="lock" class="h-4 w-4" stroke="1.8" />5-character short code</li>
        <li class="inline-flex items-center gap-1.5"><TsnIcon name="clock" class="h-4 w-4" stroke="1.8" />Text auto-deletes after first read or 10 min</li>
        <li class="inline-flex items-center gap-1.5"><TsnIcon name="globe" class="h-4 w-4" stroke="1.8" />No account · No app · Free forever</li>
      </ul>
    </section>

    <!-- What is online text sharing -->
    <section class="section" aria-labelledby="what-is-title">
      <div class="wrap">
        <div class="max-w-2xl">
          <h2 id="what-is-title" class="section-title">What Is Online Text Sharing?</h2>
          <p class="section-lead">A browser-based way to move text, links, and notes between devices — no apps, no accounts, no cables.</p>
        </div>
        <div class="mt-10 max-w-[68ch] space-y-5 text-[16px] leading-7 text-muted">
          <p>
            <strong class="font-semibold text-ink">Online text sharing</strong> means using a web-based tool to transfer text from one device to another over the internet. Unlike AirDrop, Nearby Share, or Pushbullet — which require apps, OS compatibility, or both devices on the same network — an online tool works in any browser, on any operating system, across any connection.
          </p>
          <p>
            You open the site on both devices, paste your text on one, get a short code, type that code on the other, and the text appears. The entire round trip takes under 10 seconds. The content is encrypted in transit, stored temporarily (10 minutes max), and deleted immediately after retrieval.
          </p>
          <p>
            This approach solves the fundamental friction of cross-device text transfer: <strong class="font-semibold text-ink">you don't need to install anything, sign in anywhere, or be on the same Wi-Fi.</strong> It just works.
          </p>
        </div>
      </div>
    </section>

    <!-- Browser vs apps comparison -->
    <section class="section" aria-labelledby="compare-title">
      <div class="wrap">
        <div class="max-w-2xl">
          <h2 id="compare-title" class="section-title">Browser-Based vs. App-Based Sharing</h2>
          <p class="section-lead">Why <em>share text online</em> with a browser tool instead of installing an app?</p>
        </div>

        <div class="mt-12 overflow-x-auto rounded-xl border border-line bg-surface shadow-card">
          <table class="w-full min-w-[820px] border-collapse text-left text-[15px]" aria-label="Browser vs app text sharing comparison">
            <thead>
              <tr>
                <th scope="col" class="px-5 py-5 font-medium text-muted">Factor</th>
                <th scope="col" class="bg-surface-2 px-5 py-5 font-semibold text-ink">TextShareNow (Browser)</th>
                <th scope="col" class="px-5 py-5 font-semibold">AirDrop / Nearby Share</th>
                <th scope="col" class="px-5 py-5 font-semibold">Pushbullet / Join / KDE Connect</th>
                <th scope="col" class="px-5 py-5 font-semibold">Email / Self-Message</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in compareRows" :key="row[0]" class="border-t border-line">
                <th scope="row" class="px-5 py-4 font-medium">{{ row[0] }}</th>
                <td v-for="(cell, i) in row.slice(1)" :key="i" class="px-5 py-4" :class="{ 'bg-surface-2/60 font-medium': i === 0 }">
                  <span v-if="cell[0] === 'good'" class="inline-flex items-center gap-1.5 font-medium text-ink"><TsnIcon name="check" class="h-[18px] w-[18px] shrink-0" stroke="2.4" />{{ cell[1] }}</span>
                  <span v-else-if="cell[0] === 'bad'" class="inline-flex items-center gap-1.5 text-muted"><TsnIcon name="x" class="h-4 w-4 shrink-0" stroke="2.2" />{{ cell[1] }}</span>
                  <span v-else :class="{ 'text-muted': i !== 0 }">{{ cell[1] }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="mt-8 max-w-[68ch] text-[16px] leading-7 text-muted">
          The key insight: <strong class="font-semibold text-ink">apps solve sync; browsers solve transfer.</strong> If you want ongoing clipboard sync across your own daily-driver devices, an app like Pushbullet or KDE Connect makes sense. But for the 90% of transfers that are one-off — a link to a colleague, a note to your laptop, a Wi-Fi password to a guest — a browser-based <em>online text sharing</em> tool is faster, cleaner, and leaves no trace.
        </p>
      </div>
    </section>

    <!-- How it works -->
    <section id="how-it-works" class="section" aria-labelledby="hiw-title">
      <div class="wrap">
        <div class="max-w-2xl">
          <h2 id="hiw-title" class="section-title">How Online Text Sharing Works</h2>
          <p class="section-lead">From copy to paste in under 10 seconds — no accounts, no apps, no friction.</p>
        </div>

        <ol class="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <li v-for="(s, i) in steps" :key="s.title">
            <span
              class="grid h-9 w-9 place-items-center rounded-md text-[14px] font-semibold"
              :class="i === steps.length - 1 ? 'bg-brand text-on-brand' : 'border border-line bg-bg shadow-card'"
            >{{ i + 1 }}</span>
            <h3 class="mt-5 text-[21px] font-semibold tracking-[-0.025em]">{{ s.title }}</h3>
            <p class="mt-2 max-w-[34ch] text-muted">{{ s.desc }}</p>
          </li>
        </ol>

        <div class="tile mt-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div class="flex items-center gap-3">
              <TsnIcon name="phone" class="h-6 w-6 shrink-0 text-ink" stroke="1.8" />
              <div>
                <p class="text-[13px] text-muted">Phone</p>
                <p class="text-[15px]">Paste, send, get code <span class="font-mono font-semibold">Z7K4P</span></p>
              </div>
            </div>
            <TsnIcon name="arrow" class="hidden h-5 w-5 shrink-0 text-muted sm:block" />
            <div class="flex items-center gap-3">
              <TsnIcon name="laptop" class="h-6 w-6 shrink-0 text-ink" stroke="1.8" />
              <div>
                <p class="text-[13px] text-muted">Laptop</p>
                <p class="text-[15px]">Enter <span class="font-mono font-semibold">Z7K4P</span>, Text appears</p>
              </div>
            </div>
          </div>
          <p class="text-[14px] text-muted">Average transfer time: <strong class="font-semibold text-ink">under 8 seconds</strong></p>
        </div>
      </div>
    </section>

    <!-- Use cases -->
    <section class="section" aria-labelledby="use-cases-title">
      <div class="wrap">
        <div class="max-w-2xl">
          <h2 id="use-cases-title" class="section-title">When Online Text Sharing Wins</h2>
          <p class="section-lead">Real situations where a browser-based tool beats every other option.</p>
        </div>

        <div class="mt-12 grid gap-4 md:grid-cols-2">
          <article v-for="u in useCases" :key="u.title" class="tile">
            <h3 class="text-[19px] font-semibold tracking-[-0.025em]">{{ u.title }}</h3>
            <p class="mt-2 text-[15px] leading-relaxed text-muted">{{ u.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section" aria-labelledby="faq-title" itemscope itemtype="https://schema.org/FAQPage">
      <div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <div>
          <h2 id="faq-title" class="section-title">Common Questions</h2>
          <p class="section-lead">Everything you need to know about <em>online text sharing</em> with TextShareNow.</p>
          <NuxtLink to="/faq" class="btn-ghost mt-6">View All FAQs</NuxtLink>
        </div>
        <div class="border-t border-line">
          <details
            v-for="(item, i) in faqs"
            :key="i"
            class="faq border-b border-line"
            :open="i === 0"
            itemprop="mainEntity"
            itemscope
            itemtype="https://schema.org/Question"
          >
            <summary class="flex items-center justify-between gap-4 py-4 text-[15px] font-medium hover:underline hover:underline-offset-4">
              <span itemprop="name">{{ item.question }}</span>
              <span class="plus grid h-6 w-6 shrink-0 place-items-center text-muted"><TsnIcon name="plus" class="h-3.5 w-3.5" stroke="2.6" /></span>
            </summary>
            <div itemprop="acceptedAnswer" itemscope itemtype="https://schema.org/Answer">
              <p class="max-w-[62ch] pb-4 text-[15px] text-muted" itemprop="text">{{ item.answer }}</p>
            </div>
          </details>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section">
      <div class="wrap">
        <div class="tile px-6 py-14 text-center sm:px-12">
          <h2 class="section-title mx-auto max-w-[20ch]">Ready to try online text sharing?</h2>
          <p class="section-lead mx-auto">Open on any device, paste, get code, done. Free, private, no sign-up.</p>
          <NuxtLink to="/" class="btn-primary mt-8">Use the Tool Now</NuxtLink>
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

// Comparison table: [factor, ...cells], each cell is [tone, text]; tone good/bad/neutral
const compareRows = [
  ['Install required', ['good', 'No'], ['bad', 'Yes (OS-level)'], ['bad', 'Yes (app + account)'], ['good', 'No']],
  ['Account / sign-in', ['good', 'None'], ['bad', 'Apple/Google ID'], ['bad', 'Required'], ['good', 'None']],
  ['Cross-platform (iOS, Android, Windows)', ['good', 'Universal'], ['bad', 'Ecosystem-locked'], ['good', 'Mostly'], ['good', 'Universal']],
  ['Same network required', ['good', 'No'], ['bad', 'Yes (local)'], ['good', 'No'], ['good', 'No']],
  ['Transfer speed (text)', ['good', '~8 seconds'], ['neutral', '~5-15s'], ['neutral', '~10-30s'], ['bad', '30-60s']],
  ['Auto-delete after retrieval', ['good', 'Yes'], ['bad', 'No'], ['bad', 'No'], ['bad', 'No']],
  ['Works on locked-down work devices', ['good', 'Yes (browser only)'], ['bad', 'No'], ['bad', 'No (install blocked)'], ['good', 'Yes']],
  ['Share images / small videos', ['good', 'Yes (up to 10 MB)'], ['good', 'Yes (file size varies)'], ['neutral', 'Limited by app'], ['bad', 'Compresses / limits']],
  ['File size limit', ['neutral', '10 MB per file'], ['good', '~Several GB'], ['neutral', '~Varies'], ['bad', '25 MB (Gmail) / varies']],
]

const steps = [
  { title: 'Paste Your Text', desc: 'On your sending device, open TextShareNow and paste your link, note, or any text into the Send tab.' },
  { title: 'Get a Short Code', desc: 'Hit send — our system instantly generates a unique 5-character code tied to your content.' },
  { title: 'Type the Code', desc: 'On your other device, open the same site, go to Receive, and type in the short code.' },
  { title: 'Text Appears Instantly', desc: 'Your content shows up immediately — auto-copied to your clipboard and ready to use.' },
]

const useCases = [
  { title: 'Developers Moving Code Snippets', desc: 'Found a fix on your phone during a commute? Paste the snippet, get a code, and pull it up on your laptop the moment you sit down — no Slack message to yourself, no half-typed gist.' },
  { title: 'Students Sharing Notes & Links', desc: 'Copy a research link or a paragraph from a PDF on a library computer, then read it properly later on your phone on the way home, without emailing a locked-down university account.' },
  { title: 'Professionals Bridging Work & Personal Devices', desc: 'Move a meeting note or a URL from a work laptop to a personal phone (or back) without touching corporate email or a messaging app that syncs your entire chat history across both.' },
  { title: 'Anyone Setting Up a New Device', desc: 'Setting up a new phone or laptop often means retyping Wi-Fi passwords, license keys, and account details from your old device. A short code makes that a few seconds of copy-paste instead.' },
  { title: 'Sharing a Screenshot or Quick Photo', desc: 'Took a screenshot on your phone and need it on your laptop? Upload it, get a code, download on the other device — no WhatsApp compression, no email attachment limits, no cloud upload.' },
  { title: 'Sharing Long URLs Without Breaking Them', desc: 'Modern URLs with tracking params break in SMS, chat apps, or when printed. Paste the full URL here — it transfers character-for-character, no truncation, no preview mangling.' },
  { title: "Private Text That Doesn't Live in Chat History", desc: 'Every self-message sits in a chat log forever. TextShareNow deletes content after one read — nothing stays behind to search, back up, or leak.' },
]
</script>
