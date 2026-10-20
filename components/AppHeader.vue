<template>
    <header class="sticky top-[env(safe-area-inset-top,0px)] z-40 border-b border-line bg-bg/80 px-4 backdrop-blur-xl">
        <div class="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3">
            <NuxtLink to="/" class="flex items-center gap-2 text-[16px] font-bold tracking-[-0.03em]" aria-label="TextShareNow home">
                <TsnLogo class="h-7 w-7 shrink-0" />
                TextShareNow
            </NuxtLink>

            <nav class="hidden items-center lg:flex" aria-label="Main">
                <NuxtLink v-for="l in LINKS" :key="l.to" :to="l.to" class="nav-link" exact-active-class="!text-ink">{{ l.label }}</NuxtLink>
            </nav>

            <div class="flex items-center gap-1">
                <NuxtLink
                    v-if="isPro"
                    to="/my-shares"
                    class="nav-link"
                    exact-active-class="!text-ink"
                    title="Manage your Pro shares"
                >Dashboard</NuxtLink>
                <button
                    v-else
                    type="button"
                    class="inline-flex h-9 items-center gap-1.5 rounded-full border border-brand/40 bg-brand/10 px-3 text-[13px] font-semibold text-brand transition-colors hover:bg-brand/20"
                    title="Unlock TextShareNow Pro"
                    @click="openProModal('general')"
                >
                    <span aria-hidden="true">⭐</span> Pro
                </button>
                <button type="button" class="btn-icon" :aria-label="dark ? 'Switch to light theme' : 'Switch to dark theme'" @click="toggleTheme">
                    <TsnIcon :name="dark ? 'sun' : 'moon'" class="h-[18px] w-[18px]" stroke="1.9" />
                </button>
                <NuxtLink to="/#tool" class="btn-primary hidden !h-9 sm:inline-flex">Share now</NuxtLink>
                <button
                    type="button"
                    class="btn-icon lg:hidden"
                    :aria-expanded="open"
                    aria-controls="mobile-nav"
                    :aria-label="open ? 'Close menu' : 'Open menu'"
                    @click="open = !open"
                >
                    <TsnIcon :name="open ? 'x' : 'menu'" class="h-5 w-5" stroke="1.9" />
                </button>
            </div>
        </div>

        <nav v-if="open" id="mobile-nav" class="mx-auto mb-3 max-w-6xl rounded-lg border border-line bg-bg p-1 shadow-card lg:hidden" aria-label="Mobile">
            <NuxtLink
                v-for="l in LINKS"
                :key="l.to"
                :to="l.to"
                class="nav-link block !py-2.5 !text-[15px] hover:!bg-surface-2"
            >{{ l.label }}</NuxtLink>
            <NuxtLink
                v-if="isPro"
                to="/my-shares"
                class="nav-link block !py-2.5 !text-[15px] hover:!bg-surface-2"
                exact-active-class="!text-ink"
            >Dashboard</NuxtLink>
        </nav>
    </header>
</template>

<script setup>
const LINKS = [
    { to: "/", label: "Tool" },
    { to: "/share-files-online", label: "Share Files" },
    { to: "/how-it-works", label: "How It Works" },
    { to: "/pricing", label: "Pricing" },
    { to: "/faq", label: "FAQ" },
    { to: "/blog", label: "Blog" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
];

const { isPro } = usePremium();
const { open: openProModal } = useProModal();

const open = ref(false);
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
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", readTheme);
    const onKey = (e) => e.key === "Escape" && (open.value = false);
    window.addEventListener("keydown", onKey);
    onBeforeUnmount(() => {
        mq.removeEventListener("change", readTheme);
        window.removeEventListener("keydown", onKey);
    });
});
</script>
