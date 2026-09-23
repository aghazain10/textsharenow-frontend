<template>
  <div>
    <PageHero
      meta="Documentation"
      title="How TextShareNow Works"
      lead="A complete guide to sharing text between any devices in seconds — from phone to laptop, laptop to phone, or any combination."
    />

    <!-- Embeds the shared how-it-works component -->
    <HowItWorks />

    <!-- Extended written guide (for SEO) -->
    <section class="section">
      <div class="wrap">
        <div class="max-w-[68ch] space-y-14">
          <section v-for="guide in guides" :key="guide.title">
            <h2 class="text-[26px] font-semibold tracking-[-0.03em] text-ink">{{ guide.title }}</h2>
            <ol class="mt-6 space-y-5">
              <li v-for="(step, i) in guide.steps" :key="step.title" class="flex gap-4">
                <span class="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-line bg-bg text-[13px] font-semibold text-ink shadow-card">{{ i + 1 }}</span>
                <p class="text-[16px] leading-7 text-muted">
                  <strong class="font-semibold text-ink">{{ step.title }}</strong> — {{ step.detail }}
                </p>
              </li>
            </ol>
          </section>

          <section>
            <h2 class="text-[26px] font-semibold tracking-[-0.03em] text-ink">Online Text Sharing: The Browser-Based Alternative</h2>
            <p class="mt-4 text-[16px] leading-7 text-muted">
              Looking for a deeper dive on <strong class="font-semibold text-ink">online text sharing</strong> — why browser-based tools
              beat apps for cross-platform transfers, comparison tables, and more use cases?
              <NuxtLink to="/online-text-sharing" class="text-link">Read our dedicated online text sharing guide</NuxtLink>.
            </p>
          </section>
        </div>
      </div>
    </section>

    <FaqSection />
  </div>
</template>

<script setup>
useSeo({
  title: 'How It Works — Share Text and Files Between Devices',
  description:
    'A complete guide to how TextShareNow transfers text and files between your phone and laptop using short codes. Step-by-step instructions and technical details.',
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

const fileShareSteps = [
  { title: 'Open TextShareNow and switch to the Share Files tab', detail: 'Click "Share Files" at the top of the tool on your sending device.' },
  { title: 'Select Send File', detail: 'Drag and drop a file or click to browse. Accepted types: PNG, JPEG, WebP, MP4, WebM (max 10 MB).' },
  { title: 'Upload and get your code', detail: 'The file is uploaded, scanned for malware, and a 5-character code is generated. Valid for 15 minutes.' },
  { title: 'Open Share Files on the receiving device', detail: 'Switch to the Share Files tab on the other device.' },
  { title: 'Select Receive File and enter the code', detail: 'Type the code and click Download. The file downloads directly to your device with the correct filename.' },
]

const guides = [
  { title: 'Step-by-Step: Phone to Laptop', steps: phoneToLaptopSteps },
  { title: 'Step-by-Step: Laptop to Phone', steps: laptopToPhoneSteps },
  { title: 'How to Share Files Between Devices', steps: fileShareSteps },
]
</script>
