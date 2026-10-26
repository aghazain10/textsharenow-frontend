<template>
    <div>
        <PageHero
            meta="Pro dashboard"
            title="My shares"
            lead="Manage the text shares and multi-file transfers created with your Pro license. See what is still live, open a private receipt for opens and reads, copy a link, or delete it. No account needed — your license key is the credential."
        />

        <section class="section">
            <div class="wrap">
                <div v-if="!checked" class="tile flex items-center gap-3 text-[14px] text-muted">
                    <span class="h-2 w-2 animate-pulse rounded-full bg-brand" aria-hidden="true" />
                    Checking your Pro status…
                </div>

                <div v-else-if="!isPro" class="tile max-w-2xl">
                    <span class="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-2.5 py-1 text-[12px] font-semibold text-ink">
                        <TsnIcon name="lock" class="h-3 w-3" stroke="2.2" />
                        Pro feature
                    </span>
                    <h2 class="mt-4 text-[24px] font-semibold tracking-[-0.03em] text-ink">My Shares is part of Pro</h2>
                    <p class="mt-2 max-w-[54ch] text-[15px] leading-7 text-muted">
                        Activate your license key on this device to see active shares, check how many reads are left, and remove links you no longer need.
                    </p>
                    <div class="mt-5 flex flex-wrap gap-2">
                        <button type="button" class="btn-primary" @click="openProModal('general')">Activate Pro</button>
                        <NuxtLink to="/pricing" class="btn-ghost">See Pro features</NuxtLink>
                    </div>
                </div>

                <template v-else>
                    <div class="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h2 class="text-[26px] font-semibold tracking-[-0.03em] text-ink">Active shares</h2>
                            <p class="mt-1 text-[14px] text-muted">
                                {{ shares.length }} active · links disappear automatically when they expire, are read, or are downloaded
                            </p>
                        </div>
                        <div class="flex flex-wrap gap-2">
                            <button type="button" class="btn-ghost" :disabled="loading" @click="load">
                                {{ loading ? "Refreshing…" : "Refresh" }}
                            </button>
                            <NuxtLink to="/" class="btn-primary">New share</NuxtLink>
                        </div>
                    </div>

                    <p v-if="error" class="mt-5 rounded-lg border border-bad/30 bg-bad/5 px-4 py-3 text-[14px] text-bad" role="alert">
                        {{ error }}
                    </p>
                    <p v-if="notice" class="mt-5 rounded-lg border border-ok/30 bg-ok/5 px-4 py-3 text-[14px] text-ok" role="status">
                        {{ notice }}
                    </p>

                    <div v-if="loading && !shares.length" class="tile mt-6 flex items-center gap-3 text-[14px] text-muted">
                        <span class="h-2 w-2 animate-pulse rounded-full bg-brand" aria-hidden="true" />
                        Loading your shares…
                    </div>

                    <div v-else-if="!shares.length" class="tile mt-6 flex flex-col items-center py-14 text-center">
                        <span class="grid h-12 w-12 place-items-center rounded-lg border border-line bg-bg text-ink">
                            <TsnIcon name="link" class="h-6 w-6" stroke="1.8" />
                        </span>
                        <h3 class="mt-4 text-[19px] font-semibold tracking-[-0.02em] text-ink">No active shares</h3>
                        <p class="mt-2 max-w-[42ch] text-[14px] leading-6 text-muted">
                            Text shares and multi-file transfers you create while Pro is active will appear here until they expire or are deleted.
                        </p>
                        <NuxtLink to="/" class="btn-primary mt-5">Create a share</NuxtLink>
                    </div>

                    <ul v-else class="mt-6 grid gap-3">
                        <li v-for="s in shares" :key="s.code" class="tile overflow-hidden !p-0">
                            <div class="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                                <div class="min-w-0">
                                    <div class="flex flex-wrap items-center gap-2">
                                        <code class="font-mono text-[17px] font-semibold tracking-wide text-ink">{{ s.code }}</code>
                                        <span v-if="s.kind === 'transfer'" class="rounded-full border border-line bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted">Files</span>
                                        <span v-if="s.custom" class="rounded-full border border-line bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted">Custom</span>
                                        <span v-if="s.passwordRequired" class="inline-flex items-center gap-1 rounded-full border border-line bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted">
                                            <TsnIcon name="lock" class="h-3 w-3" stroke="2" />Password
                                        </span>
                                    </div>
                                    <div class="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted">
                                        <span class="inline-flex items-center gap-1.5">
                                            <TsnIcon name="clock" class="h-3.5 w-3.5" stroke="1.8" />{{ expiryText(s) }}
                                        </span>
                                        <span class="inline-flex items-center gap-1.5">
                                            <TsnIcon :name="s.kind === 'transfer' ? 'file' : 'eye'" class="h-3.5 w-3.5" stroke="1.8" />{{ readsText(s) }}
                                        </span>
                                        <span v-if="s.receipt" class="inline-flex items-center gap-1.5">
                                            <TsnIcon name="receipt" class="h-3.5 w-3.5" stroke="1.8" />{{ activityText(s) }}
                                        </span>
                                    </div>
                                </div>
                                <div class="flex shrink-0 flex-wrap items-center gap-2">
                                    <NuxtLink v-if="s.receipt" :to="`/receipts/${encodeURIComponent(s.code)}`" class="btn-ghost !h-9 !px-3">
                                        <TsnIcon name="receipt" class="h-4 w-4" stroke="1.8" />
                                        Receipt
                                    </NuxtLink>
                                    <button type="button" class="btn-ghost !h-9 !px-3" @click="copyLink(s)">
                                        <TsnIcon :name="copied === s.code ? 'check' : 'copy'" class="h-4 w-4" stroke="2" />
                                        {{ copied === s.code ? "Copied" : "Copy link" }}
                                    </button>
                                    <button
                                        type="button"
                                        class="btn-icon text-muted hover:!text-bad"
                                        :aria-label="`Delete ${s.kind === 'transfer' ? 'transfer' : 'share'} ${s.code}`"
                                        @click="confirming = s.code"
                                    >
                                        <TsnIcon name="trash" class="h-4 w-4" stroke="1.8" />
                                    </button>
                                </div>
                            </div>

                            <div v-if="confirming === s.code" class="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface-2 px-5 py-3">
                                <p class="text-[13px] text-ink">{{ s.kind === "transfer" ? "Delete this transfer? The link stops working and all remaining files are removed." : "Delete this share? The link stops working immediately." }}</p>
                                <div class="flex gap-2">
                                    <button type="button" class="btn-ghost !h-8 !px-3 !text-[13px]" @click="confirming = ''">Cancel</button>
                                    <button type="button" class="btn-primary !h-8 !bg-bad !px-3 !text-[13px] hover:!bg-bad/90" @click="remove(s)">Delete</button>
                                </div>
                            </div>
                        </li>
                    </ul>

                    <p v-if="truncated" class="mt-4 text-[13px] text-muted">
                        Showing the first 100 shares on this license.
                    </p>

                    <section v-if="history.length" class="mt-10">
                        <div class="flex flex-wrap items-end justify-between gap-3">
                            <div>
                                <h2 class="text-[22px] font-semibold tracking-[-0.03em] text-ink">Receipt history</h2>
                                <p class="mt-1 text-[14px] text-muted">Expired, used-up, and deleted text shares from the last 90 days.</p>
                            </div>
                        </div>
                        <ul class="mt-4 grid gap-2">
                            <li v-for="r in history" :key="r.code" class="flex flex-col gap-3 rounded-lg border border-line bg-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                                <div class="min-w-0">
                                    <div class="flex flex-wrap items-center gap-2">
                                        <code class="font-mono text-[15px] font-semibold tracking-wide text-ink">{{ r.code }}</code>
                                        <span class="rounded-full border px-2 py-0.5 text-[11px] font-medium" :class="statusClass(r.status)">{{ statusLabel(r.status) }}</span>
                                        <span v-if="r.passwordRequired" class="inline-flex items-center gap-1 rounded-full border border-line bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted">
                                            <TsnIcon name="lock" class="h-3 w-3" stroke="2" />Password
                                        </span>
                                    </div>
                                    <p class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted">
                                        <span>{{ activityText(r) }}</span>
                                        <span>{{ formatDate(r.createdAt) }}</span>
                                    </p>
                                </div>
                                <NuxtLink :to="`/receipts/${encodeURIComponent(r.code)}`" class="btn-ghost !h-9 shrink-0 !px-3">
                                    <TsnIcon name="receipt" class="h-4 w-4" stroke="1.8" />View receipt
                                </NuxtLink>
                            </li>
                        </ul>
                    </section>

                    <div class="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5 text-[13px] text-muted">
                        <p>Text shares and multi-file transfers created with this license appear here. Single-file links are not listed yet. Receipts store event times only and are kept for 90 days after a share closes.</p>
                        <button type="button" class="font-medium text-muted underline decoration-line underline-offset-4 hover:text-ink" @click="deactivatePro">
                            Deactivate Pro on this device
                        </button>
                    </div>
                </template>
            </div>
        </section>
    </div>
