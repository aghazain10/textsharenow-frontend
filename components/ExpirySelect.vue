<template>
    <div class="inline-flex flex-wrap items-center gap-x-2.5 gap-y-2 text-[13px]">
        <span class="inline-flex items-center gap-1.5 text-muted">
            <TsnIcon name="clock" class="h-3.5 w-3.5 shrink-0" stroke="1.8" />
            <span class="max-[399px]:hidden">{{ label }}</span>
        </span>
        <span ref="wrap" class="relative inline-flex">
            <button
                ref="trigger"
                type="button"
                class="inline-flex items-center gap-1.5 rounded-md border border-line bg-bg px-2.5 py-1 text-[12px] font-medium text-ink transition-colors hover:bg-surface-2"
                aria-haspopup="menu"
                :aria-expanded="open"
                :aria-label="`${label}: ${current.label}`"
                @click="toggle"
                @keydown.down.prevent="openMenu()"
                @keydown.esc.prevent="closeMenu(true)"
            >
                {{ current.label }}
                <TsnIcon name="chevron-down" class="h-3 w-3 shrink-0 text-muted transition-transform" :class="{ 'rotate-180': open }" stroke="2" />
            </button>
            <span
                v-if="open"
                ref="menu"
                role="menu"
                :aria-label="label"
                class="absolute bottom-full left-0 z-30 mb-1.5 w-max min-w-full rounded-md border border-line bg-bg py-1 shadow-card"
                @keydown="onMenuKey"
            >
                <button
                    v-for="o in EXPIRY_OPTIONS"
                    :key="o.seconds"
                    type="button"
                    role="menuitemradio"
                    :aria-checked="modelValue === o.seconds"
                    class="flex w-full items-center justify-between gap-3 whitespace-nowrap px-2.5 py-1.5 text-left text-[12px] font-medium transition-colors"
                    :class="modelValue === o.seconds ? 'text-brand' : 'text-muted hover:bg-surface-2 hover:text-ink'"
                    @click="pick(o.seconds)"
                >
                    {{ o.label }}
                    <TsnIcon v-if="modelValue === o.seconds" name="check" class="h-3.5 w-3.5 shrink-0" stroke="2.2" />
                </button>
            </span>
        </span>
    </div>
</template>

<script setup>
import { EXPIRY_OPTIONS } from "~/utils/expiry.js";

const props = defineProps({
    modelValue: { type: Number, required: true }, // seconds
    label: { type: String, default: "Deletes after" },
});
const emit = defineEmits(["update:modelValue"]);

const open = ref(false);
const wrap = ref(null);
const trigger = ref(null);
const menu = ref(null);

const current = computed(() => EXPIRY_OPTIONS.find((o) => o.seconds === props.modelValue) || EXPIRY_OPTIONS[0]);

function toggle() {
    open.value ? closeMenu(true) : openMenu();
}

function openMenu() {
    if (open.value) return;
    open.value = true;
    nextTick(() => menu.value?.querySelector('[aria-checked="true"]')?.focus());
}

function closeMenu(refocus = false) {
    if (!open.value) return;
    open.value = false;
    if (refocus) trigger.value?.focus();
}

function pick(seconds) {
    if (seconds !== props.modelValue) emit("update:modelValue", seconds);
    closeMenu(true);
}

function onMenuKey(e) {
    if (e.key === "Escape") {
        e.preventDefault();
        closeMenu(true);
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const items = [...menu.value.querySelectorAll('[role="menuitemradio"]')];
        const i = items.indexOf(document.activeElement);
        const next = e.key === "ArrowDown" ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
        items[next]?.focus();
    } else if (e.key === "Tab") {
        closeMenu(false);
    }
}

function onDocDown(e) {
    if (open.value && !wrap.value?.contains(e.target)) closeMenu(false);
}

onMounted(() => document.addEventListener("mousedown", onDocDown));
onBeforeUnmount(() => document.removeEventListener("mousedown", onDocDown));
</script>
