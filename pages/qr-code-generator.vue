<template>
    <div>
        <ToolPageHero
            eyebrow="QR code generator"
            title="QR code generator — free, no sign-up, no upload"
            lead="Make a QR code for a link, Wi-Fi network, contact card, email, SMS or WhatsApp message. Everything is generated in your browser, downloads as PNG or print-ready SVG, and never carries a watermark."
            :badges="badges"
            footnote="Generated on this device · Nothing is uploaded or stored"
        >
            <QrStudio />
        </ToolPageHero>

        <!-- What you can make -->
        <section class="border-t border-line px-4 py-12 sm:py-16" aria-labelledby="qr-types-title">
            <div class="tool-wrap">
                <p class="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">One generator, four jobs</p>
                <h2 id="qr-types-title" class="mt-2 max-w-[28ch] text-[clamp(1.6rem,3.2vw,2.25rem)] font-bold leading-[1.1] tracking-[-0.03em]">
                    Links, Wi-Fi, contact cards and messages
                </h2>
                <p class="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-muted">
                    Pick the type above and the form changes to match. The code is built from the data you type, so there is no redirect,
                    no account and no scan tracking.
                </p>

                <div class="mt-7 grid gap-px overflow-hidden rounded-xl border border-line bg-line shadow-card sm:grid-cols-2 lg:grid-cols-4">
                    <article v-for="type in types" :key="type.title" class="bg-surface p-5 sm:p-6">
                        <span class="grid h-9 w-9 place-items-center rounded-lg border border-line bg-bg text-ink shadow-card">
                            <TsnIcon :name="type.icon" class="h-4 w-4" stroke="1.9" />
                        </span>
                        <h3 class="mt-4 text-[16px] font-semibold tracking-[-0.01em]">{{ type.title }}</h3>
                        <p class="mt-2 text-[14px] leading-relaxed text-muted">{{ type.desc }}</p>
                    </article>
                </div>
            </div>
        </section>

        <ToolCompare
            eyebrow="Why make it here"
            title="A QR code should not need an account or a watermark"
            local-label="This generator"
            typical-label="Typical hosted QR service"
            :rows="compareRows"
        >
            <p class="mt-4 text-[15px] leading-relaxed text-muted">
                A static QR code contains the data itself. That means the code keeps working without a server, a redirect, or a
                subscription — and nobody can switch it off later.
            </p>
            <p class="mt-3 text-[15px] leading-relaxed text-muted">
                It also means you can print it once. A menu, Wi-Fi sign or event page can change behind the link without reprinting the
                code, because the scanner reads the URL from the code, not from our database.
            </p>
            <ul class="mt-5 space-y-2.5 text-[14px] leading-relaxed text-muted">
                <li class="flex items-start gap-2">
                    <TsnIcon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-ink" stroke="2.4" />
                    Free PNG and SVG downloads, with no watermark and no sign-up.
                </li>
                <li class="flex items-start gap-2">
                    <TsnIcon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-ink" stroke="2.4" />
                    The SVG is vector, so it stays sharp on a business card or a poster.
                </li>
                <li class="flex items-start gap-2">
                    <TsnIcon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-ink" stroke="2.4" />
                    Nothing you type is sent to a server, logged, or attached to a scan count.
                </li>
            </ul>
        </ToolCompare>

        <section class="border-t border-line px-4 py-12 sm:py-16" aria-labelledby="qr-steps-title">
            <div class="tool-wrap">
                <p class="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">How it works</p>
                <h2 id="qr-steps-title" class="mt-2 max-w-[26ch] text-[clamp(1.6rem,3.2vw,2.25rem)] font-bold leading-[1.1] tracking-[-0.03em]">
                    Three steps from data to a printed code
                </h2>
                <ToolSteps :steps="steps" :cols="3" />
            </div>
        </section>

        <ToolFaq
            title="QR codes: questions"
            lead="What a static code can do, how scanning works, and what to check before you print one."
            :items="faqs"
        />

        <ToolFooter
            tool="qr-code-generator"
            path="/qr-code-generator"
            label="the QR code generator"
            :items="related"
        />
    </div>
</template>

<script setup>
useSeo({
    title: "QR Code Generator — Free Wi-Fi, vCard & Link QR Codes",
    description:
        "Create QR codes for links, Wi-Fi, contact cards, email, SMS and WhatsApp in your browser. Free PNG and SVG downloads, no account, no watermark, nothing uploaded.",
    pagePath: "/qr-code-generator",
});

const badges = [
    { icon: "lock", label: "No upload" },
    { icon: "qr", label: "Link · Wi-Fi · vCard" },
    { icon: "download", label: "PNG + SVG" },
    { icon: "check", label: "No watermark" },
];

const types = [
    {
        icon: "link",
        title: "Links & text",
        desc: "Menus, forms, event pages, portfolios, coupon codes or a plain note. The scanner opens the URL or shows the text.",
    },
    {
        icon: "wifi",
        title: "Wi-Fi access",
        desc: "Guests scan to join the network without typing a long password. Great for cafés, guest rooms and offices.",
    },
    {
        icon: "user",
        title: "Contact cards",
        desc: "Encode a vCard with name, phone, email and website. Scanning offers to save the details straight to contacts.",
    },
    {
        icon: "mail",
        title: "Email & messages",
        desc: "Open a pre-filled email, SMS or WhatsApp chat, or dial a number. The scanner still has to press send.",
    },
];

