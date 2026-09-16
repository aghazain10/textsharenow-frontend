import tailwindcss from "@tailwindcss/vite";
import type { Plugin } from "vite";

export default defineNuxtConfig({
    devtools: { enabled: true },

    modules: [],

    vite: {
        plugins: [tailwindcss() as unknown as Plugin],
    },

    css: ["~/assets/css/fonts.css", "~/assets/css/main.css"],

    // ── Env vars ─────────────────────────────────────────────────────────────
    runtimeConfig: {
        // Server-only (not exposed to browser)
        UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL || "",
        UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN || "",
        // Public (exposed to browser)
        public: {
            FILES_API_URL: process.env.NUXT_PUBLIC_FILES_API_URL || "https://files.textsharenow.com",
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
                { name: "theme-color", content: "#060a14" },
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
                {
                    rel: "preload",
                    href: "/fonts/orbitron-latin.woff2",
                    as: "font",
                    type: "font/woff2",
                    crossorigin: "",
                },
                {
                    rel: "preload",
                    href: "/fonts/exo2-latin.woff2",
                    as: "font",
                    type: "font/woff2",
                    crossorigin: "",
                },
                {
                    rel: "preload",
                    href: "/fonts/jetbrains-mono-latin.woff2",
                    as: "font",
                    type: "font/woff2",
                    crossorigin: "",
                },
            ],
            script: [
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
        "/blog/airdrop-alternative-cross-platform": { prerender: true },
        "/blog/airdrop-alternative-for-windows": { prerender: true },
        "/api/**": { cors: true },
    },

    compatibilityDate: "2024-04-03",
});
