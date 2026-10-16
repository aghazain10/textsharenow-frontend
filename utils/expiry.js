// Expiry choices offered for text and file shares (in seconds).
// value 0 = never auto-delete. Pro-only options are flagged and hidden
// until premium is active.
export const EXPIRY_OPTIONS = [
    { value: 600, label: "10 min" },
    { value: 1800, label: "30 min" },
    { value: 3600, label: "1 h" },
    { value: 86400, label: "1 day", pro: true },
    { value: 604800, label: "7 days", pro: true },
    { value: 2592000, label: "30 days", pro: true },
    { value: 0, label: "Never", pro: true },
];

// File shares always need a TTL (the files service expects one),
// so "Never" is text-only.
export const FILE_EXPIRY_OPTIONS = EXPIRY_OPTIONS.filter((o) => o.value !== 0);

export const DEFAULT_EXPIRY = 600;

// Human label for a TTL, falling back to plain minutes for odd values.
export const expiryLabel = (seconds) =>
    EXPIRY_OPTIONS.find((o) => o.value === seconds)?.label ||
    (seconds === 0 ? "Never" : `${Math.round(seconds / 60)} min`);
