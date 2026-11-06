/**
 * GET /ads.txt
 *
 * Redirects to Mediavine's hosted ads.txt so the partner list stays
 * up to date automatically. Mediavine keeps this file current.
 */
export default defineEventHandler(async (event) => {
    setHeader(event, "Cache-Control", "public, max-age=3600");
    return sendRedirect(
        event,
        "https://adstxt.journeymv.com/sites/313cf240-86a4-4ba2-a568-96247180b9f1/ads.txt",
        301,
    );
});
