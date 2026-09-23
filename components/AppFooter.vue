<template>
    <footer class="border-t border-line px-4">
        <div class="mx-auto grid max-w-6xl gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
                <NuxtLink to="/" class="flex items-center gap-2 text-[16px] font-bold tracking-[-0.03em]">
                    <TsnLogo class="h-7 w-7 shrink-0" />TextShareNow
                </NuxtLink>
                <p class="mt-3 max-w-[32ch] text-[14px] text-muted">Instant text transfer between any devices.<br />No app. No account. Just a code.</p>
            </div>
            <nav v-for="col in COLS" :key="col.title" :aria-label="col.title">
                <h3 class="text-[14px] font-semibold">{{ col.title }}</h3>
                <ul class="mt-3 grid gap-2 text-[14px] text-muted">
                    <li v-for="l in col.links" :key="l.label">
                        <a v-if="l.href" class="hover:text-ink" :href="l.href" target="_blank" rel="noopener noreferrer">{{ l.label }}</a>
                        <NuxtLink v-else class="hover:text-ink" :to="l.to">{{ l.label }}</NuxtLink>
                    </li>
                </ul>
            </nav>
        </div>
        <div class="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 border-t border-line py-6 text-[13px] text-muted">
            <span>© {{ year }} TextShareNow. All rights reserved.</span>
            <span>Built for fast humans</span>
        </div>
    </footer>
</template>

<script setup>
const year = new Date().getFullYear();
const COLS = [
    {
        title: "Tool",
        links: [
            { label: "Send Text", to: "/" },
            { label: "Receive Text", to: "/#receive" },
            { label: "How It Works", to: "/how-it-works" },
            { label: "Online Text Sharing", to: "/online-text-sharing" },
            { label: "Share Files Online", to: "/share-files-online" },
        ],
    },
    {
        title: "Info",
        links: [
            { label: "FAQ", to: "/faq" },
            { label: "Blog", to: "/blog" },
            { label: "About", to: "/about" },
            { label: "Contact", to: "/contact" },
        ],
    },
    {
        title: "Legal",
        links: [
            { label: "Privacy Policy", to: "/privacy" },
            { label: "Terms of Use", to: "/terms" },
            { label: "Support this project", href: "https://wise.com/pay/me/syedm198" },
        ],
    },
];
</script>
