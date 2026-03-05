/**
 * useSeo — sets page title, meta description, Open Graph tags, Twitter cards,
 * canonical link, and Google Search Console verification meta tag.
 * Call in each page's <script setup> (or globally in app.vue) to keep SEO consistent and DRY.
 */

export const useSeo = ({
    title,
    description,
    pagePath = "",
    googleVerification = "L--A8Gy198HynMrAU7tnLePL1DPX7tseeaSFYBBh9Bg", // ← your GSC code (default so it's always added unless overridden)
} = {}) => {
    // = {} makes all params optional
    const site = "TextShareNow";
    const base = "https://textsharenow.com"; // ← update to your future custom domain when you switch
    const full = title ? `${title} — ${site}` : site;

    useHead({
        title: full,
        meta: [
            { name: "description", content: description },
            { property: "og:title", content: full },
            { property: "og:description", content: description },
            { property: "og:url", content: `${base}${pagePath}` },
            { name: "twitter:title", content: full },
            { name: "twitter:description", content: description },

            // Google verification tag — only added if a value exists (prevents empty tag)
            ...(googleVerification
                ? [
                      {
                          name: "google-site-verification",
                          content: googleVerification,
                      },
                  ]
                : []),
        ],
        link: [{ rel: "canonical", href: `${base}${pagePath}` }],
    });
};