</template>

<script setup>
useSeo({
    title: "My Shares",
    description: "Manage text shares and multi-file transfers, and view private open and read receipts for your TextShareNow Pro license.",
    pagePath: "/my-shares",
});
useHead({ meta: [{ name: "robots", content: "noindex, nofollow" }] });

const { isPro, checked, checkStatus, deactivate } = usePremium();
const { open: openProModal } = useProModal();

const shares = ref([]);
const receipts = ref([]);
const loading = ref(false);
const error = ref("");
const notice = ref("");
const truncated = ref(false);
const copied = ref("");
const confirming = ref("");
let noticeTimer;

const history = computed(() => {
    const active = new Set(shares.value.map((s) => s.code));
    return receipts.value.filter((r) => r.status !== "active" && !active.has(r.code));
});

onMounted(async () => {
    await checkStatus();
    if (isPro.value) await load();
});

watch(isPro, (value) => {
    if (value && !shares.value.length && !loading.value) load();
});

onBeforeUnmount(() => clearTimeout(noticeTimer));

async function load() {
    if (loading.value) return;
    loading.value = true;
    error.value = "";
    const [sharesResult, receiptsResult] = await Promise.allSettled([
        $fetch("/api/pro/shares"),
        $fetch("/api/pro/receipts"),
    ]);
    if (sharesResult.status === "fulfilled") {
        shares.value = sharesResult.value?.shares || [];
        truncated.value = !!sharesResult.value?.truncated;
    } else {
        error.value = sharesResult.reason?.data?.message || "Could not load your shares. Please try again.";
    }
    receipts.value = receiptsResult.status === "fulfilled" ? receiptsResult.value?.receipts || [] : [];
    loading.value = false;
}

