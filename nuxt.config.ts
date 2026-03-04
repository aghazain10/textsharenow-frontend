import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },

    vite: {
        plugins: [tailwindcss() as any],
    },

    css: ["~/assets/css/main.css"],

    app: {
        head: {
            htmlAttrs: { lang: "en" },
            charset: "utf-8",
            viewport: "width=device-width, initial-scale=1",
            title: "TextShareNow — Instant Text Sharing Between Devices",
            meta: [
                {
                    name: "description",
                    content:
                        "Share text, links, and notes between your phone and laptop instantly. No app, no account — just paste, get a code, and retrieve on any device in seconds.",
                },
                { name: "theme-color", content: "#060a14" },
                { property: "og:type", content: "website" },
                {
                    property: "og:title",
                    content:
                        "TextShareNow — Instant Text Sharing Between Devices",
                },
                {
                    property: "og:description",
                    content:
                        "Share text, links, and notes between your phone and laptop instantly using a short code. No sign-up needed.",
                },
                { property: "og:site_name", content: "TextShareNow" },
                { name: "twitter:card", content: "summary_large_image" },
                {
                    name: "twitter:title",
                    content:
                        "TextShareNow — Instant Text Sharing Between Devices",
                },
                {
                    name: "twitter:description",
                    content:
                        "Share text between devices in seconds with a short code. Free, private, no account needed.",
                },
                { name: "robots", content: "index, follow" },
            ],
            link: [
                { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
                { rel: "canonical", href: "https://textsharenow.com" },
                { rel: "preconnect", href: "https://fonts.googleapis.com" },
                {
                    rel: "preconnect",
                    href: "https://fonts.gstatic.com",
                    crossorigin: "",
                },
                {
                    rel: "stylesheet",
                    href: "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;900&family=Exo+2:wght@300;400;500;600&family=JetBrains+Mono:wght@400;600&display=swap",
                },
            ],
        },
    },

    // Nuxt 3 SSR for SEO
    ssr: true,

    // Route rules for performance
    routeRules: {
        "/": { prerender: true },
        "/about": { prerender: true },
        "/privacy": { prerender: true },
        "/faq": { prerender: true },
        "/blog": { prerender: true },
    },

    compatibilityDate: "2024-04-03",
});
