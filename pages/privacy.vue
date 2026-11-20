<template>
    <div>
        <PageHero title="Privacy Policy" meta="Last updated: October 2026" lead="What we store, how long we keep it, and how analytics, advertising, and payments are handled on this site." />

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
                        <p class="mt-3 text-[16px] leading-7 text-muted">
                            To report abusive or illegal content, use our
                            <NuxtLink to="/abuse" class="text-link">abuse report page</NuxtLink>
                            or email the same address.
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
        "TextShareNow privacy policy — what we store, how long text and files are kept on the free and Pro plans, how deletion works, and how analytics, advertising, and payments are handled.",
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
                    "Files you upload are temporarily stored only to fulfil the transfer request. Standard uploads are scanned for malware before becoming available. Private file mode encrypts the contents in your browser; we store ciphertext, never receive the key, and cannot scan the contents. File names, MIME types, sizes, and folder paths remain visible in both modes.",
                    "The free plan accepts PNG, JPEG, WebP, MP4 and WebM files up to 10 MB. Pro accepts up to 20 files and 100 MB total per transfer (any non-executable file type, up to 100 MB per file), within a per-license storage allowance. Multi-file transfers also store the original file names and folder paths so the recipient can download them correctly.",
                    "If you activate Pro, the license key you enter is stored in a signed, http-only cookie on your device for up to 30 days, and a SHA-256 hash of the key is cached on our servers for up to 24 hours so we do not have to contact Gumroad on every request. We send the key to Gumroad to verify the subscription. When you use the API or MCP server, the key is sent with each request and verified the same way.",
                    "For Pro text shares, we keep a private receipt of event times (created, opened, read, and closed) so you can see how a share was accessed. Receipts do not include IP addresses, device data, or the shared text, are deleted 90 days after the share closes, and never-expiring shares keep a one-year receipt window.",
                    "We do not ask for your name, phone number, or an account to use the tool. If you activate Pro, Gumroad returns the email address associated with the license; we cache it with the license check for up to 24 hours and never use it for marketing or share it.",
                    "We may collect anonymised server metrics such as request counts and response times for performance monitoring.",
                    "Standard web server logs (IP addresses, timestamps) may be retained for up to 7 days for security purposes. Security events such as repeated wrong-password attempts are logged for up to 7 days; those entries contain an event type, the share code, and a timestamp — never the content or IP addresses.",
                ],
            },
        ],
    },
    {
        title: "2. How Your Content Is Stored",
        content: [
            {
                type: "p",
                text: "When you submit text through our Send feature, it is encrypted at rest with AES-256-GCM and stored with a time-to-live (TTL) you choose: 10 minutes, 30 minutes or 1 hour on the free plan; Pro shares can be set to 1 day, 7 days, 30 days, or never expire. If you enable Private mode (the “Encrypt Now” toggle), the text is encrypted in your browser with a key that never reaches our servers — we store only ciphertext we cannot decrypt. Standard shares are decrypted on our server only long enough to deliver them, then deleted according to the rules below.",
            },
            {
                type: "p",
                text: "When you upload a file, it is stored on a dedicated server. Free uploads use the same TTL choices: 10 minutes, 30 minutes or 1 hour. Pro uploads can be kept for 1 day, 7 days or 30 days. Standard uploads are scanned for malware using ClamAV before becoming available; files that fail the scan are deleted and never served. If you enable Private file mode, the contents are encrypted in your browser with AES-256-GCM before upload. We store only ciphertext and never receive the key, so we cannot read or scan the contents. File names, MIME types, sizes, and folder paths remain visible. Encrypted files are deleted after the recipient acknowledges decryption or when the timer ends.",
            },
            {
                type: "p",
                text: "Free text shares are deleted immediately upon their first successful retrieval. Pro shares can allow 5, 10, or unlimited reads and are deleted when their read limit is reached or their timer ends, whichever comes first. Standard files are deleted after their first successful download or when their timer ends. Private files are deleted after the recipient downloads and acknowledges decryption, or when their timer ends. Pro text shares set to never expire remain stored until their read limit is reached (if one applies) or until we remove them for a violation of our Terms; a Pro share with no expiry and unlimited reads remains stored indefinitely.",
            },
            {
                type: "p",
                text: "We do not archive or back up submitted text or uploaded files. Content is retained only as described above.",
            },
            {
                type: "p",
                text: "Executable files and installers (such as .exe, .msi, .bat, .cmd, .scr, .jar, .apk, .dmg, .deb and .rpm) are blocked on every plan, including Pro. Pro uploads are also subject to a live storage allowance per license.",
            },
        ],
    },
    {
        title: "3. Cookies, Advertising & Third-Party Vendors",
        content: [
            {
                type: "p",
                text: "TextShareNow sets no first-party cookies except the Pro session cookie described above. We use Google Analytics and Google AdSense, plus Vercel Analytics for aggregate traffic and event measurement. Pro payments are handled separately by Gumroad.",
            },
            {
                type: "p",
                text: "Analytics — we use Google Analytics 4 to measure aggregate, anonymised usage of this site: which pages are visited, which devices and languages are used, and how visitors arrive here.",
            },
            {
                type: "p",
                text: "We also use Vercel Analytics, which counts page views and anonymous events (such as which pricing button was clicked) without cookies or cross-site tracking. Pro checkout clicks are stored in our own database only as aggregate numbers — never linked to you or your license key.",
            },
            {
                type: "p",
                text: "Advertising — we have integrated Google AdSense on this site, which may display advertisements. Google, as a third-party vendor, and its advertising partners may use cookies, including the DoubleClick cookie, to serve ads based on a visitor's prior visits to this site or other sites on the internet.",
            },
            {
                type: "p",
                text: "Payments — Pro subscriptions are processed by Gumroad. When you check out, you interact directly with Gumroad's website and their privacy policy governs the payment information you provide there. We never receive or store your card details.",
            },
            {
                type: "ul",
                items: [
                    "Google Analytics event data is kept only for the retention period configured in our Analytics property (Google's default is 2 months).",
                    "The lifetime of Google's advertising cookies is governed by Google's own cookie policy.",
                    "Anonymous Pro checkout click counts are stored in aggregate form for up to 400 days.",
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
                text: "All data in transit is encrypted using HTTPS/TLS, with HSTS enabled. Stored text is encrypted at rest with AES-256-GCM. In Private mode the text is also encrypted in your browser with a key we never receive. Uploaded files are stored on a dedicated server with strict access controls and are never served as static files. In Private file mode the contents are browser-encrypted before upload; we store only ciphertext and never receive the key.",
            },
            {
                type: "p",
                text: "Passwords are never sent to us in plaintext: your browser derives them with PBKDF2-HMAC-SHA256 (210,000 iterations), and we store only the derived verifier. For Private-mode shares we store a SHA-256 hash of the passphrase mix, never the mix itself.",
            },
            {
                type: "p",
                text: "Standard uploads are automatically scanned for malware using ClamAV before becoming available for download; files that fail the scan are immediately deleted. Private file mode is end-to-end encrypted, so the server cannot scan the contents. Only open encrypted files from senders you trust.",
            },
            {
                type: "p",
                text: "We apply rate limiting to prevent brute-force enumeration of codes. Each code allows a limited number of retrieval attempts per IP address per minute. Password-protected shares also delete themselves after ten wrong password attempts within a short window.",
            },
        ],
    },
    {
        title: "5. Third Parties",
        content: [
            {
                type: "p",
                text: "We do not sell, rent, or share your submitted text or uploaded files with any third parties. Your content is used solely to fulfil your transfer request and is then deleted as described above.",
            },
            {
                type: "p",
                text: "Gumroad processes Pro subscription payments and license verification. Their privacy policy applies to the information you provide at checkout.",
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
                text: "Because TextShareNow does not require accounts and deletes submitted content automatically after its last permitted read or when its timer ends, we generally do not hold personal data beyond short-lived server logs. Pro shares configured never to expire are retained until read (if a read limit applies) or removed for abuse. Any such request can be made using the contact details below.",
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
