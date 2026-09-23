<template>
    <!-- Receive-only page: where QR codes land, and a quick page for people who only want to receive -->
    <section class="relative isolate overflow-hidden px-4 pb-20 pt-12 sm:pt-16">
        <div class="hero-grid absolute inset-0 -z-10" aria-hidden="true" />
        <div class="mx-auto max-w-xl text-center">
            <h1 class="text-[clamp(2.2rem,6vw,3.4rem)] font-bold leading-[1.05] tracking-[-0.045em]">Receive Text or Files</h1>
            <p class="mx-auto mt-4 max-w-[44ch] text-[17px] leading-relaxed text-muted">Type the 5-character code from your other device. Text is copied to your clipboard, files download straight away.</p>
        </div>
        <div class="tool-glow mx-auto mt-10 max-w-xl rounded-xl border border-line bg-surface p-3 sm:p-4">
            <ReceiveCode :initial-code="code" :initial-kind="kind" />
        </div>
        <p class="mx-auto mt-6 max-w-xl text-center text-[14px] text-muted">
            Want to send something instead? <NuxtLink to="/#tool" class="text-link">Open the full tool</NuxtLink>
        </p>
    </section>
</template>

<script setup>
useSeo({
    title: "Receive Text or Files",
    description: "Enter your 5-character TextShareNow code to receive text or files from your other device.",
    pagePath: "/r",
});
// A utility page with no content of its own, so keep it out of search results
useHead({ meta: [{ name: "robots", content: "noindex, follow" }] });

const route = useRoute();
const router = useRouter();
const code = ref("");
const kind = ref("");
const clean = (v) => (v || "").toString().trim().toUpperCase().replace(/[^A-Z0-9]/g, "");

onMounted(() => {
    const c = clean(route.query.code);
    const f = clean(route.query.fcode);
    if (c.length >= 5 || f.length >= 5) {
        kind.value = c.length >= 5 ? "text" : "file";
        code.value = c.length >= 5 ? c : f;
        router.replace({ query: {} });
    }
});
</script>
