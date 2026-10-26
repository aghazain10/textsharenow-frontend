<template>
    <div>
        <PageHero
            meta="Private receipt"
            title="Share receipt"
            lead="A private timeline of opens and reads for one text share. Only the Pro license that created it can see this receipt."
            :back="{ to: '/my-shares', label: 'Back to My Shares' }"
        />

        <section class="section">
            <div class="wrap max-w-3xl">
                <div v-if="!checked" class="tile flex items-center gap-3 text-[14px] text-muted">
                    <span class="h-2 w-2 animate-pulse rounded-full bg-brand" aria-hidden="true" />
                    Checking your Pro status…
                </div>

                <div v-else-if="!isPro" class="tile max-w-2xl">
                    <span class="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-2.5 py-1 text-[12px] font-semibold text-ink">
                        <TsnIcon name="lock" class="h-3 w-3" stroke="2.2" />
                        Pro feature
                    </span>
                    <h2 class="mt-4 text-[24px] font-semibold tracking-[-0.03em] text-ink">Receipts are part of Pro</h2>
                    <p class="mt-2 max-w-[54ch] text-[15px] leading-7 text-muted">
                        Activate your license key on this device to see when a share was opened, how many times it was read, and when it closed.
                    </p>
                    <div class="mt-5 flex flex-wrap gap-2">
                        <button type="button" class="btn-primary" @click="openProModal('general')">Activate Pro</button>
                        <NuxtLink to="/pricing" class="btn-ghost">See Pro features</NuxtLink>
                    </div>
                </div>

                <template v-else>
                    <p v-if="error" class="rounded-lg border border-bad/30 bg-bad-soft px-4 py-3 text-[14px] text-bad" role="alert">
                        {{ error }}
                    </p>

                    <div v-if="loading && !receipt" class="tile mt-5 flex items-center gap-3 text-[14px] text-muted">
                        <span class="h-2 w-2 animate-pulse rounded-full bg-brand" aria-hidden="true" />
                        Loading receipt…
                    </div>

                    <template v-else-if="receipt">
                        <div class="tile">
                            <div class="flex flex-wrap items-start justify-between gap-4">
                                <div class="min-w-0">
                                    <div class="flex flex-wrap items-center gap-2">
                                        <code class="font-mono text-[26px] font-semibold tracking-wide text-ink">{{ receipt.code }}</code>
                                        <span class="rounded-full border px-2.5 py-1 text-[11px] font-semibold" :class="statusClass(receipt.status)">{{ statusLabel(receipt.status) }}</span>
                                    </div>
                                    <div class="mt-2 flex flex-wrap items-center gap-2 text-[12px] text-muted">
                                        <span class="rounded-full border border-line bg-surface-2 px-2 py-0.5 font-medium">Text share</span>
                                        <span v-if="receipt.custom" class="rounded-full border border-line bg-surface-2 px-2 py-0.5 font-medium">Custom code</span>
                                        <span v-if="receipt.passwordRequired" class="inline-flex items-center gap-1 rounded-full border border-line bg-surface-2 px-2 py-0.5 font-medium">
                                            <TsnIcon name="lock" class="h-3 w-3" stroke="2" />Password
                                        </span>
                                    </div>
                                </div>
                                <TsnIcon name="receipt" class="h-8 w-8 shrink-0 text-muted" stroke="1.5" />
                            </div>

                            <div class="mt-6 grid gap-3 sm:grid-cols-3">
                                <div class="rounded-lg border border-line bg-bg px-4 py-3">
                                    <p class="text-[12px] font-medium text-muted">Opened</p>
                                    <p class="mt-1 text-[26px] font-semibold tracking-[-0.04em] text-ink">{{ receipt.opens }}</p>
                                </div>
                                <div class="rounded-lg border border-line bg-bg px-4 py-3">
                                    <p class="text-[12px] font-medium text-muted">Reads</p>
                                    <p class="mt-1 text-[26px] font-semibold tracking-[-0.04em] text-ink">{{ receipt.reads }}</p>
                                </div>
                                <div class="rounded-lg border border-line bg-bg px-4 py-3">
                                    <p class="text-[12px] font-medium text-muted">Reads left</p>
                                    <p class="mt-1 text-[26px] font-semibold tracking-[-0.04em] text-ink">{{ readsLeftText }}</p>
                                </div>
                            </div>

                            <dl class="mt-5 grid gap-x-6 gap-y-3 border-t border-line pt-5 text-[13px] sm:grid-cols-2">
                                <div class="flex items-baseline justify-between gap-4">
                                    <dt class="text-muted">Created</dt>
                                    <dd class="text-right font-medium text-ink">{{ formatDateTime(receipt.createdAt) }}</dd>
                                </div>
                                <div class="flex items-baseline justify-between gap-4">
                                    <dt class="text-muted">{{ expiryLabel }}</dt>
                                    <dd class="text-right font-medium text-ink">{{ expiryText }}</dd>
                                </div>
                                <div class="flex items-baseline justify-between gap-4">
                                    <dt class="text-muted">Read limit</dt>
                                    <dd class="text-right font-medium text-ink">{{ readLimitText }}</dd>
                                </div>
                                <div class="flex items-baseline justify-between gap-4">
                                    <dt class="text-muted">Last activity</dt>
                                    <dd class="text-right font-medium text-ink">{{ formatDateTime(receipt.lastEventAt) }}</dd>
                                </div>
                            </dl>

                            <p v-if="notice" class="mt-4 rounded-lg border border-ok/30 bg-ok/5 px-3 py-2 text-[13px] text-ok" role="status">{{ notice }}</p>

                            <div v-if="receipt.status === 'active'" class="mt-5 flex flex-wrap gap-2">
                                <button type="button" class="btn-primary !h-9 !px-3" @click="copyLink">
                                    <TsnIcon :name="copied ? 'check' : 'copy'" class="h-4 w-4" stroke="2" />
                                    {{ copied ? "Copied" : "Copy share link" }}
                                </button>
                                <button type="button" class="btn-ghost !h-9 !px-3 text-bad" @click="confirming = true">
                                    <TsnIcon name="trash" class="h-4 w-4" stroke="1.8" />Delete share
                                </button>
                            </div>

                            <div v-if="confirming" class="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface-2 px-4 py-3">
                                <p class="text-[13px] text-ink">Delete this share? The link stops working immediately, but the receipt stays for 90 days.</p>
                                <div class="flex gap-2">
                                    <button type="button" class="btn-ghost !h-8 !px-3 !text-[13px]" @click="confirming = false">Cancel</button>
                                    <button type="button" class="btn-primary !h-8 !bg-bad !px-3 !text-[13px] hover:!bg-bad/90" :disabled="removing" @click="remove">
                                        {{ removing ? "Deleting…" : "Delete" }}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="tile mt-5">
                            <div class="flex flex-wrap items-end justify-between gap-2">
                                <div>
                                    <h2 class="text-[19px] font-semibold tracking-[-0.02em] text-ink">Activity</h2>
                                    <p class="mt-1 text-[13px] text-muted">Newest events first. Times are shown in your local timezone.</p>
                                </div>
                            </div>

                            <p v-if="!events.length" class="mt-4 text-[14px] text-muted">No activity recorded yet.</p>

                            <ol v-else class="relative mt-5 space-y-5 border-l border-line pl-5">
                                <li v-for="(event, index) in events" :key="`${event.t}-${event.e}-${index}`" class="relative">
                                    <span class="absolute -left-[25px] top-1.5 grid h-2.5 w-2.5 place-items-center rounded-full border-2 border-surface" :class="eventDotClass(event)" aria-hidden="true" />
                                    <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                                        <p class="text-[14px] font-medium text-ink">{{ eventLabel(event) }}</p>
                                        <time class="text-[12px] text-muted">{{ formatDateTime(event.t) }}</time>
                                    </div>
                                    <p v-if="eventDetail(event)" class="mt-1 text-[13px] leading-5 text-muted">{{ eventDetail(event) }}</p>
                                </li>
                            </ol>
                        </div>

                        <p class="mt-5 text-[13px] leading-6 text-muted">
                            This receipt is private to your Pro license. It stores event times only — no IP address, device data, or share content. Receipts are kept for 90 days after a share closes.
                        </p>
                    </template>
                </template>
            </div>
        </section>
    </div>
