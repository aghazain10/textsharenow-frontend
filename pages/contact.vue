<template>
    <div>
        <section class="contact-hero section">
            <div class="container">
                <span class="section-label">Contact</span>
                <h1 class="section-title animate-fade-up">
                    Get in <span class="glow-text">Touch</span>
                </h1>
                <p class="section-subtitle animate-fade-up-1">
                    TextShareNow is a one-person project with no support ticket
                    system and no live chat — just a real inbox. Questions, bug
                    reports, and feedback are all welcome.
                </p>
            </div>
        </section>

        <section class="section">
            <div class="container contact-content">
                <article class="contact-body glass-card">
                    <h2 class="contact-section-heading">Reach Me Directly</h2>
                    <p>
                        TextShareNow doesn't run a backend for contact forms, so
                        rather than a form that quietly goes nowhere, here's how
                        to reach me directly. I read and reply to every message
                        myself.
                    </p>

                    <div class="contact-grid">
                        <a
                            href="mailto:info@textsharenow.com"
                            class="contact-item"
                        >
                            <span class="contact-icon">✉️</span>
                            <div>
                                <span class="contact-label"
                                    >Email (Support)</span
                                >
                                <span class="contact-value"
                                    >info@textsharenow.com</span
                                >
                            </div>
                        </a>

                        <a
                            href="mailto:aghazain10@gmail.com"
                            class="contact-item"
                        >
                            <span class="contact-icon">📧</span>
                            <div>
                                <span class="contact-label"
                                    >Email (Personal)</span
                                >
                                <span class="contact-value"
                                    >aghazain10@gmail.com</span
                                >
                            </div>
                        </a>

                        <a href="tel:+923460950600" class="contact-item">
                            <span class="contact-icon">📞</span>
                            <div>
                                <span class="contact-label">Phone</span>
                                <span class="contact-value"
                                    >+92 346 0950600</span
                                >
                            </div>
                        </a>

                        <div class="contact-item contact-item-static">
                            <span class="contact-icon">📍</span>
                            <div>
                                <span class="contact-label">Based In</span>
                                <span class="contact-value"
                                    >Skardu, Pakistan</span
                                >
                            </div>
                        </div>
                    </div>

                    <hr class="content-divider" />

                    <h2 class="contact-section-heading">
                        What To Contact Me About
                    </h2>
                    <ul class="contact-list">
                        <li>Bugs or issues with sending / receiving text</li>
                        <li>Feature requests or feedback on the tool</li>
                        <li>Business, partnership, or advertising inquiries</li>
                        <li>
                            Privacy or data questions about how TextShareNow
                            works
                        </li>
                    </ul>
                </article>

                <aside class="contact-sidebar">
                    <div class="sidebar-card glass-card">
                        <h3 class="sidebar-title">About the Developer</h3>
                        <p class="sidebar-desc">
                            Zain Rizvee — web developer based in Skardu,
                            Pakistan, building and running e-commerce businesses
                            with Laravel, Nuxt, and Vue.
                        </p>
                        <NuxtLink to="/about" class="btn-primary sidebar-btn">
                            <span>Read Full Story →</span>
                        </NuxtLink>
                    </div>

                    <div class="sidebar-card glass-card">
                        <h3 class="sidebar-title">Ready to try it?</h3>
                        <p class="sidebar-desc">
                            No sign-up. No app. Just open and share.
                        </p>
                        <NuxtLink to="/" class="btn-primary sidebar-btn">
                            <span>Use the Tool →</span>
                        </NuxtLink>
                    </div>
                </aside>
            </div>
        </section>
    </div>
</template>

<script setup>
useSeo({
    title: "Contact — TextShareNow",
    description:
        "Get in touch with the developer of TextShareNow for support, feedback, bug reports, or business inquiries.",
    pagePath: "/contact",
});
</script>

<style scoped>
.contact-hero {
    padding-bottom: 40px;
}

.contact-content {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 32px;
    align-items: start;
}

@media (max-width: 900px) {
    .contact-content {
        grid-template-columns: 1fr;
    }
}

.contact-body {
    padding: 40px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.contact-section-heading {
    font-family: var(--font-display);
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: var(--accent);
    text-transform: uppercase;
    margin-top: 8px;
}

.contact-body p {
    font-size: 0.92rem;
    color: var(--text-secondary);
    line-height: 1.8;
    font-weight: 300;
}

.content-divider {
    border: none;
    border-top: 1px solid var(--border);
    margin: 8px 0;
}

.contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 8px;
}

@media (max-width: 600px) {
    .contact-grid {
        grid-template-columns: 1fr;
    }
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 20px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: var(--radius);
    border: 1px solid var(--border);
    text-decoration: none;
    transition:
        border-color 0.2s ease,
        transform 0.2s ease;
}

.contact-item:hover {
    border-color: var(--accent);
    transform: translateY(-2px);
}

.contact-item-static {
    cursor: default;
}

.contact-item-static:hover {
    border-color: var(--border);
    transform: none;
}

.contact-icon {
    font-size: 1.3rem;
    flex-shrink: 0;
}

.contact-label {
    display: block;
    font-family: var(--font-mono);
    font-size: 0.62rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 4px;
}

.contact-value {
    display: block;
    font-size: 0.86rem;
    color: var(--text-primary);
    font-weight: 500;
    word-break: break-word;
}

.contact-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 0;
    margin: 0;
}

.contact-list li {
    font-size: 0.9rem;
    color: var(--text-secondary);
    font-weight: 300;
    padding-left: 20px;
    position: relative;
}

.contact-list li::before {
    content: "→";
    position: absolute;
    left: 0;
    color: var(--accent);
}

/* Sidebar (reuses about page pattern) */
.contact-sidebar {
    position: sticky;
    top: 90px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.sidebar-card {
    padding: 28px 24px;
}

.sidebar-title {
    font-family: var(--font-display);
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-secondary);
    margin-bottom: 20px;
}

.sidebar-desc {
    font-size: 0.84rem;
    color: var(--text-secondary);
    margin-bottom: 16px;
    line-height: 1.6;
}

.sidebar-btn {
    width: 100%;
    display: flex;
    justify-content: center;
}
</style>
