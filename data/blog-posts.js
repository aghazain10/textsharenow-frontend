// data/blog-posts.js
// Single source of truth for blog content. Both pages/blog/index.vue and
// pages/blog/[slug].vue import from this file — add new posts here only.

export const blogPosts = [
    {
        slug: "how-to-share-text-from-phone-to-laptop",
        title: "The Fastest Way to Share Text From Your Phone to Your Laptop (No Cables)",
        excerpt:
            "Tired of emailing yourself URLs? Here are the five best methods for getting text off your phone and onto your laptop quickly — with a clear winner.",
        tag: "Guide",
        date: "January 2025",
        readTime: "4 min read",
        content: [
            {
                type: "p",
                text: "You are on your phone, you find a link you want to open on your laptop. What do you do? If you are like most people, you email it to yourself, or open a WhatsApp chat with yourself, or take a screenshot and retype it. Each method works — but none of them should take as long as they do.",
            },
            { type: "h2", text: "The 5 Common Methods (Ranked)" },
            { type: "h3", text: "5. Typing the URL manually" },
            {
                type: "p",
                text: "Obviously the worst option for long URLs. Only practical for short ones — even then, typos are common.",
            },
            { type: "h3", text: "4. Taking a screenshot and OCR" },
            {
                type: "p",
                text: "Some phones and browsers can extract text from screenshots now. It is clever but fiddly, and adds several steps.",
            },
            { type: "h3", text: "3. Emailing yourself" },
            {
                type: "p",
                text: "The classic. Open mail app, compose, send to yourself, open mail on laptop, find the email. Works every time — but takes 30–60 seconds and leaves a trail in your inbox forever.",
            },
            {
                type: "h3",
                text: "2. Messaging apps (WhatsApp, Telegram self-chat)",
            },
            {
                type: "p",
                text: "Faster than email if you already have the app open. But requires you to be logged in on both devices and the app to be installed.",
            },
            { type: "h3", text: "1. TextShareNow" },
            {
                type: "p",
                text: "Open the site on your phone. Paste. Get a 5-character code. Type the code on your laptop. Done in under 10 seconds, with zero setup, no account, and no data retained.",
            },
            {
                type: "callout",
                icon: "⚡",
                text: "The entire flow — paste to retrieve — takes under 8 seconds on a typical connection.",
            },
            { type: "h2", text: "When Each Method Makes Sense" },
            {
                type: "ul",
                items: [
                    "TextShareNow: Quick one-off transfers, any device, any network",
                    "Messaging apps: You already have the device open and chat visible",
                    "Email: Archiving the link for later reference (not just transferring it)",
                    "Screenshot/OCR: Text that cannot be copied from the source app",
                ],
            },
            { type: "h2", text: "The Bottom Line" },
            {
                type: "p",
                text: "For pure speed and simplicity, a tool built specifically for this task wins every time. TextShareNow requires nothing but a browser and the ability to type five characters.",
            },
        ],
    },
    {
        slug: "why-you-should-stop-emailing-yourself",
        title: "Why You Should Stop Emailing Yourself (And What to Use Instead)",
        excerpt:
            "Self-emailing is a productivity anti-pattern that wastes 30–60 seconds per transfer. Here is what professional users do instead.",
        tag: "Productivity",
        date: "January 2025",
        readTime: "3 min read",
        content: [
            {
                type: "p",
                text: "Self-emailing has become so normalised that most people do not even question it. But if you track how long it actually takes — opening the app, composing, sending, switching devices, finding the email — it is rarely under 30 seconds and often closer to a minute.",
            },
            {
                type: "p",
                text: "That is the best case. In practice, the email gets buried, you lose the link, or you forget to check your inbox on the other device.",
            },
            { type: "h2", text: "The Hidden Costs" },
            {
                type: "ul",
                items: [
                    "Inbox clutter: Every self-email is noise you have to delete later",
                    "Context switching: Opening and closing apps breaks your flow",
                    "Time: 30-60 seconds per transfer adds up significantly over a week",
                    "No auto-expiry: The link stays in your inbox forever, raising minor privacy concerns",
                ],
            },
            { type: "h2", text: "The Better Alternatives" },
            {
                type: "p",
                text: "For quick transfers, a purpose-built tool like TextShareNow is faster and cleaner. For keeping notes between sessions, a synced clipboard tool or a notes app (Notion, Apple Notes, Google Keep) is more appropriate.",
            },
            {
                type: "callout",
                icon: "💡",
                text: "The key distinction: if you are transferring something right now and do not need to keep it, use a transfer tool. If you need to archive it, use a notes app.",
            },
        ],
    },
    {
        slug: "airdrop-alternative-cross-platform",
        title: "The Best AirDrop Alternatives That Work Across Windows, Android, and iPhone",
        excerpt:
            "AirDrop is great — if you are in the Apple ecosystem. For everyone else, here are the real cross-platform alternatives.",
        tag: "Guide",
        date: "January 2025",
        readTime: "5 min read",
        content: [
            {
                type: "p",
                text: "AirDrop is genuinely excellent — when every device involved is made by Apple. The moment a Windows laptop, a Chromebook, or an Android phone enters the picture, it stops existing entirely. There is no AirDrop app for Android, no AirDrop setting in Windows. If you regularly move between platforms, you need something else.",
            },
            { type: "h2", text: "Why AirDrop Doesn't Work Everywhere" },
            {
                type: "p",
                text: "AirDrop relies on a proprietary combination of Bluetooth (for discovery) and a peer-to-peer Wi-Fi connection (for the actual transfer), built directly into Apple's operating systems. Apple has never licensed this protocol to other platforms, so there is no technical path for an Android or Windows device to participate — not even with a third-party app.",
            },
            { type: "h2", text: "Cross-Platform Alternatives, Compared" },
            { type: "h3", text: "Nearby Share (Google)" },
            {
                type: "p",
                text: "Google's answer to AirDrop, built into Android and available on ChromeOS and Windows via a companion app. It works well device-to-device on Google's side of the fence, but there is still no version for iPhone, so it does not solve a mixed Apple/Android household.",
            },
            { type: "h3", text: "Bluetooth File Transfer" },
            {
                type: "p",
                text: "Technically universal, since almost every device has Bluetooth. In practice, pairing is slow, transfer speeds are poor for anything beyond a small file, and the process differs enough between operating systems that it rarely feels simple.",
            },
            {
                type: "h3",
                text: "Cloud Storage (Google Drive, Dropbox, iCloud)",
            },
            {
                type: "p",
                text: "Reliable and genuinely cross-platform, but built for storage, not quick transfers. You need an account on both devices, an upload step, a sync delay, then a download step — reasonable for a large file you want to keep, overkill for a link you want to glance at once.",
            },
            { type: "h3", text: "TextShareNow" },
            {
                type: "p",
                text: "For text, links, and notes specifically, a short-code tool sidesteps the platform problem entirely — it runs in a browser, so it does not matter whether the sending device is an iPhone and the receiving one is a Windows laptop. Paste on one device, type the 5-character code on the other, done.",
            },
            {
                type: "callout",
                icon: "📎",
                text: "Worth noting: TextShareNow is built for text and links, not photos or large files — it is a focused fix for the specific AirDrop gap around quick text transfers, not a full file-sharing replacement.",
            },
            { type: "h2", text: "Which One Should You Actually Use" },
            {
                type: "ul",
                items: [
                    "Large files, same platform: AirDrop (Apple) or Nearby Share (Android)",
                    "Large files, mixed platforms: Cloud storage, accepting the extra steps",
                    "Text, links, or notes, any platform combination: A short-code tool like TextShareNow",
                    "No internet connection at all: Bluetooth, despite the slower speed",
                ],
            },
            { type: "h2", text: "The Bottom Line" },
            {
                type: "p",
                text: "There is no single perfect AirDrop replacement, because AirDrop bundles file transfer and cross-device convenience into one Apple-only feature. Splitting the problem — a dedicated tool for quick text and links, cloud storage for large files you want to keep — ends up faster than forcing one tool to do everything.",
            },
        ],
    },
    {
        slug: "qr-codes-vs-short-codes-device-sharing",
        title: "QR Codes vs Short Codes: Which Is Better for Phone-to-Laptop Sharing?",
        excerpt:
            "QR codes are everywhere — but they have a significant flaw when sharing from phone to laptop. Here is why short codes often win.",
        tag: "Comparison",
        date: "January 2025",
        readTime: "4 min read",
        content: [
            {
                type: "p",
                text: "QR codes are everywhere now — restaurant menus, Wi-Fi passwords taped to a router, boarding passes, payment terminals. They are a genuinely clever way to move a chunk of data onto a phone without typing. But that direction is the key word: onto a phone. Going the other way is where QR codes start to struggle.",
            },
            { type: "h2", text: "How Each Approach Actually Works" },
            { type: "h3", text: "QR Codes" },
            {
                type: "p",
                text: "A QR code encodes data as a scannable pattern. Something displays the code — a screen, a printed page — and a camera reads it. That camera is almost always a phone camera, which is why QR codes shine when a laptop or a poster is showing the code and a phone is doing the scanning.",
            },
            { type: "h3", text: "Short Codes" },
            {
                type: "p",
                text: "A short code is just a handful of characters, typed manually on the receiving device. No camera, no scanning app, no line of sight required — just a keyboard.",
            },
            { type: "h2", text: "The Core Problem: Phone to Laptop" },
            {
                type: "p",
                text: "Try scanning a QR code that is displayed on your phone using your laptop. Most laptops either have no camera at all facing the screen usefully, or a webcam positioned for video calls, not document scanning. You end up holding your phone up to your laptop's camera at an awkward angle, hoping it focuses — the exact friction QR codes are supposed to eliminate.",
            },
            { type: "h2", text: "Where QR Codes Still Win" },
            {
                type: "ul",
                items: [
                    "Laptop or screen displaying, phone scanning (e.g. Wi-Fi setup, event check-in)",
                    "Static content that does not change, like a printed menu or poster",
                    "Payment flows, where the QR code is part of a verified payment app",
                ],
            },
            { type: "h2", text: "Where Short Codes Win" },
            {
                type: "ul",
                items: [
                    "Phone to laptop transfers, since typing beats awkward camera angles",
                    "Devices without a usable camera, or with the camera disabled by IT policy",
                    "Situations where you want to type quickly rather than hold up a device to scan",
                    "Bidirectional sharing, since the same short code works either direction",
                ],
            },
            {
                type: "callout",
                icon: "🔍",
                text: "The honest takeaway: QR codes and short codes solve overlapping but different problems. QR codes are best when a phone camera can do the work; short codes are best when the phone is where the content starts.",
            },
            { type: "h2", text: "The Bottom Line" },
            {
                type: "p",
                text: "If you are sending something to a phone, a QR code is often the fastest option. If you are sending something from a phone — particularly to a laptop — a short, typeable code avoids the awkward scanning problem entirely. TextShareNow uses this exact approach for text and links.",
            },
        ],
    },
];
