// Expiry choices offered for both text and file shares (in seconds).
export const EXPIRY_OPTIONS = [
    { seconds: 600, label: "10 min" },
    { seconds: 1800, label: "30 min" },
    { seconds: 3600, label: "1 h" },
];

export const DEFAULT_EXPIRY = 600;

// Human label for a TTL, falling back to plain minutes for odd values.
export const expiryLabel = (seconds) =>
    EXPIRY_OPTIONS.find((o) => o.seconds === seconds)?.label || `${Math.round(seconds / 60)} min`;
