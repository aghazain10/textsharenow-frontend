<template>
    <nav
        class="mb-7 flex flex-col items-center gap-2.5 sm:mb-8 sm:flex-row sm:justify-center sm:gap-3"
        aria-label="Free browser tools"
    >
        <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted sm:text-[12px]">
            More free tools
        </p>

        <ul class="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            <li v-for="tool in TOOLS" :key="tool.path">
                <NuxtLink
                    :to="tool.path"
                    :title="tool.desc"
                    class="group inline-flex items-center gap-1.5 rounded-full border border-line bg-bg px-2.5 py-1 text-[12px] font-medium text-muted shadow-card transition-colors hover:border-muted/40 hover:bg-surface-2 hover:text-ink sm:gap-2 sm:px-3 sm:py-1.5 sm:text-[13px]"
                    @click="trackToolLinkClick(tool.name, placement)"
                >
                    <TsnIcon
                        :name="tool.icon"
                        class="h-3.5 w-3.5 text-muted transition-colors group-hover:text-ink sm:h-4 sm:w-4"
                        stroke="1.8"
                    />{{ tool.label }}
                </NuxtLink>
            </li>
            <li>
                <NuxtLink
                    to="/tools"
                    class="group inline-flex items-center gap-1 rounded-full px-2 py-1 text-[12px] font-semibold text-ink transition-colors hover:bg-surface-2 sm:px-2.5 sm:py-1.5 sm:text-[13px]"
                    @click="trackToolLinkClick('all', placement)"
                >
                    View all
                    <span class="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
                </NuxtLink>
            </li>
        </ul>
    </nav>
</template>

<script setup>
import { trackToolLinkClick } from "~/composables/useAnalytics.js";

defineProps({
    /** Where the rail sits, for analytics. */
    placement: { type: String, default: "home_hero" },
});

const TOOLS = [
    {
        name: "image-compressor",
        label: "Image Compressor",
        icon: "image",
        path: "/image-compressor",
        desc: "Compress or convert a photo to an exact size — right in your browser.",
    },
    {
        name: "pdf-tools",
        label: "Combine PDF",
        icon: "pdf",
        path: "/pdf-tools",
        desc: "Combine, split or compress PDFs without uploading them.",
    },
    {
        name: "exif-remover",
        label: "EXIF Remover",
        icon: "map-pin",
        path: "/exif-remover",
        desc: "Strip GPS and camera metadata from a photo before sharing it.",
    },
];
</script>
