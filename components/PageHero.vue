<template>
    <!-- Top of every inner page: same dot grid + type scale as the home hero, left-aligned -->
    <section class="relative isolate overflow-hidden px-4 pb-14 pt-14 sm:pb-16 sm:pt-20">
        <div class="hero-grid absolute inset-0 -z-10" aria-hidden="true" />
        <div class="wrap">
            <NuxtLink v-if="back" :to="back.to" class="inline-flex items-center gap-1.5 text-[14px] font-medium text-muted hover:text-ink">
                <TsnIcon name="back" class="h-4 w-4" />{{ back.label }}
            </NuxtLink>
            <p v-if="meta" class="text-[13px] font-medium text-muted" :class="{ 'mt-6': back }">{{ meta }}</p>
            <h1 class="mt-3 max-w-[20ch] text-[clamp(2.4rem,6vw,4.2rem)] font-bold leading-[1.05] tracking-[-0.045em]">{{ title }}</h1>
            <p v-if="lead" class="mt-5 max-w-[58ch] text-[18px] leading-relaxed text-muted">{{ lead }}</p>
            <slot />
        </div>
    </section>
</template>

<script setup>
defineProps({
    title: { type: String, required: true },
    lead: { type: String, default: "" },
    meta: { type: String, default: "" }, // small line above the title, e.g. "Last updated August 2026"
    back: { type: Object, default: null }, // { to, label }
});
</script>
