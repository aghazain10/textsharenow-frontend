<template>
    <div>
        <PageHero
            title="Report Abuse"
            meta="Abuse"
            lead="TextShareNow is anonymous by design. If someone is using it to distribute malware, phishing links, or illegal content, report it here and we will act."
        />

        <section class="section">
            <div class="wrap">
                <div class="max-w-[68ch] space-y-12 text-[16px] leading-7 text-muted">
                    <section>
                        <h2 class="text-[26px] font-semibold tracking-[-0.03em] text-ink">What to Report</h2>
                        <ul class="mt-4 list-disc space-y-2 pl-5 marker:text-line">
                            <li>Malware, viruses, trojans, or files that execute code.</li>
                            <li>Phishing pages, fake login forms, or credential-harvesting content.</li>
                            <li>Illegal content, including content that exploits or endangers minors.</li>
                            <li>Pirated software, cracked installers, or other copyright-infringing files.</li>
                            <li>Harassment, threats, or non-consensual sharing of private material.</li>
                            <li>Automated abuse, scraping, or attempts to break the service's limits.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 class="text-[26px] font-semibold tracking-[-0.03em] text-ink">How to Report</h2>
                        <p class="mt-4">
                            Email
                            <a href="mailto:info@textsharenow.com?subject=Abuse%20report" class="text-link">info@textsharenow.com</a>
                            with the subject “Abuse report” and include:
                        </p>
                        <ul class="mt-4 list-disc space-y-2 pl-5 marker:text-line">
                            <li>The share code, link, or file URL involved.</li>
                            <li>What the content is and why it is abusive.</li>
                            <li>When you saw it, and any context that helps us verify it.</li>
                        </ul>
                        <p class="mt-4">
                            Do not download or open suspicious files to investigate them yourself. A description
                            and the code are enough for us to locate and review the content.
                        </p>
                    </section>

                    <section>
                        <h2 class="text-[26px] font-semibold tracking-[-0.03em] text-ink">What Happens Next</h2>
                        <p class="mt-4">
                            We review every report, usually within two business days. If a violation is confirmed we
                            remove the content immediately and may suspend or revoke access — including Pro access —
                            without notice. Where the law requires it, we may preserve and disclose the limited
                            information we hold to the relevant authorities.
                        </p>
                        <p class="mt-4">
                            Because shares are anonymous and short-lived, some content may expire before we can act
                            on it. Reporting quickly matters.
                        </p>
                    </section>

                    <section>
                        <h2 class="text-[26px] font-semibold tracking-[-0.03em] text-ink">What We Already Block</h2>
                        <ul class="mt-4 list-disc space-y-2 pl-5 marker:text-line">
                            <li>Executable files and installers are blocked on every plan, including Pro.</li>
                            <li>Every uploaded file is scanned with ClamAV before it can be downloaded.</li>
                            <li>Rate limits apply to code lookups and password attempts.</li>
                            <li>Pro uploads are capped by a per-license storage allowance.</li>
                        </ul>
                        <p class="mt-4">
                            These controls catch most abuse automatically. Reports still help us find what slips
                            through and remove it fast.
                        </p>
                    </section>

                    <section>
                        <h2 class="text-[26px] font-semibold tracking-[-0.03em] text-ink">Reporting a Billing Issue</h2>
                        <p class="mt-4">
                            For a charge you do not recognise or a license key that will not activate, email the same
                            address with the subject “Billing” and include your Gumroad receipt. Pro subscriptions are
                            billed and managed by Gumroad, as described in our
                            <NuxtLink to="/terms" class="text-link">Terms of Use</NuxtLink>.
                        </p>
                    </section>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
useSeo({
    title: "Report Abuse — TextShareNow",
    description:
        "Report malware, phishing, illegal content, or other abuse of TextShareNow's anonymous text and file sharing service.",
    pagePath: "/abuse",
});
</script>
