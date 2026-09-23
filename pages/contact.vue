<template>
    <div>
        <PageHero
            meta="Contact"
            title="Get in Touch"
            lead="TextShareNow is a one-person project with no support ticket system and no live chat — just a real inbox. Questions, bug reports, and feedback are all welcome."
        />

        <section class="section">
            <div class="wrap grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
                <article class="min-w-0 text-[16px] leading-7 text-muted">
                    <h2 class="text-[26px] font-semibold tracking-[-0.03em] text-ink">Reach Me Directly</h2>
                    <p class="mt-4 max-w-[68ch]">
                        TextShareNow doesn't run a backend for contact forms, so
                        rather than a form that quietly goes nowhere, here's how
                        to reach me directly. I read and reply to every message
                        myself.
                    </p>

                    <div class="mt-8 grid gap-4 sm:grid-cols-2">
                        <a href="mailto:info@textsharenow.com" class="tile flex items-center gap-4 !p-5 transition-colors hover:bg-surface-2">
                            <span class="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-line bg-bg text-ink"><TsnIcon name="mail" class="h-5 w-5" stroke="1.8" /></span>
                            <span class="min-w-0">
                                <span class="block text-[13px] font-medium text-muted">Email (Support)</span>
                                <span class="block break-words text-[15px] font-medium text-ink">info@textsharenow.com</span>
                            </span>
                        </a>

                        <a href="mailto:aghazain10@gmail.com" class="tile flex items-center gap-4 !p-5 transition-colors hover:bg-surface-2">
                            <span class="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-line bg-bg text-ink"><TsnIcon name="mail" class="h-5 w-5" stroke="1.8" /></span>
                            <span class="min-w-0">
                                <span class="block text-[13px] font-medium text-muted">Email (Personal)</span>
                                <span class="block break-words text-[15px] font-medium text-ink">aghazain10@gmail.com</span>
                            </span>
                        </a>

                        <a href="tel:+923460950600" class="tile flex items-center gap-4 !p-5 transition-colors hover:bg-surface-2">
                            <span class="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-line bg-bg text-ink"><TsnIcon name="phone" class="h-5 w-5" stroke="1.8" /></span>
                            <span class="min-w-0">
                                <span class="block text-[13px] font-medium text-muted">Phone</span>
                                <span class="block break-words text-[15px] font-medium text-ink">+92 346 0950600</span>
                            </span>
                        </a>

                        <div class="tile flex items-center gap-4 !p-5">
                            <span class="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-line bg-bg text-ink"><TsnIcon name="globe" class="h-5 w-5" stroke="1.8" /></span>
                            <span class="min-w-0">
                                <span class="block text-[13px] font-medium text-muted">Based In</span>
                                <span class="block break-words text-[15px] font-medium text-ink">Skardu, Pakistan</span>
                            </span>
                        </div>
                    </div>

                    <h2 class="mt-12 border-t border-line pt-12 text-[26px] font-semibold tracking-[-0.03em] text-ink">What To Contact Me About</h2>
                    <ul class="mt-4 max-w-[68ch] list-disc space-y-2 pl-5 marker:text-line">
                        <li>Bugs or issues with sending / receiving text</li>
                        <li>Feature requests or feedback on the tool</li>
                        <li>Business, partnership, or advertising inquiries</li>
                        <li>Privacy or data questions about how TextShareNow works</li>
                    </ul>
                </article>

                <aside class="grid gap-4 lg:sticky lg:top-24">
                    <div class="tile">
                        <h3 class="text-[13px] font-medium text-muted">About the Developer</h3>
                        <p class="mt-3 text-[15px] leading-6 text-ink">
                            Zain Rizvee — web developer based in Skardu,
                            Pakistan, building and running e-commerce businesses
                            with Laravel, Nuxt, and Vue.
                        </p>
                        <NuxtLink to="/about" class="btn-ghost mt-5 w-full">Read Full Story</NuxtLink>
                    </div>

                    <div class="tile">
                        <h3 class="text-[13px] font-medium text-muted">Ready to try it?</h3>
                        <p class="mt-3 text-[15px] leading-6 text-ink">No sign-up. No app. Just open and share.</p>
                        <NuxtLink to="/" class="btn-primary mt-5 w-full">Use the Tool</NuxtLink>
                    </div>
                </aside>
            </div>
        </section>
    </div>
</template>

<script setup>
useSeo({
    title: "Contact — TextShareNow",
    description:
        "Get in touch with the developer of TextShareNow for support, feedback, bug reports, or business inquiries.",
    pagePath: "/contact",
});
</script>
