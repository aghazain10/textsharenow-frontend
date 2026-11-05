<template>
    <ol class="mt-7 grid gap-px overflow-hidden rounded-xl border border-line bg-line shadow-card" :class="COLS[cols] || COLS[3]">
        <li v-for="(step, i) in steps" :key="step.title" class="flex flex-col bg-surface p-5 sm:p-6">
            <div class="flex items-center justify-between gap-3">
                <span class="font-mono text-[11px] font-semibold tracking-[0.16em] text-muted">{{ String(i + 1).padStart(2, "0") }}</span>
                <TsnIcon v-if="step.icon" :name="step.icon" class="h-4 w-4 text-muted" stroke="1.8" />
            </div>
            <h3 class="mt-4 text-[16px] font-semibold tracking-[-0.01em]">{{ step.title }}</h3>
            <p class="mt-2 text-[14px] leading-relaxed text-muted">{{ step.body }}</p>
        </li>
    </ol>
</template>

<script setup>
const COLS = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
};

defineProps({
    steps: { type: Array, required: true }, // [{ title, body, icon }]
    cols: { type: Number, default: 3 },
});
</script>
