<template>
    <section id="features" class="section" aria-labelledby="features-title">
        <div class="wrap">
            <div class="max-w-2xl">
                <p class="text-[13px] font-medium text-muted">Why TextShareNow</p>
                <h2 id="features-title" class="section-title mt-3">Built for Speed</h2>
                <p class="section-lead">Every decision in this tool is designed to save you time and protect your privacy.</p>
            </div>

            <div class="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <!-- Works Both Ways (wide) -->
                <article class="tile overflow-hidden md:col-span-2">
                    <h3 class="text-[22px] font-semibold tracking-[-0.03em]">Works Both Ways</h3>
                    <p class="mt-2 max-w-[46ch] text-muted">Mobile to desktop, desktop to mobile — the short code works in any direction.</p>
                    <div class="mt-8 flex items-center justify-between gap-2 sm:gap-5" aria-hidden="true">
                        <div class="flex shrink-0 items-center gap-2.5 rounded-lg border border-line bg-surface-2/60 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
                            <TsnIcon name="phone" class="h-7 w-7 text-ink" stroke="1.8" />
                            <div><p class="text-[14px] font-semibold">Phone</p><p class="text-[12px] text-muted">Mobile data</p></div>
                        </div>
                        <svg class="hidden h-6 min-w-0 flex-1 sm:block" viewBox="0 0 200 24" preserveAspectRatio="none"><line class="wire" x1="0" y1="12" x2="200" y2="12" stroke="var(--muted)" stroke-width="1.5" /></svg>
                        <span class="flap flap-sm hidden shrink-0 !text-[15px] sm:inline-grid">K7</span>
                        <TsnIcon name="swap" class="h-5 w-5 shrink-0 text-muted sm:hidden" stroke="1.8" />
                        <svg class="hidden h-6 min-w-0 flex-1 sm:block" viewBox="0 0 200 24" preserveAspectRatio="none"><line class="wire" x1="0" y1="12" x2="200" y2="12" stroke="var(--muted)" stroke-width="1.5" /></svg>
                        <div class="flex shrink-0 items-center gap-2.5 rounded-lg border border-line bg-surface-2/60 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
                            <TsnIcon name="laptop" class="h-7 w-7 text-ink" stroke="1.8" />
                            <div><p class="text-[14px] font-semibold">Laptop</p><p class="text-[12px] text-muted">Wi‑Fi</p></div>
                        </div>
                    </div>
                </article>

                <!-- Under 10 Seconds -->
                <article class="tile">
                    <div class="flex items-start justify-between gap-4">
                        <h3 class="text-[22px] font-semibold tracking-[-0.03em]">Under 10 Seconds</h3>
                        <svg class="timer-ring h-12 w-12 shrink-0" viewBox="0 0 44 44" aria-hidden="true"><circle class="track" cx="22" cy="22" r="18" /><circle class="bar" cx="22" cy="22" r="18" stroke-dasharray="113.1" stroke-dashoffset="34" /></svg>
                    </div>
                    <p class="mt-2 text-muted">From paste to retrieve in less time than it takes to open your email app.</p>
                </article>

                <!-- Auto-Delete Privacy -->
                <article class="tile">
                    <h3 class="text-[22px] font-semibold tracking-[-0.03em]">Auto-Delete Privacy</h3>
                    <p class="mt-2 text-muted">Text is permanently deleted from our servers after first read or 10 minutes.</p>
                    <div class="relative mt-6 flex w-fit gap-1" aria-hidden="true">
                        <span v-for="c in 'K7Q2P'" :key="c" class="flap flap-xs !text-[13px]">{{ c }}</span>
                        <span class="stamp absolute -right-5 -top-3 rounded-md border border-ink bg-bg px-1.5 py-0.5 text-[11px] font-semibold text-ink shadow-card">Used</span>
                    </div>
                </article>

                <!-- No App Required (wide, dark) -->
                <article class="tile !border-brand !bg-brand text-on-brand md:col-span-2">
                    <h3 class="text-[22px] font-semibold tracking-[-0.03em]">No App Required</h3>
                    <p class="mt-2 opacity-85">Pure web-based. Open a browser on any device — that's all you need.</p>
                    <ul class="mt-6 flex flex-wrap gap-2 text-[14px] font-medium" aria-label="Works on">
                        <li v-for="d in DEVICES" :key="d" class="rounded-md border border-on-brand/20 px-2.5 py-1">{{ d }}</li>
                    </ul>
                </article>

                <!-- Completely Free -->
                <article class="tile">
                    <p class="text-[40px] font-bold leading-none tracking-[-0.05em]" aria-hidden="true">$0</p>
                    <h3 class="mt-4 text-[22px] font-semibold tracking-[-0.03em]">Completely Free</h3>
                    <p class="mt-2 text-muted">No subscription, no credits, no hidden fees. Free for everyday use.</p>
                </article>

                <!-- No Account Needed -->
                <article class="tile">
                    <span class="grid h-10 w-10 place-items-center rounded-md border border-line bg-surface-2/60" aria-hidden="true"><TsnIcon name="user-x" class="h-5 w-5" stroke="1.8" /></span>
                    <h3 class="mt-4 text-[22px] font-semibold tracking-[-0.03em]">No Account Needed</h3>
                    <p class="mt-2 text-muted">Zero sign-up. No email, no password. Open, share, done.</p>
                </article>
            </div>

            <!-- Comparison -->
            <div class="mt-20 max-w-2xl">
                <p class="text-[13px] font-medium text-muted">Comparison</p>
                <h3 class="section-title mt-3">How We Stack Up</h3>
            </div>
            <div class="mt-10 overflow-x-auto rounded-xl border border-line bg-surface shadow-card">
                <table class="w-full min-w-[680px] border-collapse text-left text-[15px]" aria-label="Feature comparison">
                    <thead>
                        <tr>
                            <th scope="col" class="px-6 py-5 font-medium text-muted">Feature</th>
                            <th scope="col" class="bg-surface-2 px-6 py-5 font-semibold text-ink">TextShareNow</th>
                            <th scope="col" class="px-6 py-5 font-semibold">Email Yourself</th>
                            <th scope="col" class="px-6 py-5 font-semibold">QR Code Tools</th>
                            <th scope="col" class="px-6 py-5 font-semibold">WhatsApp</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in comparisonRows" :key="row.feature" class="border-t border-line">
                            <th scope="row" class="px-6 py-4 font-medium">{{ row.feature }}</th>
                            <td v-for="(cell, i) in [row.us, row.email, row.qr, row.wa]" :key="i" class="px-6 py-4" :class="{ 'bg-surface-2/60': i === 0 }">
                                <span v-if="cell === true" class="inline-flex items-center gap-1.5 font-medium text-ink"><TsnIcon name="check" class="h-[18px] w-[18px]" stroke="2.4" />Yes</span>
                                <span v-else-if="cell === false" class="inline-flex items-center gap-1.5 text-muted"><TsnIcon name="x" class="h-4 w-4" stroke="2.2" />No</span>
                                <span v-else class="text-muted">{{ cell }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </section>
</template>

<script setup>
const DEVICES = ["iPhone", "Android", "Mac", "Windows", "iPad", "Linux"];

// "Partly" replaces the old warning emoji
const comparisonRows = [
    { feature: "No account needed", us: true, email: false, qr: true, wa: false },
    { feature: "Works phone → laptop", us: true, email: true, qr: "Partly", wa: true },
    { feature: "Works laptop → phone", us: true, email: true, qr: true, wa: true },
    { feature: "Under 10 seconds", us: true, email: false, qr: "Partly", wa: false },
    { feature: "QR scan to receive", us: true, email: false, qr: true, wa: false },
    { feature: "Auto-deletes data", us: true, email: false, qr: false, wa: false },
    { feature: "Short, typeable code", us: true, email: false, qr: false, wa: false },
    { feature: "Works cross-network", us: true, email: true, qr: "Partly", wa: true },
];
</script>
