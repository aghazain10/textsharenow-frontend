<template>
    <!-- Closing CTA (original "Ready to share?" copy) in the black band -->
    <section id="support" class="section">
        <div class="relative mx-auto max-w-6xl overflow-hidden rounded-xl border border-line bg-brand px-6 py-14 text-center text-on-brand sm:px-12 sm:py-20">
            <h2 class="mx-auto max-w-[20ch] text-[clamp(2rem,4.4vw,3.25rem)] font-bold leading-[1.04] tracking-[-0.045em]">Ready to share?<br />Takes 8 seconds.</h2>
            <p class="mx-auto mt-4 max-w-[52ch] text-[17px] leading-relaxed opacity-70">Open on any device, paste, get code, done.</p>
            <div class="mt-8 flex flex-wrap justify-center gap-3">
                <NuxtLink to="/#tool" class="btn bg-on-brand text-brand hover:opacity-90">Use the Tool Now</NuxtLink>
                <a
                    href="https://wise.com/pay/me/syedm198"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn border border-on-brand/25 text-on-brand hover:bg-on-brand/10"
                    aria-label="Support TextShareNow with a donation via Wise"
                >
                    <TsnIcon name="heart" class="h-[18px] w-[18px]" />Support this project
                </a>
            </div>
        </div>
    </section>
</template>
