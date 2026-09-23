<template>
    <!-- Closing CTA (original "Ready to share?" copy) in the black band, with the tip QR -->
    <section id="support" class="section">
        <div class="relative mx-auto grid max-w-6xl items-center gap-10 overflow-hidden rounded-xl border border-line bg-brand px-6 py-14 text-center text-on-brand sm:px-12 sm:py-16 md:grid-cols-[1fr_auto] md:text-left">
            <div>
                <h2 class="mx-auto max-w-[20ch] text-[clamp(2rem,4.4vw,3.25rem)] font-bold leading-[1.04] tracking-[-0.045em] md:mx-0">Ready to share?<br />Takes 8 seconds.</h2>
                <p class="mx-auto mt-4 max-w-[52ch] text-[17px] leading-relaxed opacity-70 md:mx-0">Open on any device, paste, get code, done.</p>
                <div class="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
                    <NuxtLink to="/#tool" class="btn bg-on-brand text-brand hover:opacity-90">Use the Tool Now</NuxtLink>
                    <a
                        :href="tipUrl"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="btn border border-on-brand/25 text-on-brand hover:bg-on-brand/10"
                        aria-label="Support TextShareNow with a tip via PayPal"
                        @click="countTipClick"
                    >
                        <TsnIcon name="heart" class="h-[18px] w-[18px]" />Support this project
                    </a>
                </div>
            </div>
            <figure class="mx-auto flex flex-col items-center gap-3">
                <div class="w-40 overflow-hidden rounded-lg border border-black/10 bg-white p-2 [&_canvas]:!h-auto [&_canvas]:!w-full">
                    <QrCode :text="tipUrl" :size="150" />
                </div>
                <figcaption class="text-[14px] font-medium">Help keep TextShareNow free</figcaption>
                <p class="-mt-2 text-[12px] opacity-60">Scan to tip with card or PayPal</p>
            </figure>
        </div>
    </section>
</template>

<script setup>
const tipUrl = TIP_URL;
const apiBase = useRuntimeConfig().public.API_BASE;
const countTipClick = () => trackTip("click", "banner", apiBase);
</script>
