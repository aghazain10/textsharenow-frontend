<template>
    <div>
        <PageHero
            meta="Pricing"
            title="TextShareNow Pricing: Free Plan, Pro at $5/Month"
            lead="Share text and files for free with no sign-up — forever. Go Pro for 100,000 characters, 100 MB files, expiry up to never, multi-reads, and password protection."
        >
            <div class="mt-7 flex flex-wrap gap-3">
                <a :href="PRO_URL" target="_blank" rel="noopener noopener" class="btn-primary">Get Pro — $5/month</a>
                <NuxtLink to="/#tool" class="btn-ghost">Start with the free plan</NuxtLink>
            </div>
        </PageHero>

        <!-- Plans -->
        <section class="section" aria-labelledby="plans-title">
            <div class="wrap">
                <div class="max-w-2xl">
                    <h2 id="plans-title" class="section-title">Two Plans, One Tool</h2>
                    <p class="section-lead">Everything is usable without an account. Pro is an optional upgrade for people who need bigger limits — the free plan is not going anywhere.</p>
                </div>

                <div class="mt-12 grid gap-5 lg:grid-cols-2">
                    <!-- Free -->
                    <article class="tile relative flex flex-col">
                        <h3 class="text-[15px] font-semibold uppercase tracking-[0.06em] text-muted">Free</h3>
                        <p class="mt-4 flex items-baseline gap-2">
                            <span class="text-[44px] font-bold leading-none tracking-[-0.04em] text-ink">$0</span>
                            <span class="text-[15px] text-muted">forever</span>
                        </p>
                        <p class="mt-3 text-[15px] leading-relaxed text-muted">Everything you need for quick, one-off transfers between your own devices.</p>
                        <ul class="mt-6 grid flex-1 gap-2.5 text-[14px]">
                            <li v-for="f in freeFeatures" :key="f" class="flex items-start gap-2.5">
                                <span class="mt-0.5 grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full bg-brand-soft"><TsnIcon name="check" class="h-3 w-3" stroke="3" /></span>
                                <span class="text-ink">{{ f }}</span>
                            </li>
                        </ul>
                        <NuxtLink to="/#tool" class="btn-ghost mt-7 w-full">Start Sharing Free</NuxtLink>
                    </article>

                    <!-- Pro -->
                    <article class="tile relative flex flex-col !border-brand shadow-[0_0_0_1px_var(--color-brand)]">
                        <span class="absolute -top-3 left-5 rounded-full bg-brand px-2.5 py-0.5 text-[12px] font-semibold text-on-brand">Most popular</span>
                        <h3 class="text-[15px] font-semibold uppercase tracking-[0.06em] text-brand">Pro</h3>
                        <p class="mt-4 flex items-baseline gap-2">
                            <span class="text-[44px] font-bold leading-none tracking-[-0.04em] text-ink">$5</span>
                            <span class="text-[15px] text-muted">/ month</span>
                        </p>
                        <p class="mt-3 text-[15px] leading-relaxed text-muted">For power users: 10× the limits, real control over expiry and access.</p>
                        <ul class="mt-6 grid flex-1 gap-2.5 text-[14px]">
                            <li v-for="f in proFeatures" :key="f" class="flex items-start gap-2.5">
                                <span class="mt-0.5 grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full bg-brand-soft"><TsnIcon name="check" class="h-3 w-3" stroke="3" /></span>
                                <span class="text-ink">{{ f }}</span>
                            </li>
                        </ul>
                        <a :href="PRO_URL" target="_blank" rel="noopener noopener" class="btn-primary mt-7 w-full">Get Pro — $5/month</a>
                        <button type="button" class="mt-2 w-full rounded-md py-2 text-[14px] font-medium text-brand transition-colors hover:underline" @click="openProModal('general')">
                            Already have a license key? Activate it
                        </button>
                    </article>
                </div>
            </div>
        </section>

        <!-- Full comparison table -->
        <section class="section" aria-labelledby="compare-title">
            <div class="wrap">
                <div class="max-w-2xl">
                    <h2 id="compare-title" class="section-title">Every Difference, Side by Side</h2>
                    <p class="section-lead">No asterisks and no hidden catches — here is the complete free vs Pro comparison.</p>
                </div>

                <div class="mt-12 overflow-x-auto rounded-xl border border-line bg-surface shadow-card">
                    <table class="w-full min-w-[720px] border-collapse text-left text-[15px]" aria-label="Free versus Pro feature comparison">
                        <thead>
                            <tr>
                                <th scope="col" class="px-5 py-5 font-medium text-muted">Feature</th>
                                <th scope="col" class="px-5 py-5 font-semibold text-ink">Free</th>
                                <th scope="col" class="bg-surface-2 px-5 py-5 font-semibold text-ink">Pro — $5/month</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in compareRows" :key="row[0]" class="border-t border-line">
                                <th scope="row" class="px-5 py-4 font-medium">{{ row[0] }}</th>
                                <td class="px-5 py-4">
                                    <span v-if="row[1][0] === 'good'" class="inline-flex items-center gap-1.5 font-medium text-ink"><TsnIcon name="check" class="h-[18px] w-[18px] shrink-0" stroke="2.4" />{{ row[1][1] }}</span>
                                    <span v-else-if="row[1][0] === 'bad'" class="inline-flex items-center gap-1.5 text-muted"><TsnIcon name="x" class="h-4 w-4 shrink-0" stroke="2.2" />{{ row[1][1] }}</span>
                                    <span v-else class="text-muted">{{ row[1][1] }}</span>
                                </td>
                                <td class="bg-surface-2/60 px-5 py-4">
                                    <span v-if="row[2][0] === 'good'" class="inline-flex items-center gap-1.5 font-medium text-ink"><TsnIcon name="check" class="h-[18px] w-[18px] shrink-0" stroke="2.4" />{{ row[2][1] }}</span>
                                    <span v-else-if="row[2][0] === 'bad'" class="inline-flex items-center gap-1.5 text-muted"><TsnIcon name="x" class="h-4 w-4 shrink-0" stroke="2.2" />{{ row[2][1] }}</span>
                                    <span v-else class="text-muted">{{ row[2][1] }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p class="mt-8 max-w-[68ch] text-[16px] leading-7 text-muted">
                    Both plans share the same engine: instant 5-character codes, QR codes and shareable links, malware
                    scanning, no account required, and content that is deleted from our servers the moment it's read or
                    expires. Pro only raises the ceilings.
                </p>
            </div>
        </section>

        <!-- Charts -->
        <section class="section" aria-labelledby="charts-title">
            <div class="wrap">
                <div class="max-w-2xl">
                    <h2 id="charts-title" class="section-title">Pro at a Glance: 10× the Limits</h2>
                    <p class="section-lead">How far each plan goes on the four limits people hit most often.</p>
                </div>

                <div class="mt-12 grid gap-5 md:grid-cols-2">
                    <figure v-for="chart in charts" :key="chart.label" class="tile">
                        <figcaption class="text-[15px] font-semibold text-ink">{{ chart.label }}</figcaption>
                        <div class="mt-5 space-y-4">
                            <div>
                                <div class="flex items-baseline justify-between text-[13px]">
                                    <span class="text-muted">Free</span>
                                    <span class="tabular-nums text-muted">{{ chart.free }}</span>
                                </div>
                                <div class="mt-1.5 h-4 overflow-hidden rounded-full bg-surface-2">
                                    <div class="h-full rounded-full bg-muted/50" :style="{ width: chart.freeWidth + '%' }" aria-hidden="true" />
                                </div>
                            </div>
                            <div>
                                <div class="flex items-baseline justify-between text-[13px]">
                                    <span class="font-semibold text-brand">Pro</span>
                                    <span class="tabular-nums font-semibold text-ink">{{ chart.pro }}</span>
                                </div>
                                <div class="mt-1.5 h-4 overflow-hidden rounded-full bg-surface-2">
                                    <div class="h-full rounded-full bg-brand" :style="{ width: chart.proWidth + '%' }" aria-hidden="true" />
                                </div>
                            </div>
                        </div>
                    </figure>
                </div>
                <p class="mt-6 text-[13px] text-muted">Bars are scaled for readability; the exact numbers are shown beside each bar.</p>
            </div>
        </section>

        <!-- Pro features deep dive -->
        <section class="section" aria-labelledby="features-title">
            <div class="wrap">
                <div class="max-w-2xl">
                    <h2 id="features-title" class="section-title">What's Inside Pro</h2>
                    <p class="section-lead">Six power features, each solving a limit people actually run into on the free plan.</p>
                </div>

                <div class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <article v-for="f in proDetails" :key="f.title" class="tile">
                        <span class="grid h-10 w-10 place-items-center rounded-lg border border-line bg-surface-2/60" aria-hidden="true">
                            <TsnIcon :name="f.icon" class="h-5 w-5 text-ink" stroke="1.8" />
                        </span>
                        <h3 class="mt-4 text-[19px] font-semibold tracking-[-0.02em] text-ink">{{ f.title }}</h3>
                        <p class="mt-2 text-[15px] leading-6 text-muted">{{ f.desc }}</p>
                    </article>
                </div>
            </div>
        </section>

        <!-- Why a paid plan + how activation works -->
        <section class="section" aria-labelledby="why-title">
            <div class="wrap grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
                <div>
                    <h2 id="why-title" class="section-title">Why Is There a Paid Plan?</h2>
                    <div class="mt-6 max-w-[68ch] space-y-4 text-[16px] leading-7 text-muted">
                        <p>
                            <strong class="text-ink">The free plan stays free.</strong> 10,000 characters, 10 MB files,
                            10-minute to 1-hour expiry, single-use codes — that's the tool's default and it isn't
                            being gutted or moved behind a wall. No account will ever be required to use it.
                        </p>
                        <p>
                            TextShareNow runs on paid infrastructure — servers, bandwidth, malware scanning, and the
                            external file service. Until now that was covered by ads and out of pocket. Pro gives the
                            people who lean hardest on the tool a way to pay for it directly, in exchange for real
                            upgrades: bigger limits, longer expiry, multi-reads, and passwords.
                        </p>
                        <p>
                            Ads support the free plan; subscriptions fund everything else. If you never pay a cent,
                            nothing breaks — that's the whole point of keeping the free tier intact.
                        </p>
                    </div>
                </div>

                <div class="tile h-fit">
                    <h3 class="text-[17px] font-semibold text-ink">Pro in three steps</h3>
                    <ol class="mt-5 grid gap-4">
                        <li v-for="(step, i) in activationSteps" :key="step.title" class="flex gap-3.5">
                            <span class="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-line bg-bg text-[13px] font-semibold text-ink shadow-card">{{ i + 1 }}</span>
                            <p class="text-[15px] leading-6 text-muted">
                                <strong class="font-semibold text-ink">{{ step.title }}</strong> — {{ step.detail }}
                            </p>
                        </li>
                    </ol>
                    <a :href="PRO_URL" target="_blank" rel="noopener noopener" class="btn-primary mt-6 w-full">Subscribe on Gumroad</a>
                    <button type="button" class="mt-2 w-full rounded-md py-2 text-[14px] font-medium text-brand transition-colors hover:underline" @click="openProModal('general')">
                        I already have a key — activate
                    </button>
                </div>
            </div>
        </section>

        <!-- FAQ -->
        <section class="section" aria-label="Pricing FAQ">
            <div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
                <div>
                    <h2 class="section-title">Pricing Questions, Answered</h2>
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
                    <h2 class="section-title mx-auto max-w-[22ch]">Try the free plan first. Go Pro when you hit a wall.</h2>
                    <p class="section-lead mx-auto">No sign-up for either. Pro unlocks the moment you paste your license key.</p>
                    <div class="mt-8 flex flex-wrap justify-center gap-3">
                        <NuxtLink to="/#tool" class="btn-ghost">Use the free tool</NuxtLink>
                        <a :href="PRO_URL" target="_blank" rel="noopener noopener" class="btn-primary">Get Pro — $5/month</a>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
useSeo({
    title: "Pricing — Free Plan and Pro at $5/Month",
    description:
        "TextShareNow is free forever — no sign-up, 10,000 characters, 10 MB files. Pro costs $5/month and adds 100K characters, 100 MB files, expiry up to never, multi-reads, and password protection. Cancel anytime.",
    pagePath: "/pricing",
});

const PRO_URL = useRuntimeConfig().public.PRO_URL;
const { open: openProModal } = useProModal();

const freeFeatures = [
    "Up to 10,000 characters per share",
    "Files up to 10 MB (PNG, JPEG, WebP, MP4, WebM)",
    "Expiry: 10 minutes, 30 minutes or 1 hour",
    "Single-use codes — deleted after one read",
    "QR code and shareable link for every code",
    "Malware scanning on every file",
    "No account, no sign-up, no data resale",
];

const proFeatures = [
    "Everything in Free, plus:",
    "Up to 100,000 characters per share (10×)",
    "Files up to 100 MB — any file type",
    "Expiry: 1 day, 7 days, 30 days — or never",
    "Read limits: 1, 5, 10 or unlimited reads",
    "Password-protect any share",
    "Custom share codes (e.g. coffee-menu)",
    "No ads",
];

// [feature, free cell, pro cell] — cell = [kind, label]; kind: good | bad | text
const compareRows = [
    ["Price", ["text", "$0 — no billing"], ["text", "$5 per month, billed via Gumroad"]],
    ["Account required", ["good", "None"], ["good", "None — just a license key"]],
    ["Text per share", ["text", "10,000 characters"], ["text", "100,000 characters"]],
    ["File size", ["text", "10 MB"], ["text", "100 MB"]],
    ["File types", ["text", "PNG, JPEG, WebP, MP4, WebM"], ["good", "Any file type"]],
    ["Share expiry", ["text", "10 min, 30 min, 1 h"], ["text", "10 min – 30 days, or never"]],
    ["Reads per share", ["text", "1 (single-use)"], ["text", "1, 5, 10 or unlimited"]],
    ["Password protection", ["bad", "Not included"], ["good", "Included"]],
    ["Custom code", ["text", "Random 5 characters"], ["good", "Any available name"]],
    ["QR code + share link", ["good", "Included"], ["good", "Included"]],
    ["Malware scanning", ["good", "Included"], ["good", "Included"]],
    ["Ads", ["text", "A few, non-intrusive"], ["good", "None"]],
    ["Manage or cancel", ["text", "Nothing to manage"], ["good", "Cancel anytime"]],
];

const charts = [
    { label: "Text per share", free: "10,000 characters", freeWidth: 10, pro: "100,000 characters", proWidth: 100 },
    { label: "File upload size", free: "10 MB", freeWidth: 10, pro: "100 MB", proWidth: 100 },
    { label: "Share expiry", free: "Up to 1 hour", freeWidth: 5, pro: "Up to 30 days — or never", proWidth: 100 },
    { label: "Reads before deletion", free: "1 read", freeWidth: 4, pro: "Unlimited reads", proWidth: 100 },
];

const proDetails = [
    {
        icon: "clipboard",
        title: "100,000 characters",
        desc: "10× the free cap. Fit an entire blog draft, a large JSON payload, a full code file, or a long set of instructions in one share — no splitting into chunks.",
    },
    {
        icon: "upload",
        title: "100 MB files, any type",
        desc: "Send HD screen recordings, ZIP archives, PDFs, PSDs — anything up to 100 MB. The free plan stays at 10 MB and five formats; Pro lifts both limits.",
    },
    {
        icon: "clock",
        title: "Expiry up to never",
        desc: "Keep a code alive for 1 day, 7 days, 30 days — or never delete it. The same short code and QR flow, just without the clock running out mid-task.",
    },
    {
        icon: "eye",
        title: "Multi-read shares",
        desc: "Free codes die after one read. Pro lets you set 5, 10, or unlimited reads — ideal for sharing instructions with a class, a team, or anyone who might need it again.",
    },
    {
        icon: "lock",
        title: "Password protection",
        desc: "Viewers must enter your password before the text is revealed. It's stored as a SHA-256 hash, so wrong passwords are rejected without consuming a read — and we never see the original.",
    },
    {
        icon: "check",
        title: "Ad-free browsing",
        desc: "Pro hides all ads across the site. Ads keep the free plan running; your subscription is what lets you browse without them.",
    },
];

const activationSteps = [
    { title: "Subscribe on Gumroad", detail: "$5/month through our secure Gumroad checkout — no account on this site required." },
    { title: "Copy your license key", detail: "Gumroad shows the key on the receipt page and emails it to you right away." },
    { title: "Paste it and activate", detail: "Open the ⭐ Pro panel anywhere on the site, choose “I already have a license key”, paste, and every limit lifts instantly." },
];

const faqs = [
    {
        q: "Is TextShareNow still free?",
        a: "Yes. The free plan is unchanged and stays free forever: 10,000 characters per share, files up to 10 MB, expiry from 10 minutes to 1 hour, single-use codes, and no sign-up required. Pro is an optional upgrade — you never need it for everyday sharing.",
    },
    {
        q: "How much does TextShareNow Pro cost?",
        a: "Pro is $5 per month, billed in USD through Gumroad. There are no tiers, add-ons, or hidden fees, and you can cancel anytime from your Gumroad receipt.",
    },
    {
        q: "What exactly do I get with Pro?",
        a: "100,000 characters per share (10× the free limit), file uploads up to 100 MB with no file-type restrictions, expiry choices of 1 day, 7 days, 30 days or never, read limits of 1, 5, 10 or unlimited, password protection for any share, and an ad-free site.",
    },
    {
        q: "How do I activate my license key?",
        a: "After subscribing, Gumroad gives you a license key on the receipt page and by email. Click the ⭐ Pro button in the header (or any locked feature), open “I already have a license key”, paste the key, and press Activate. Your browser is unlocked immediately and stays unlocked for the life of the subscription.",
    },
    {
        q: "Can I cancel anytime?",
        a: "Yes. Subscriptions are managed entirely by Gumroad — the receipt email contains a management link where you can cancel in one click. You keep full Pro access until the end of the billing period you already paid for.",
    },
    {
        q: "What happens to my shares if I cancel or my subscription ends?",
        a: "Shares you already created keep their settings — expiry, read count, and password — until they expire naturally. New shares fall back to the free plan's limits. Reactivating at any time restores Pro immediately with the same license key.",
    },
    {
        q: "Do you offer refunds?",
        a: "Refunds are handled case-by-case through Gumroad. If something went wrong — a key that won't activate or a charge you don't recognise — contact us via the contact page and we'll sort it out.",
    },
];

// Schema must come after `faqs` — JSON.stringify runs during setup (TDZ otherwise).
useHead({
    script: [
        {
            type: "application/ld+json",
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: faqs.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
            }),
        },
        {
            type: "application/ld+json",
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                name: "TextShareNow Pro",
                description:
                    "Premium plan for TextShareNow: 100,000 characters per share, 100 MB files, expiry up to never, multi-read shares, and password protection.",
                url: "https://www.textsharenow.com/pricing",
                offers: {
                    "@type": "Offer",
                    price: "5.00",
                    priceCurrency: "USD",
                    availability: "https://schema.org/InStock",
                    url: "https://www.textsharenow.com/pricing",
                },
            }),
        },
    ],
});
</script>
