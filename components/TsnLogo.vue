<template>
    <!-- Logo mark: a split-flap tile with a T; colours follow the light/dark theme -->
    <svg viewBox="0 0 64 64" aria-hidden="true">
        <defs><clipPath :id="id"><rect width="64" height="64" rx="14" /></clipPath></defs>
        <g :clip-path="`url(#${id})`">
            <rect width="64" height="64" fill="var(--flap)" />
            <rect width="64" height="31.25" fill="var(--flap-top)" />
            <rect x="16" y="15" width="32" height="8" rx="2" fill="var(--flap-ink)" />
            <rect x="28" y="15" width="8" height="34" rx="2" fill="var(--flap-ink)" />
            <rect y="31.25" width="64" height="1.5" fill="var(--flap)" />
        </g>
    </svg>
</template>

<script setup>
// Unique clip id so header and footer logos don't clash
const id = `tsn-logo-${useId()}`;
</script>
