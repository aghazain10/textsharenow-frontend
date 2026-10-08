<template>
    <div>
        <!-- Hero + Tool -->
        <section class="relative isolate overflow-hidden px-4 pb-16 pt-14 sm:pb-20 sm:pt-20">
            <div class="hero-grid absolute inset-0 -z-10" aria-hidden="true" />

            <div class="mx-auto max-w-4xl text-center">
                <p class="inline-flex items-center gap-2 rounded-full border border-line bg-bg px-3 py-1 text-[13px] font-medium text-muted shadow-card">
                    <TsnIcon name="file" class="h-3.5 w-3.5 text-ink" stroke="2" />File sharing
                </p>
                <h1 class="mx-auto mt-7 max-w-[18ch] text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.06] tracking-[-0.05em]">
                    Share Files Online — Free, No App, No Sign-Up
                </h1>
                <p class="mx-auto mt-6 max-w-[54ch] text-[18px] leading-relaxed text-muted">
                    Send photos, screenshots, and short videos between any devices
                    using a short code. No account, no cloud storage, no
                    file sitting on someone else's server. Files auto-delete
                    after the first download.
                </p>
            </div>

            <div class="mt-12">
                <ShareTool initial-tab="files" />
            </div>

            <p class="mx-auto mt-6 flex max-w-3xl items-center justify-center gap-2 text-center text-[13px] text-muted">
                <TsnIcon name="lock" class="h-4 w-4 shrink-0" stroke="1.8" />
                Files auto-delete after first download or expiry (10 min–1 h) · Scanned for malware
            </p>
            <ul class="mx-auto mt-3 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-muted">
                <li class="inline-flex items-center gap-1.5"><TsnIcon name="user-x" class="h-4 w-4" stroke="1.8" />No sign-up</li>
                <li class="inline-flex items-center gap-1.5"><TsnIcon name="clock" class="h-4 w-4" stroke="1.8" />Files auto-delete after first download or expiry</li>
                <li class="inline-flex items-center gap-1.5"><TsnIcon name="lock" class="h-4 w-4" stroke="1.8" />Scanned for malware</li>
                <li class="inline-flex items-center gap-1.5"><TsnIcon name="globe" class="h-4 w-4" stroke="1.8" />Any browser, any device</li>
            </ul>
        </section>

        <!-- How It Works -->
        <section class="section">
            <div class="wrap">
                <h2 class="section-title max-w-2xl">Share a File in 3 Steps</h2>

                <ol class="mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
                    <li v-for="(step, i) in steps" :key="step.num">
                        <div class="flex items-center">
                            <span
                                class="grid h-9 w-9 place-items-center rounded-md text-[14px] font-semibold"
                                :class="i === steps.length - 1 ? 'bg-brand text-on-brand' : 'border border-line bg-bg shadow-card'"
                            >{{ i + 1 }}</span>
                            <span
                                v-if="i < steps.length - 1"
                                class="ml-4 hidden h-px flex-1 bg-[repeating-linear-gradient(90deg,var(--line)_0_6px,transparent_6px_12px)] md:block"
                                aria-hidden="true"
                            />
                        </div>
                        <h3 class="mt-5 text-[21px] font-semibold tracking-[-0.025em]">{{ step.title }}</h3>
                        <p class="mt-2 max-w-[34ch] text-muted">{{ step.desc }}</p>
                    </li>
                </ol>
            </div>
        </section>

        <!-- Share Files Between Phone and Laptop -->
        <section class="section" aria-labelledby="devices-title">
            <div class="wrap">
                <div class="max-w-2xl">
                    <h2 id="devices-title" class="section-title">Share Files Between Phone and Laptop</h2>
                    <p class="section-lead">No USB cable, no paired Bluetooth, no app on either device — just a browser and a 5-character code.</p>
                </div>

                <div class="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
                    <div class="max-w-[68ch] space-y-5 text-[16px] leading-7 text-muted">
                        <p>
                            The most common transfer is a photo, screenshot, or short video that needs to go from a
                            <strong class="font-semibold text-ink">phone to a laptop</strong> (or the other way around). With a cable
                            you have to find the cable. With AirDrop or Quick Share both devices have to be nearby and in the same
                            ecosystem. With a messaging app you end up with the file sitting in your chat history forever.
                        </p>
                        <p>
                            Here the flow is the same in every direction: upload on the sending device, get a
                            <strong class="font-semibold text-ink">5-character code</strong>, type that code on the receiving device,
                            and the file downloads with its original filename. The two devices can be on completely different networks —
                            home Wi-Fi on one, mobile data on the other, or both on the
                            <strong class="font-semibold text-ink">same Wi-Fi network</strong>. Nothing has to discover anything.
                        </p>
                        <p>
                            Each code is single-use and expires after 10 minutes, 30 minutes, or 1 hour, so nothing lingers on either
                            device afterwards. Prefer to move text, links, or notes instead?
                            <NuxtLink to="/online-text-sharing" class="text-link">Online text sharing</NuxtLink>
                            works exactly the same way.
                        </p>
                        <p class="text-[15px]">
                            Step-by-step instructions for every device pair:
                            <NuxtLink to="/blog/share-files-between-phone-and-laptop" class="text-link">how to share files between phone and laptop</NuxtLink>,
                            or the full
                            <NuxtLink to="/how-it-works" class="text-link">how it works guide</NuxtLink>.
                        </p>
                    </div>

                    <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                        <li v-for="pair in devicePairs" :key="pair" class="flex items-center gap-3 rounded-lg border border-line bg-surface px-4 py-3 shadow-card">
                            <TsnIcon name="check" class="h-4 w-4 shrink-0 text-ink" stroke="2.4" />
                            <span class="text-[15px] font-medium">{{ pair }}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </section>

        <!-- Why This Beats Alternatives -->
        <section class="section">
            <div class="wrap">
                <h2 class="section-title max-w-2xl">File Sharing That Respects Your Privacy</h2>

                <div class="mt-12 grid gap-4 md:grid-cols-2">
                    <article v-for="item in advantages" :key="item.title" class="tile">
                        <TsnIcon :name="item.icon" class="h-5 w-5 text-ink" stroke="1.8" />
                        <h3 class="mt-4 text-[19px] font-semibold tracking-[-0.025em]">{{ item.title }}</h3>
                        <p class="mt-2 text-[15px] leading-relaxed text-muted">{{ item.desc }}</p>
                    </article>
                </div>
            </div>
        </section>

        <!-- Supported Formats -->
        <section class="section">
            <div class="wrap">
                <h2 class="section-title max-w-2xl">What You Can Share</h2>

                <ul class="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    <li v-for="fmt in formats" :key="fmt.type" class="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface px-4 py-3 shadow-card">
                        <span class="text-[15px] font-semibold">{{ fmt.type }}</span>
                        <span class="font-mono text-[13px] text-muted">{{ fmt.ext }}</span>
                    </li>
                </ul>

                <p class="mt-6 max-w-[68ch] text-[15px] leading-7 text-muted">Maximum file size: 10 MB per file. All files are scanned for malware before becoming available.</p>
            </div>
        </section>

        <!-- Comparison -->
        <section class="section" aria-labelledby="compare-title">
            <div class="wrap">
                <div class="max-w-2xl">
                    <h2 id="compare-title" class="section-title">How This Compares to Other Ways to Share a File</h2>
                    <p class="section-lead">Against AirDrop, email attachments, messaging apps, and cloud links — for one-off transfers between two devices.</p>
                </div>

                <div class="mt-12 overflow-x-auto rounded-xl border border-line bg-surface shadow-card">
                    <table class="w-full min-w-[880px] border-collapse text-left text-[15px]" aria-label="File sharing method comparison">
                        <thead>
                            <tr>
                                <th scope="col" class="px-5 py-5 font-medium text-muted">Factor</th>
                                <th scope="col" class="bg-surface-2 px-5 py-5 font-semibold text-ink">TextShareNow (code)</th>
                                <th scope="col" class="px-5 py-5 font-semibold">AirDrop / Quick Share</th>
                                <th scope="col" class="px-5 py-5 font-semibold">Email attachment</th>
                                <th scope="col" class="px-5 py-5 font-semibold">WhatsApp / Messenger</th>
                                <th scope="col" class="px-5 py-5 font-semibold">Cloud link (Drive, Dropbox)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in compareRows" :key="row[0]" class="border-t border-line">
                                <th scope="row" class="px-5 py-4 font-medium">{{ row[0] }}</th>
                                <td v-for="(cell, i) in row.slice(1)" :key="i" class="px-5 py-4" :class="{ 'bg-surface-2/60 font-medium': i === 0 }">
                                    <span v-if="cell[0] === 'good'" class="inline-flex items-center gap-1.5 font-medium text-ink"><TsnIcon name="check" class="h-[18px] w-[18px] shrink-0" stroke="2.4" />{{ cell[1] }}</span>
                                    <span v-else-if="cell[0] === 'bad'" class="inline-flex items-center gap-1.5 text-muted"><TsnIcon name="x" class="h-4 w-4 shrink-0" stroke="2.2" />{{ cell[1] }}</span>
                                    <span v-else class="text-muted">{{ cell[1] }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p class="mt-8 max-w-[68ch] text-[16px] leading-7 text-muted">
                    The pattern: <strong class="font-semibold text-ink">every other method either needs an account, needs both devices
                    nearby on the same ecosystem, or leaves the file behind afterwards.</strong> A short code needs none of those —
                    which is also why it beats AirDrop for
                    <NuxtLink to="/blog/airdrop-alternative-online" class="text-link">cross-platform AirDrop alternatives</NuxtLink>
                    and messaging apps for
                    <NuxtLink to="/blog/how-to-send-photo-without-losing-quality" class="text-link">sending photos without losing quality</NuxtLink>.
                </p>
            </div>
        </section>

        <!-- FAQ -->
        <section class="section" aria-label="File sharing FAQ">
            <div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
                <div>
                    <h2 class="section-title">Frequently Asked Questions</h2>
                </div>
                <div class="border-t border-line">
                    <details v-for="(item, i) in faqs" :key="i" class="faq border-b border-line" :open="i === 0">
                        <summary class="flex items-center justify-between gap-4 py-4 text-[15px] font-medium hover:underline hover:underline-offset-4">
                            {{ item.q }}
                            <span class="plus grid h-6 w-6 shrink-0 place-items-center text-muted"><TsnIcon name="plus" class="h-3.5 w-3.5" stroke="2.6" /></span>
                        </summary>
                        <p class="max-w-[62ch] pb-4 text-[15px] text-muted">{{ item.a }}</p>
                    </details>
                </div>
            </div>
        </section>

        <!-- CTA -->
        <section class="section">
            <div class="wrap">
                <div class="tile px-6 py-14 text-center sm:px-12">
                    <h2 class="section-title mx-auto max-w-[20ch]">Ready to share a file? Takes 10 seconds.</h2>
                    <p class="section-lead mx-auto">No sign-up. No app. Just upload, get a code, done.</p>
                    <button type="button" class="btn-primary mt-8" @click="scrollToTool">Use the Tool Now</button>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>

useSeo({
    title: 'Share Files Online — Free File Sharing Between Devices',
    description:
        'Share files between any devices using a short code. Free, no sign-up — photos, screenshots and short videos download with a code, then auto-delete.',
    pagePath: '/share-files-online',
})

// FAQ Schema for Google rich results — built from the visible `faqs` array below
// (defined after it in this setup block) so markup and content can never drift apart.


function scrollToTool() {
    const el = document.getElementById('tool')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
}

const steps = [
    {
        num: '01',
        title: 'Upload your file',
        desc: 'Drag and drop or click to browse. Supported: PNG, JPEG, WebP, MP4, WebM. Max 10 MB.',
    },
    {
        num: '02',
        title: 'Get a short code',
        desc: 'A unique 5-character code and shareable link are generated instantly. You choose the expiry: 10 min, 30 min or 1 h.',
    },
    {
        num: '03',
        title: 'Download on the other device',
        desc: 'Open the site on the receiving device, enter the code, and the file downloads. Done.',
    },
]

const advantages = [
    {
        icon: 'globe',
        title: 'No Upload to Cloud',
        desc: 'Files are stored temporarily on our server, not in someone\'s cloud drive. No account needed, no shared links floating around.',
    },
    {
        icon: 'clock',
        title: 'Auto-Delete After Download',
        desc: 'Each file is single-use. After the first download or when its timer ends — 10 min, 30 min or 1 h — it\'s permanently deleted. No archives, no backups.',
    },
    {
        icon: 'lock',
        title: 'Malware Scanned',
        desc: 'Every file is scanned with ClamAV before it becomes available. Infected files are rejected immediately.',
    },
    {
        icon: 'phone',
        title: 'Works on Any Device',
        desc: 'Phone to laptop, laptop to phone, Android to iPhone — any combination. Just a browser, no app needed.',
    },
]

const formats = [
    { type: 'PNG', ext: '.png' },
    { type: 'JPEG', ext: '.jpg' },
    { type: 'WebP', ext: '.webp' },
    { type: 'MP4', ext: '.mp4' },
    { type: 'WebM', ext: '.webm' },
]

const faqs = [
    {
        q: 'How do I share a file between my phone and laptop?',
        a: 'Open TextShareNow, click "Share Files", select "Send File", and upload your file. You get a 5-character code. On the other device, switch to "Share Files", click "Receive File", enter the code, and the file downloads.',
    },
    {
        q: 'What file types are supported?',
        a: 'We support PNG, JPEG, WebP, MP4, and WebM. Images are re-encoded from raw pixels for security. SVG files are explicitly rejected.',
    },
    {
        q: 'What is the maximum file size?',
        a: 'Files can be up to 10 MB. If your file is larger, try compressing it before sharing.',
    },
    {
        q: 'How long does a file stay on the server?',
        a: 'Files are available until the first download or until their timer ends — whichever comes first. The sender chooses 10 minutes, 30 minutes or 1 hour. After that, the file and its metadata are permanently deleted.',
    },
    {
        q: 'Are files scanned for malware?',
        a: 'Yes. Every uploaded file is scanned with ClamAV antivirus before becoming available for download. Files that fail the scan are immediately rejected and deleted.',
    },
    {
        q: 'Can I download the same file more than once?',
        a: 'No. File codes are single-use. After the first successful download, the file and its code are permanently deleted. Ask the sender to generate a new code if you need the file again.',
    },
    {
        q: 'Is this really free?',
        a: 'Yes. No account, no subscription, no hidden fees. The site may show a small number of ads to cover server costs.',
    },
]

const devicePairs = [
    'Phone → Laptop',
    'Laptop → Phone',
    'Android → iPhone',
    'iPhone → Windows PC',
    'Phone → Tablet',
    'Mac → Phone',
]

const compareRows = [
    ['No app or account required', ['good', 'None'], ['bad', 'Built-in app'], ['bad', 'Both need an account'], ['bad', 'Both need the app'], ['bad', 'Sender needs an account']],
    ['Works across platforms', ['good', 'Any combination'], ['bad', 'Same ecosystem'], ['good', 'Any'], ['good', 'Any'], ['good', 'Any']],
    ['No cable, no same-network setup', ['good', 'Any network'], ['bad', 'Nearby / same network'], ['good', 'Any network'], ['good', 'Any network'], ['good', 'Any network']],
    ['Keeps original quality', ['good', 'No compression'], ['good', 'No compression'], ['good', 'No compression'], ['bad', 'Compresses media'], ['good', 'No compression']],
    ['Deleted after first download', ['good', '1 download or timer'], ['good', 'Nothing stored'], ['bad', 'Stays in inbox'], ['bad', 'Stays in chat'], ['bad', 'Until you delete it']],
    ['Leaves no chat or inbox history', ['good', 'None'], ['good', 'None'], ['bad', 'Full thread'], ['bad', 'Full thread'], ['bad', 'Shared folder entry']],
    ['Works for a one-off transfer', ['good', 'Under 10 seconds'], ['good', 'Fast if nearby'], ['bad', '30–60 seconds'], ['bad', 'App round trip'], ['bad', 'Upload, link, permissions']],
]

useHead({
    script: [
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqs.map((f) => ({
                    '@type': 'Question',
                    name: f.q,
                    acceptedAnswer: { '@type': 'Answer', text: f.a },
                })),
            }),
        },
    ],
})
</script>
