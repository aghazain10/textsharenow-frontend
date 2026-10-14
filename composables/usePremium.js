// Preview toggle for premium features until auth + payments land.
// Shared global state so the send/receive components stay in sync.
export function usePremium() {
    const isPro = useState("premium-preview", () => false);
    return { isPro };
}
