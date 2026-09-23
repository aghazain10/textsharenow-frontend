<template>
    <div>
        <PageHero
            meta="About"
            title="Built for the Frictionless Transfer"
            lead="TextShareNow was created to solve a single, frustrating problem — why is it so hard to move a piece of text from your phone to your laptop?"
        />

        <section class="section">
            <div class="wrap grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
                <article class="max-w-[68ch] text-[16px] leading-7 text-muted">
                    <h2 class="text-[26px] font-semibold tracking-[-0.03em] text-ink">The Problem We Solved</h2>
                    <p class="mt-4">
                        Every day, millions of people email themselves URLs.
                        They message their own WhatsApp. They screenshot notes,
                        then retype them. The workflow is absurd — and yet it
                        persists, because no simple, universal tool existed to
                        bridge the gap between devices.
                    </p>
                    <p class="mt-4">
                        QR codes work well from laptop to phone (easy to scan),
                        but the reverse is awkward — your laptop doesn't have a
                        camera pointed at a screen. Long shareable links require
                        you to type a full URL, which defeats the purpose. Apps
                        require accounts.
                    </p>
                    <p class="mt-4">
                        TextShareNow is the answer: a short, typeable code that
                        works in both directions, across any network, on any
                        device, with zero setup. If you are coming from Apple's
                        ecosystem and missing AirDrop on your Windows or Android
                        device, our guide on
                        <NuxtLink to="/blog/airdrop-alternative-cross-platform" class="text-link">AirDrop alternatives that work across platforms</NuxtLink>
                        covers the landscape in detail.
                    </p>

                    <h2 class="mt-12 border-t border-line pt-12 text-[26px] font-semibold tracking-[-0.03em] text-ink">How It Works (Technically)</h2>
                    <p class="mt-4">
                        When you submit text, it is stored in an encrypted
                        temporary key-value store with a time-to-live (TTL) of
                        10 minutes. A unique 5-character alphanumeric code is
                        generated and tied to your content as the key. The code
                        space gives over 60 million combinations, and our
                        rate-limiting prevents brute-force enumeration.
                    </p>
                    <p class="mt-4">
                        When the receiving device submits the code, the content
                        is retrieved and the entry is immediately deleted — a
                        single-read guarantee. The entire round trip takes under
                        500ms on a typical connection.
                    </p>

                    <h2 class="mt-12 border-t border-line pt-12 text-[26px] font-semibold tracking-[-0.03em] text-ink">File Sharing — Beyond Text</h2>
                    <p class="mt-4">
                        Text sharing solved the daily friction of moving links
                        and notes between devices. But the same problem exists
                        for files — photos, videos, documents. AirDrop only
                        works between Apple devices. Bluetooth is slow and
                        requires pairing. Cloud storage means uploading
                        someone else's server, creating an account, and managing
                        shared links.
                    </p>
                    <p class="mt-4">
                        So we added file sharing to TextShareNow. The workflow
                        is the same: upload a file on one device, get a short
                        code, type it on the other device, and the file
                        downloads. No accounts, no apps, no cloud storage
                        sitting around. Files are scanned for malware before
                        becoming available, and automatically deleted after the
                        first download or 15 minutes — whichever comes first.
                    </p>
                    <p class="mt-4">
                        Supported formats include PNG, JPEG, WebP, MP4, and
                        WebM, with a 10 MB size limit per file. Images are
                        re-encoded from raw pixels for security. Every file is
                        stored on a dedicated server with strict access
                        controls — never served as static files, never indexed
                        by search engines.
                    </p>

                    <h2 class="mt-12 border-t border-line pt-12 text-[26px] font-semibold tracking-[-0.03em] text-ink">Who Built This</h2>
                    <p class="mt-4">
                        TextShareNow is an independent project built and
                        maintained by
                        <strong class="font-semibold text-ink">Zain Rizvee</strong>, a web developer based in
                        Skardu, Pakistan. Zain runs several e-commerce
                        businesses and builds the custom storefronts and
                        internal tools behind them himself, working primarily
                        with Laravel, Nuxt, and Vue.
                    </p>
                    <p class="mt-4">
                        The idea for TextShareNow came out of a problem Zain
                        kept running into during his own work: moving a link, a
                        snippet of code, or a quick note between his phone and
                        his laptop, over and over, every single day. Emailing
                        himself got old fast, and every existing tool either
                        needed an app install, an account, or only worked one
                        direction. So he built the tool he actually wanted to
                        use — a short code that works instantly, in both
                        directions, on any device.
                    </p>
                    <p class="mt-4">
                        TextShareNow is free to use and doesn't require an
                        account, a subscription, or your email address. To keep
                        it free and cover the cost of running the servers, the
                        site may show a small number of ads. There's no catch
                        beyond that — no data resale, no hidden tiers, just a
                        tool built to solve a real, everyday problem.
                    </p>

                    <h2 class="mt-12 border-t border-line pt-12 text-[26px] font-semibold tracking-[-0.03em] text-ink">Keep This Free</h2>
                    <p class="mt-4">
                        TextShareNow is free to use, and that's not changing.
                        Running it costs a little in hosting and time, though
                        — if it's saved you a few minutes here and there, you
                        can support it directly. No account or subscription
                        needed on your end, just a one-time show of support
                        if you'd like to.
                    </p>
                    <a
                        href="https://wise.com/pay/me/syedm198"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="btn-ghost mt-6"
                        aria-label="Support TextShareNow with a donation via Wise"
                    >
                        <TsnIcon name="heart" class="h-4 w-4" />
                        Support via Wise
                    </a>

                    <h2 class="mt-12 border-t border-line pt-12 text-[26px] font-semibold tracking-[-0.03em] text-ink">Our Principles</h2>
                    <div class="mt-6 grid gap-4 sm:grid-cols-2">
                        <div v-for="p in principles" :key="p.title" class="tile">
                            <TsnIcon :name="p.icon" class="h-5 w-5 text-ink" stroke="1.8" />
                            <h3 class="mt-4 text-[19px] font-semibold tracking-[-0.02em] text-ink">{{ p.title }}</h3>
                            <p class="mt-2 text-[15px] leading-6 text-muted">{{ p.desc }}</p>
                        </div>
                    </div>
                </article>

                <!-- Sidebar -->
                <aside class="grid gap-4 lg:sticky lg:top-24">
                    <div class="tile">
                        <h3 class="text-[13px] font-medium text-muted">By the Numbers</h3>
                        <dl class="mt-4 divide-y divide-line">
                            <div v-for="stat in sidebarStats" :key="stat.label" class="flex items-baseline justify-between gap-4 py-3 first:pt-0 last:pb-0">
                                <dt class="text-[14px] text-muted">{{ stat.label }}</dt>
                                <dd class="shrink-0 text-[18px] font-semibold tracking-[-0.02em] text-ink">{{ stat.value }}</dd>
                            </div>
                        </dl>
                    </div>

                    <div class="tile">
                        <h3 class="text-[13px] font-medium text-muted">Built By</h3>
                        <p class="mt-3 text-[15px] leading-6 text-ink">
                            Zain Rizvee — web developer, Skardu, Pakistan.<br />
                            <span class="text-muted">Laravel · Nuxt · Vue</span>
                        </p>
                        <NuxtLink to="/contact" class="btn-ghost mt-5 w-full">Get in Touch</NuxtLink>
                    </div>

                    <div class="tile">
                        <h3 class="text-[13px] font-medium text-muted">Ready to try it?</h3>
                        <p class="mt-3 text-[15px] leading-6 text-ink">No sign-up. No app. Just open and share.</p>
                        <NuxtLink to="/" class="btn-primary mt-5 w-full">Use the Tool</NuxtLink>
                    </div>
                </aside>
            </div>
        </section>
    </div>
</template>

<script setup>
useSeo({
    title: "About — Why We Built TextShareNow",
    description:
        "Learn why TextShareNow was built — to solve the frustrating problem of transferring text and files between phone and laptop without cables, apps, or accounts.",
    pagePath: "/about",
});

const principles = [
    {
        icon: "clock",
        title: "Speed First",
        desc: "Every design decision prioritises getting your text from device A to device B as fast as possible.",
    },
    {
        icon: "lock",
        title: "Privacy by Default",
        desc: "We delete your content immediately after retrieval. There is no archive, no history, no logging of what you share.",
    },
    {
        icon: "check",
        title: "One Thing, Done Well",
        desc: "We are not building a platform. We solve one problem: quick text and file sharing between devices.",
    },
    {
        icon: "globe",
        title: "Universal Access",
        desc: "Works on any device with a browser. No OS restrictions, no app installs, no carrier dependencies.",
    },
];

const sidebarStats = [
    { value: "~8s", label: "Average transfer time" },
    { value: "5", label: "Characters in every code" },
    { value: "10 min", label: "Maximum data retention" },
    { value: "0", label: "Accounts needed" },
    { value: "10,000", label: "Max characters per transfer" },
];
</script>
