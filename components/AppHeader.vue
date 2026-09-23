<template>
    <header class="sticky top-[env(safe-area-inset-top,0px)] z-40 border-b border-line bg-bg/80 px-4 backdrop-blur-xl">
        <div class="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3">
            <NuxtLink to="/" class="flex items-center gap-2 text-[16px] font-bold tracking-[-0.03em]" aria-label="TextShareNow home">
                <span class="flap flap-xs !text-[13px]" aria-hidden="true">T</span>
                TextShareNow
            </NuxtLink>

            <nav class="hidden items-center md:flex" aria-label="Main">
                <NuxtLink v-for="l in LINKS" :key="l.to" :to="l.to" class="nav-link" exact-active-class="!text-ink">{{ l.label }}</NuxtLink>
            </nav>

            <div class="flex items-center gap-1">
                <span class="mr-1 hidden items-center gap-2 rounded-full border border-line px-2.5 py-0.5 text-[12px] font-medium text-muted lg:inline-flex" role="status">
                    <i class="live-dot" :class="{ off: !online }" aria-hidden="true" />{{ online ? "Online" : "Offline" }}
                </span>
                <button type="button" class="btn-icon" :aria-label="dark ? 'Switch to light theme' : 'Switch to dark theme'" @click="toggleTheme">
                    <TsnIcon :name="dark ? 'sun' : 'moon'" class="h-[18px] w-[18px]" stroke="1.9" />
                </button>
                <NuxtLink to="/#tool" class="btn-primary hidden !h-9 sm:inline-flex">Share now</NuxtLink>
                <button
                    type="button"
                    class="btn-icon md:hidden"
                    :aria-expanded="open"
                    aria-controls="mobile-nav"
                    :aria-label="open ? 'Close menu' : 'Open menu'"
                    @click="open = !open"
                >
                    <TsnIcon :name="open ? 'x' : 'menu'" class="h-5 w-5" stroke="1.9" />
                </button>
            </div>
        </div>

        <nav v-if="open" id="mobile-nav" class="mx-auto mb-3 max-w-6xl rounded-lg border border-line bg-bg p-1 shadow-card md:hidden" aria-label="Mobile">
            <NuxtLink
                v-for="l in LINKS"
                :key="l.to"
                :to="l.to"
                class="nav-link block !py-2.5 !text-[15px] hover:!bg-surface-2"
            >{{ l.label }}</NuxtLink>
        </nav>
    </header>
</template>

<script setup>
const LINKS = [
    { to: "/", label: "Tool" },
    { to: "/how-it-works", label: "How It Works" },
    { to: "/faq", label: "FAQ" },
    { to: "/blog", label: "Blog" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
];

const open = ref(false);
const online = ref(true);
const dark = ref(false);

const route = useRoute();
watch(() => route.fullPath, () => (open.value = false));

function readTheme() {
    const t = document.documentElement.dataset.theme;
    dark.value = t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function toggleTheme() {
    const next = dark.value ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("tsn-theme", next); } catch {}
    dark.value = next === "dark";
}

onMounted(() => {
    readTheme();
    const net = () => (online.value = navigator.onLine);
    net();
    window.addEventListener("online", net);
    window.addEventListener("offline", net);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", readTheme);
    const onKey = (e) => e.key === "Escape" && (open.value = false);
    window.addEventListener("keydown", onKey);
    onBeforeUnmount(() => {
        mq.removeEventListener("change", readTheme);
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("online", net);
        window.removeEventListener("offline", net);
    });
});
</script>
