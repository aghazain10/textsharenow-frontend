<template>
    <div>
        <PageHero title="Terms of Use" meta="Last updated: October 2026" lead="The rules and conditions for using the TextShareNow text and file transfer tool." />

        <section class="section">
            <div class="wrap">
                <div class="max-w-[68ch] space-y-12">
                    <section v-for="section in sections" :key="section.title">
                        <h2 class="text-[26px] font-semibold tracking-[-0.03em] text-ink">{{ section.title }}</h2>
                        <div class="mt-4 space-y-4 text-[16px] leading-7 text-muted">
                            <template v-for="(block, i) in section.content" :key="i">
                                <p v-if="block.type === 'p'">{{ block.text }}</p>
                                <ul v-else-if="block.type === 'ul'" class="list-disc space-y-2 pl-5 marker:text-line">
                                    <li v-for="(item, j) in block.items" :key="j">{{ item }}</li>
                                </ul>
                            </template>
                        </div>
                    </section>

                    <section>
                        <h2 class="text-[26px] font-semibold tracking-[-0.03em] text-ink">Contact</h2>
                        <p class="mt-4 text-[16px] leading-7 text-muted">
                            Questions about these Terms can be sent to
                            <a href="mailto:info@textsharenow.com" class="text-link">info@textsharenow.com</a>.
                            Abuse reports can also be filed through our
                            <NuxtLink to="/abuse" class="text-link">abuse report page</NuxtLink>.
                        </p>
                    </section>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
useSeo({
    title: "Terms of Use",
    description:
        "Terms of Use for TextShareNow — the rules for using our free and Pro text and file transfer service, including billing, cancellation, refunds, and acceptable use.",
    pagePath: "/terms",
});

