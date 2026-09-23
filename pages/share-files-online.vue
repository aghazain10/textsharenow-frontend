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
                    Send photos, videos, and documents between any devices
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
                Files auto-delete after first download or 15 min · Scanned for malware
            </p>
            <ul class="mx-auto mt-3 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-muted">
                <li class="inline-flex items-center gap-1.5"><TsnIcon name="user-x" class="h-4 w-4" stroke="1.8" />No sign-up</li>
                <li class="inline-flex items-center gap-1.5"><TsnIcon name="clock" class="h-4 w-4" stroke="1.8" />Files auto-delete after first download or 15 min</li>
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
        'Share files between any devices instantly using a short code. Free, no sign-up. Upload photos, videos, or documents — recipient downloads with a code. Files auto-delete after first download. Malware scanned.',
    pagePath: '/share-files-online',
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
                        name: 'How do I share a file between my phone and laptop?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Open TextShareNow, click Share Files, select Send File, and upload your file. You get a 5-character code. On the other device, switch to Share Files, click Receive File, enter the code, and the file downloads.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'Is file sharing free?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Yes. TextShareNow file sharing is completely free with no sign-up, no account, and no size limits beyond 10 MB per file.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'Are uploaded files scanned for viruses?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Yes. Every uploaded file is scanned with ClamAV antivirus before becoming available for download. Infected files are immediately rejected and deleted.',
                        },
                    },
                ],
            }),
        },
    ],
})

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
        desc: 'A unique 5-character code is generated instantly. Valid for 15 minutes.',
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
        desc: 'Each file is single-use. After the first download or 15 minutes, it\'s permanently deleted. No archives, no backups.',
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
        a: 'Files are available for 15 minutes or until the first download — whichever comes first. After that, the file and its metadata are permanently deleted.',
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
</script>
