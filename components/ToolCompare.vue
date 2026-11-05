<template>
    <!-- Honest, specific comparison: no logo walls, just what changes when the
         file never leaves the device. The left column is page-specific copy. -->
    <section class="border-t border-line px-4 py-12 sm:py-16" :aria-label="title">
        <div class="tool-wrap grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-14">
            <div>
                <p class="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">{{ eyebrow }}</p>
                <h2 class="mt-2 text-[clamp(1.6rem,3.2vw,2.25rem)] font-bold leading-[1.1] tracking-[-0.03em]">{{ title }}</h2>
                <slot />
            </div>

            <div class="overflow-x-auto rounded-xl border border-line shadow-card">
                <table class="w-full min-w-[420px] border-collapse text-left text-[14px]">
                    <thead>
                        <tr class="border-b border-line bg-surface-2">
                            <th class="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted"> </th>
                            <th class="px-4 py-3 text-[12px] font-semibold text-ink">{{ localLabel }}</th>
                            <th class="px-4 py-3 text-[12px] font-medium text-muted">{{ typicalLabel }}</th>
                        </tr>
                    </thead>
                    <tbody class="bg-surface">
                        <tr v-for="row in rows" :key="row.label" class="border-b border-line align-top last:border-b-0">
                            <th scope="row" class="px-4 py-3.5 text-[13px] font-medium text-ink">{{ row.label }}</th>
                            <td class="px-4 py-3.5">
                                <span class="inline-flex items-start gap-1.5 font-medium text-ink">
                                    <TsnIcon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-ok" stroke="2.6" />{{ row.local }}
                                </span>
                            </td>
                            <td class="px-4 py-3.5">
                                <span class="inline-flex items-start gap-1.5 text-muted">
                                    <TsnIcon name="x" class="mt-0.5 h-4 w-4 shrink-0 text-bad/80" stroke="2.2" />{{ row.typical }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </section>
</template>

<script setup>
defineProps({
    eyebrow: { type: String, default: "The difference" },
    title: { type: String, required: true },
    localLabel: { type: String, default: "This tool" },
    typicalLabel: { type: String, default: "Typical online tool" },
    rows: { type: Array, required: true }, // [{ label, local, typical }]
});
</script>
