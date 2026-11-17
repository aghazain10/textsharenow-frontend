<template>
    <section class="section border-y border-line bg-surface-2/40" aria-labelledby="req-title">
        <div class="wrap grid min-w-0 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
            <div class="min-w-0">
                <span class="inline-flex items-center gap-2 rounded-full border border-line bg-bg px-3 py-1 text-[13px] font-medium text-ink shadow-card">
                    <i class="live-dot" aria-hidden="true" />New — Incoming requests
                </span>
                <h2 id="req-title" class="section-title mt-5">Need something from someone?</h2>
                <p class="section-lead">
                    Ask once — get a link — send it anywhere (text, email, Slack, wherever). They reply with text or a file, no account, no app, no login. You open your private link and see everything the moment it lands.
                </p>
                <ul class="mt-6 grid gap-2.5 text-[15px] text-ink">
                    <li v-for="f in points" :key="f" class="flex items-start gap-2.5">
                        <span class="mt-0.5 grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full bg-brand-soft"><TsnIcon name="check" class="h-3 w-3" stroke="3" /></span>
                        {{ f }}
                    </li>
                </ul>
                <p class="mt-5 text-[13px] text-muted">Free: 3 links per day · 5 replies each · 48h expiry · files need Pro. Pro adds file attachments, longer expiry, labels and an email the moment something arrives.</p>
            </div>

            <div class="tile relative min-w-0">
                <h3 class="text-[17px] font-semibold tracking-[-0.02em] text-ink">Create your private request link</h3>

                <template v-if="state === 'idle'">
                    <p class="mt-2 text-[15px] leading-relaxed text-muted">Pick a destination for what arrives — your clipboard, this tab, your phone — send the link, and collect it when it's ready.</p>
                    <button type="button" class="btn-primary mt-5 w-full" :disabled="busy" @click="create">
                        {{ busy ? "Creating…" : "Create my request link" }}
                    </button>
                    <p v-if="error" class="mt-3 flex items-center gap-2 text-[13px] text-bad" role="alert"><TsnIcon name="alert" class="h-4 w-4 shrink-0" stroke="1.8" />{{ error }}</p>
                    <p class="mt-3 text-[12px] text-muted">Your submissions are encrypted at rest; only your private link can read them.</p>
                </template>

                <template v-else>
                    <p class="mt-2 text-[15px] leading-relaxed text-muted">Your request link is ready — paste it anywhere you want the answer to arrive.</p>

                    <!-- Share link (them) -->
                    <p class="mt-4 text-[13px] font-medium text-muted">For them — send this anywhere</p>
                    <div class="mt-1 flex flex-col gap-2 rounded-lg border border-line bg-bg p-2 sm:flex-row sm:items-center sm:gap-2">
                        <code class="block min-w-0 break-all flex-1 px-2 py-1.5 font-mono text-[12px] leading-5 text-ink sm:text-[13px]">{{ shareLink }}</code>
                        <button type="button" class="btn-ghost h-10 w-full shrink-0 text-[14px] sm:h-9 sm:w-auto sm:text-[13px]" :aria-label="copied === 'share' ? 'Copied' : 'Copy request link'" @click="copy('share', shareLink)">
                            <TsnIcon :name="copied === 'share' ? 'check' : 'copy'" class="h-4 w-4" stroke="2" />{{ copied === 'share' ? "Copied" : "Copy link" }}
                        </button>
                    </div>

                    <!-- Private link (you) -->
                    <p class="mt-4 text-[13px] font-medium text-muted">For you — opens the answers</p>
                    <div class="mt-1 flex flex-col gap-2 rounded-lg border border-brand/40 bg-brand-soft/30 p-2 sm:flex-row sm:items-center sm:gap-2">
                        <code class="block min-w-0 break-all flex-1 px-2 py-1.5 font-mono text-[12px] leading-5 text-ink sm:text-[13px]">{{ privateLink }}</code>
                        <button type="button" class="btn-primary h-10 w-full shrink-0 text-[14px] sm:h-9 sm:w-auto sm:text-[13px]" :aria-label="copied === 'private' ? 'Copied' : 'Copy private link'" @click="copy('private', privateLink)">
                            <TsnIcon :name="copied === 'private' ? 'check' : 'copy'" class="h-4 w-4" stroke="2" />{{ copied === 'private' ? "Copied" : "Copy link" }}
                        </button>
                    </div>
                    <p class="mt-2 text-[13px] leading-relaxed text-muted">Keep the private link to yourself — it shows everything that arrives. The "send this" link is safe to paste in chat.</p>

                    <NuxtLink :to="`/request/${encodeURIComponent(code)}#m=${manageToken}`" class="btn-ghost mt-4 w-full">Open my private inbox</NuxtLink>
                    <button type="button" class="mt-2 w-full rounded-md py-2 text-[13px] font-medium text-muted transition-colors hover:text-ink" @click="reset">Create another</button>
                </template>
            </div>
        </div>
    </section>
</template>

<script setup>
const API_BASE = useRuntimeConfig().public.API_BASE;

const points = [
    "Works for text, links, addresses, passwords and one-time secrets",
    "No account for either side — not even yours",
    "3 links per day · 5 replies each — free, forever; upgrade for files and volume",
    "Everything received is encrypted and only your private link can read it",
];

const state = ref("idle"); // idle | done
const busy = ref(false);
const error = ref("");
const code = ref("");
const manageToken = ref("");
const copied = ref("");

const origin = () => (typeof window === "undefined" ? "https://www.textsharenow.com" : window.location.origin);
const shareLink = computed(() => `${origin()}/request/${encodeURIComponent(code.value)}`);
const privateLink = computed(() => `${origin()}/request/${encodeURIComponent(code.value)}#m=${manageToken.value}`);

// Persist the private manage token for this browser so re-opening the page
// restores the inbox view without the fragment.
function persist() {
    try {
        const key = "tsn-request-" + code.value;
        localStorage.setItem(key, manageToken.value);
        localStorage.setItem(`${key}:exp`, String(Date.now() + 25 * 3600 * 1000));
    } catch {}
}

async function create() {
    if (busy.value) return;
    busy.value = true;
    error.value = "";
    try {
        const res = await $fetch(`${API_BASE}/api/request/create`, {
            method: "POST",
            body: {},
        });
        code.value = res.code;
        manageToken.value = res.manage;
        state.value = "done";
        persist();
    } catch (e) {
        error.value = e?.data?.message || "Couldn't create a link just now. Try again.";
    } finally {
        busy.value = false;
    }
}

function reset() {
    state.value = "idle";
    copied.value = "";
    error.value = "";
}

async function copy(which, text) {
    try {
        await navigator.clipboard.writeText(text);
        copied.value = which;
        setTimeout(() => {
            if (copied.value === which) copied.value = "";
        }, 1600);
    } catch {
        error.value = "Couldn't copy — use the other button instead.";
    }
}
</script>
