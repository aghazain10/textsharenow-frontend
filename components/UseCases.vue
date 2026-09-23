<template>
    <section class="section" aria-labelledby="use-cases-title">
        <div class="wrap">
            <div class="max-w-2xl">
                <p class="text-[13px] font-medium text-muted">Who It's For</p>
                <h2 id="use-cases-title" class="section-title mt-3">Built for Everyday Moments</h2>
                <p class="section-lead">A few real situations where a short code beats every other option.</p>
            </div>

            <div class="mt-12 grid gap-4 md:grid-cols-6">
                <article
                    v-for="(uc, i) in useCases"
                    :key="uc.title"
                    class="tile"
                    :class="i < 2 ? 'md:col-span-3' : 'md:col-span-2'"
                >
                    <span class="grid h-10 w-10 place-items-center rounded-md border border-line bg-surface-2/60 text-ink">
                        <TsnIcon :name="uc.icon" class="h-5 w-5" stroke="1.8" />
                    </span>
                    <h3 class="mt-5 text-[19px] font-semibold tracking-[-0.02em]">{{ uc.title }}</h3>
                    <p class="mt-2 text-[15px] leading-relaxed text-muted">{{ uc.description }}</p>
                </article>
            </div>
        </div>
    </section>
</template>

<script setup>
const useCases = [
    {
        icon: "laptop",
        title: "Developers Moving Code Snippets",
        description:
            "Found a fix on your phone during a commute? Paste the snippet, get a code, and pull it up on your laptop the moment you sit down — no Slack message to yourself, no half-typed gist.",
    },
    {
        icon: "file",
        title: "Students Sharing Notes and Links",
        description:
            "Copy a research link or a paragraph from a PDF on a library computer, then read it properly later on your phone on the way home, without emailing a locked-down university account.",
    },
    {
        icon: "swap",
        title: "Professionals Bridging Work and Personal Devices",
        description:
            "Move a meeting note or a URL from a work laptop to a personal phone (or back) without touching corporate email or a messaging app that syncs your entire chat history across both.",
    },
    {
        icon: "phone",
        title: "Anyone Setting Up a New Device",
        description:
            "Setting up a new phone or laptop often means retyping Wi-Fi passwords, license keys, and account details from your old device. A short code makes that a few seconds of copy-paste instead.",
    },
    {
        icon: "upload",
        title: "Sharing a Screenshot or Quick Photo",
        description:
            "Took a screenshot on your phone and need it on your laptop? Upload it, get a code, download on the other device — no WhatsApp compression, no email attachment limits, no cloud upload.",
    },
];
</script>
