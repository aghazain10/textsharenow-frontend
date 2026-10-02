<template>
    <div>
        <PageHero title="Privacy Policy" meta="Last updated: October 2026" lead="What we store, how long we keep it, and how analytics and advertising cookies are handled on this site." />

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
                                <p v-else-if="block.type === 'links'">
                                    {{ block.prefix }}
                                    <template v-for="(link, k) in block.links" :key="k"><a
                                        :href="link.href"
                                        :target="link.external === false ? null : '_blank'"
                                        :rel="link.external === false ? null : 'noopener noreferrer'"
                                        class="text-link"
                                    >{{ link.text }}</a><span v-if="k < block.links.length - 1">, </span></template>.
                                </p>
                            </template>
                        </div>
                    </section>

                    <section>
                        <h2 class="text-[26px] font-semibold tracking-[-0.03em] text-ink">Contact</h2>
                        <p class="mt-4 text-[16px] leading-7 text-muted">
                            For privacy questions or data requests, contact us at
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
    title: "Privacy Policy",
    description:
        "TextShareNow privacy policy — how we handle your data, what we store, how your content is deleted after use, and how analytics and advertising cookies are used.",
    pagePath: "/privacy",
});

const sections = [
    {
        title: "1. What We Collect",
        content: [
            {
                type: "p",
                text: "TextShareNow is designed to collect as little data as possible. Specifically:",
            },
            {
                type: "ul",
                items: [
                    "Text content you submit is temporarily stored only to fulfil the transfer request.",
                    "File uploads (images and videos) are temporarily stored only to fulfil the transfer request and are scanned for malware before becoming available.",
                    "We do not collect your name, email address, phone number, or any personally identifying information to use the tool.",
                    "We may collect anonymised server metrics such as request counts and response times for performance monitoring.",
                    "Standard web server logs (IP addresses, timestamps) may be retained for up to 7 days for security purposes.",
                ],
            },
        ],
    },
    {
        title: "2. How Your Content Is Stored",
        content: [
            {
                type: "p",
                text: "When you submit text through our Send feature, it is stored in an encrypted temporary data store with a time-to-live (TTL) of 10 minutes.",
            },
            {
                type: "p",
                text: "When you upload a file, it is stored on a dedicated server with a TTL of 15 minutes. All uploaded files are scanned for malware using ClamAV before becoming available for download. Files that fail the malware scan are immediately deleted and are never served.",
            },
            {
                type: "p",
                text: "Upon first successful retrieval (text) or download (file), the content is immediately and permanently deleted. If not retrieved within the respective TTL window, it is automatically deleted.",
            },
            {
                type: "p",
                text: "We do not archive, back up, or retain any copies of submitted text or uploaded files beyond the TTL window.",
            },
        ],
    },
    {
        title: "3. Cookies, Advertising & Third-Party Vendors",
        content: [
            {
                type: "p",
                text: "TextShareNow sets no first-party cookies of its own, and we run no analytics or advertising software ourselves. Two optional Google services do, and both are held behind your consent.",
            },
            {
                type: "p",
                text: "Analytics — we use Google Analytics 4 to measure aggregate, anonymised usage of this site: which pages are visited, which devices and languages are used, and how visitors arrive here. The Google tag loads with every consent category set to denied, so no analytics storage is written until you press Accept all in the cookie banner. If you decline, the visit is not recorded in Google Analytics.",
            },
            {
                type: "p",
                text: "Advertising — we use Google AdSense to display advertisements on this site. Google, as a third-party vendor, and its advertising partners may use cookies, including the DoubleClick cookie, to serve ads based on a visitor's prior visits to this site or other sites on the internet. The AdSense tag follows the same consent default and only stores advertising cookies once you accept.",
            },
            {
                type: "p",
                text: "If you are located in the European Economic Area, the United Kingdom or Switzerland, personalised advertising is only enabled through a Google-certified consent management platform operating under the IAB Transparency and Consent Framework, as required by Google's EU user consent policy.",
            },
            {
                type: "ul",
                items: [
                    "Google Analytics event data is kept only for the retention period configured in our Analytics property (Google's default is 2 months).",
                    "The lifetime of Google's advertising cookies is governed by Google's own cookie policy.",
                    "Your consent choice is stored on your own device only — we receive no consent identifier.",
                ],
            },
            {
                type: "links",
                prefix: "You may also opt out of personalised advertising by visiting",
                links: [
                    {
                        text: "Google Ads Settings",
                        href: "https://adssettings.google.com",
                    },
                    {
                        text: "www.aboutads.info",
                        href: "https://www.aboutads.info/choices",
                    },
                ],
            },
            {
                type: "links",
                prefix: "To opt out of Google Analytics itself, see",
                links: [
                    {
                        text: "Google's Analytics opt-out browser add-on",
                        href: "https://tools.google.com/dlpage/gaoptout",
                    },
                ],
            },
            {
                type: "links",
                prefix: "You can change or withdraw your consent for this site at any time with",
                links: [
                    {
                        text: "the cookie preferences panel",
                        href: "#cookie-preferences",
                        external: false,
                    },
                ],
            },
            {
                type: "p",
                text: "Withdrawing consent is as easy as giving it. You can also disable cookies entirely through your browser settings, though this may affect functionality on other websites.",
            },
        ],
    },
    {
        title: "4. Data Security",
        content: [
            {
                type: "p",
                text: "All data in transit is encrypted using HTTPS/TLS. Stored text is encrypted at rest in our temporary data store. Uploaded files are stored on a dedicated server with strict access controls and are never served as static files.",
            },
            {
                type: "p",
                text: "All uploaded files are automatically scanned for malware using ClamAV before becoming available for download. Files that fail the scan are immediately deleted.",
            },
            {
                type: "p",
                text: "We apply rate limiting to prevent brute-force enumeration of codes. Each code allows a limited number of retrieval attempts per IP address per minute.",
            },
        ],
    },
    {
        title: "5. Third Parties",
        content: [
            {
                type: "p",
                text: "We do not sell, rent, or share your submitted text or uploaded files with any third parties. Your content is used solely to fulfil your transfer request and is then deleted.",
            },
            {
                type: "p",
                text: "Google, through both Google Analytics and Google AdSense, may independently collect and process data as described in its own privacy policy.",
            },
            {
                type: "links",
                prefix: "Learn more at",
                links: [
                    {
                        text: "Google's Privacy & Terms",
                        href: "https://policies.google.com/technologies/partner-sites",
                    },
                ],
            },
        ],
    },
    {
        title: "6. Your Rights (GDPR / UK GDPR)",
        content: [
            {
                type: "p",
                text: "If you are located in the European Economic Area or the United Kingdom, you have the right to request access to, correction of, or deletion of any personal data we hold about you, and the right to object to or restrict certain processing.",
            },
            {
                type: "p",
                text: "Because TextShareNow does not require accounts and deletes submitted text automatically within 10 minutes, we generally do not hold personal data beyond short-lived server logs. Any such request can be made using the contact details below.",
            },
        ],
    },
    {
        title: "7. California Privacy Rights (CCPA)",
        content: [
            {
                type: "p",
                text: "If you are a California resident, you have the right to know what personal information is collected about you, to request deletion of that information, and to opt out of the sale of personal information. TextShareNow does not sell personal information to third parties.",
            },
        ],
    },
    {
        title: "8. Children's Privacy",
        content: [
            {
                type: "p",
                text: "TextShareNow is not directed at children under 13. We do not knowingly collect data from children. If you believe a child has submitted content through our service, please contact us immediately so we can remove it.",
            },
        ],
    },
    {
        title: "9. Changes to This Policy",
        content: [
            {
                type: "p",
                text: "We may update this privacy policy from time to time. Changes will be reflected by an updated date at the top of this page. Continued use of the service after changes constitutes acceptance of the updated policy.",
            },
        ],
    },
];
</script>
