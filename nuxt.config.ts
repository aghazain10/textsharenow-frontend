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
        // Gumroad ping endpoint shared secret. Set the same value in the
        // Gumroad product's "Ping URL" as ?secret=... (or leave unset to
        // disable the endpoint entirely). NUXT_ prefix allows overriding at
        // runtime without rebuilding.
        GUMROAD_PING_SECRET: process.env.NUXT_GUMROAD_PING_SECRET || process.env.GUMROAD_PING_SECRET || "",
        // GA4 Measurement Protocol credentials for server-confirmed events
        // (checkout_completed, pro_deactivated). The measurement ID matches
        // the gtag property in the app head by default.
        GA4_API_SECRET: process.env.NUXT_GA4_API_SECRET || process.env.GA4_API_SECRET || "",
        GA4_MEASUREMENT_ID: process.env.NUXT_GA4_MEASUREMENT_ID || process.env.GA4_MEASUREMENT_ID || "G-PXW7CX14YN",
        // Shared with the files service so dashboard deletes are authenticated.
        FILES_DELETE_SECRET: process.env.FILES_DELETE_SECRET || "",
        // Resend (mail.textsharenow.com, verified). EMAIL_SENDING=disabled mutes everything.
        RESEND_API_KEY: process.env.NUXT_RESEND_API_KEY || process.env.RESEND_API_KEY || "",
        EMAIL_FROM: process.env.EMAIL_FROM || "TextShareNow <no-reply@mail.textsharenow.com>",
        EMAIL_SENDING: process.env.EMAIL_SENDING || "",
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
            ],
            link: [
                { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
                { rel: "canonical", href: "https://www.textsharenow.com" },
            ],
            script: [
                // Mediavine ad script — placed first for earlier execution (higher bids)
                {
                    src: "//scripts.scriptwrapper.com/tags/313cf240-86a4-4ba2-a568-96247180b9f1.js",
                    type: "text/javascript",
                    async: true,
                    "data-noptimize": "1",
                    "data-cfasync": "false",
                },
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
        "/tools": { prerender: true },
        "/image-compressor": { prerender: true },
        "/pdf-tools": { prerender: true },
        "/exif-remover": { prerender: true },
        "/qr-code-generator": { prerender: true },
        "/developers": { prerender: true },
        "/security": { prerender: true },
        "/r": { prerender: true },
        "/author/zain-rizvee": { prerender: true },
        ...blogPrerender,
        "/sitemap.xml": { prerender: true },
    },

    compatibilityDate: "2024-04-03",
});
