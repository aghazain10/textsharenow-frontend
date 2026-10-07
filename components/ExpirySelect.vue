<template>
    <div class="flex flex-wrap items-center gap-x-2.5 gap-y-2">
        <span class="inline-flex items-center gap-1.5 text-[13px] text-muted">
            <TsnIcon name="clock" class="h-3.5 w-3.5 shrink-0" stroke="1.8" />{{ label }}
        </span>
        <div class="flex gap-1.5" role="radiogroup" :aria-label="label">
            <button
                v-for="o in EXPIRY_OPTIONS"
                :key="o.seconds"
                type="button"
                role="radio"
                :aria-checked="modelValue === o.seconds"
                class="rounded-md border px-2.5 py-1 text-[12px] font-medium transition-colors"
                :class="modelValue === o.seconds
                    ? 'border-brand bg-brand text-on-brand shadow-card'
                    : 'border-line bg-bg text-muted hover:bg-surface-2 hover:text-ink'"
                @click="pick(o.seconds)"
            >
                {{ o.label }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { EXPIRY_OPTIONS } from "~/utils/expiry.js";

const props = defineProps({
    modelValue: { type: Number, required: true }, // seconds
    label: { type: String, default: "Deletes after" },
});
const emit = defineEmits(["update:modelValue"]);

function pick(seconds) {
    if (seconds !== props.modelValue) emit("update:modelValue", seconds);
}
</script>