</template>

<script setup>
const route = useRoute();

useSeo({
    title: "Share Receipt",
    description: "A private receipt of opens, reads, and activity for a TextShareNow Pro text share.",
    pagePath: `/receipts/${String(route.params.code || "")}`,
});
useHead({ meta: [{ name: "robots", content: "noindex, nofollow" }] });

const { isPro, checked, checkStatus } = usePremium();
const { open: openProModal } = useProModal();

const receipt = ref(null);
const events = ref([]);
const loading = ref(false);
const error = ref("");
const notice = ref("");
const confirming = ref(false);
const removing = ref(false);
const copied = ref(false);
let copiedTimer;

onMounted(async () => {
    await checkStatus();
    if (isPro.value) await load();
});

watch(isPro, (value) => {
    if (value && !receipt.value) load();
});

onBeforeUnmount(() => clearTimeout(copiedTimer));

async function load() {
    const code = String(route.params.code || "").trim();
    if (!code || loading.value) return;
    loading.value = true;
    error.value = "";
    try {
        const res = await $fetch(`/api/pro/receipts/${encodeURIComponent(code)}`);
        receipt.value = res?.receipt || null;
        events.value = Array.isArray(res?.events) ? res.events : [];
    } catch (e) {
        const status = e?.status ?? e?.response?.status;
        if (status === 404) {
            error.value = "Receipt not found. It may have expired and passed the 90-day retention window.";
        } else if (status === 403) {
            error.value = e?.data?.message || "This receipt belongs to a different Pro license.";
        } else {
            error.value = e?.data?.message || "Could not load this receipt. Please try again.";
        }
        receipt.value = null;
        events.value = [];
    } finally {
        loading.value = false;
    }
}

