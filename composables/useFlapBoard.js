/**
 * useFlapBoard — the split-flap "departure board" animation used for codes.
 * Each flap spins through random characters, then lands on its letter, left to right.
 */
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export const flipTo = (flaps, word, { spins = 7, speed = 55, stagger = 90 } = {}) => {
    const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
        flaps.forEach((f, i) => (f.textContent = word[i] ?? ""));
        return Promise.resolve();
    }
    return Promise.all(
        flaps.map(
            (f, i) =>
                new Promise((done) => {
                    let n = 0;
                    const total = spins + i * Math.round(stagger / speed);
                    const step = () => {
                        f.classList.remove("tick");
                        void f.offsetWidth;
                        f.classList.add("tick");
                        if (n++ >= total) {
                            f.textContent = word[i] ?? "";
                            return done();
                        }
                        f.textContent = ALPHABET[(Math.random() * ALPHABET.length) | 0];
                        setTimeout(step, speed);
                    };
                    step();
                }),
        ),
    );
};

/** Copy with a fallback for browsers that block the async clipboard API. */
export const copyText = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        const el = document.createElement("textarea");
        el.value = text;
        el.style.cssText = "position:fixed;opacity:0";
        document.body.appendChild(el);
        el.select();
        let ok = false;
        try { ok = document.execCommand("copy"); } catch {}
        el.remove();
        return ok;
    }
};