const compareRows = [
    { label: "Account required", local: "None", typical: "Sometimes required" },
    { label: "Watermark on download", local: "None", typical: "Common on free tiers" },
    { label: "SVG export", local: "Free", typical: "Often paid or missing" },
    { label: "Code expiry", local: "Never — static", typical: "Dynamic codes can be disabled" },
    { label: "Scan limit", local: "Unlimited", typical: "Some services meter scans" },
    { label: "Data lives in", local: "The code itself", typical: "A redirect, for dynamic codes" },
];

const steps = [
    {
        icon: "qr",
        title: "Pick the type",
        body: "Choose link or text, Wi-Fi, contact card, or a message. The form only asks for the fields that type needs.",
    },
    {
        icon: "eye",
        title: "Fill in the details",
        body: "The preview updates as you type. Everything is encoded in your browser; nothing is uploaded or saved.",
    },
    {
        icon: "download",
        title: "Download and print",
        body: "Save a PNG for screens and chat, or an SVG for print. There is no watermark, no sign-up and no scan limit.",
    },
];

const faqs = [
    {
        q: "Is this QR code generator free?",
        a: "Yes. Every type — link, Wi-Fi, contact card, email, SMS and WhatsApp — is free, and both PNG and SVG downloads are included. There is no account, no watermark and no daily limit.",
    },
    {
        q: "Do QR codes expire?",
        a: "Static QR codes like these do not expire. The data is encoded directly in the pattern, so there is no redirect to switch off. The page a link points to can change or go offline, but the code itself keeps working. Dynamic QR codes sold by some services do expire because they point at a short URL on that service's server.",
    },
    {
        q: "Are my details uploaded?",
        a: "No. The QR code is generated in JavaScript inside this page. The text, Wi-Fi password, contact details and message never reach a server, so there is no copy to log or delete. The page itself is downloaded from our server; the fields you type are not.",
    },
    {
        q: "How do I create a Wi-Fi QR code?",
        a: "Choose the Wi-Fi tab, enter the network name (SSID), pick the security type and enter the password. The code encodes the network details in the standard WIFI: format, so iPhone and Android cameras can offer to join. Test it on a second device before printing it.",
    },
    {
        q: "What is a vCard QR code?",
        a: "A vCard QR code contains a contact card: name, organization, phone, email and website. When someone scans it, their phone offers to add the details to contacts. It is a quick way to share business details without a paper card.",
    },
    {
        q: "Should I download PNG or SVG?",
        a: "Use SVG for anything printed — business cards, posters, menus, stickers — because it stays sharp at any size. Use PNG for screens, slides, email and chat. If you need PNG for print, choose 2048 px and check it at the final size.",
    },
    {
        q: "Why won't my QR code scan?",
        a: "The most common causes are low contrast, a code that is too small, or cropping the white border around it. Keep the quiet zone, print dark modules on a light background, and leave at least 2 cm of width for a phone camera. Very long text also creates a denser code that is harder to scan, so shorten it if possible.",
    },
    {
        q: "Is it safe to put a Wi-Fi password in a QR code?",
        a: "Anyone who can see and scan the code can read the password. Treat a Wi-Fi QR like writing the password on the wall: use a guest network, avoid putting it where the public can photograph it, and change the password if the code is shared more widely than intended.",
    },
    {
        q: "Do these QR codes track scans?",
        a: "No. There is no redirect and no scan counter. The code contains your data directly, so scanning it does not contact TextShareNow or tell us anything about the person scanning it.",
    },
];

const related = [
    { to: "/image-compressor", icon: "image", title: "Image Compressor", desc: "Compress or convert a photo to an exact size, locally in your browser." },
    { to: "/pdf-tools", icon: "pdf", title: "Combine PDF Files", desc: "Combine, split or compress PDFs without uploading the documents." },
    { to: "/exif-remover", icon: "map-pin", title: "EXIF / Location Remover", desc: "Strip GPS and camera metadata from a photo before sharing it." },
];

useHead({
    script: [
        {
            type: "application/ld+json",
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@graph": [
                    {
                        "@type": "WebApplication",
                        name: "QR Code Generator",
                        url: "https://www.textsharenow.com/qr-code-generator",
                        description:
                            "Create QR codes for links, Wi-Fi, contact cards, email and messages in the browser. Free PNG and SVG downloads with no account or watermark.",
                        applicationCategory: "UtilitiesApplication",
                        operatingSystem: "Any",
                        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
                        featureList: [
                            "Link and text QR codes",
                            "Wi-Fi QR codes",
                            "vCard contact QR codes",
                            "Email, SMS and WhatsApp QR codes",
                            "PNG and SVG export",
                        ],
                    },
                    {
                        "@type": "FAQPage",
                        mainEntity: faqs.map((faq) => ({
                            "@type": "Question",
                            name: faq.q,
                            acceptedAnswer: { "@type": "Answer", text: faq.a },
                        })),
                    },
                ],
            }),
        },
    ],
});
</script>
