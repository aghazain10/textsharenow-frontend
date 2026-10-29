<template>
    <div>
        <!-- Hero: pitch + live-looking Pro preview -->
        <section class="relative isolate overflow-hidden px-4 pb-14 pt-14 sm:pb-16 sm:pt-20">
            <div class="hero-grid absolute inset-0 -z-10" aria-hidden="true" />
            <div class="wrap grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
                <div>
                    <p class="text-[13px] font-medium text-muted">Pricing</p>
                    <h1 class="mt-3 max-w-[20ch] text-[clamp(2.4rem,6vw,4.2rem)] font-bold leading-[1.05] tracking-[-0.045em]">TextShareNow Pricing: Free Plan, Pro at $5/Month</h1>
                    <p class="mt-5 max-w-[58ch] text-[18px] leading-relaxed text-muted">Share text and files for free with no sign-up — forever. Go Pro for 100,000 characters, up to 20 files / 100 MB total, expiry up to never, multi-reads, and password protection.</p>
                    <div class="mt-7 flex flex-wrap gap-3">
                        <a :href="checkoutHref('hero')" class="btn-primary" @click="onCtaClick('hero')">Get Pro — $5/month</a>
                        <NuxtLink to="/#tool" class="btn-ghost">Start with the free plan</NuxtLink>
                    </div>
                    <p class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-muted">
                        <span class="inline-flex items-center gap-1.5"><TsnIcon name="lock" class="h-3.5 w-3.5" stroke="1.8" />Secure checkout by Gumroad</span>
                        <span>Instant license key</span>
                        <span>Cancel anytime</span>
                    </p>
                </div>
                <ProPreview class="lg:justify-self-end" />
            </div>
        </section>

        <!-- Live usage + trust strip -->
        <section class="border-t border-line bg-surface-2/40 px-4 py-5">
            <div class="wrap flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-[14px] text-muted">
                <span><UsageCounter kind="text" /> texts shared</span>
                <span><UsageCounter kind="file" /> files shared</span>
                <span class="inline-flex items-center gap-1.5"><TsnIcon name="check" class="h-4 w-4 text-ok" stroke="2.4" />No account needed</span>
                <span class="inline-flex items-center gap-1.5"><TsnIcon name="check" class="h-4 w-4 text-ok" stroke="2.4" />Pro is optional — the free plan stays free</span>
            </div>
        </section>

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
                        <a :href="checkoutHref('plan_card')" class="btn-primary mt-7 w-full" @click="onCtaClick('plan_card')">Get Pro — $5/month</a>
                        <p class="mt-2 text-center text-[12px] text-muted">Gumroad checkout · instant license key · cancel anytime</p>
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
                    scanning for standard uploads, no account required, and content that is deleted from our servers when
                    its read limit or timer is reached. Both also include Private mode — text and file contents encrypted
                    in your browser with a key we never see. Pro only raises the ceilings.
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
                    <p class="section-lead">Eight power features, from bigger limits to a dashboard for managing every link you create.</p>
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
                <p class="mt-8 text-[15px] text-muted">
                    Building with AI agents? <NuxtLink to="/developers" class="text-link">Read the API &amp; MCP guide</NuxtLink>.
                    Already Pro? <NuxtLink to="/my-shares" class="text-link">Manage your active shares</NuxtLink>.
                </p>
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
                            external file service. Pro gives the people who lean hardest on the tool a way to pay for
                            it directly, in exchange for real upgrades: bigger limits, longer expiry, multi-reads,
                            passwords, and custom codes.
                        </p>
                        <p>
                            Subscriptions fund the service. If you never pay a cent, nothing breaks — that's the whole
                            point of keeping the free tier intact.
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
                    <a :href="checkoutHref('how_to')" class="btn-primary mt-6 w-full" @click="onCtaClick('how_to')">Get Pro — $5/month</a>
                    <p class="mt-2 text-center text-[12px] text-muted">You'll pay on Gumroad and get your key on the receipt.</p>
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
                    <details v-for="(item, i) in faqs" :key="i" class="faq border-b border-line" :open="i === 0" @toggle="onFaqToggle(i, $event)">
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
                        <a :href="checkoutHref('bottom')" class="btn-primary" @click="onCtaClick('bottom')">Get Pro — $5/month</a>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { proCheckoutPath } from "~/utils/checkout.js";
import { trackProEvent } from "~/composables/useProTracking.js";

useSeo({
    title: "Pricing — Free Plan and Pro at $5/Month",
    description:
        "TextShareNow is free forever — no sign-up, 10,000 characters, 10 MB files. Pro costs $5/month and adds 100K characters, 100 MB files, expiry up to never, multi-reads, and password protection. Cancel anytime.",
    pagePath: "/pricing",
});

const { open: openProModal } = useProModal();

// Every CTA links to /go/pro, which counts the click and redirects straight
// to Gumroad's checkout with UTMs attached.
const checkoutHref = (location) => proCheckoutPath({ plan: "monthly", location });
const onCtaClick = (location) => trackProEvent("pro_cta_click", { location, plan: "monthly" });

function onFaqToggle(index, event) {
    if (event.target.open) trackProEvent("pricing_faq_open", { question_index: index });
}

