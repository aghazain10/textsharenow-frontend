<template>
    <div>
        <PageHero title="Terms of Use" meta="Last updated: August 2026" lead="The rules and conditions for using the TextShareNow text and file transfer tool." />

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
        "Terms of Use for TextShareNow — the rules and conditions for using our free text transfer tool.",
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
                text: "TextShareNow is a free, browser-based tool that lets users transfer short pieces of text or files between devices using a temporary, single-use code. The Service does not require account creation and does not permanently store submitted content.",
            },
            {
                type: "p",
                text: "Submitted text is automatically deleted after first retrieval or after 10 minutes, whichever occurs first. Uploaded files are automatically deleted after first download or after 15 minutes, whichever occurs first, as described in our Privacy Policy.",
            },
            {
                type: "p",
                text: "Accepted file types for the file sharing feature are limited to PNG, JPEG, WebP, MP4, and WebM, with a maximum size of 10 MB per file. All uploaded files are scanned for malware before becoming available for download.",
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
                    "Upload files that exceed 10 MB or are not in an accepted format (PNG, JPEG, WebP, MP4, WebM).",
                    "Attempt to overwhelm, disrupt, or gain unauthorised access to the Service or its infrastructure.",
                    "Attempt to brute-force, guess, or otherwise access another user's code or content.",
                    "Use the Service for spam, bulk automated transfers, or any activity that abuses its intended purpose.",
                ],
            },
            {
                type: "p",
                text: "We reserve the right to block or rate-limit access, without notice, for any use that violates these terms or threatens the stability of the Service.",
            },
        ],
    },
    {
        title: "4. No Account, No Guarantee of Delivery",
        content: [
            {
                type: "p",
                text: "Because TextShareNow has no accounts or user authentication, we cannot verify the identity of anyone sending or retrieving a code. Codes are short-lived and single-use by design, but you are responsible for who you share a code with.",
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
                text: "TextShareNow is a free service and may display advertisements served by Google AdSense and other advertising partners to help cover the cost of running the Service. Advertisements are provided by third parties, and we are not responsible for the content of ads displayed.",
            },
            {
                type: "p",
                text: "See our Privacy Policy for details on how advertising cookies are used and how to opt out of personalised advertising.",
            },
        ],
    },
    {
        title: "7. Disclaimer of Warranties",
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
        title: "8. Limitation of Liability",
        content: [
            {
                type: "p",
                text: "To the fullest extent permitted by law, Zain Rizvee and TextShareNow shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of, or inability to use, the Service, including loss of data or content transmitted through the Service.",
            },
        ],
    },
    {
        title: "9. Changes to the Service or Terms",
        content: [
            {
                type: "p",
                text: "We may modify, suspend, or discontinue the Service, in whole or in part, at any time without prior notice. We may also update these Terms from time to time; continued use of the Service after changes constitutes acceptance of the updated Terms.",
            },
        ],
    },
    {
        title: "10. Governing Law",
        content: [
            {
                type: "p",
                text: "These Terms are governed by and construed in accordance with applicable local laws, without regard to conflict of law principles. Any disputes arising from use of the Service will be handled in good faith between the parties in the first instance.",
            },
        ],
    },
];
</script>
