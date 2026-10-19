// Free vs premium limits — the single source of truth for both
// client validation/labels and server validation.
export const FREE_MAX_CHARS = 10000;
export const PRO_MAX_CHARS = 100000;

export const FREE_MAX_FILE = 10 * 1024 * 1024;
export const PRO_MAX_FILE = 100 * 1024 * 1024;

export const FREE_FILE_ACCEPT = "image/png,image/jpeg,image/webp,video/mp4,video/webm";
export const FREE_FILE_LABEL = "PNG, JPEG, WebP, MP4, WebM";
export const PRO_FILE_LABEL = "Any non-executable type";

export const FREE_MAX_READS = 1;

// TTLs offered for file shares (seconds). The files service hard-caps free
// uploads at 3600s; longer TTLs are authorized via an upload ticket.
export const FILE_TTLS = [600, 1800, 3600, 86400, 604800, 2592000];
export const FILE_TICKET_TTL = 600; // must upload within 10 minutes of minting