onMounted(() => {
    let sent = false;
    const onScroll = () => {
        if (sent) return;
        const doc = document.documentElement;
        const depth = (doc.scrollTop + window.innerHeight) / doc.scrollHeight;
        if (depth >= 0.75) {
            sent = true;
            trackProEvent("pricing_scroll", { depth: 75 });
            window.removeEventListener("scroll", onScroll);
        }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onBeforeUnmount(() => window.removeEventListener("scroll", onScroll));
});

const freeFeatures = [
    "Up to 10,000 characters per share",
    "Files up to 10 MB (PNG, JPEG, WebP, MP4, WebM)",
    "Expiry: 10 minutes, 30 minutes or 1 hour",
    "Single-use codes — deleted after one read",
    "QR code and shareable link for every code",
    "Optional Private mode — text and file contents encrypted in your browser",
    "Malware scanning on standard uploads",
    "No account, no sign-up, no data resale",
];

const proFeatures = [
    "Everything in Free, plus:",
    "Encrypted file transfers (contents end-to-end encrypted)",
    "Up to 100,000 characters per share (10×)",
    "Up to 20 files, 100 MB total — any non-executable type",
    "Expiry: 1 day, 7 days, 30 days — or never",
    "Read limits: 1, 5, 10 or unlimited reads",
    "Password-protect any share",
    "Custom share codes (e.g. coffee-menu)",
    "My Shares dashboard for active text links",
    "Developer API and MCP server for AI agents",
];

// [feature, free cell, pro cell] — cell = [kind, label]; kind: good | bad | text
const compareRows = [
    ["Price", ["text", "$0 — no billing"], ["text", "$5 per month, billed via Gumroad"]],
    ["Account required", ["good", "None"], ["good", "None — just a license key"]],
    ["Text per share", ["text", "10,000 characters"], ["text", "100,000 characters"]],
    ["File size", ["text", "10 MB"], ["text", "100 MB total, up to 20 files"]],
    ["File types", ["text", "PNG, JPEG, WebP, MP4, WebM"], ["good", "Any non-executable type"]],
    ["Share expiry", ["text", "10 min, 30 min, 1 h"], ["text", "10 min – 30 days, or never"]],
    ["Reads per share", ["text", "1 (single-use)"], ["text", "1, 5, 10 or unlimited"]],
    ["Password protection", ["bad", "Not included"], ["good", "Included"]],
    ["Private mode (E2E text + file contents)", ["good", "Included"], ["good", "Included"]],
    ["Custom code", ["text", "Random 5 characters"], ["good", "Any available name"]],
    ["API & MCP", ["text", "Free-plan limits only"], ["good", "Full Pro limits + MCP server"]],
    ["My Shares dashboard", ["bad", "Not included"], ["good", "List, copy and delete active links"]],
    ["QR code + share link", ["good", "Included"], ["good", "Included"]],
    ["Malware scanning (standard uploads)", ["good", "Included"], ["good", "Included"]],
    ["Manage or cancel", ["text", "Nothing to manage"], ["good", "Cancel anytime"]],
];

const charts = [
    { label: "Text per share", free: "10,000 characters", freeWidth: 10, pro: "100,000 characters", proWidth: 100 },
    { label: "File upload size", free: "10 MB", freeWidth: 10, pro: "100 MB total", proWidth: 100 },
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
        title: "Up to 20 files, 100 MB total",
        desc: "Send up to 20 files per transfer, 100 MB total — HD screen recordings, ZIP archives, PDFs, PSDs. The free plan stays at one file, 10 MB, and five formats; Pro lifts all three limits. Executables and installers stay blocked for everyone.",
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
        desc: "Viewers must enter your password before the text is revealed. It's stored as a salted, slow password hash, so wrong passwords are rejected without consuming a read — and we never see the original.",
    },
    {
        icon: "link",
        title: "Custom share codes",
        desc: "Pick a memorable code like coffee-menu or team-notes instead of a random string. Availability is checked instantly, and custom codes are protected like any other share — add a password for extra privacy.",
    },
    {
        icon: "external",
        title: "API & MCP for AI agents",
        desc: "Use your license key as a Bearer token to create and receive shares from scripts, or install the textsharenow-mcp server so Claude, opencode, or Cursor can share text as links directly. Same Pro limits, same auto-deletion.",
    },
    {
        icon: "dashboard",
        title: "My Shares dashboard",
        desc: "See every active text share tied to your license, how many reads are left, and when each link expires. Copy a link or delete a share without hunting through old tabs. No account needed — the license key is the login.",
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
        q: "What happens after I click Get Pro?",
        a: "You go straight to Gumroad's secure checkout — there is no product page in between. After payment, Gumroad shows your license key on the receipt and emails it to you. Paste that key into the ⭐ Pro panel anywhere on this site and every limit lifts instantly.",
    },
    {
        q: "What exactly do I get with Pro?",
        a: "100,000 characters per share (10× the free limit), up to 20 files and 100 MB total per transfer for any non-executable file type, expiry choices of 1 day, 7 days, 30 days or never, read limits of 1, 5, 10 or unlimited, password protection for any share, custom share codes, a My Shares dashboard, and a developer API plus MCP server.",
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
    {
        q: "Is there an API or MCP server?",
        a: "Yes. Pro includes a small HTTP API and an MCP server, so scripts and AI agents can create and receive shares without a browser. Send your license key as an Authorization: Bearer token, or install textsharenow-mcp with npx for Claude, opencode, Cursor, or any MCP client. The full guide, including endpoints, limits, and configuration examples, is on the API & MCP page.",
    },
    {
        q: "Can I manage shares after creating them?",
        a: "Yes. Pro includes a My Shares dashboard — linked from the header and footer — that lists every active text share and multi-file transfer tied to your license, shows remaining reads and expiry, and lets you copy the link or delete it. No account or extra password is needed beyond your license key. Single-file links are not listed yet.",
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
