<template>
    <div>
        <section class="section">
            <div class="container legal-container">
                <div class="legal-header">
                    <span class="section-label">Legal</span>
                    <h1 class="section-title">Privacy Policy</h1>
                    <p class="section-subtitle">Last updated: August 2026</p>
                </div>

                <div class="legal-body glass-card">
                    <section
                        v-for="section in sections"
                        :key="section.title"
                        class="legal-section"
                    >
                        <h2 class="legal-h2">{{ section.title }}</h2>
                        <div v-for="(block, i) in section.content" :key="i">
                            <p v-if="block.type === 'p'" class="legal-p">
                                {{ block.text }}
                            </p>
                            <ul
                                v-else-if="block.type === 'ul'"
                                class="legal-ul"
                            >
                                <li v-for="(item, j) in block.items" :key="j">
                                    {{ item }}
                                </li>
                            </ul>
                            <p
                                v-else-if="block.type === 'links'"
                                class="legal-p"
                            >
                                {{ block.prefix }}
                                <a
                                    v-for="(link, k) in block.links"
                                    :key="k"
                                    :href="link.href"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="legal-link"
                                    >{{ link.text }}</a
                                ><span v-if="k < block.links.length - 1"
                                    >,
                                </span>
                            </p>
                        </div>
                    </section>

                    <div class="legal-contact">
                        <h2 class="legal-h2">Contact</h2>
                        <p class="legal-p">
                            For privacy questions or data requests, contact us
                            at
                            <span class="highlight">info@textsharenow.com</span>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
useSeo({
    title: "Privacy Policy",
    description:
        "TextShareNow privacy policy — how we handle your data, what we store, how your content is deleted after use, and how advertising cookies are used.",
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
                    "We do not collect your name, email address, phone number, or any personally identifying information to use the tool.",
                    "We may collect anonymised server metrics such as request counts and response times for performance monitoring.",
                    "Standard web server logs (IP addresses, timestamps) may be retained for up to 7 days for security purposes.",
                ],
            },
        ],
    },
    {
        title: "2. How Your Text Is Stored",
        content: [
            {
                type: "p",
                text: "When you submit text through our Send feature, it is stored in an encrypted temporary data store with a time-to-live (TTL) of 10 minutes.",
            },
            {
                type: "p",
                text: "Upon first successful retrieval, the content is immediately and permanently deleted. If not retrieved within 10 minutes, it is automatically deleted by the TTL mechanism.",
            },
            {
                type: "p",
                text: "We do not archive, back up, or retain any copies of submitted text beyond the TTL window.",
            },
        ],
    },
    {
        title: "3. Cookies, Advertising & Third-Party Vendors",
        content: [
            {
                type: "p",
                text: "TextShareNow does not use cookies for its own tracking or analytics, and we do not run third-party analytics services such as Google Analytics.",
            },
            {
                type: "p",
                text: "We do use Google AdSense to display advertisements on this site. Google, as a third-party vendor, and its advertising partners use cookies (including the DoubleClick cookie) to serve ads based on a visitor's prior visits to this site or other sites on the internet.",
            },
            {
                type: "p",
                text: "Google's use of advertising cookies enables it and its partners to serve ads based on your visits to this site and/or other sites. Third-party vendors, including Google, may also use cookies to serve ads based on your prior visits to our website or other websites.",
            },
            {
                type: "links",
                prefix: "You may opt out of personalised advertising by visiting",
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
                type: "p",
                text: "You can also disable cookies entirely through your browser settings, though this may affect functionality on other websites.",
            },
        ],
    },
    {
        title: "4. Data Security",
        content: [
            {
                type: "p",
                text: "All data in transit is encrypted using HTTPS/TLS. Stored text is encrypted at rest in our temporary data store.",
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
                text: "We do not sell, rent, or share your submitted text with any third parties. Your content is used solely to fulfil your transfer request and is then deleted.",
            },
            {
                type: "p",
                text: "Our advertising partner, Google, may independently collect and process data as described in their own privacy policy.",
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

<style scoped>
.legal-container {
    max-width: 760px;
}

.legal-header {
    margin-bottom: 36px;
}

.legal-body {
    padding: 48px;
    display: flex;
    flex-direction: column;
    gap: 36px;
}

@media (max-width: 640px) {
    .legal-body {
        padding: 28px 20px;
    }
}

.legal-section {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.legal-h2 {
    font-family: var(--font-display);
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: var(--accent);
    text-transform: uppercase;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border-accent);
}

.legal-p {
    font-size: 0.9rem;
    color: var(--text-secondary);
    line-height: 1.8;
    font-weight: 300;
}

.legal-ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 0;
}

.legal-ul li {
    font-size: 0.9rem;
    color: var(--text-secondary);
    line-height: 1.7;
    font-weight: 300;
    padding-left: 18px;
    position: relative;
}

.legal-ul li::before {
    content: "›";
    position: absolute;
    left: 0;
    color: var(--accent);
    font-family: var(--font-mono);
}

.legal-link {
    color: var(--accent);
    text-decoration: underline;
}

.legal-contact {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.highlight {
    font-family: var(--font-mono);
    color: var(--accent);
    font-size: 0.85rem;
}
</style>
