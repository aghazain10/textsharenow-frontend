export default {
    "slug": "share-long-urls-without-breaking-links",
    "title": "How to Share Long URLs Without Breaking Links or Losing Characters",
    "excerpt": "Long URLs with tracking parameters and query strings break easily when copied through the wrong app. Here is how to avoid it.",
    "tag": "Guide",
    "date": "August 2026",
    "datePublished": "2026-08-11",
    "dateModified": "2026-10-06",
    "readTime": "5 min read",
    "content": [
        {
            "type": "p",
            "text": "A link that looks like one line of text is usually a chain of several: a scheme, a host, a path, and increasingly a long tail of query parameters carrying campaign tags, session identifiers, filters, or pagination state. A product page, a shared document, or a filtered dashboard view can pass several hundred characters before anyone has done anything unusual with it."
        },
        {
            "type": "p",
            "text": "That length is only a problem because links travel through channels that were not designed to carry them faithfully. Send one the wrong way and it can be truncated at a line break, split across two messages, wrapped with an added hyphen, stripped of its query string by a preview generator, or silently re-encoded so that characters the server expected arrive as something else."
        },
        {
            "type": "h2",
            "text": "Why URLs Get Long in the First Place"
        },
        {
            "type": "p",
            "text": "Most extremely long links are not long because someone typed them. They are long because they carry state."
        },
        {
            "type": "table",
            "caption": "What adds length to an ordinary URL",
            "head": ["Part of the link", "What it carries", "Typical cost"],
            "rows": [
                ["Path", "The page itself — usually short and stable", "Under 60 characters"],
                ["Query parameters", "Filters, sort order, page number, search terms", "10–80 characters"],
                ["Campaign tags", "utm_source, utm_medium, utm_campaign and friends", "40–120 characters"],
                ["Session or auth tokens", "Temporary identifiers that make the link personal", "30–200+ characters"],
                ["Fragment (#section)", "Jump target within the page", "1–40 characters"]
            ]
        },
        {
            "type": "p",
            "text": "The practical consequence: two people can hold what looks like the same link and get different results, because the tail is doing work. Trimming a link by guessing at where it 'ends' is therefore the most common way people break their own URLs — the visible page address finished ten lines ago, and the characters after it were still required."
        },
        {
            "type": "h2",
            "text": "Where Long URLs Commonly Break"
        },
        {
            "type": "ul",
            "items": [
                "SMS text messages, which split long messages into segments and can corrupt a link that straddles the seam",
                "Chat apps that build a link preview: the previewer may strip tracking parameters, re-encode characters, or fail outright on a link it cannot fetch",
                "Word processors and note apps with auto-formatting, which can turn part of the path into a hyperlink and leave the remainder as plain text",
                "Printed or handwritten notes, where a wrapped line makes it ambiguous whether a character was a hyphen or a line break",
                "PDFs and slide decks, where a link that runs past the text box is truncated visually but still looks complete",
                "Voice dictation and speech-to-text, which drop punctuation and casing the URL depends on"
            ]
        },
        {
            "type": "p",
            "text": "The common thread is that something in the middle reformatted, re-encoded, or split the string. Links fail at the seams — between two SMS segments, between a link and the auto-added line break, between what you pasted and what the previewer fetched."
        },
        {
            "type": "h2",
            "text": "How to Diagnose a Broken Link"
        },
        {
            "type": "p",
            "text": "When a link arrives and does not work, the failure almost always falls into one of a few categories. The response the browser gives narrows it down quickly."
        },
        {
            "type": "table",
            "caption": "What the failure usually means",
            "head": ["What you see", "What happened", "Fix"],
            "rows": [
                ["Page loads but ignores your filters", "The query string was stripped before it arrived", "Re-copy from the source; avoid chat previews"],
                ["404 or 'not found'", "Characters were dropped or a line break inserted mid-path", "Compare against the original character by character"],
                ["Link ends in a stray character like . or ,", "A sender or app appended punctuation", "Delete trailing punctuation manually"],
                ["Access denied / session expired", "A personal token travelled somewhere it should not", "Send the cleaned, public version of the link"],
                ["Garbled characters in the middle", "Encoding was changed in transit (spaces, non-ASCII)", "Re-encode, or send the link as plain text"]
            ]
        },
        {
            "type": "h2",
            "text": "How to Send One Safely"
        },
        {
            "type": "p",
            "text": "The safest transfer methods treat the URL as plain text: no reformatting, no resizing, no smart link handling, no preview fetch in between. Copy-pasting into a plain text field preserves every character exactly, which is the whole requirement."
        },
        {
            "type": "p",
            "text": "Concretely, that rules out a few common defaults. Do not send a long link by SMS if it can be avoided — segment splitting is a real corruption risk, not a rare edge case. Do not paste it into a rich text editor and expect the auto-hyperlink to have kept every parameter. And be careful about pasting into a chat composer, because what leaves the composer is often not what you put in: preview generation is an active transformation, not a display effect."
        },
        {
            "type": "p",
            "text": "What works is anything that moves bytes without interpreting them. A short-code text-sharing tool fits here specifically because it does nothing clever with the content — what you paste is exactly what comes out the other end, character for character, regardless of length up to the tool's limit, with no preview, no auto-linking, and no line wrapping applied on the way through."
        },
        {
            "type": "h2",
            "text": "Before You Send: Two Checks Worth Doing"
        },
        {
            "type": "ol",
            "items": [
                "Paste the link into a plain text field and look at the end of it. If you cannot see the natural end of the URL — a domain, a path, a closing parameter value — the text after it is either yours to delete or a sign something was appended.",
                "Open the link once in your own browser before sending it. If it resolves on your side, whatever fails afterwards was introduced by the transfer, which immediately rules out the original link as the problem."
            ]
        },
        {
            "type": "callout",
            "icon": "",
            "text": "If you are ever unsure whether a link survived a transfer intact, paste it into something plain — a notes app or an empty text field — before clicking, so you can see it has not been truncated or wrapped. Ten seconds of looking beats a round trip of debugging."
        },
        {
            "type": "links",
            "label": "Sources",
            "items": [
                {
                    "href": "https://www.rfc-editor.org/rfc/rfc3986",
                    "text": "RFC 3986 — the standard that defines a URI's grammar"
                },
                {
                    "href": "https://en.wikipedia.org/wiki/Query_string",
                    "text": "Query strings — what the part after the ? actually does"
                },
                {
                    "href": "https://en.wikipedia.org/wiki/URL_shortening",
                    "text": "URL shortening — why some links redirect through a service"
                }
            ]
        },
        {
            "type": "h2",
            "text": "The Short Version"
        },
        {
            "type": "p",
            "text": "Long URLs are fragile in exactly the apps most people default to for quick sharing, because those apps interpret links rather than transporting them. A plain-text transfer — no preview, no auto-formatting, no segment splitting — is the safest way to make sure the link that arrives is the link you sent, and checking it in your own browser first tells you which side of the transfer to blame."
        }
    ]
};
