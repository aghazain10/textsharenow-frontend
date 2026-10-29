<template>
    <section id="faq" class="section" aria-labelledby="faq-title" itemscope itemtype="https://schema.org/FAQPage">
        <div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
            <div>
                <p class="text-[13px] font-medium text-muted">FAQ</p>
                <h2 id="faq-title" class="section-title mt-3">Common Questions</h2>
                <p class="section-lead">Everything you need to know about sharing text between devices.</p>
                <NuxtLink to="/faq" class="text-link mt-6 inline-block text-[15px]">View all FAQs</NuxtLink>
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
                        <p class="max-w-[62ch] pb-4 text-[15px] leading-relaxed text-muted" itemprop="text">{{ item.answer }}</p>
                    </div>
                </details>
            </div>
        </div>
    </section>
</template>

<script setup>
const faqs = [
    {
        question: "How do I transfer text from my phone to my laptop without a cable?",
        answer: "Open TextShareNow on your phone, paste your text into the Send tab, and tap Generate Code. A short 5-character code appears. On your laptop, open the same website, go to the Receive tab, type the code, and your text shows up instantly — no cable, no app, no sign-up.",
    },
    {
        question: "Is the shared text stored on your servers?",
        answer: "Only temporarily and encrypted at rest. Your text is deleted when its read limit or timer is reached — 10 minutes to 30 days, or never if the sender chooses on Pro. Private-mode text is encrypted in the browser, so we store ciphertext we cannot read. We do not log, sell, or retain content after deletion.",
    },
    {
        question: "Do I need to create an account to use TextShareNow?",
        answer: "No. There are no accounts, no sign-ups, and no email addresses required. The tool is completely anonymous and works the moment you open it in any browser.",
    },
    {
        question: "Does it work across different Wi-Fi networks or mobile data?",
        answer: "Yes. Unlike tools that require the same Wi-Fi network, TextShareNow works across any internet connection — mobile data, home broadband, office Wi-Fi, or public hotspots.",
    },
    {
        question: "Can the same code be used multiple times?",
        answer: "By default, no — each code is single-use and the content is permanently deleted after the first read. Pro can allow 5 or 10 reads, or unlimited reads until the timer ends.",
    },
    {
        question: "Is my text encrypted?",
        answer: "Yes. Every share is encrypted in transit and at rest. Toggle “Encrypt Now” for zero-knowledge mode: your browser encrypts the text with AES-256-GCM and the key stays in the link — our server cannot read it. Private shares must be opened with the full link, not just the code.",
    },
    {
        question: "Are file uploads encrypted?",
        answer: "You choose. Standard uploads are encrypted in transit and scanned for malware before serving. Turn on “Encrypt files” and your browser encrypts the contents with AES-256-GCM; the key stays in the link and never reaches our server. File names, types, sizes, and folder paths remain visible, and encrypted contents cannot be virus-scanned. Private file links must be opened in full — the 5-character code alone will not work.",
    },
    {
        question: "What is the maximum text size I can share?",
        answer: "You can share up to 10,000 characters per transfer — enough for most URLs, notes, code snippets, and short messages.",
    },
];

// FAQPage structured data for rich snippets
useHead({
    script: [
        {
            type: "application/ld+json",
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: faqs.map((faq) => ({
                    "@type": "Question",
                    name: faq.question,
                    acceptedAnswer: { "@type": "Answer", text: faq.answer },
                })),
            }),
        },
    ],
});
</script>
