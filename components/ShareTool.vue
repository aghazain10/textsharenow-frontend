<template>
    <div id="tool" class="tool-glow mx-auto rounded-xl border border-line bg-surface p-3 text-left sm:p-4" :class="wide ? 'max-w-5xl' : 'max-w-3xl'">
        <div class="relative grid grid-cols-3 rounded-lg bg-surface-2 p-1 sm:max-w-md" role="tablist" aria-label="Choose what to do">
            <span class="seg-thumb" :style="{ transform: `translateX(${index * 100}%)` }" aria-hidden="true" />
            <button
                v-for="(t, i) in TABS"
                :id="`tab-${t.id}`"
                :key="t.id"
                ref="tabEls"
                role="tab"
                :aria-controls="`panel-${t.id}`"
                :aria-selected="tab === t.id"
                :tabindex="tab === t.id ? 0 : -1"
                class="relative z-10 rounded-md px-2 py-1.5 text-[14px] font-medium transition-colors"
                :class="tab === t.id ? 'text-ink' : 'text-muted'"
                @click="tab = t.id"
                @keydown.right.prevent="move(i, 1)"
                @keydown.left.prevent="move(i, -1)"
            >
                {{ t.label }}
            </button>
        </div>

        <div v-show="tab === 'text'" id="panel-text" role="tabpanel" aria-labelledby="tab-text" class="mt-3">
            <SendText />
        </div>
        <div v-show="tab === 'files'" id="panel-files" role="tabpanel" aria-labelledby="tab-files" class="mt-3">
            <SendFile ref="sender" />
        </div>
        <div v-show="tab === 'receive'" id="panel-receive" role="tabpanel" aria-labelledby="tab-receive" class="mt-3">
            <ReceiveCode ref="receiver" :initial-code="initialCode" :initial-kind="initialKind" />
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    initialTab: { type: String, default: "text" }, // "text" | "files" | "receive"
    initialCode: { type: String, default: "" },
    initialKind: { type: String, default: "" },
    wide: { type: Boolean, default: false }, // home hero uses the bigger box
});

const TABS = [
    { id: "text", label: "Send text" },
    { id: "files", label: "Send files" },
    { id: "receive", label: "Receive" },
];
const tab = ref(props.initialTab);
const tabEls = ref([]);
const receiver = ref(null);
const sender = ref(null);

// Paste a screenshot anywhere on the page: switch to Send files and pick it up
const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
function onPaste(e) {
    const item = Array.from(e.clipboardData?.items || []).find((i) => i.kind === "file" && IMAGE_TYPES.includes(i.type));
    const file = item?.getAsFile();
    if (!file) return;
    e.preventDefault();
    tab.value = "files";
    // Screenshots arrive as "image.png"; give them a clearer name
    const named = file.name && file.name !== "image.png" ? file : new File([file], `screenshot-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.${file.type.split("/")[1]}`, { type: file.type });
    nextTick(() => sender.value?.take(named));
}
onMounted(() => document.addEventListener("paste", onPaste));
onBeforeUnmount(() => document.removeEventListener("paste", onPaste));
const index = computed(() => TABS.findIndex((t) => t.id === tab.value));

watch(() => props.initialTab, (t) => (tab.value = t));
watch(tab, (t) => {
    if (t === "receive") nextTick(() => receiver.value?.focus());
});

function move(i, d) {
    const next = (i + d + TABS.length) % TABS.length;
    tab.value = TABS[next].id;
    tabEls.value[next]?.focus();
}
</script>
