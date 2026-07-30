export default defineEventHandler((event) => {
    const host = getRequestHost(event);

    if (host.includes("vercel.app")) {
        const url = getRequestURL(event);
        return sendRedirect(
            event,
            `https://www.textsharenow.com${url.pathname}${url.search}`,
            308,
        );
    }
});
