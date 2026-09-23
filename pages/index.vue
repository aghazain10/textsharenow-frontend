<template>
    <div>
        <!-- Hero -->
        <section class="relative isolate overflow-hidden px-4 pb-16 pt-14 sm:pb-20 sm:pt-20" aria-labelledby="hero-title">
            <div class="hero-grid absolute inset-0 -z-10" aria-hidden="true" />

            <div class="mx-auto max-w-6xl text-center">
                <p class="inline-flex items-center gap-2 rounded-full border border-line bg-bg px-3 py-1 text-[13px] font-medium text-ink shadow-card">
                    <i class="live-dot" aria-hidden="true" />No account · No app · Free forever
                </p>

                <h1 id="hero-title" class="mx-auto mt-7 text-[clamp(2.5rem,5.4vw,4.9rem)] font-bold leading-[1.04] tracking-[-0.05em]">
                    Share Text and Files Between <br class="hidden md:block" />Any Devices In Seconds
                </h1>
                <p class="mx-auto mt-6 max-w-[68ch] text-[19px] leading-relaxed text-muted">
                    Stop emailing yourself. Paste your link or note, get a short code, type it on your other device — done. Works phone to laptop, laptop to phone, across any network.
                </p>
            </div>

            <div class="mt-12">
                <ShareTool wide :initial-tab="tab" :initial-code="scannedCode" :initial-kind="scannedKind" />
            </div>

            <ul class="mx-auto mt-6 flex max-w-5xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-muted">
                <li class="inline-flex items-center gap-1.5"><TsnIcon name="user-x" class="h-4 w-4" stroke="1.8" />No sign-up</li>
                <li class="inline-flex items-center gap-1.5"><TsnIcon name="lock" class="h-4 w-4" stroke="1.8" />Each code works once</li>
                <li class="inline-flex items-center gap-1.5"><TsnIcon name="clock" class="h-4 w-4" stroke="1.8" />Text deleted after 10 min</li>
                <li class="inline-flex items-center gap-1.5"><TsnIcon name="globe" class="h-4 w-4" stroke="1.8" />Any browser, any network</li>
            </ul>
            <p class="mx-auto mt-3 max-w-5xl text-center text-[12px] text-muted/80">
                Text auto-deletes after first read or 10 min · Files after first download or 15 min
            </p>

            <dl class="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line shadow-card sm:grid-cols-4">
                <div v-for="s in STATS" :key="s.label" class="flex flex-col-reverse gap-1 bg-bg px-5 py-4 text-center">
                    <dt class="text-[12px] text-muted">{{ s.label }}</dt>
                    <dd class="text-[22px] font-bold tracking-[-0.03em] text-ink">
                        <UsageCounter v-if="s.counter" /><template v-else>{{ s.value }}</template>
                    </dd>
                </div>
            </dl>
        </section>

        <HowItWorks />
        <AboutTool />
        <FeaturesSection />
        <UseCases />
        <BlogPreview />
        <FaqSection />
        <SupportSection />
    </div>
</template>

<script setup>
useSeo({
    title: "Share Text and Files Between Any Devices",
    description:
        "Share text, links, notes, and files between any devices instantly using a short code. No app, no sign-up, free. Works phone to laptop and back. Files auto-delete after download.",
    pagePath: "/",
});

useHead({
    script: [
        {
            type: "application/ld+json",
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: "TextShareNow",
                url: "https://textsharenow.com",
                description: "Instantly share text, links, and notes between any devices using a short code. No account needed.",
                applicationCategory: "UtilitiesApplication",
                operatingSystem: "Any",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            }),
        },
    ],
});

const route = useRoute();
const router = useRouter();
const tab = ref("text");
const scannedCode = ref("");
const scannedKind = ref("");

const STATS = [
    { label: "texts shared using textsharenow", counter: true },
    { label: "avg. transfer time", value: "~8s" },
    { label: "short code", value: "5 chars" },
    { label: "sign-ups needed", value: "0" },
];

const clean = (v) => (v || "").toString().trim().toUpperCase().replace(/[^A-Z0-9]/g, "");

onMounted(() => {
    // A scanned QR opens the Receive tab and fetches straight away:
    // /?code=XXXXX for text, /?fcode=XXXXX for files
    const code = clean(route.query.code);
    const fcode = clean(route.query.fcode);
    if (code.length >= 4 || fcode.length >= 4) {
        tab.value = "receive";
        scannedKind.value = code.length >= 4 ? "text" : "file";
        scannedCode.value = code.length >= 4 ? code : fcode;
        router.replace({ query: {} });
    } else if (route.hash === "#receive") {
        tab.value = "receive";
    }
});

// Footer "Receive Text" link while already on the home page
watch(
    () => route.hash,
    (h) => {
        if (h === "#receive") {
            tab.value = "receive";
            document.getElementById("tool")?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    },
);
</script>
