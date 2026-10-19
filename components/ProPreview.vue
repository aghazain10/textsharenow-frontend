<template>
    <!-- Decorative preview of the Pro send form — not interactive. -->
    <div class="relative w-full max-w-[460px]" aria-hidden="true">
        <div class="overflow-hidden rounded-xl border border-line bg-surface shadow-card">
            <!-- Window chrome -->
            <div class="flex items-center gap-1.5 border-b border-line bg-surface-2/60 px-4 py-3">
                <span class="h-2.5 w-2.5 rounded-full bg-line" />
                <span class="h-2.5 w-2.5 rounded-full bg-line" />
                <span class="h-2.5 w-2.5 rounded-full bg-line" />
                <span class="ml-2 text-[12px] font-medium text-muted">TextShareNow</span>
                <span class="ml-auto inline-flex items-center gap-1 rounded-full border border-brand/40 bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand">
                    <TsnIcon name="lock" class="h-3 w-3" stroke="2.2" />Pro
                </span>
            </div>

            <!-- Editor -->
            <div class="px-5 pt-5">
                <div class="space-y-2.5">
                    <div class="h-3 w-[92%] rounded-full bg-line/80" />
                    <div class="h-3 w-[78%] rounded-full bg-line/80" />
                    <div class="h-3 w-[85%] rounded-full bg-line/80" />
                    <div class="h-3 w-[40%] rounded-full bg-line/60" />
                </div>
                <p class="mt-4 text-right text-[12px] tabular-nums text-muted">84,210 / 100,000</p>
            </div>

            <!-- Pro controls -->
            <div class="mt-4 flex flex-wrap gap-2 border-t border-line px-5 py-3.5">
                <span
                    v-for="c in CONTROLS"
                    :key="c.label"
                    class="inline-flex items-center gap-1.5 rounded-md border border-line bg-bg px-2.5 py-1 text-[12px] font-medium text-ink"
                >
                    <TsnIcon :name="c.icon" class="h-3.5 w-3.5 text-muted" stroke="1.8" />{{ c.label }}
                    <span v-if="c.ok" class="text-[10px] font-semibold text-ok">free</span>
                </span>
            </div>

            <!-- Action -->
            <div class="flex items-center gap-3 border-t border-line px-5 py-3.5">
                <span class="text-[12px] text-muted">Expires in 7 days</span>
                <span class="ml-auto rounded-md bg-brand px-3.5 py-1.5 text-[13px] font-medium text-on-brand">Generate code</span>
            </div>
        </div>
        <p class="mt-3 text-center text-[12px] text-muted">Pro controls unlock the moment you paste your license key.</p>
    </div>
</template>

<script setup>
const CONTROLS = [
    { icon: "clock", label: "7 days" },
    { icon: "eye", label: "10 reads" },
    { icon: "lock", label: "Password" },
    { icon: "link", label: "coffee-menu", ok: true },
];
</script>
