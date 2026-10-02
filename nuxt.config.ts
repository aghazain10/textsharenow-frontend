import tailwindcss from "@tailwindcss/vite";
import type { Plugin } from "vite";
import { blogPosts } from "./data/blog-posts.js";

// Prerender every published post without editing this file: add a post in
// data/posts/ and it is registered in the build and the sitemap automatically.
const blogPrerender = Object.fromEntries(
    blogPosts.map((post) => [`/blog/${post.slug}`, { prerender: true }] as const),
);

export default defineNuxtConfig({
    devtools: { enabled: true },

    modules: ["@nuxt/fonts"],

    // Self-host Geist (downloaded at build time) with size-matched fallback fonts,
    // so text shows at once and doesn't jump when the real font arrives.
    fonts: {
        families: [
            { name: "Geist", provider: "google", weights: [400, 500, 600, 700, 800], styles: ["normal"], fallbacks: ["Arial"], preload: true },
            { name: "Geist Mono", provider: "google", weights: [500, 700], styles: ["normal"], fallbacks: ["Courier New"] },
        ],
        defaults: {
            subsets: ["latin"],
        },
    },

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
            ],
            script: [
                // Google Consent Mode v2 — must execute before any Google tag, including
                // adsbygoogle.js, so no analytics/advertising storage exists beforehand.
                // Unhead renders <script src> tags above inline ones, hence the priority.
                {
                    key: "tsn-consent-default",
                    tagPriority: -1000,
                    innerHTML:
                        'window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}' +
                        'gtag("consent","default",{ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",analytics_storage:"denied",wait_for_update:500});' +
                        'try{if(localStorage.getItem("tsn-consent")==="granted"){gtag("consent","update",{ad_storage:"granted",ad_user_data:"granted",ad_personalization:"granted",analytics_storage:"granted"});}}catch(e){}',
                },
                {
                    src: "https://www.googletagmanager.com/gtag/js?id=G-PXW7CX14YN",
                    async: true,
                },
                // GA4 init — runs after the consent default above.
                {
                    innerHTML: 'gtag("js",new Date());gtag("config","G-PXW7CX14YN");',
                },
                // Dark by default; a saved light/dark choice wins. Runs before first paint (no flash).
                {
                    innerHTML:
                        'var t="dark";try{t=localStorage.getItem("tsn-theme")||"dark"}catch(e){}document.documentElement.dataset.theme=t',
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
        "/author/zain-rizvee": { prerender: true },
        ...blogPrerender,
        "/sitemap.xml": { prerender: true },
        "/api/**": { cors: true },
    },

    compatibilityDate: "2024-04-03",
});
