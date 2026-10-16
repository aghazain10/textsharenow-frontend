<template>
    <div class="inline-flex flex-wrap items-center gap-x-2.5 gap-y-2 text-[13px]">
        <span class="inline-flex items-center gap-1.5 text-muted">
            <TsnIcon :name="icon" class="h-3.5 w-3.5 shrink-0" stroke="1.8" />
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
                    v-for="o in options"
                    :key="o.value"
                    type="button"
                    role="menuitemradio"
                    :aria-checked="modelValue === o.value"
                    class="flex w-full items-center justify-between gap-3 whitespace-nowrap px-2.5 py-1.5 text-left text-[12px] font-medium transition-colors"
                    :class="locked(o) ? 'text-muted hover:bg-surface-2' : modelValue === o.value ? 'text-brand' : 'text-muted hover:bg-surface-2 hover:text-ink'"
                    @click="pick(o)"
                >
                    <span class="inline-flex items-center gap-1.5">
                        <TsnIcon v-if="locked(o)" name="lock" class="h-3 w-3 shrink-0" stroke="2" />
                        {{ o.label }}
                    </span>
                    <TsnIcon v-if="!locked(o) && modelValue === o.value" name="check" class="h-3.5 w-3.5 shrink-0" stroke="2.2" />
                </button>
            </span>
        </span>
    </div>
</template>

<script setup>
import { EXPIRY_OPTIONS } from "~/utils/expiry.js";

const props = defineProps({
    modelValue: { type: Number, required: true }, // seconds (0 = never)
    label: { type: String, default: "Deletes after" },
    icon: { type: String, default: "clock" },
    // Items: { value, label, pro? } — pro options always show, but picking
    // one as a free user opens the "Go Pro" modal instead of selecting.
    options: { type: Array, default: () => EXPIRY_OPTIONS },
    // What to tell the modal when a locked option is clicked
    reason: { type: String, default: "expiry" },
});
const emit = defineEmits(["update:modelValue"]);

const { isPro } = usePremium();
const { open: openProModal } = useProModal();

const open = ref(false);
const wrap = ref(null);
const trigger = ref(null);
const menu = ref(null);

const locked = (o) => !!o.pro && !isPro.value;
const current = computed(() => props.options.find((o) => o.value === props.modelValue) || props.options[0]);

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

function pick(o) {
    if (locked(o)) {
        closeMenu(true);
        openProModal(props.reason);
        return;
    }
    if (o.value !== props.modelValue) emit("update:modelValue", o.value);
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
