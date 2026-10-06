export default {
    "slug": "how-to-send-small-video-without-email-limits",
    "title": "How to Send a Small Video Without Email Attachment Limits",
    "excerpt": "Email caps attachments at 25 MB. Your phone shoots 4K video at 400 MB a minute. Here is how to send short clips without limits or compression.",
    "tag": "Guide",
    "date": "September 2026",
    "datePublished": "2026-09-17",
    "dateModified": "2026-09-17",
    "readTime": "5 min read",
    "content": [
        {
            "type": "p",
            "text": "You record a short video on your phone — a 15-second clip of a bug for a developer ticket, a quick screen recording of a workflow, a video of a meeting whiteboard — and you need it on your laptop. The obvious move is email. But your clip is 30 MB, and Gmail caps attachments at 25 MB. Outlook is 20 MB. Even if the clip fits, you are about to send a video file through a system that was not built for it."
        },
        {
            "type": "p",
            "text": "Email attachment limits are not arbitrary — they exist because email was designed for text and small files, not video. But the limit creates a real, specific friction point for the common case of sending a short video clip between devices."
        },
        {
            "type": "h2",
            "text": "Why Email Is the Wrong Tool for Video"
        },
        {
            "type": "p",
            "text": "Beyond the size limit, email has three problems specific to video transfers:"
        },
        {
            "type": "ul",
            "items": [
                "Size caps: Gmail (25 MB), Outlook (20 MB), Yahoo (25 MB). A 1080p screen recording at 30fps produces roughly 10 MB per minute — a 3-minute clip already exceeds Gmail's limit",
                "Compression: some email clients re-encode video attachments during upload, particularly on mobile. The file that arrives may not be byte-identical to what you sent",
                "Inbox persistence: the video sits in your inbox (and the recipient's) permanently, taking up storage and creating a searchable record of something you only needed once"
            ]
        },
        {
            "type": "h2",
            "text": "What Actually Works for Short Video Clips"
        },
        {
            "type": "h3",
            "text": "AirDrop (Apple only)"
        },
        {
            "type": "p",
            "text": "AirDrop transfers video files at full quality with no size limit in practice. It is the best option if both devices are Apple. The limitation is the same as always: it does not exist on Windows, Android, or ChromeOS."
        },
        {
            "type": "h3",
            "text": "Nearby Share / Quick Share (Android + Windows)"
        },
        {
            "type": "p",
            "text": "Google's file transfer tool works between Android phones and Windows PCs via a companion app. It handles video files well, but requires app installation on the Windows side and a Google account sign-in. It does not work with iPhone."
        },
        {
            "type": "h3",
            "text": "Cloud storage with a shared link"
        },
        {
            "type": "p",
            "text": "Google Drive, Dropbox, and OneDrive all handle large video files. Upload the clip, share the link, download on the other end. This works reliably but adds overhead: account required on at least one end, upload time, link generation, and you end up with a permanent file in your cloud storage. For a one-off transfer, this is more infrastructure than the situation calls for."
        },
        {
            "type": "h3",
            "text": "Browser-based file transfer"
        },
        {
            "type": "p",
            "text": "For video clips under 10 MB — which covers most short screen recordings, 15-second phone clips, and small demo videos — a browser-based transfer is the fastest option. Upload on one device, get a short code, type the code on the other device, download the file. No account, no app install, no cloud storage. The file is stored as-is with no recompression."
        },
        {
            "type": "callout",
            "icon": "",
            "text": "The 10 MB limit is honest: this approach works for short clips and screen recordings, not for long videos. A 1-minute 1080p clip from a phone camera is typically 100–200 MB — that belongs in cloud storage or AirDrop, not a temporary transfer tool."
        },
        {
            "type": "h2",
            "text": "What Counts as a 'Small Video'?"
        },
        {
            "type": "p",
            "text": "Not all video is created equal. Here is what fits within a 10 MB transfer and what does not:"
        },
        {
            "type": "ul",
            "items": [
                "Screen recordings (1080p, 30fps): roughly 10 MB per minute — a 1-minute clip fits, a 5-minute clip does not",
                "Phone camera clips (1080p, 30fps): roughly 100–150 MB per minute — only very short clips (under 5 seconds) fit",
                "Phone camera clips (720p, 30fps): roughly 50–80 MB per minute — still too large for most clips",
                "Short screen recordings (720p, compressed): roughly 5 MB per minute — 2-minute clips fit comfortably",
                "Webcam clips (720p): roughly 10–20 MB per minute — short clips fit"
            ]
        },
        {
            "type": "p",
            "text": "The key insight: screen recordings and webcam clips are much smaller than phone camera footage because they have less motion and less detail. For a quick demo video, a bug report recording, or a short tutorial, a browser-based transfer works. For anything longer than about 60 seconds from a phone camera, use cloud storage."
        },
        {
            "type": "h2",
            "text": "A Practical Decision Tree"
        },
        {
            "type": "ul",
            "items": [
                "Video is under 10 MB and both devices have a browser: use a browser-based file transfer — fastest, no account needed",
                "Both devices are Apple: AirDrop — original quality, no size limit, no compression",
                "Android to Windows: Quick Share (Google) — requires app install and account on Windows side",
                "Video is over 10 MB: cloud storage (Google Drive, Dropbox) — upload, share link, download",
                "Sending to someone else (not your own device): cloud storage or messaging app — they likely already have one of those"
            ]
        },
        {
            "type": "links",
            "items": [
                {
                    "to": "/share-files-online",
                    "text": "Send a video clip now — free, no sign-up, up to 10 MB"
                },
                {
                    "to": "/blog/how-to-send-photo-without-losing-quality",
                    "text": "How to send a photo without losing quality"
                },
                {
                    "to": "/blog/free-temporary-file-sharing",
                    "text": "Free temporary file sharing: how it works and when to use it"
                },
                {
                    "to": "/blog/airdrop-alternative-for-windows",
                    "text": "AirDrop alternative for Windows: 3 ways to send files and text"
                }
            ]
        }
    ]
};
