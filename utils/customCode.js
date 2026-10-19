// Custom share codes (Pro) — one source of truth for client validation and
// server enforcement. Codes are stored lowercase; lookup tries both the
// lowercase (custom) and uppercase (random 5-char) forms of what's typed.

export const CUSTOM_CODE_MIN = 3;
export const CUSTOM_CODE_MAX = 30;
export const CUSTOM_CODE_RE = /^[a-z0-9][a-z0-9_-]{2,29}$/;

// Site paths and sensitive-looking names a custom code must never shadow.
export const RESERVED_CODES = new Set([
    "r", "api", "admin", "login", "signup", "register", "logout", "app",
    "dashboard", "settings", "static", "assets", "public", "robots",
    "sitemap", "favicon", "terms", "privacy", "pricing", "faq", "blog",
    "about", "contact", "how-it-works", "share-files-online", "pro",
    "premium", "textsharenow", "www", "mail", "support", "help", "docs",
    "status", "health", "ping", "oauth", "auth", "user", "users",
    "account", "accounts", "download", "downloads", "upload", "uploads",
    "files", "file", "text", "send", "receive", "view", "open", "create",
    "new", "test", "demo", "null", "undefined", "root", "me", "security",
    "billing", "payment", "payments", "subscribe", "checkout", "cdn",
    "media", "images", "graphql", "swagger", "wp", "phpmyadmin",
    "server-status", "author", "blog-rss", "rss", "feed", "ads", "ad",
]);

export const normalizeCustomCode = (s) =>
    String(s ?? "").toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, CUSTOM_CODE_MAX);

export const isValidCustomCode = (s) => CUSTOM_CODE_RE.test(s) && !RESERVED_CODES.has(s);
