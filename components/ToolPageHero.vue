<template>
    <!-- Compact, product-style header: the tool is the first thing on the page. -->
    <section class="relative isolate overflow-hidden px-4 pb-12 pt-8 sm:pb-16 sm:pt-10" aria-labelledby="tool-title">
        <div class="hero-grid absolute inset-0 -z-10" aria-hidden="true" />

        <div class="tool-wrap">
            <nav class="flex items-center gap-2 text-[12px] text-muted" aria-label="Breadcrumb">
                <NuxtLink to="/tools" class="transition-colors hover:text-ink">Free tools</NuxtLink>
                <span aria-hidden="true">/</span>
                <span class="text-ink">{{ eyebrow }}</span>
            </nav>

            <div class="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div class="max-w-[64ch]">
                    <h1 id="tool-title" class="max-w-[24ch] text-[clamp(2rem,4.6vw,3.35rem)] font-bold leading-[1.05] tracking-[-0.045em]">
                        {{ title }}
                    </h1>
                    <p class="mt-4 max-w-[60ch] text-[16px] leading-relaxed text-muted sm:text-[17px]">{{ lead }}</p>
                </div>

                <ul v-if="badges.length" class="flex flex-wrap gap-2 lg:max-w-[260px] lg:shrink-0 lg:justify-end">
                    <li
                        v-for="badge in badges"
                        :key="badge.label"
                        class="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg px-2.5 py-1 text-[12px] font-medium text-muted shadow-card"
                    >
                        <TsnIcon :name="badge.icon" class="h-3.5 w-3.5 text-ink" stroke="1.9" />{{ badge.label }}
                    </li>
                </ul>
            </div>

            <div class="mt-8 sm:mt-10">
                <slot />
                <p v-if="footnote" class="mt-4 flex items-center justify-center gap-2 text-center text-[12px] text-muted">
                    <TsnIcon name="lock" class="h-3.5 w-3.5" stroke="1.8" />{{ footnote }}
                </p>
            </div>
        </div>
    </section>
</template>

<script setup>
defineProps({
    eyebrow: { type: String, default: "Free tools" },
    title: { type: String, required: true },
    lead: { type: String, default: "" },
    badges: { type: Array, default: () => [] }, // [{ icon, label }]
    footnote: { type: String, default: "" },
});
</script>
