<template>
  <span class="usage-counter">
    <span v-if="count !== null" class="usage-count">{{ formatted }}</span>
  </span>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const count = ref(null)

const formatted = computed(() => {
  if (count.value === null) return ''
  return new Intl.NumberFormat('en-US').format(count.value)
})

onMounted(async () => {
  try {
    const res = await $fetch('/api/stats')
    count.value = res?.count ?? 0
  } catch {
    count.value = 0
  }
})
</script>

<style scoped>
.usage-count {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--accent);
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
}
</style>
