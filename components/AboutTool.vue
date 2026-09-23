<template>
    <section class="section" aria-labelledby="about-tool-title">
        <div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
            <div>
                <p class="text-[13px] font-medium text-muted">About This Tool</p>
                <h2 id="about-tool-title" class="section-title mt-3">Why TextShareNow Exists</h2>
            </div>
            <div>
                <div class="grid max-w-[68ch] gap-5 text-[17px] leading-8 text-muted">
                    <p>
                        Moving a link, a note, or a snippet of text from one device to another sounds like a solved problem — until you actually try to do it quickly. Emailing yourself works, but it takes 30-60 seconds and clutters your inbox. Messaging yourself on WhatsApp or Telegram means opening an app and scrolling past your own chat history. Bluetooth and AirDrop only work reliably within the same ecosystem, and USB cables are rarely within reach when you need one.
                    </p>
                    <p>
                        TextShareNow is a fast, free tool for <strong class="font-semibold text-ink">online text sharing</strong> between any two devices. Paste your text, get a short 5-character code, type that code on your other device, and your content appears — typically in under 8 seconds. There's no account to create, no app to install, and no history left behind: everything you send is automatically deleted after it's read once, or after 10 minutes, whichever comes first.
                    </p>
                    <p>
                        It works in both directions — phone to laptop or laptop to phone — and across any network, so switching from home Wi-Fi to mobile data between devices doesn't break anything. It's a small, single-purpose tool, and that's intentional: one problem, solved well, for free.
                    </p>
                </div>
                <ul class="mt-8 grid gap-2 border-t border-line pt-6 text-[15px]">
                    <li><NuxtLink to="/how-it-works" class="text-link">See exactly how it works</NuxtLink></li>
                    <li><NuxtLink to="/blog/why-you-should-stop-emailing-yourself" class="text-link">Why email-to-self is worth quitting</NuxtLink></li>
                    <li><NuxtLink to="/blog/airdrop-alternative-cross-platform" class="text-link">Best AirDrop alternatives for cross-platform sharing</NuxtLink></li>
                </ul>
            </div>
        </div>
    </section>
</template>
