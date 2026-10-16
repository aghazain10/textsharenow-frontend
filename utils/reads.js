// How many times a premium share may be read. 1 = burn after read (free
// default), 0 = unlimited.
export const READ_OPTIONS = [
    { value: 1, label: "1 read" },
    { value: 5, label: "5 reads", pro: true },
    { value: 10, label: "10 reads", pro: true },
    { value: 0, label: "Unlimited", pro: true },
];

export const DEFAULT_READS = 1;

export const readLabel = (value) =>
    READ_OPTIONS.find((o) => o.value === value)?.label || `${value} reads`;