const sections = [
    {
        title: "1. Acceptance of Terms",
        content: [
            {
                type: "p",
                text: 'By accessing or using TextShareNow ("the Service"), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the Service.',
            },
            {
                type: "p",
                text: "TextShareNow is operated by Zain Rizvee, an independent developer based in Skardu, Pakistan. These Terms apply to all visitors and users of the Service.",
            },
        ],
    },
    {
        title: "2. Description of Service",
        content: [
            {
                type: "p",
                text: "TextShareNow is a browser-based tool with a free plan and an optional paid membership (\"Pro\") that lets users transfer short pieces of text or files between devices using a temporary code. The free plan does not require account creation, and the Service does not permanently store submitted content except where a Pro user explicitly chooses an unlimited, non-expiring share.",
            },
            {
                type: "p",
                text: "Pro also includes a My Shares dashboard plus a developer API and MCP server for programmatic text sharing. API and MCP requests authenticate with the Pro license key instead of a browser cookie, and the same content, expiry, read-limit, and password rules apply.",
            },
            {
                type: "p",
                text: "Free shares are automatically deleted after first retrieval or when their timer ends (10 minutes, 30 minutes or 1 hour), whichever occurs first. Pro shares can be configured with a longer expiry (1 day, 7 days, 30 days or never), multiple reads (5, 10 or unlimited), or both, and are deleted when their read limit is reached, when their timer ends, or after retrieval on single-read shares. A Pro share configured never to expire remains stored until its read limit is reached (if one applies) or until it is removed under these Terms. Files are automatically deleted after first download or when their timer ends, and file shares are available for up to 30 days on Pro. In a multi-file transfer, each file is deleted after its first download and the transfer ends when all files are gone or the timer ends. This is described in more detail in our Privacy Policy.",
            },
            {
                type: "p",
                text: "Accepted file types for the free plan are limited to PNG, JPEG, WebP, MP4 and WebM, with a maximum size of 10 MB per file. Pro accepts up to 20 files and 100 MB total per transfer (any non-executable file type, up to 100 MB per file), within a per-license live storage allowance. Executable files and installers are blocked on every plan. All uploaded files are scanned for malware before becoming available for download.",
            },
        ],
    },
    {
        title: "3. Acceptable Use",
        content: [
            {
                type: "p",
                text: "You agree to use TextShareNow only for lawful purposes. You may not use the Service to:",
            },
            {
                type: "ul",
                items: [
                    "Transmit content that is illegal, defamatory, obscene, or infringes on the rights of others.",
                    "Distribute malware, phishing links, or other malicious content.",
                    "Upload files containing viruses, trojans, or other harmful code — all uploads are scanned and rejected if malware is detected.",
                    "Upload executables, installers, or scripts designed to run automatically. These are blocked on every plan, including Pro.",
                    "Upload files that exceed the limits of your plan or use a format blocked on that plan (free: the five formats above up to 10 MB; Pro: up to 20 files / 100 MB total per transfer, any non-executable file up to 100 MB, within the storage allowance).",
                    "Circumvent storage caps, rate limits, or other restrictions by creating multiple licenses or accounts, or by automated means.",
                    "Use Pro to host or distribute malware, phishing pages, pirated software, or other illegal content under our domain.",
                    "Attempt to overwhelm, disrupt, or gain unauthorised access to the Service or its infrastructure.",
                    "Attempt to brute-force, guess, or otherwise access another user's code or content.",
                    "Use the Service for spam, bulk automated transfers, or any activity that abuses its intended purpose.",
                ],
            },
            {
                type: "p",
                text: "To report abuse, contact info@textsharenow.com or use our abuse report page with the share code or link and a description of the problem. We review every report and may remove content and suspend or revoke access, including Pro access, without notice where a violation is found or the stability of the Service is threatened.",
            },
        ],
    },
    {
        title: "4. No Account, No Guarantee of Delivery",
        content: [
            {
                type: "p",
                text: "TextShareNow does not use traditional accounts. Free use requires no authentication, while Pro features — including the API and MCP server — authenticate with a Gumroad license key. We cannot verify the identity of anyone sending or retrieving a code. Codes are short-lived and single-use by default; Pro shares may allow multiple reads or longer lifetimes, but you are responsible for who you share a code with.",
            },
            {
                type: "p",
                text: "We do not guarantee that content will always be successfully delivered, retained for the full TTL window, or free from technical interruption. Use the Service at your own discretion, and do not rely on it for sensitive, confidential, or time-critical information.",
            },
        ],
    },
    {
        title: "5. Intellectual Property",
        content: [
            {
                type: "p",
                text: "The TextShareNow name, logo, website design, and underlying code are the property of Zain Rizvee unless otherwise noted. You may not copy, reproduce, or redistribute the Service's design or codebase without permission.",
            },
            {
                type: "p",
                text: "You retain all rights to any text content you submit through the Service. We claim no ownership over content you transfer.",
            },
        ],
    },
    {
        title: "6. Advertising",
        content: [
            {
                type: "p",
                text: "The free plan of TextShareNow may display advertisements served by Google AdSense and other advertising partners to help cover the cost of running the Service. Advertisements are provided by third parties, and we are not responsible for the content of ads displayed. The optional Pro plan unlocks additional features and directly supports the Service.",
            },
            {
                type: "p",
                text: "See our Privacy Policy for details on how advertising cookies are used and how to opt out of personalised advertising.",
            },
        ],
    },
    {
        title: "7. Pro Subscriptions, Billing & Cancellation",
        content: [
            {
                type: "p",
                text: "Pro is billed at $5 USD per month through Gumroad, our third-party payment processor. Subscriptions renew automatically each month until cancelled.",
            },
            {
                type: "p",
                text: "You can cancel at any time using the management link in your Gumroad receipt email. Cancellation stops future charges, and you keep Pro access until the end of the period you have already paid for. We cannot cancel or modify a Gumroad subscription on your behalf.",
            },
            {
                type: "p",
                text: "Your license key is proof of purchase. Treat it like a password: anyone with your key can activate Pro, and the same key authenticates API and MCP requests, so keep it private. We may deactivate a key if a payment is refunded, reversed, or charged back.",
            },
            {
                type: "p",
                text: "Refunds are handled case by case through Gumroad. Contact us at info@textsharenow.com if a key will not activate, or if you do not recognise a charge. If a refund or chargeback is issued, Pro access may be revoked.",
            },
            {
                type: "p",
                text: "Prices may change in the future. Changes will not apply retroactively to periods you have already paid for, and we will give notice through Gumroad before a change affects your renewal.",
            },
            {
                type: "p",
                text: "Pro access depends on third-party services, including Gumroad for license verification and our file host for uploads. We do not guarantee uninterrupted availability of Pro features.",
            },
        ],
    },
    {
        title: "8. Disclaimer of Warranties",
        content: [
            {
                type: "p",
                text: 'TextShareNow is provided "as is" and "as available," without warranties of any kind, whether express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.',
            },
            {
                type: "p",
                text: "We do not warrant that the Service will be uninterrupted, error-free, or completely secure.",
            },
        ],
    },
    {
        title: "9. Limitation of Liability",
        content: [
            {
                type: "p",
                text: "To the fullest extent permitted by law, Zain Rizvee and TextShareNow shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of, or inability to use, the Service, including loss of data or content transmitted through the Service.",
            },
        ],
    },
    {
        title: "10. Changes to the Service or Terms",
        content: [
            {
                type: "p",
                text: "We may modify, suspend, or discontinue the Service, in whole or in part, at any time without prior notice. We may also update these Terms from time to time; continued use of the Service after changes constitutes acceptance of the updated Terms.",
            },
        ],
    },
    {
        title: "11. Governing Law",
        content: [
            {
                type: "p",
                text: "These Terms are governed by and construed in accordance with applicable local laws, without regard to conflict of law principles. Any disputes arising from use of the Service will be handled in good faith between the parties in the first instance.",
            },
        ],
    },
];
</script>