const statusLabel = (status) => {
    if (status === "exhausted") return "Read limit reached";
    if (status === "deleted") return "Deleted";
    if (status === "expired") return "Expired";
    return "Active";
};

const statusClass = (status) => {
    if (status === "deleted") return "border-bad/30 bg-bad/5 text-bad";
    if (status === "exhausted") return "border-line bg-surface-2 text-ink";
    return "border-line bg-surface-2 text-muted";
};

const readsLeftText = computed(() => {
    if (!receipt.value) return "—";
    if (receipt.value.status !== "active") return receipt.value.maxReads === 0 ? "—" : "0";
    if (receipt.value.maxReads === 0) return "Unlimited";
    return String(receipt.value.readsLeft ?? 0);
});

const readLimitText = computed(() => {
    const limit = receipt.value?.maxReads;
    if (limit === 0) return "Unlimited";
    return `${limit} read${limit === 1 ? "" : "s"}`;
});

const expiryLabel = computed(() => {
    if (!receipt.value) return "Expiry";
    if (receipt.value.status === "deleted" || receipt.value.status === "exhausted") return "Closed";
    if (receipt.value.status === "expired") return "Expired";
    return receipt.value.expiresAt ? "Expires" : "Expiry";
});

const expiryText = computed(() => {
    if (!receipt.value) return "—";
    if (receipt.value.status === "deleted" || receipt.value.status === "exhausted") {
        return formatDateTime(receipt.value.lastEventAt);
    }
    if (!receipt.value.expiresAt) return "Never expires";
    return formatDateTime(receipt.value.expiresAt);
});

function formatDateTime(value) {
    if (!value) return "—";
    const date = new Date(Number(value) * 1000);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

function eventLabel(event) {
    if (event.e === "created") return "Receipt created";
    if (event.e === "opened") return "Share opened";
    if (event.e === "read") return "Text read";
    if (event.e === "exhausted") return "Read limit reached";
    if (event.e === "deleted") return event.reason === "password" ? "Deleted after too many password attempts" : "Share deleted";
    return "Activity";
}

function eventDetail(event) {
    if (event.e === "created" && event.m !== undefined) {
        if (event.m === 0) return "Unlimited reads allowed.";
        return `${event.m} read${event.m === 1 ? "" : "s"} allowed.`;
    }
    if (event.e === "read") {
        if (event.m === 0) return "Read on an unlimited-read share.";
        if (event.r === 0) return "This was the final allowed read.";
        if (typeof event.r === "number") return `${event.r} read${event.r === 1 ? "" : "s"} left after this.`;
    }
    if (event.e === "exhausted") return "The share was removed after its final read.";
    return "";
}

function eventDotClass(event) {
    if (event.e === "read") return "bg-ok";
    if (event.e === "opened") return "bg-brand";
    if (event.e === "deleted" || event.e === "exhausted") return "bg-bad";
    return "bg-muted";
}

async function copyLink() {
    if (!receipt.value) return;
    try {
        await navigator.clipboard.writeText(`${window.location.origin}/r?code=${encodeURIComponent(receipt.value.code)}`);
        copied.value = true;
        clearTimeout(copiedTimer);
        copiedTimer = setTimeout(() => (copied.value = false), 1600);
    } catch {
        error.value = "Could not copy the link. Open the share page and copy it from the address bar.";
    }
}

async function remove() {
    if (!receipt.value || removing.value) return;
    removing.value = true;
    error.value = "";
    try {
        await $fetch(`/api/share/${encodeURIComponent(receipt.value.code)}`, { method: "DELETE" });
        confirming.value = false;
        notice.value = "Share deleted. The receipt will remain for 90 days.";
        await load();
    } catch (e) {
        error.value = e?.data?.message || "Could not delete that share. Please try again.";
    } finally {
        removing.value = false;
    }
}
</script>
