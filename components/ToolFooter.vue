<template>
    <section class="border-t border-line px-4 py-12 sm:py-16">
        <div class="tool-wrap">
            <ToolShareCta :tool="tool" :path="path" :label="label" />

            <div class="mt-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p class="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">Keep going</p>
                    <h2 class="mt-2 text-[22px] font-semibold tracking-[-0.03em]">Related free tools</h2>
                </div>
                <NuxtLink to="/tools" class="text-[13px] font-medium text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
                    All free tools →
                </NuxtLink>
            </div>

            <div class="mt-5 grid gap-px overflow-hidden rounded-xl border border-line bg-line shadow-card sm:grid-cols-3">
                <NuxtLink
                    v-for="item in items"
                    :key="item.to"
                    :to="item.to"
                    class="group flex flex-col bg-surface p-5 transition-colors hover:bg-surface-2"
                >
                    <span class="grid h-9 w-9 place-items-center rounded-lg border border-line bg-bg text-ink shadow-card">
                        <TsnIcon :name="item.icon" class="h-4 w-4" stroke="1.8" />
                    </span>
                    <h3 class="mt-4 text-[16px] font-semibold tracking-[-0.02em]">{{ item.title }}</h3>
                    <p class="mt-1.5 text-[13px] leading-relaxed text-muted">{{ item.desc }}</p>
                    <span class="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                        Open tool
                        <span class="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
                    </span>
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup>
defineProps({
    tool: { type: String, required: true },
    path: { type: String, required: true },
    label: { type: String, default: "this tool" },
    items: { type: Array, required: true }, // [{ to, icon, title, desc }]
});
</script>
