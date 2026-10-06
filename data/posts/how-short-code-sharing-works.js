export default {
    "slug": "how-short-code-sharing-works",
    "title": "How Short-Code Sharing Works: Codes, TTLs, and Single-Read Storage",
    "excerpt": "Five characters, ten minutes, one key in a key-value store. Code space math, collisions, rate limits, and what the server really sees.",
    "tag": "Technical",
    "date": "October 2026",
    "datePublished": "2026-10-02",
    "dateModified": "2026-10-02",
    "readTime": "8 min read",
    "content": [
        {
            "type": "p",
            "text": "A short code looks like a magic trick: paste text on one device, type five characters on another, and the text appears. Nothing about the mechanism is magic. It is one key-value write, one timer, one read, and one delete — and every interesting design decision sits in the details of those four operations: which characters go in a code, how long the key lives, who is allowed to ask for it, and what happens the moment somebody does."
        },
        {
            "type": "p",
            "text": "This walkthrough follows one concrete implementation — a 5-character code, a 600-second lifetime, a Redis key — because concrete numbers make the trade-offs visible. The pattern generalises to any code-based transfer service, so substitute your own parameters where they differ."
        },
        {
            "type": "h2",
            "text": "The Code Is a Pointer, Not the Payload"
        },
        {
            "type": "p",
            "text": "The central decision is what travels between the devices. One option is the content itself: put the whole text in the URL and hand the receiver a link. That fails immediately for anything longer than a line or two, and it leaves the content sitting in browser history, referrer headers, and proxy logs on every machine that touches it."
        },
        {
            "type": "p",
            "text": "The other option is a pointer. The sender's device uploads the content once, the server stores it under a key, and the receiver receives only the key — five characters that reveal nothing about what they open. The content stays in exactly one place for its whole lifetime, and the receiver's request is what goes and fetches it. Everything else in the system exists to make that pointer safe to hand around: short enough to type, large enough not to collide, constrained enough not to be enumerated, and time-limited enough that a leaked pointer expires before anyone finds it."
        },
        {
            "type": "h2",
            "text": "Choosing the Alphabet and the Length"
        },
        {
            "type": "p",
            "text": "A code is a number written in another base. Its total number of possible values — the code space — is the alphabet size raised to the power of the code length. Choosing an alphabet is therefore a security decision disguised as a typing decision."
        },
        {
            "type": "table",
            "caption": "Code space for common choices. The rows differ by orders of magnitude, but only some of them are easy to read aloud.",
            "head": ["Alphabet", "Length", "Possible codes", "Main trade-off"],
            "rows": [
                ["Digits only (0–9)", "5", "100,000", "Trivial to type, far too small to resist guessing."],
                ["A–Z + 0–9 (36)", "5", "60,466,176", "Larger, but full of look-alike pairs such as I/l, O/0, S/5."],
                ["A–Z + 2–9, minus I/O/0/1 (32)", "4", "1,048,576", "Ambiguity removed, but only about a million codes."],
                ["A–Z + 2–9, minus I/O/0/1 (32)", "5", "33,554,432", "Over 33 million codes, and every character is unambiguous."],
                ["A–Z + 2–9, minus I/O/0/1 (32)", "6", "1,073,741,824", "Over a billion — rarely needed for a 10-minute key."]
            ]
        },
        {
            "type": "p",
            "text": "Dropping I, O, 0, and 1 costs nothing in practice and removes the errors that generate support tickets: nobody has to guess whether a character is a letter or a digit. The usual sweet spot is five characters over a 32-character alphabet, giving 33,554,432 distinct codes — large enough that collisions are rare, short enough to type on a phone in one glance."
        },
        {
            "type": "p",
            "text": "Note what does not change with a bigger code space: the window. A longer code makes each guess less likely to land, but it does nothing about an attacker who is allowed to make unlimited guesses. Code space is a fixed constant chosen at launch; rate limits and TTLs are live controls. The constant is the weaker defence."
        },
        {
            "type": "h2",
            "text": "Storing the Payload With a TTL"
        },
        {
            "type": "p",
            "text": "The sender's browser posts the content to the server, which writes it into a key-value store with an expiry attached. In Redis, one command does both jobs: the key exists, the clock starts, and nothing else needs to run for the content to disappear."
        },
        {
            "type": "code",
            "filename": "redis-cli",
            "lang": "text",
            "code": "# store the payload; the key evaporates on its own after 600 seconds\nSETEX share:K7P2N 600 \"the text that was pasted\"\n\n# check whether a candidate code is already taken\nEXISTS share:K7P2N\n\n# read it back once, then remove it\nGET    share:K7P2N\nDEL    share:K7P2N"
        },
        {
            "type": "p",
            "text": "Two properties of that first line matter more than they look. Because the expiry travels with the write, deletion does not depend on a cron job, a user action, or a later cleanup pass — the store itself enforces the window. And because the TTL is attached to the key rather than to the content, the same mechanism covers payloads of any size: a one-line URL and a 10,000-character note expire identically."
        },
        {
            "type": "h2",
            "text": "Deleting on Read: Single-Use Semantics"
        },
        {
            "type": "p",
            "text": "The second design choice is what the read does. The simplest version reads the key and returns it, leaving the key to expire on its own. The stronger version reads and deletes in one step, so the content can be fetched exactly once: the first request wins, every later request gets a 404, and the effective lifetime becomes whichever comes first — the timer or the retrieval."
        },
        {
            "type": "p",
            "text": "Single-use reads change the threat model meaningfully. A leaked pointer that can be fetched a thousand times over ten minutes is a different risk from one that can be fetched once, right now, by whoever gets there first. The subtlety worth knowing about is atomicity: the read and the delete must be one indivisible operation. A plain GET followed by a separate DEL has a small window in which two simultaneous requests can both read before either deletes — which is why stores expose an atomic delete-and-return command, and why implementations should reach for it."
        },
        {
            "type": "h2",
            "text": "Collisions: Why Retrying Is Enough"
        },
        {
            "type": "p",
            "text": "With 33.5 million possible codes and randomly generated picks, two codes will eventually match. The relevant question is how often, and the answer comes from the birthday problem: the chance that a new random code hits one of N live codes is roughly N²÷(2×code space). With 1,000 codes live at the same moment, that is about 1.5% — small, but not negligible if you ignore it."
        },
        {
            "type": "p",
            "text": "The fix is the standard one: before storing, ask whether the candidate key already exists, and if it does, draw another. A handful of attempts drops the residual risk to effectively zero, and because live codes are bounded by a 10-minute window, the pool of live keys stays small in practice. If every attempt fails, the honest answer is to return an error and let the user retry — silently overwriting somebody else's pending transfer would be far worse than a failed request."
        },
        {
            "type": "callout",
            "text": "Because codes are short, collision handling is a correctness requirement rather than an optimisation. Any code-based system that generates a code, stores to it, and never checks whether the key was already taken will occasionally hand two senders the same code — and one of them will retrieve the other's content."
        },
        {
            "type": "h2",
            "text": "Rate Limiting Does the Real Work"
        },
        {
            "type": "p",
            "text": "Enumeration is the obvious attack: keep guessing codes until something comes back. The maths against a 33.5-million-code space is unforgiving for the attacker even before limits are considered — at 20 guesses per minute, covering the space would take over three years of continuous trying, while every individual key expires after ten minutes. Guessing a live key is a race against a clock that resets constantly."
        },
        {
            "type": "p",
            "text": "Operators still add explicit limits, because they are the control you can move today: a typical setup allows on the order of ten sends and a couple of dozen retrievals per minute from one address, returning 429 Too Many Requests beyond that. Rate limits also absorb accidental load — a stuck page on retry, a script looping, a misbehaving health check — which is often their more common job."
        },
        {
            "type": "h2",
            "text": "What the Server Actually Sees"
        },
        {
            "type": "p",
            "text": "Between the browser and the server, TLS encrypts the request, so the content is protected from anyone watching the network. Inside the server, though, the application has to read the content in order to return it: it can be stored encrypted at rest, but it is not end-to-end encrypted, because end-to-end means exactly the server can never read it. Both designs are legitimate. They answer different questions — a single-read store answers 'how long does this exist and who can fetch it', while end-to-end answers 'can anyone in the middle read it' — and a transfer tool should be clear about which one it provides."
        },
        {
            "type": "h2",
            "text": "The Five Ways a Transfer Fails"
        },
        {
            "type": "p",
            "text": "Everything above collapses into a small, predictable set of outcomes, and each one has a specific status behind it:"
        },
        {
            "type": "ol",
            "items": [
                "404 — no such key: the window elapsed, or the content was already retrieved once. The two are indistinguishable by design, because both mean the same thing to the requester.",
                "429 — the client crossed its per-minute budget of sends or retrievals. Waiting a minute resolves it; no data was lost.",
                "422 — the request itself was malformed: an empty body, a code of the wrong shape, or content past the size limit.",
                "500 — the collision loop exhausted its attempts without finding a free key, or the store was unreachable. Transient, and safe to retry.",
                "Silent failure — the payload was fine but the request never left the device: offline browser, blocked script, or a proxy that swallowed the connection."
            ]
        },
        {
            "type": "h2",
            "text": "Deliberately Boring"
        },
        {
            "type": "p",
            "text": "There is no clever protocol in this design, and that is the point. One write with a deadline, one guarded read, one delete, plus a rate limiter in front of both directions — every piece is a primitive any store has offered for a decade, and every failure mode is one a user can understand without a glossary. The interesting engineering is not in making the transfer exotic; it is in choosing constants — alphabet, length, window, budget — that keep the boring version safe."
        },
        {
            "type": "links",
            "label": "Further reading",
            "items": [
                {
                    "href": "https://redis.io/docs/latest/commands/setex/",
                    "text": "SETEX: write a key with an expiry in a single command"
                },
                {
                    "href": "https://en.wikipedia.org/wiki/Birthday_problem",
                    "text": "The birthday problem: why collisions arrive faster than intuition suggests"
                },
                {
                    "href": "https://owasp.org/www-community/attacks/Brute_force_attack",
                    "text": "OWASP on brute force: how enumeration attempts are actually carried out"
                },
                {
                    "href": "https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API",
                    "text": "MDN: Web Crypto API — what end-to-end protection would add"
                },
                {
                    "to": "/blog/cross-device-sharing-glossary",
                    "text": "The cross-device sharing glossary — TTL, E2E, metadata and the rest"
                }
            ]
        }
    ]
};
