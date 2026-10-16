// Free vs premium limits — the single source of truth for both
// client validation/labels and server validation.
export const FREE_MAX_CHARS = 10000;
export const PRO_MAX_CHARS = 100000;

export const FREE_MAX_FILE = 10 * 1024 * 1024;
export const PRO_MAX_FILE = 100 * 1024 * 1024;

export const FREE_FILE_ACCEPT = "image/png,image/jpeg,image/webp,video/mp4,video/webm";
export const FREE_FILE_LABEL = "PNG, JPEG, WebP, MP4, WebM";
export const PRO_FILE_LABEL = "Any file type";

export const FREE_MAX_READS = 1;
