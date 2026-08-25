<template>
    <section class="section about-tool" aria-labelledby="about-tool-title">
        <div class="container">
            <div class="about-tool-inner glass-card">
                <span class="section-label">About This Tool</span>
                <h2 id="about-tool-title" class="section-title">
                    Why <span class="glow-text">TextShareNow</span> Exists
                </h2>

                <div class="about-tool-body">
                    <p>
                        Moving a link, a note, or a snippet of text from one
                        device to another sounds like a solved problem — until
                        you actually try to do it quickly. Emailing yourself
                        works, but it takes 30-60 seconds and clutters your
                        inbox. Messaging yourself on WhatsApp or Telegram means
                        opening an app and scrolling past your own chat history.
                        Bluetooth and AirDrop only work reliably within the same
                        ecosystem, and USB cables are rarely within reach when
                        you need one.
                    </p>
                    <p>
                        TextShareNow was built to remove every one of those
                        steps. Paste your text, get a short 5-character code,
                        type that code on your other device, and your content
                        appears — typically in under 8 seconds. There's no
                        account to create, no app to install, and no history
                        left behind: everything you send is automatically
                        deleted after it's read once, or after 10 minutes,
                        whichever comes first.
                    </p>
                    <p>
                        It works in both directions — phone to laptop or laptop
                        to phone — and across any network, so switching from
                        home Wi-Fi to mobile data between devices doesn't break
                        anything. It's a small, single-purpose tool, and that's
                        intentional: one problem, solved well, for free.
                    </p>
                </div>

                <div class="about-tool-links">
                    <NuxtLink to="/how-it-works" class="inline-link"
                        >See exactly how it works →</NuxtLink
                    >
                    <NuxtLink
                        to="/blog/why-you-should-stop-emailing-yourself"
                        class="inline-link"
                        >Why email-to-self is worth quitting →</NuxtLink
                    >
                    <NuxtLink
                        to="/blog/airdrop-alternative-cross-platform"
                        class="inline-link"
                        >Best AirDrop alternatives for cross-platform sharing →</NuxtLink
                    >
                </div>
            </div>
        </div>
    </section>
</template>

<script setup></script>

<style scoped>
.about-tool-inner {
    padding: 44px 40px;
}

.about-tool-inner .section-title {
    margin-top: 12px;
    margin-bottom: 24px;
}

.about-tool-body {
    display: flex;
    flex-direction: column;
    gap: 18px;
    max-width: 720px;
}

.about-tool-body p {
    font-size: 0.92rem;
    color: var(--text-secondary);
    line-height: 1.85;
    font-weight: 300;
}

.about-tool-links {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
    margin-top: 28px;
    padding-top: 24px;
    border-top: 1px solid var(--border);
}

.inline-link {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    letter-spacing: 0.04em;
    color: var(--accent);
    text-decoration: none;
}

.inline-link:hover {
    opacity: 0.75;
}
</style>
