export default {
    "slug": "sharing-code-not-working",
    "title": "Sharing Code Not Working? 8 Causes and What Each One Means",
    "excerpt": "Expired, opened, mistyped, throttled — the server responses behind almost every failed code, and the 60-second check that tells them apart.",
    "tag": "Troubleshooting",
    "date": "October 2026",
    "datePublished": "2026-10-02",
    "dateModified": "2026-10-02",
    "readTime": "7 min read",
    "content": [
        {
            "type": "p",
            "text": "You type five characters, press the button, and get nothing back — or worse, a message that tells you the code does not exist. It is the most common failure in code-based sharing, and almost always one of a handful of causes, each with a different fix. Guessing wastes more time than reading the response, because the response is specific: the server distinguishes between a code that is gone, a request it refused to accept, and a client it has temporarily throttled."
        },
        {
            "type": "h2",
            "text": "Read the Message First"
        },
        {
            "type": "p",
            "text": "Before touching anything else, read the exact text of the error. The wording maps one-to-one onto the failure, and each one has a different remedy:"
        },
        {
            "type": "table",
            "caption": "The four responses a code-based sharing service can give you, and the first move for each.",
            "head": ["What you see", "What it means", "First move"],
            "rows": [
                ["Code not found or has expired", "There is no live key for that code — it timed out, or someone already opened it.", "Ask the sender for a fresh code; nothing you type will bring an old one back."],
                ["Too many requests", "Your address crossed the per-minute budget for sends or retrievals.", "Wait 60 seconds and try exactly once more."],
                ["Invalid code format", "The code was the wrong shape — too short, or characters that are not part of the alphabet.", "Re-read the code from the sender, character by character."],
                ["Please provide text to share / too many characters", "The send itself was rejected: empty content, or content past the size limit.", "Paste the content again; split it if it exceeds the limit."],
                ["Nothing happens at all", "The request never reached the server — offline, blocked script, or a proxy in the way.", "Refresh the page and check the connection; this one is local, not the code's fault."]
            ]
        },
        {
            "type": "h2",
            "text": "The Eight Causes"
        },
        {
            "type": "h3",
            "text": "1. The window closed"
        },
        {
            "type": "p",
            "text": "Codes are born with a countdown — typically ten minutes from the moment they are created, not from the moment you start reading them. If a sender generates a code, gets distracted, and comes back to read it on a second device five minutes later, the remaining window is five minutes, not ten. The sender's result screen shows the countdown running, which is the most reliable warning you will get."
        },
        {
            "type": "h3",
            "text": "2. Someone already opened it"
        },
        {
            "type": "p",
            "text": "Most short-code systems are single-use: the first successful retrieval deletes the content immediately, so every later attempt returns the same 'not found' message as an expired code. This is by design — it is what stops a leaked pointer from being fetched repeatedly. It also means the sender may have tested the code themselves, a curious colleague may have opened it, or you may have pressed Receive twice and lost the race against your own first request."
        },
        {
            "type": "h3",
            "text": "3. A character was misread"
        },
        {
            "type": "p",
            "text": "Codes are written to be transcribed: the alphabet drops I, O, 0, and 1 so that letters and digits cannot be confused. The look-alikes that remain are still worth checking — 2 against Z, 5 against S, 6 against G, 8 against B — especially when the code was read aloud over a call or copied from a photograph. Case is not the problem: input is normalised before lookup, so a lower-case entry is accepted. Length is: a five-character code that reaches the server as four will be rejected outright."
        },
        {
            "type": "h3",
            "text": "4. The code went into the wrong box"
        },
        {
            "type": "p",
            "text": "The send and receive flows look similar, and it is easy to paste a code into the content field instead of the receive field — or to stay on the Share Text tab when the content was sent as a file. Codes are direction-agnostic; the screens are not. Confirm you are on the Receive tab, that the code sits in the field labelled for entering a code from your other device, and that the content type matches what was sent."
        },
        {
            "type": "h3",
            "text": "5. The rate limit caught you"
        },
        {
            "type": "p",
            "text": "Retrieval is budgeted per address — on the order of twenty attempts a minute — and sending is budgeted tighter still, around ten a minute. A page stuck in a retry loop, a script polling for a code, or simply several rapid attempts while debugging can exhaust the budget in seconds. The limit resets on a rolling one-minute window, so waiting is genuinely the fix; mashing the button keeps the counter where it is."
        },
        {
            "type": "h3",
            "text": "6. The page went stale"
        },
        {
            "type": "p",
            "text": "A tab left open for hours runs yesterday's interface against today's service. If a request silently fails — the device lost Wi-Fi, a VPN dropped, the browser suspended the background tab — the page shows no error at all, because the request never completed. A hard refresh re-establishes the connection and usually clears it. If other sites work but this one does not, suspect the page before you suspect the code."
        },
        {
            "type": "h3",
            "text": "7. A network or proxy blocked it"
        },
        {
            "type": "p",
            "text": "Corporate networks, school networks, and some VPNs filter API traffic while leaving ordinary pages reachable. The symptom is a request that never returns — no error message, no spinner that finishes — on one network and works instantly on another. Switching to mobile data for ten seconds is the fastest way to confirm it. Nothing about the code changes; only the path to the server did."
        },
        {
            "type": "h3",
            "text": "8. The content was refused"
        },
        {
            "type": "p",
            "text": "Sometimes the code worked and the payload was the problem: text past the character ceiling (10,000 characters is a common limit), or a file that is too large or in an unsupported format. File transfers usually restrict both — for example to images and short videos under 10 MB — because anything larger needs a different transport altogether. The rejection happens on the send side, so the receiving device simply never sees a code to enter."
        },
        {
            "type": "h2",
            "text": "A 60-Second Diagnostic Sequence"
        },
        {
            "type": "p",
            "text": "Working through the causes in a fixed order avoids the common mistake of rebuilding the transfer when the actual problem is a single character:"
        },
        {
            "type": "ol",
            "items": [
                "Read the error text verbatim — 404, 429, and 422 each send you down a different branch, and only one of them is fixed by waiting.",
                "Re-read the code from the sender's screen, one character at a time, checking it is exactly five characters long.",
                "Confirm the receive box is selected and the code is in the code field, not the content field.",
                "Wait a full minute, then press Receive once — this clears a rate limit and stops a retry loop from refilling it.",
                "Refresh the page, then enter the code again, in case the tab was stale or offline.",
                "Try once from a different network, such as mobile data, to rule out a proxy or firewall.",
                "If it still returns 'not found', the key is genuinely gone — ask for a new code rather than retrying the old one."
            ]
        },
        {
            "type": "h2",
            "text": "How to Avoid It Next Time"
        },
        {
            "type": "ul",
            "items": [
                "Send immediately before reading — generate the code when you are already on the receiving device, so the whole window is available to you.",
                "Use the copy button rather than reading aloud: the result screen has a one-tap copy, and a clipboard round trip beats any transcription.",
                "Scan the QR instead of typing when both devices can see each other — the code travels as a link and never passes through human eyes.",
                "Watch the countdown chip on the sender's screen; when it empties, the code is gone regardless of who did what.",
                "Split oversized content into two transfers rather than trimming it — a rejected send produces no code at all."
            ]
        },
        {
            "type": "callout",
            "text": "If a code returns 'not found' while the sender's countdown is still running, it has almost certainly been opened once already. Single-use codes cannot be re-opened by anyone, including the person who sent them — the fix is always a new code, never a retry loop."
        },
        {
            "type": "links",
            "label": "Related reading",
            "items": [
                {
                    "to": "/how-it-works",
                    "text": "How the send and receive flow works, step by step"
                },
                {
                    "to": "/blog/how-short-code-sharing-works",
                    "text": "How short-code sharing works under the hood"
                },
                {
                    "href": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429",
                    "text": "MDN: HTTP 429 Too Many Requests — what the throttle actually is"
                },
                {
                    "href": "https://en.wikipedia.org/wiki/Rate_limiting",
                    "text": "Rate limiting: sliding windows, budgets, and why waiting works"
                }
            ]
        },
        {
            "type": "h2",
            "text": "When It Is Not the Code"
        },
        {
            "type": "p",
            "text": "One distinction saves the most time: a rejection from the server means the request arrived and was judged, while silence means it never arrived at all. Errors are the server talking back — expired, throttled, malformed — and they resolve by getting a fresh code or waiting out the window. Silence is always local: a dead connection, a blocked request, a stale tab, a proxy in the path. Diagnose the channel first when you get no message, and the code first when you do."
        }
    ]
};
