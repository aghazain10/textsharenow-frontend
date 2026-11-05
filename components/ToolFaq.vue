<template>
    <section class="border-t border-line px-4 py-12 sm:py-16" :aria-label="title">
        <div class="tool-wrap grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-16">
            <div>
                <p class="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">FAQ</p>
                <h2 class="mt-2 text-[clamp(1.6rem,3.2vw,2.25rem)] font-bold leading-[1.1] tracking-[-0.03em]">{{ title }}</h2>
                <p v-if="lead" class="mt-3 max-w-[42ch] text-[14px] leading-relaxed text-muted">{{ lead }}</p>
            </div>

            <div class="border-t border-line">
                <details v-for="(item, i) in items" :key="item.q" class="faq border-b border-line" :open="i === 0">
                    <summary class="flex items-center justify-between gap-4 py-4 text-[15px] font-medium hover:underline hover:underline-offset-4">
                        {{ item.q }}
                        <span class="plus grid h-6 w-6 shrink-0 place-items-center text-muted"><TsnIcon name="plus" class="h-3.5 w-3.5" stroke="2.6" /></span>
                    </summary>
                    <p class="max-w-[62ch] pb-4 text-[15px] leading-relaxed text-muted">{{ item.a }}</p>
                </details>
            </div>
        </div>
    </section>
</template>

<script setup>
defineProps({
    title: { type: String, default: "Questions" },
    lead: { type: String, default: "" },
    items: { type: Array, required: true }, // [{ q, a }]
});
</script>
