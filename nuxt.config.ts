import tailwindcss from "@tailwindcss/vite";
import type { Plugin } from "vite";

export default defineNuxtConfig({
    devtools: { enabled: true },

    modules: [],

    vite: {
        plugins: [tailwindcss() as unknown as Plugin],
    },

    css: ["~/assets/css/main.css"],

    // ── Env vars ─────────────────────────────────────────────────────────────
    runtimeConfig: {
        // Server-only (not exposed to browser)
        UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL || "",
        UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN || "",
        // Public (exposed to browser)
        public: {
            FILES_API_URL: process.env.NUXT_PUBLIC_FILES_API_URL || "https://files.textsharenow.com",
            // Where /api/share and /api/stats live. Empty = this same server (production).
            // Set NUXT_PUBLIC_API_BASE=https://www.textsharenow.com locally to test against the live API.
            API_BASE: process.env.NUXT_PUBLIC_API_BASE || "",
        },
    },

    app: {
        head: {
            htmlAttrs: { lang: "en" },
            charset: "utf-8",
            viewport: "width=device-width, initial-scale=1",
            title: "TextShareNow — Instant Text and File Sharing Between Devices",
            meta: [
                {
                    name: "description",
                    content:
                        "Share text, files, links, and notes between your phone and laptop instantly. No app, no account — just paste, get a code, and retrieve on any device in seconds.",
                },
                { name: "theme-color", content: "#09090b" },
                { property: "og:type", content: "website" },
                {
                    property: "og:title",
                    content:
                        "TextShareNow — Instant Text and File Sharing Between Devices",
                },
                {
                    property: "og:description",
                    content:
                        "Share text, files, links, and notes between your phone and laptop instantly using a short code. No sign-up needed.",
                },
                { property: "og:site_name", content: "TextShareNow" },
                { name: "twitter:card", content: "summary_large_image" },
                {
                    name: "twitter:title",
                    content:
                        "TextShareNow — Instant Text and File Sharing Between Devices",
                },
                {
                    name: "twitter:description",
                    content:
                        "Share text and files between devices in seconds with a short code. Free, private, no account needed.",
                },
                { name: "robots", content: "index, follow" },
                { name: "google-adsense-account", content: "ca-pub-6697676712322371" },
            ],
            link: [
                { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
                { rel: "canonical", href: "https://www.textsharenow.com" },
                {
                    rel: "preconnect",
                    href: "https://pagead2.googlesyndication.com",
                    crossorigin: "",
                },
                {
                    rel: "dns-prefetch",
                    href: "https://pagead2.googlesyndication.com",
                },
                { rel: "preconnect", href: "https://fonts.googleapis.com" },
                { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
                {
                    rel: "stylesheet",
                    href: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&family=Geist+Mono:wght@500;700&display=swap",
                },
            ],
            script: [
                // Apply the saved light/dark choice before first paint (no flash)
                {
                    innerHTML:
                        'try{var t=localStorage.getItem("tsn-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}',
                    tagPosition: "head",
                },
                {
                    src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6697676712322371",
                    async: true,
                    crossorigin: "anonymous",
                },
            ],
        },
    },

    ssr: true,

    routeRules: {
        "/": { prerender: true },
        "/about": { prerender: true },
        "/privacy": { prerender: true },
        "/terms": { prerender: true },
        "/faq": { prerender: true },
        "/contact": { prerender: true },
        "/blog": { prerender: true },
        "/how-it-works": { prerender: true },
        "/online-text-sharing": { prerender: true },
        "/share-files-online": { prerender: true },
        "/r": { prerender: true },
        "/blog/airdrop-alternative-cross-platform": { prerender: true },
        "/blog/airdrop-alternative-for-windows": { prerender: true },
        "/blog/how-to-share-text-from-phone-to-laptop": { prerender: true },
        "/blog/why-you-should-stop-emailing-yourself": { prerender: true },
        "/blog/qr-codes-vs-short-codes-device-sharing": { prerender: true },
        "/blog/share-code-snippets-between-devices-for-developers": { prerender: true },
        "/blog/iphone-windows-text-transfer-without-icloud": { prerender: true },
        "/blog/share-wifi-password-without-reading-aloud": { prerender: true },
        "/blog/clipboard-manager-vs-text-sharing-tool": { prerender: true },
        "/blog/share-long-urls-without-breaking-links": { prerender: true },
        "/blog/signs-you-need-better-device-sharing": { prerender: true },
        "/blog/share-text-privately-without-chat-history": { prerender: true },
        "/blog/transfer-text-from-android-to-mac": { prerender: true },
        "/blog/online-text-sharing-vs-apps": { prerender: true },
        "/blog/how-to-send-photo-without-losing-quality": { prerender: true },
        "/blog/free-temporary-file-sharing": { prerender: true },
        "/blog/how-to-send-small-video-without-email-limits": { prerender: true },
        "/blog/screenshot-to-second-device-in-seconds": { prerender: true },
        "/api/**": { cors: true },
    },

    compatibilityDate: "2024-04-03",
});
