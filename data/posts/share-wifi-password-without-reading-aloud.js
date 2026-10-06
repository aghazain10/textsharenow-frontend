export default {
    "slug": "share-wifi-password-without-reading-aloud",
    "title": "Best Ways to Share a Wi-Fi Password Without Reading It Out Loud",
    "excerpt": "Spelling out a 16-character Wi-Fi password to a guest is nobody's favorite moment. Here are better ways to hand it over.",
    "tag": "Guide",
    "date": "August 2026",
    "datePublished": "2026-08-11",
    "dateModified": "2026-10-06",
    "readTime": "5 min read",
    "content": [
        {
            "type": "p",
            "text": "Modern Wi-Fi passwords are long and deliberately hard to guess, which is great for security and terrible for the moment a guest asks for it and you have to read out a string like \"Kb7#mQ2!vLpX9z\" one character at a time. Every convention that makes a password good — mixed case, symbols, no dictionary words — makes it worse to dictate."
        },
        {
            "type": "p",
            "text": "The failure mode is always the same. Someone says 'capital K, no wait, is that a seven or a B', you say it again, they type it, and the network says no. Two rounds of that and both people start wishing they had not asked. There are five ways out of it, and each one fits a different situation."
        },
        {
            "type": "h2",
            "text": "Common Ways to Share It (And Their Downsides)"
        },
        {
            "type": "h3",
            "text": "Reading it aloud"
        },
        {
            "type": "p",
            "text": "Slow, error-prone, and mildly awkward for both people involved — especially with mixed-case letters and symbols that sound identical out loud. Capital I, lowercase l and the digit 1 are three different characters that are one sound. Expect at least two attempts, and expect the person typing to give up and ask you to spell the whole thing again more slowly."
        },
        {
            "type": "h3",
            "text": "A printed card near the router"
        },
        {
            "type": "p",
            "text": "Works well for a home you control, but is a static, low-effort solution that does not help when you are not physically near the router — at a friend's place, an office, or a rental. It also fails the moment the password changes, since the card does not know that. Anyone who can see the card can join the network, which is fine for a holiday flat and a poor idea for a shared office."
        },
        {
            "type": "h3",
            "text": "QR code Wi-Fi sharing"
        },
        {
            "type": "p",
            "text": "Many phones can generate a scannable Wi-Fi QR code. This is genuinely excellent when the guest is standing there with a phone camera ready — one of the cases where QR codes clearly beat typing. The network name, password and security type are all encoded in the pattern, so there is no transcription step at all."
        },
        {
            "type": "p",
            "text": "Its limit is direction. A QR code has to be displayed on one screen and scanned by another device, which means it needs a device to show it on and a camera to read it. That works when two people are in the same room, and does nothing when they are not — or when the person receiving it is setting up a laptop that has no camera worth using for this."
        },
        {
            "type": "h3",
            "text": "Your phone's built-in sharing"
        },
        {
            "type": "p",
            "text": "Apple devices will share the network password to a nearby Apple device when both are unlocked and in range; Android has an equivalent within its own ecosystem. When it works it is the most effortless option available. The catch is that it only works between devices from the same family — the exact case where you least need help, since the problem almost always involves a guest with a different phone."
        },
        {
            "type": "h3",
            "text": "A short text code"
        },
        {
            "type": "p",
            "text": "For remote sharing — texting a password to someone before they arrive, or sending it from your phone to your own laptop when setting up a new device — a short code avoids both the read-aloud problem and the need for a camera. Paste the password, send a 5-character code, and the recipient types it in and copies the real password out, exactly as typed, no misheard characters."
        },
        {
            "type": "callout",
            "icon": "",
            "text": "One advantage worth noting for sensitive info like Wi-Fi passwords: the content auto-deletes after it is read once, so the password is not left sitting in a chat log indefinitely."
        },
        {
            "type": "h2",
            "text": "Matching the Method to the Situation"
        },
        {
            "type": "p",
            "text": "The question is not which method is best overall — it is which one survives the actual circumstances of the handoff."
        },
        {
            "type": "table",
            "caption": "Handing over a Wi-Fi password, five ways",
            "head": ["Situation", "Method", "Why it fits"],
            "rows": [
                ["Guest standing in front of you", "QR code", "Camera does the transcription; no typing at all"],
                ["Same-ecosystem devices, both unlocked", "Built-in sharing", "Zero interaction beyond confirming"],
                ["Password needed before someone arrives", "Short text code", "Works over any distance, no camera needed"],
                ["Setting up your own new laptop or desktop", "Short text code", "The new device cannot scan for itself yet"],
                ["A home you control, long term", "Printed card or guest network", "One-time effort, no per-guest work"],
                ["A rented or shared space", "Short text code or QR", "Nothing left behind on a wall"]
            ]
        },
        {
            "type": "h2",
            "text": "What Not to Do"
        },
        {
            "type": "ul",
            "items": [
                "Do not hand out your primary network password when a guest network will do. A separate SSID lets you revoke access by changing one password without affecting every device you own.",
                "Do not send it over a channel that keeps history if you can avoid it — a message left in a chat thread is a credential sitting there indefinitely, on a device you do not control.",
                "Do not write it somewhere with a shared edit history: a collaborative doc, a shared note, a whiteboard in an office.",
                "Do not reuse the Wi-Fi password anywhere else. If it leaks — and hand-told passwords leak — it should not unlock anything but the network."
            ]
        },
        {
            "type": "h2",
            "text": "Two Minutes That Make the Whole Thing Safer"
        },
        {
            "type": "p",
            "text": "Whatever method you use, the follow-up matters more than the method. Sharing a password is a small, one-time event; leaving it shared indefinitely is a standing one."
        },
        {
            "type": "ol",
            "items": [
                "If the router supports it, put guests on a separate network or a guest VLAN. They get internet, you keep separation, and you can change the guest password without touching anything of yours.",
                "Rotate the password after a gathering or a rental turnover. It takes a minute in the router admin page and invalidates every copy you ever handed out.",
                "Prefer WPA3 or WPA2 with a genuinely random passphrase over any short memorable one. Length beats complexity, and you are no longer paying the cost of dictating it."
            ]
        },
        {
            "type": "links",
            "label": "Related reading",
            "items": [
                {
                    "to": "/blog/qr-codes-vs-short-codes-device-sharing",
                    "text": "QR codes vs short codes: which is better for device sharing"
                },
                {
                    "to": "/blog/what-happens-to-your-text",
                    "text": "What happens to text after it is shared — and when it is deleted"
                },
                {
                    "to": "/online-text-sharing",
                    "text": "Try free online text sharing — no app, no account"
                }
            ]
        },
        {
            "type": "h2",
            "text": "The Short Version"
        },
        {
            "type": "p",
            "text": "If the person is in front of you with a phone, scan a QR code. If they are somewhere else, or you are setting up your own new machine, use a short code so nothing has to be dictated or left in a message. And if the network is one you actually care about, give guests their own network rather than yours — the handoff becomes trivial to undo, which is the property that matters most."
        }
    ]
};
