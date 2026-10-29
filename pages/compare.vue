<template>
    <div>
        <PageHero
            title="Compare Secure Secret Sharing Tools"
            meta="Comparison · Reviewed October 29, 2026"
            lead="TextShareNow, OneTimeSecret, Privnote, Password.link, Yopass, and Password Pusher all remove secrets from email and chat. They make different trade-offs on files, encryption, self-hosting, and team controls. Here is the honest comparison — including where TextShareNow is not the right choice."
        >
            <div class="mt-8 flex flex-wrap gap-3">
                <NuxtLink to="/#tool" class="btn-primary">
                    <TsnIcon name="lock" class="h-4 w-4" stroke="2" />Try TextShareNow
                </NuxtLink>
                <NuxtLink to="/security" class="btn-ghost">Read the security details</NuxtLink>
            </div>
        </PageHero>

        <section class="section pt-0" aria-labelledby="quick-answer-title">
            <div class="wrap">
                <div class="rounded-xl border border-line bg-surface-2/60 p-6 sm:p-8">
                    <h2 id="quick-answer-title" class="text-[20px] font-semibold tracking-[-0.025em] text-ink">The short answer</h2>
                    <p class="mt-3 max-w-[80ch] text-[16px] leading-7 text-muted">
                        If you need <strong class="font-semibold text-ink">text-only secrets plus self-hosting</strong>, OneTimeSecret is still the stronger fit.
                        If you need <strong class="font-semibold text-ink">text and files in one no-account flow, with optional browser-side encryption</strong>, TextShareNow is the closest fit.
                        For EU-hosted zero-knowledge text and files with team features, look at Password.link. For a self-hosted CLI workflow, look at Yopass.
                        For audit logs, SSO, and very large files, look at Password Pusher.
                    </p>
                </div>

                <nav class="mt-6 flex flex-wrap gap-2" aria-label="Jump to a tool">
                    <a
                        v-for="tool in tools"
                        :key="tool.id"
                        :href="`#${tool.id}`"
                        class="rounded-full border border-line bg-bg px-3 py-1.5 text-[13px] font-medium text-muted transition-colors hover:border-muted hover:text-ink"
                    >{{ tool.name }}</a>
                </nav>
            </div>
        </section>

        <section class="section" aria-labelledby="compare-table-title">
            <div class="wrap">
                <div class="max-w-2xl">
                    <p class="text-[13px] font-medium text-muted">At a glance</p>
                    <h2 id="compare-table-title" class="section-title mt-3">The six tools side by side</h2>
                    <p class="section-lead">Feature support, not marketing language. Check the linked official pages before relying on a detail — plans and limits change.</p>
                </div>

                <div class="mt-10 overflow-x-auto rounded-xl border border-line bg-surface shadow-card">
                    <table class="w-full min-w-[1040px] border-collapse text-left text-[14px]" aria-label="Comparison of secure secret sharing tools">
                        <thead>
                            <tr>
                                <th scope="col" class="px-4 py-4 font-medium text-muted">Tool</th>
                                <th scope="col" class="px-4 py-4 font-medium text-muted">Best for</th>
                                <th scope="col" class="px-4 py-4 font-medium text-muted">Files</th>
                                <th scope="col" class="px-4 py-4 font-medium text-muted">Encryption model</th>
                                <th scope="col" class="px-4 py-4 font-medium text-muted">Self-host</th>
                                <th scope="col" class="px-4 py-4 font-medium text-muted">Pricing</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="tool in tools" :key="tool.id" class="border-t border-line align-top">
                                <th scope="row" class="px-4 py-4 font-semibold text-ink">
                                    <NuxtLink v-if="!tool.external" to="/" class="underline decoration-line underline-offset-4 hover:decoration-ink">{{ tool.name }}</NuxtLink>
                                    <a v-else :href="tool.url" target="_blank" rel="noopener noreferrer" class="underline decoration-line underline-offset-4 hover:decoration-ink">{{ tool.name }}</a>
                                    <span v-if="!tool.external" class="mt-1 block text-[11px] font-medium uppercase tracking-wide text-muted">This site</span>
                                </th>
                                <td class="px-4 py-4 text-muted">{{ tool.bestFor }}</td>
                                <td class="px-4 py-4 text-muted">{{ tool.files }}</td>
                                <td class="px-4 py-4 text-muted">{{ tool.encryption }}</td>
                                <td class="px-4 py-4 text-muted">{{ tool.selfHost }}</td>
                                <td class="px-4 py-4 text-muted">{{ tool.pricing }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p class="mt-4 max-w-[80ch] text-[13px] leading-6 text-muted">
                    “Browser-side” means the encryption key is handled in the user’s browser according to the vendor’s documentation. It is not an independent audit.
                    TextShareNow is our product; competitor entries are based on their public docs and product pages reviewed on October 29, 2026.
                </p>
            </div>
        </section>

        <section class="section" aria-labelledby="onetimesecret-title">
            <div class="wrap">
                <div class="max-w-2xl">
                    <p class="text-[13px] font-medium text-muted">The closest comparison</p>
                    <h2 id="onetimesecret-title" class="section-title mt-3">TextShareNow vs OneTimeSecret</h2>
                    <p class="section-lead">OneTimeSecret is the established, open-source, text-only option. TextShareNow is the newer tool built for text <em>and</em> files with a code-first flow.</p>
                </div>

                <div class="mt-10 overflow-x-auto rounded-xl border border-line bg-surface shadow-card">
                    <table class="w-full min-w-[720px] border-collapse text-left text-[15px]" aria-label="TextShareNow versus OneTimeSecret">
                        <thead>
                            <tr>
                                <th scope="col" class="px-5 py-4 font-medium text-muted">Factor</th>
                                <th scope="col" class="bg-surface-2 px-5 py-4 font-semibold text-ink">TextShareNow</th>
                                <th scope="col" class="px-5 py-4 font-semibold">OneTimeSecret</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in oneTimeRows" :key="row[0]" class="border-t border-line align-top">
                                <th scope="row" class="px-5 py-4 font-medium">{{ row[0] }}</th>
                                <td class="bg-surface-2/60 px-5 py-4 text-muted">{{ row[1] }}</td>
                                <td class="px-5 py-4 text-muted">{{ row[2] }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="mt-6 grid gap-4 md:grid-cols-2">
                    <article class="tile">
                        <h3 class="text-[19px] font-semibold tracking-[-0.02em]">Choose OneTimeSecret if…</h3>
                        <p class="mt-2 text-[15px] leading-relaxed text-muted">
                            You want a text-only service with a long track record, open-source code you can inspect, self-hosting, regional hosting, and an established team/API offering.
                        </p>
                    </article>
                    <article class="tile !border-brand">
                        <h3 class="text-[19px] font-semibold tracking-[-0.02em]">Choose TextShareNow if…</h3>
                        <p class="mt-2 text-[15px] leading-relaxed text-muted">
                            You want to send text and files from the same screen, keep the 5-character code flow, avoid an account, and optionally encrypt contents in your browser before upload.
                        </p>
                    </article>
                </div>
            </div>
        </section>

        <section class="section" aria-labelledby="tools-title">
            <div class="wrap">
                <div class="max-w-2xl">
                    <p class="text-[13px] font-medium text-muted">The details</p>
                    <h2 id="tools-title" class="section-title mt-3">Which tool fits which job?</h2>
                    <p class="section-lead">A quick profile of each option, including the cases where it beats TextShareNow.</p>
                </div>

                <div class="mt-10 grid gap-4 md:grid-cols-2">
                    <article
                        v-for="tool in tools"
                        :id="tool.id"
                        :key="tool.id"
                        class="tile scroll-mt-24"
                        :class="{ '!border-brand': !tool.external }"
                    >
                        <div class="flex flex-wrap items-start justify-between gap-2">
                            <h3 class="text-[21px] font-semibold tracking-[-0.025em]">{{ tool.name }}</h3>
                            <span v-if="!tool.external" class="rounded-full border border-line bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted">This site</span>
                            <span v-else class="rounded-full border border-line bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted">{{ tool.type }}</span>
                        </div>
                        <p class="mt-3 text-[15px] leading-relaxed text-muted">{{ tool.summary }}</p>
                        <dl class="mt-4 grid gap-2 text-[14px] leading-6">
                            <div class="flex gap-2">
                                <dt class="w-16 shrink-0 font-medium text-ink">Choose if</dt>
                                <dd class="text-muted">{{ tool.choose }}</dd>
                            </div>
                            <div class="flex gap-2">
                                <dt class="w-16 shrink-0 font-medium text-ink">Skip if</dt>
                                <dd class="text-muted">{{ tool.skip }}</dd>
                            </div>
                        </dl>
                        <a
                            v-if="tool.external"
                            :href="tool.url"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-link"
                        >Visit {{ tool.name }}<TsnIcon name="external" class="h-3.5 w-3.5" stroke="1.9" /></a>
                        <NuxtLink v-else to="/" class="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-link">
                            Open TextShareNow<TsnIcon name="arrow" class="h-3.5 w-3.5" stroke="1.9" />
                        </NuxtLink>
                    </article>
                </div>
            </div>
        </section>

        <section class="section" aria-labelledby="criteria-title">
            <div class="wrap">
                <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
                    <div>
                        <p class="text-[13px] font-medium text-muted">Method</p>
                        <h2 id="criteria-title" class="section-title mt-3">What we compared</h2>
                        <p class="section-lead">The useful differences are not just “encrypted or not.”</p>
                    </div>
                    <ul class="grid gap-3 text-[15px] leading-6 text-muted">
                        <li v-for="criterion in criteria" :key="criterion" class="flex gap-2">
                            <TsnIcon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-ok" stroke="2.4" />
                            <span>{{ criterion }}</span>
                        </li>
                    </ul>
                </div>

                <div class="mt-10 rounded-xl border border-line bg-surface-2/60 p-6 text-[14px] leading-6 text-muted">
                    <p class="font-medium text-ink">Disclosure</p>
                    <p class="mt-2 max-w-[85ch]">
                        TextShareNow is our product. We built this page because “which tool is most secure?” has no universal answer: self-hosting, browser-side encryption, file support, metadata exposure, and team controls are different trade-offs.
                        We included cases where a competitor is the better choice. We did not run independent security audits of any product listed here. Features and prices change; verify them on the vendor’s official page before deciding.
                    </p>
                </div>
            </div>
        </section>

        <section class="section" aria-labelledby="faq-title" itemscope itemtype="https://schema.org/FAQPage">
            <div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
                <div>
                    <p class="text-[13px] font-medium text-muted">Questions</p>
                    <h2 id="faq-title" class="section-title mt-3">Comparison FAQ</h2>
                    <p class="section-lead">The answers people actually need before choosing a secret-sharing tool.</p>
                    <NuxtLink to="/faq" class="btn-ghost mt-6">View all FAQs</NuxtLink>
                </div>
                <div class="border-t border-line">
                    <details
                        v-for="(item, i) in faqs"
                        :key="i"
                        class="faq border-b border-line"
                        :open="i === 0"
                        itemprop="mainEntity"
                        itemscope
                        itemtype="https://schema.org/Question"
                    >
                        <summary class="flex items-center justify-between gap-4 py-4 text-[15px] font-medium hover:underline hover:underline-offset-4">
                            <span itemprop="name">{{ item.question }}</span>
                            <span class="plus grid h-6 w-6 shrink-0 place-items-center text-muted"><TsnIcon name="plus" class="h-3.5 w-3.5" stroke="2.6" /></span>
                        </summary>
                        <div itemprop="acceptedAnswer" itemscope itemtype="https://schema.org/Answer">
                            <p class="max-w-[62ch] pb-4 text-[15px] text-muted" itemprop="text">{{ item.answer }}</p>
                        </div>
                    </details>
                </div>
            </div>
        </section>

        <section class="section" aria-labelledby="sources-title">
            <div class="wrap">
                <div class="max-w-[80ch]">
                    <h2 id="sources-title" class="section-title">Sources checked</h2>
                    <p class="section-lead">Public product pages and documentation, reviewed October 29, 2026.</p>
                    <ul class="mt-6 grid gap-2 text-[14px]">
                        <li v-for="source in sources" :key="source.url">
                            <a :href="source.url" target="_blank" rel="noopener noreferrer" class="text-link">{{ source.label }}</a>
                        </li>
                    </ul>
                </div>

                <div class="mt-12 flex flex-wrap gap-3">
                    <NuxtLink to="/share-files-online" class="btn-primary">Share a file now</NuxtLink>
                    <NuxtLink to="/security" class="btn-ghost">How TextShareNow encryption works</NuxtLink>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { useSeo, useHead } from '#imports'

useSeo({
    title: 'Secure Secret Sharing Tools Compared (2026)',
    description: 'Compare TextShareNow, OneTimeSecret, Privnote, Password.link, Yopass, and Password Pusher by file support, encryption, self-hosting, limits, and price.',
    pagePath: '/compare',
})

const tools = [
    {
        id: 'textsharenow',
        name: 'TextShareNow',
        url: '/',
        external: false,
        type: 'Hosted',
        bestFor: 'Text + files in one no-account flow',
        files: 'Yes — 10 MB free (photos/short video); 100 MB / 20 files Pro',
        encryption: 'Optional browser-side AES-256-GCM for text and files',
        selfHost: 'No — hosted',
        pricing: 'Free; Pro $5/mo',
        summary: 'The same 5-character code handles text and files. Private mode encrypts contents in the browser before upload; standard uploads are scanned for malware. Free text is 10,000 characters; free files are 10 MB and limited to photos and short videos. Pro raises limits and adds passwords, custom codes, and API/MCP access.',
        choose: 'You want one tool for text and files, no account, optional browser-side encryption, and a code that works from any browser.',
        skip: 'Self-hosting or open-source verification is a hard requirement, or you need team audit logs and SSO.',
    },
    {
        id: 'onetimesecret',
        name: 'OneTimeSecret',
        url: 'https://onetimesecret.com/en/',
        external: true,
        type: 'Open source',
        bestFor: 'Text-only secrets with self-hosting',
        files: 'No — text-only by design',
        encryption: 'Optional passphrase; official docs describe server-side encryption',
        selfHost: 'Yes — open source',
        pricing: 'Free tier; paid plans',
        summary: 'The long-running, open-source secret service. Anonymous secrets can last up to 7 days and 100 KB; free accounts raise that to 14 days and 1 MB. It offers self-hosting, regional hosting, teams, and an API, but no native file sharing.',
        choose: 'Open-source code, self-hosting, regional hosting, or a text-only workflow are requirements.',
        skip: 'You need to send files or want browser-side encryption without relying on a passphrase.',
    },
    {
        id: 'privnote',
        name: 'Privnote',
        url: 'https://privnote.com/',
        external: true,
        type: 'Hosted',
        bestFor: 'Simple text notes that self-destruct',
        files: 'No — text notes only',
        encryption: 'Browser-side encryption claim; closed source',
        selfHost: 'No',
        pricing: 'Free',
        summary: 'The simplest option: write a note, optionally add a password and expiry, then send a link. The note is destroyed after it is read or when the timer ends. No account, no files, and no self-hosting.',
        choose: 'You only need a quick text note and want the shortest path from paste to link.',
        skip: 'You need files, open-source code, self-hosting, or independently auditable encryption.',
    },
    {
        id: 'passwordlink',
        name: 'Password.link',
        url: 'https://password.link/en',
        external: true,
        type: 'Hosted',
        bestFor: 'EU-hosted zero-knowledge text + files',
        files: 'Yes — 10 MB per file, multiple attachments',
        encryption: 'Browser-side AES-256-GCM',
        selfHost: 'Custom/enterprise self-host',
        pricing: 'Free tier; paid plans',
        summary: 'A polished zero-knowledge service with one-time links, file attachments, secret requests, secure chat, teams, API access, and EU hosting. It is a stronger fit than TextShareNow for team workflows and enterprise deployment.',
        choose: 'EU hosting, team controls, secret requests, or a mature zero-knowledge provider matter more than a 5-character code.',
        skip: 'You want the simplest free flow, a short code, or no account at all.',
    },
    {
        id: 'yopass',
        name: 'Yopass',
        url: 'https://yopass.se/',
        external: true,
        type: 'Open source',
        bestFor: 'Self-hosted E2E text + small files',
        files: 'Yes — 512 KB default; 1 MB cap without a license',
        encryption: 'Browser-side OpenPGP',
        selfHost: 'Yes — open source',
        pricing: 'Free self-host; business license',
        summary: 'Open-source, browser-encrypted secrets and files with a CLI, Docker/Kubernetes deployment, Redis or Memcached, and optional S3 storage. Its default file cap is small compared with file-first services.',
        choose: 'You want to run it yourself, script it, or need OpenPGP-based end-to-end encryption.',
        skip: 'You need 10–100 MB files or a zero-setup hosted flow.',
    },
    {
        id: 'passwordpusher',
        name: 'Password Pusher',
        url: 'https://us.pwpush.com/features',
        external: true,
        type: 'Open source',
        bestFor: 'Teams, audits, and self-hosted pushes',
        files: 'Yes — large files (4 GB tested)',
        encryption: 'AES-256 + passphrases; audit logs',
        selfHost: 'Yes — open source and Pro',
        pricing: 'Free tier; paid plans',
        summary: 'A mature open-source tool for passwords, text, URLs, and files with expiration, view limits, passphrases, audit trails, SSO, API/CLI, and self-hosting. It is built for team and operations workflows rather than a one-off transfer.',
        choose: 'You need audit logs, team controls, SSO, large files, or a self-hosted operations tool.',
        skip: 'You want a lightweight, no-login transfer with a short code and minimal setup.',
    },
]

const oneTimeRows = [
    ['Native file sharing', 'Yes — 10 MB free; 100 MB and 20 files on Pro', 'No — text-only by design'],
    ['Browser-side encryption', 'Optional for text and files; key stays in the URL fragment', 'Optional passphrase; official docs describe server-side encryption'],
    ['Self-hosting / open source', 'No — hosted service', 'Yes — open source and self-hostable'],
    ['Share format', '5-character code or full link', 'One-time link'],
    ['Free limits', '10,000 characters; 10 MB photo/video files; 10 min–1 h', 'Anonymous: 7 days / 100 KB. Free account: 14 days / 1 MB'],
    ['Best fit', 'Text + files, no account, optional E2E', 'Text-only, self-hosting, open-source verification'],
]

const criteria = [
    'Whether files are supported natively, and at what size.',
    'Whether encryption happens in the browser or on the server, according to the vendor.',
    'Whether the service is open source, self-hostable, or hosted only.',
    'Expiry, read limits, password/passphrase support, and account requirements.',
    'What metadata remains visible — names, sizes, timestamps, and folder paths.',
    'Team features: audit logs, SSO, secret requests, API, and self-hosting.',
]

const faqs = [
    {
        question: 'Is TextShareNow a OneTimeSecret alternative?',
        answer: 'Yes, if you need text and files in one flow, optional browser-side encryption, and no account. OneTimeSecret is the better choice if text-only, open-source code, self-hosting, or regional hosting is a hard requirement.',
    },
    {
        question: 'Can OneTimeSecret send files?',
        answer: 'No. OneTimeSecret’s official FAQ says the service is designed for text-based secrets and does not support pictures or other files. It recommends a dedicated secure file transfer service for files.',
    },
    {
        question: 'Which tool is more secure?',
        answer: 'There is no universal winner. TextShareNow encrypts Private text and file contents in the browser; OneTimeSecret offers open-source code and self-hosting with optional passphrases; Password.link and Yopass use browser-side encryption; Password Pusher adds audit logs. The right choice depends on whether you need verifiable code, self-hosting, files, team controls, or the smallest metadata footprint.',
    },
    {
        question: 'Are TextShareNow encrypted files virus-scanned?',
        answer: 'No. Standard uploads are scanned with ClamAV. Private file contents are encrypted before upload, so the server cannot scan them. File names, MIME types, sizes, and folder paths remain visible. Only open encrypted files from people you trust.',
    },
    {
        question: 'Can I self-host TextShareNow?',
        answer: 'No. TextShareNow is a hosted service. If self-hosting is required, OneTimeSecret, Yopass, and Password Pusher are the relevant options in this comparison.',
    },
    {
        question: 'Is TextShareNow free?',
        answer: 'Yes. The free plan includes text and small files with no account. Pro is optional and adds larger limits, longer expiry, passwords, custom codes, and API/MCP access.',
    },
]

const sources = [
    { label: 'TextShareNow — Security & encryption details', url: 'https://www.textsharenow.com/security' },
    { label: 'OneTimeSecret — About and FAQ', url: 'https://onetimesecret.com/en/about/' },
    { label: 'OneTimeSecret — Self-hosting docs', url: 'https://docs.onetimesecret.com/en/self-hosting/' },
    { label: 'Privnote — Official site', url: 'https://privnote.com/' },
    { label: 'Password.link — Features', url: 'https://password.link/en' },
    { label: 'Password.link — FAQ', url: 'https://password.link/en/p/faq' },
    { label: 'Yopass — Features and docs', url: 'https://yopass.se/' },
    { label: 'Password Pusher — Features', url: 'https://us.pwpush.com/features' },
    { label: 'Password Pusher — Documentation', url: 'https://docs.pwpush.com/' },
]

useHead({
    script: [
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@graph': [
                    {
                        '@type': 'Article',
                        headline: 'Secure Secret Sharing Tools Compared (2026)',
                        description: 'Compare TextShareNow, OneTimeSecret, Privnote, Password.link, Yopass, and Password Pusher by file support, encryption, self-hosting, limits, and price.',
                        datePublished: '2026-10-29',
                        dateModified: '2026-10-29',
                        author: {
                            '@type': 'Person',
                            name: 'Zain Rizvee',
                            url: 'https://www.textsharenow.com/author/zain-rizvee',
                        },
                        publisher: {
                            '@type': 'Organization',
                            name: 'TextShareNow',
                            url: 'https://www.textsharenow.com',
                        },
                        mainEntityOfPage: {
                            '@type': 'WebPage',
                            '@id': 'https://www.textsharenow.com/compare',
                        },
                    },
                    {
                        '@type': 'ItemList',
                        name: 'Secure secret sharing tools compared',
                        itemListElement: tools.map((tool, index) => ({
                            '@type': 'ListItem',
                            position: index + 1,
                            name: tool.name,
                            url: tool.external ? tool.url : 'https://www.textsharenow.com/',
                        })),
                    },
                    {
                        '@type': 'FAQPage',
                        mainEntity: faqs.map((faq) => ({
                            '@type': 'Question',
                            name: faq.question,
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: faq.answer,
                            },
                        })),
                    },
                ],
            }),
        },
    ],
})
</script>
