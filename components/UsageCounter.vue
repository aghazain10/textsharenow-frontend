<template>
    <span class="tabular-nums">{{ formatted }}</span>
</template>

<script setup>
// Live all-time share count from /api/stats
const props = defineProps({
    // "text" → texts shared, "file" → files shared
    kind: { type: String, default: "text" },
});

const API_BASE = useRuntimeConfig().public.API_BASE;
const count = ref(null);
const formatted = computed(() => (count.value === null ? "…" : new Intl.NumberFormat("en-US").format(count.value)));

onMounted(async () => {
    try {
        const res = await $fetch(`${API_BASE}/api/stats`);
        count.value = (props.kind === "file" ? res?.fileCount : res?.count) ?? 0;
    } catch {
        count.value = 0;
    }
});
</script>
