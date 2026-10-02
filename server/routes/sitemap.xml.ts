/**
 * GET /sitemap.xml
 *
 * Built from data/blog-posts.js at build time (prerendered via routeRules),
 * so a new post is listed without touching any config or XML file.
 * /r is intentionally absent — shared content is noindex.
 */
import { blogPosts } from '~~/data/blog-posts.js'

const BASE = 'https://www.textsharenow.com'

// lastmod / priority for pages that are not posts. Bump lastmod when one changes.
const staticPages = [
  { path: '/', lastmod: '2026-09-17', priority: '1.00' },
  { path: '/about', lastmod: '2026-09-17', priority: '0.80' },
  { path: '/how-it-works', lastmod: '2026-09-17', priority: '0.80' },
  { path: '/faq', lastmod: '2026-09-17', priority: '0.80' },
  { path: '/contact', lastmod: '2026-08-25', priority: '0.70' },
  { path: '/privacy', lastmod: '2026-10-02', priority: '0.60' },
  { path: '/terms', lastmod: '2026-09-17', priority: '0.60' },
  { path: '/online-text-sharing', lastmod: '2026-09-17', priority: '0.90' },
  { path: '/share-files-online', lastmod: '2026-09-17', priority: '0.90' },
  { path: '/blog', lastmod: '2026-09-17', priority: '0.80' },
  { path: '/author/zain-rizvee', lastmod: '2026-10-02', priority: '0.60' },
]

const entry = (loc: string, lastmod: string, priority: string) =>
  `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}T00:00:00+00:00</lastmod>\n    <priority>${priority}</priority>\n  </url>`

export default defineEventHandler((event) => {
  const urls = [
    ...staticPages.map((p) => entry(`${BASE}${p.path}`, p.lastmod, p.priority)),
    ...blogPosts.map((post) => entry(`${BASE}/blog/${post.slug}`, post.dateModified || post.datePublished, '0.64')),
  ]

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
})
