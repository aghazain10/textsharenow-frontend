<template>
    <section id="how-it-works" class="section" aria-labelledby="hiw-title">
        <div class="wrap">
            <div class="max-w-2xl">
                <p class="text-[13px] font-medium text-muted">Process</p>
                <h2 id="hiw-title" class="section-title mt-3">How It Works</h2>
                <p class="section-lead">From copy to paste in under 10 seconds — no accounts, no apps, no friction.</p>
            </div>

            <ol class="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                <li v-for="(s, i) in steps" :key="s.id">
                    <div class="flex items-center">
                        <span
                            class="grid h-9 w-9 place-items-center rounded-md text-[14px] font-semibold"
                            :class="i === steps.length - 1 ? 'bg-brand text-on-brand' : 'border border-line bg-bg shadow-card'"
                        >{{ s.id }}</span>
                        <span
                            v-if="i < steps.length - 1"
                            class="ml-4 hidden h-px flex-1 bg-[repeating-linear-gradient(90deg,var(--line)_0_6px,transparent_6px_12px)] lg:block"
                            aria-hidden="true"
                        />
                    </div>
                    <h3 class="mt-5 text-[21px] font-semibold tracking-[-0.025em]">{{ s.title }}</h3>
                    <p class="mt-2 max-w-[34ch] text-muted">{{ s.description }}</p>
                </li>
            </ol>

            <!-- Demo callout -->
            <div class="tile mt-14 grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
                <div class="flex items-center gap-4">
                    <span class="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-line bg-surface-2/60"><TsnIcon name="phone" class="h-6 w-6" stroke="1.8" /></span>
                    <div>
                        <p class="text-[13px] font-medium text-muted">Phone</p>
                        <p class="mt-1 flex flex-wrap items-center gap-2 font-medium">Paste, send, get code <span class="inline-flex gap-1" aria-label="Z7K4P"><span v-for="c in 'Z7K4P'" :key="c" class="flap flap-xs !text-[13px]">{{ c }}</span></span></p>
                    </div>
                </div>
                <TsnIcon name="arrow" class="hidden h-5 w-5 text-muted md:block" />
                <div class="flex items-center gap-4">
                    <span class="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-line bg-surface-2/60"><TsnIcon name="laptop" class="h-6 w-6" stroke="1.8" /></span>
                    <div>
                        <p class="text-[13px] font-medium text-muted">Laptop</p>
                        <p class="mt-1 flex flex-wrap items-center gap-2 font-medium">Enter <span class="inline-flex gap-1" aria-label="Z7K4P"><span v-for="c in 'Z7K4P'" :key="c" class="flap flap-xs !text-[13px]">{{ c }}</span></span> and the text appears</p>
                    </div>
                </div>
                <p class="border-t border-line pt-5 text-[15px] text-muted md:col-span-3">Average transfer time: <strong class="font-semibold text-ink">under 8 seconds</strong></p>
            </div>
        </div>
    </section>
</template>

<script setup>
const steps = [
    { id: 1, title: "Paste Your Text", description: "On your sending device, open TextShareNow and paste your link, note, or any text into the Send tab." },
    { id: 2, title: "Get a Short Code", description: "Hit send — our system instantly generates a unique 5-character code tied to your content." },
    { id: 3, title: "Receive It", description: "On your other device, scan the QR code with your phone camera — or open the site and type the short code." },
    { id: 4, title: "Text Appears Instantly", description: "Your content shows up immediately — auto-copied to your clipboard and ready to use." },
];
</script>
