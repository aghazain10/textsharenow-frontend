export default {
    "slug": "cross-device-sharing-glossary",
    "title": "Cross-Device Sharing Glossary: 24 Terms, Plainly Explained",
    "excerpt": "QR codes, short codes, TTLs, single-read links, EXIF, P2P — the vocabulary of moving text and files between devices, defined in plain English.",
    "tag": "Glossary",
    "date": "October 2026",
    "datePublished": "2026-10-02",
    "dateModified": "2026-10-02",
    "readTime": "7 min read",
    "content": [
        {
            "type": "p",
            "text": "Almost every product page in this space uses the same five words — fast, secure, seamless, private, instant — and almost none of them explain what is actually happening when you move a photo from a phone to a laptop. The vocabulary underneath is small, mostly borrowed from networking, storage, and cryptography, and worth knowing if you want to compare tools on their actual behaviour rather than their adjectives."
        },
        {
            "type": "p",
            "text": "This glossary defines the 24 terms you are most likely to meet when you read about cross-device sharing, in the order you are likely to meet them. The first table is a one-line definition of each; the sections after it go deeper on the handful of terms that are routinely used carelessly."
        },
        {
            "type": "h2",
            "text": "The Glossary at a Glance"
        },
        {
            "type": "table",
            "caption": "24 terms, one line each. The second column is the plain-English version.",
            "head": ["Term", "What it actually means"],
            "rows": [
                ["Short code", "A 4–8 character stand-in for the content itself; the server maps code to payload."],
                ["QR code", "A square barcode that stores data — in sharing tools, usually a URL with the code embedded."],
                ["Handoff", "Apple's feature that continues a task from one Apple device to a nearby one."],
                ["Clipboard sync", "Background replication of your clipboard across devices signed into the same account."],
                ["Deep link", "A URL that opens a specific screen inside an app or site rather than the home page."],
                ["Pairing", "The one-time step that tells two devices to trust each other — Bluetooth, QR, or PIN."],
                ["TTL (time to live)", "How long a stored item survives before the system deletes it automatically."],
                ["Ephemeral storage", "Storage designed to lose data: nothing in it is meant to outlive its TTL."],
                ["Single-read link", "A link that returns its content once, then deletes it on the server."],
                ["Retention window", "The maximum time any copy of your content is kept, whatever else happens."],
                ["Auto-delete", "Scheduled removal that does not depend on anyone remembering to do it."],
                ["Sweep", "A background job that deletes leftovers after a TTL, in case deletion was missed."],
                ["TLS / HTTPS", "The encryption layer between your browser and the server."],
                ["Encryption at rest", "Data is encrypted while it sits on disk or in a database."],
                ["End-to-end encryption", "Only sender and receiver can read the content — the server cannot."],
                ["Metadata", "Data about the data: timestamps, device model, file size, location."],
                ["EXIF", "Photo metadata written by the camera, including GPS coordinates and device model."],
                ["Rate limiting", "A cap on how many requests one client may make inside a time window."],
                ["Brute force", "Trying every possible code until one of them works."],
                ["Cross-platform", "Behaves the same across operating systems, usually with no native app involved."],
                ["Peer-to-peer (P2P)", "Devices connect directly, with no server holding the content in between."],
                ["Local network (LAN)", "Devices on the same router or Wi-Fi network, without touching the internet."],
                ["Progressive web app", "A website you can install to a home screen, with app-like behaviour."],
                ["Screen mirroring", "A live video copy of one screen shown on another — not a file transfer."]
            ]
        },
        {
            "type": "h2",
            "text": "The Nine Terms That Get Used Carelessly"
        },
        {
            "type": "h3",
            "text": "A short code is not a password"
        },
        {
            "type": "p",
            "text": "A short code is an identifier, not an authentication secret. It points at one stored item for a few minutes; it does not unlock an account, and it is never reused. Treating it like a password leads to the wrong mental model — people worry that a code could be 'cracked' when the real protections are the short lifetime of the key and the rate limits on guessing. If a tool lets a code live forever and grant repeated access, it has quietly stopped being a short code and started being a bearer token."
        },
        {
            "type": "h3",
            "text": "A TTL is not a retention guarantee"
        },
        {
            "type": "p",
            "text": "Time to live describes when a key expires inside the primary store. It says nothing about backups, replicas, logs, or caches that may have copied the same data before expiry. Retention is the honest term for the whole chain: every copy, everywhere, for how long. When a service advertises a 10-minute TTL, the useful follow-up question is whether anything else holds a copy for longer — and a careful operator will have an answer."
        },
        {
            "type": "h3",
            "text": "Single-read is not end-to-end encryption"
        },
        {
            "type": "p",
            "text": "Deleting content on first retrieval limits how long it can be re-fetched, and it is a genuine privacy property. It is not the same as end-to-end encryption, where the server never holds readable content at all. With single-read storage the server must read the content in order to return it, so it is trusted for the duration of the transfer. Both designs are legitimate; they protect against different threats, and marketing copy tends to blur them together."
        },
        {
            "type": "h3",
            "text": "Secure is a claim, not a property"
        },
        {
            "type": "p",
            "text": "A tool is secure against a specific threat, for a specific data type, for a specific window of time. 'Secure' on its own cannot be checked. The testable version is a sentence: your file is encrypted in transit with TLS, stored encrypted at rest, readable by the server, and deleted after the first download or 15 minutes. If a product cannot produce that sentence, the adjective is doing the work the engineering should be doing."
        },
        {
            "type": "h3",
            "text": "Metadata still travels"
        },
        {
            "type": "p",
            "text": "Stripping EXIF from a photo removes GPS coordinates and the camera model from the pixels' file, but the transfer itself still produces metadata: file size, upload time, IP address, and user agent. That is normal for any network request. The distinction matters when someone promises anonymity — content privacy and traffic privacy are separate questions, and a tool that answers one has not answered the other."
        },
        {
            "type": "h3",
            "text": "Rate limiting and code length do different jobs"
        },
        {
            "type": "p",
            "text": "A larger code space makes guessing take longer in principle; rate limiting makes guessing take longer in practice. Only the second one is under the operator's control at any moment, because an operator can raise the limit, block an address, or shorten the TTL without redeploying anything. Code length is a fixed property chosen at launch, so it is the weaker of the two levers — worth checking, but rate limits are what actually stop enumeration."
        },
        {
            "type": "h3",
            "text": "Peer-to-peer does not mean private"
        },
        {
            "type": "p",
            "text": "Peer-to-peer describes the path a transfer takes — directly between two devices rather than through a server that holds the content — and nothing about who can read it. A P2P stream that is not encrypted is readable by anyone on the network path, and a server-mediated transfer that is end-to-end encrypted is unreadable by the server itself. The two terms answer different questions, and they are frequently used as though they were interchangeable. 'No middleman' is a statement about routing; 'private' is a statement about encryption."
        },
        {
            "type": "h3",
            "text": "Clipboard sync is not sharing"
        },
        {
            "type": "p",
            "text": "Sharing is a directed, one-off act: something moves from this device to that device, once, and stops. Clipboard sync is the opposite shape — continuous background replication of a small buffer to every device signed into the same account, whether or not anyone asked for it at that moment. Sync is convenient and account-bound; it also leaves the content in clipboard history on devices you have not touched in months. Confusing the two is how people end up wondering why a note they copied yesterday reappeared on a tablet."
        },
        {
            "type": "h3",
            "text": "Screen mirroring does not move a file"
        },
        {
            "type": "p",
            "text": "Mirroring sends a live video of one screen to another, at whatever quality the network allows. Nothing is transferred: the file stays exactly where it was, the receiving device holds only pixels of it, and the moment the session ends, so does the copy. That makes mirroring right for demonstrating something and wrong for handing over a photo — the recipient gets a screenshot of your file rather than the file, with compression to match. Transfer means the original moves; mirroring means a reflection does."
        },
        {
            "type": "callout",
            "text": "Reading tip: when a product page uses one of these terms, ask which of the two available meanings it intends. 'Encrypted', 'temporary', and 'private' each have a strict version and a loose version, and the difference usually lives in the fine print rather than the headline."
        },
        {
            "type": "h2",
            "text": "Why the Vocabulary Matters"
        },
        {
            "type": "p",
            "text": "The gap between the loose and strict meanings is where most disappointing transfers happen. Someone expects their photo to vanish after one download and instead finds it synchronised to a cloud library. Someone assumes a 10-minute link means the server forgot the content, when the content was only expired from one cache. None of these are failures of the technology; they are failures of a shared vocabulary."
        },
        {
            "type": "p",
            "text": "The 24 terms above are enough to read any product page in this category critically, and enough to describe your own workflow precisely — what left the device, where it sat, for how long, and who could read it. Everything else in this space is a variation on those few moving parts."
        },
        {
            "type": "links",
            "label": "Further reading",
            "items": [
                {
                    "href": "https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API",
                    "text": "MDN: Web Crypto API — how browser-side encryption actually works"
                },
                {
                    "href": "https://owasp.org/www-community/attacks/Brute_force_attack",
                    "text": "OWASP: Brute force attack — the enumeration threat rate limits defend against"
                },
                {
                    "href": "https://en.wikipedia.org/wiki/QR_code",
                    "text": "QR codes: modes, capacity, and error correction"
                },
                {
                    "to": "/blog/how-short-code-sharing-works",
                    "text": "How short-code sharing works, step by step, under the hood"
                }
            ]
        }
    ]
};
