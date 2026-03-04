/**
 * useSeo — sets page title, meta description, and Open Graph tags.
 * Call in each page's <script setup> to keep SEO consistent and DRY.
 */

export const useSeo = ({ title, description, pagePath = '' }) => {
  const site = 'TextShareNow'
  const base = 'https://textsharenow.com'
  const full = title ? `${title} — ${site}` : site

  useHead({
    title: full,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: full },
      { property: 'og:description', content: description },
      { property: 'og:url', content: `${base}${pagePath}` },
      { name: 'twitter:title', content: full },
      { name: 'twitter:description', content: description },
    ],
    link: [
      { rel: 'canonical', href: `${base}${pagePath}` },
    ],
  })
}
