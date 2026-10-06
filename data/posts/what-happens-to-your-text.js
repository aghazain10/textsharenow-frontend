export default {
    "slug": "what-happens-to-your-text",
    "title": "What Happens to Your Text After You Share It (And What Is Actually Deleted)",
    "excerpt": "Ten minutes, one key, one read. Here is the real lifecycle of shared text — what is stored, what is deleted, and what a short code cannot protect you from.",
    "tag": "Privacy",
    "date": "October 2026",
    "datePublished": "2026-10-06",
    "dateModified": "2026-10-06",
    "readTime": "7 min read",
    "content": [
        {
            "type": "p",
            "text": "Privacy pages tend to reach for adjectives. This one reaches for verbs: what the server does, in what order, and when it stops. If you are deciding whether a browser-based tool is safe enough for a particular piece of text, adjectives do not help you — the lifecycle does. Here is the full path of a share, from the moment you press send to the moment the data is no longer anywhere, plus the cases where this design is the wrong tool entirely."
        },
        {
            "type": "h2",
            "text": "Where the Text Lives While It Is Live"
        },
        {
            "type": "p",
            "text": "When you press send, the text travels over HTTPS to the server, which validates it — empty text is rejected, and anything over 10,000 characters is rejected before it is stored. The server then picks a five-character code from a 32-character alphabet (letters and digits, excluding I, O, 0 and 1 to keep the characters readable when you type them), checks that the code is not already in use, and writes the text to a key-value store under that code with a ten-minute expiry attached."
        },
        {
            "type": "p",
            "text": "That last part is the important one. The expiry is not a cleanup job that runs later and might be missed — it is set at the same moment the data is written, so the store itself drops the value when the timer runs out. Nothing has to remember to delete it. The command used is SETEX, which means set-and-expire, and it is the ordinary way this is done in Redis-compatible stores."
        },
        {
            "type": "table",
            "caption": "The full lifecycle of a text share",
            "head": ["Stage", "What happens", "How long"],
            "rows": [
                ["Send", "Text is validated, capped at 10,000 characters, and written to the store under a fresh 5-character code with a 10-minute timer", "Instant"],
                ["Waiting", "The code and its text sit in the store. Only someone who knows the code can retrieve it", "Up to 10 minutes"],
                ["Retrieve", "The text is read and, in the same request, deleted from the store", "Single read"],
                ["Expire", "If nobody reads it, the store drops the value on its own when the timer ends", "At 10 minutes"],
                ["After", "The code returns a plain not-found response — there is no archive to query", "Permanent"]
            ]
        },
        {
            "type": "h2",
            "text": "The Read Is the Deletion"
        },
        {
            "type": "p",
            "text": "Most people assume shared content is deleted by a scheduled wipe. Here the read is the wipe: retrieving a code performs the lookup and the delete together, in one request, so the value is gone before the response is written back. There is deliberately no second copy left behind for a 'recently viewed' list, no history page, and no way to retrieve the same code twice — a second attempt simply returns not found."
        },
        {
            "type": "p",
            "text": "This is what makes a code single-use rather than merely short-lived. Expiry handles the case where nobody shows up. Single-read handles the case where someone does: the value leaves the store during that first successful fetch, not ten minutes later."
        },
        {
            "type": "h2",
            "text": "What the Server Does Not Keep"
        },
        {
            "type": "p",
            "text": "There are no accounts, no cookies, and no sign-in step, so there is no user record to attach a share to. The application code contains no logging of the text itself — nothing writes the payload to a log file or an analytics event. What is counted is aggregate and anonymous: how many shares happened in total, how many happened today, and how many were files. Those counters hold numbers, never content."
        },
        {
            "type": "p",
            "text": "One thing is retained briefly and on purpose: rate limiting. Each request increments a per-IP counter with a sixty-second lifetime, which is what stops one client from hammering the service. That key holds an address and a number for a minute, then expires like everything else. It exists to protect availability, and it is the only place an address is used."
        },
        {
            "type": "h2",
            "text": "What This Does Not Protect You From"
        },
        {
            "type": "p",
            "text": "This is the section that decides whether the tool is right for your text, and it is the one most similar products skip."
        },
        {
            "type": "ul",
            "items": [
                "Anyone who has the code during its active window can read the text. A short code is a bearer credential: whoever holds it gets the content. Do not post codes publicly if the text is sensitive.",
                "The code is short by design, which means guessing is not theoretically impossible — it is made impractical by the ten-minute window and by rate limiting, not by an enormous keyspace. That is a deliberate trade for typability.",
                "There is no password, no second factor, and no encryption you hold the key to. The server must be able to read the text to hand it back, so this is not end-to-end encryption.",
                "The text is in transit over HTTPS and at rest in the temporary store under the provider's standard encryption, but it exists in readable form for up to ten minutes while it waits."
            ]
        },
        {
            "type": "callout",
            "icon": "",
            "text": "The honest summary: this design protects against leftovers — nothing lingering after you are done with it. It does not protect against someone reading the code while the text is live. Those are two different problems, and only the first one is solved here."
        },
        {
            "type": "h2",
            "text": "How to Check Any of This Yourself"
        },
        {
            "type": "p",
            "text": "Claims about deletion are easy to make and easy to test. The whole lifecycle can be verified from one browser tab without trusting the description above."
        },
        {
            "type": "ol",
            "items": [
                "Open the browser developer tools, go to the network tab, and send a piece of text. Note the single request that stores it.",
                "Read the code from a second device or a second browser window. Confirm the text arrives.",
                "Try to read the same code again. A not-found response at that point confirms the value left the store during the first read, rather than being marked for later deletion.",
                "Send another code and leave it alone for just over ten minutes, then try it. The same not-found response confirms expiry works independently of anyone reading it.",
                "Search the network tab for anything that looks like your text in a second request. The share call carries it once, in one direction."
            ]
        },
        {
            "type": "p",
            "text": "Two minutes of that is worth more than any paragraph of reassurance, and it is repeatable after any update to the service."
        },
        {
            "type": "h2",
            "text": "When You Should Use Something Else"
        },
        {
            "type": "p",
            "text": "The ten-minute, single-read lifecycle is a good fit for a specific category: text you need on another device right now, that stops mattering as soon as it arrives. A link you are moving to your laptop, an address you copied on your phone, a snippet you want to paste into an editor, a fragment of a document you are drafting across screens."
        },
        {
            "type": "p",
            "text": "It is the wrong fit for three categories. Credentials — passwords, API keys, session tokens — belong in a password manager, which encrypts them under a master secret you hold rather than under a five-character code. Anything with a long shelf life, such as medical, financial or legal records, needs storage designed for retention, not storage designed to forget. And anything where the recipient should be provably unable to read it without your key needs end-to-end encryption, which by definition cannot be provided by a server that must read the content to return it."
        },
        {
            "type": "p",
            "text": "The test is simple: if losing the text ten minutes from now would be a relief rather than a problem, the lifecycle above suits it. If losing it would be a problem, use a tool built for keeping things."
        },
        {
            "type": "links",
            "label": "Further reading",
            "items": [
                {
                    "to": "/blog/how-short-code-sharing-works",
                    "text": "How the code is generated, stored, and expired — the full mechanics"
                },
                {
                    "to": "/blog/cross-device-sharing-glossary",
                    "text": "TTL, single-read and bearer credential, defined properly"
                },
                {
                    "to": "/privacy",
                    "text": "The privacy policy, in the same plain language"
                },
                {
                    "href": "https://redis.io/docs/latest/commands/setex/",
                    "text": "Redis: SETEX — set a key with an expiry"
                }
            ]
        }
    ]
};