async function loadReceipts() {
    try {
        const res = await $fetch("/api/pro/receipts");
        receipts.value = res?.receipts || [];
    } catch {
        // The live-share list still works if the receipt index is unavailable.
    }
}

function shareUrl(s) {
    const param = s.kind === "transfer" ? "tcode" : "code";
    return `${window.location.origin}/r?${param}=${encodeURIComponent(s.code)}`;
}

async function copyLink(s) {
    try {
        await navigator.clipboard.writeText(shareUrl(s));
        copied.value = s.code;
        setTimeout(() => {
            if (copied.value === s.code) copied.value = "";
        }, 1600);
    } catch {
        error.value = "Could not copy the link. Open the share page and copy it from the address bar.";
    }
}

function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
}

function expiryText(s) {
    if (s.ttl === null) return "Never expires";
    if (s.ttl <= 0) return "Expiring now";
    const days = Math.floor(s.ttl / 86400);
    const hours = Math.floor((s.ttl % 86400) / 3600);
    const minutes = Math.max(1, Math.floor((s.ttl % 3600) / 60));
    if (days) return `Expires in ${days}d ${hours}h`;
    if (hours) return `Expires in ${hours}h ${minutes}m`;
    return `Expires in ${minutes}m`;
}

function readsText(s) {
    if (s.kind === "transfer") return `${s.fileCount} file${s.fileCount === 1 ? "" : "s"} · ${formatBytes(Number(s.bytes) || 0)}`;
    if (s.maxReads === 0 || s.readsLeft === null) return "Unlimited reads";
    if (s.readsLeft === 0) return "No reads left";
    return s.readsLeft === 1 ? "1 read left" : `${s.readsLeft} reads left`;
}

function activityText(item) {
    const opens = Number(item.opens) || 0;
    const reads = Number(item.reads) || 0;
    return `${opens} open${opens === 1 ? "" : "s"} · ${reads} read${reads === 1 ? "" : "s"}`;
}

function statusLabel(status) {
    if (status === "exhausted") return "Read limit reached";
    if (status === "deleted") return "Deleted";
    if (status === "expired") return "Expired";
    return "Active";
}

function statusClass(status) {
    if (status === "deleted") return "border-bad/30 bg-bad/5 text-bad";
    if (status === "exhausted") return "border-line bg-surface-2 text-ink";
    return "border-line bg-surface-2 text-muted";
}

function formatDate(value) {
    if (!value) return "";
    const date = new Date(Number(value) * 1000);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

async function remove(share) {
    confirming.value = "";
    const code = share.code;
    const before = shares.value;
    shares.value = shares.value.filter((s) => s.code !== code);
    try {
        const endpoint = share.kind === "transfer" ? "/api/pro/transfers" : "/api/share";
        await $fetch(`${endpoint}/${encodeURIComponent(code)}`, { method: "DELETE" });
        notice.value = `${share.kind === "transfer" ? "Transfer" : "Share"} ${code} deleted.`;
        clearTimeout(noticeTimer);
        noticeTimer = setTimeout(() => (notice.value = ""), 4000);
        if (share.kind === "text") await loadReceipts();
    } catch (e) {
        shares.value = before;
        error.value = e?.data?.message || "Could not delete that share. Please try again.";
    }
}

async function deactivatePro() {
    await deactivate();
    shares.value = [];
    receipts.value = [];
}
</script>
