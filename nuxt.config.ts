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
        // Gumroad product behind Pro (license-key verification).
        GUMROAD_PRODUCT_ID: process.env.GUMROAD_PRODUCT_ID || "mxmFVLmVr5JZImT_nJazIw==",
        // Secret for signing the pro session cookie. Falls back to a value
        // derived from the Upstash token so no secret lives in the repo;
        // set explicitly in production if you prefer (PRO_SECRET=...).
        PRO_SECRET: process.env.PRO_SECRET || "",
        // Public (exposed to browser)
        public: {
            FILES_API_URL: process.env.NUXT_PUBLIC_FILES_API_URL || "https://files.textsharenow.com",
            // Gumroad checkout page for the Pro membership.
            PRO_URL: process.env.NUXT_PUBLIC_PRO_URL || "https://textsharenow.gumroad.com/l/pro",
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
                { name: "google-adsense-account", content: "ca-pub-7341551960731079" },
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
                {
                    src: "https://www.googletagmanager.com/gtag/js?id=G-PXW7CX14YN",
                    async: true,
                },
                {
                    innerHTML: 'window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","G-PXW7CX14YN");',
                },
                // Dark by default; a saved light/dark choice wins. Runs before first paint (no flash).
                {
                    innerHTML:
                        'var t="dark";try{t=localStorage.getItem("tsn-theme")||"dark"}catch(e){}document.documentElement.dataset.theme=t',
                    tagPosition: "head",
                },
                {
                    src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7341551960731079",
                    async: true,
                    crossorigin: "anonymous",
                },
            ],
        },
    },

    ssr: true,

    // /go/pro is a redirect route, not a page — keep the prerender crawler
    // from following it to Gumroad.
    nitro: {
        prerender: {
            ignore: ["/go", "/go/**"],
        },
    },

    routeRules: {
        "/": { prerender: true },
        "/about": { prerender: true },
        "/privacy": { prerender: true },
        "/terms": { prerender: true },
        "/abuse": { prerender: true },
        "/faq": { prerender: true },
        "/contact": { prerender: true },
        "/blog": { prerender: true },
        "/how-it-works": { prerender: true },
        "/pricing": { prerender: true },
        "/online-text-sharing": { prerender: true },
        "/share-files-online": { prerender: true },
        "/developers": { prerender: true },
        "/r": { prerender: true },
        "/author/zain-rizvee": { prerender: true },
        ...blogPrerender,
        "/sitemap.xml": { prerender: true },
        "/api/**": { cors: true },
    },

    compatibilityDate: "2024-04-03",
});
