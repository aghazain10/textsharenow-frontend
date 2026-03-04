<template>
  <footer class="footer">
    <hr class="divider" />
    <div class="container footer-inner">
      <!-- Brand -->
      <div class="footer-brand">
        <div class="logo">
          <span class="logo-icon">⟨/⟩</span>
          <span class="logo-text">TextShare<span class="logo-accent">Now</span></span>
        </div>
        <p class="tagline">
          Instant text transfer between any devices.<br />
          No app. No account. Just a code.
        </p>
      </div>

      <!-- Links -->
      <nav class="footer-nav" aria-label="Footer navigation">
        <div class="footer-col">
          <h3 class="footer-col-title">Tool</h3>
          <NuxtLink to="/" class="footer-link">Send Text</NuxtLink>
          <NuxtLink to="/" class="footer-link">Receive Text</NuxtLink>
          <NuxtLink to="/how-it-works" class="footer-link">How It Works</NuxtLink>
        </div>
        <div class="footer-col">
          <h3 class="footer-col-title">Info</h3>
          <NuxtLink to="/faq" class="footer-link">FAQ</NuxtLink>
          <NuxtLink to="/blog" class="footer-link">Blog</NuxtLink>
          <NuxtLink to="/about" class="footer-link">About</NuxtLink>
        </div>
        <div class="footer-col">
          <h3 class="footer-col-title">Legal</h3>
          <NuxtLink to="/privacy" class="footer-link">Privacy Policy</NuxtLink>
          <NuxtLink to="/terms" class="footer-link">Terms of Use</NuxtLink>
        </div>
      </nav>
    </div>

    <div class="container footer-bottom">
      <p class="copyright">
        © {{ new Date().getFullYear() }} TextShareNow. All rights reserved.
      </p>
      <p class="made-with">
        <span class="mono">[ </span>Built for fast humans<span class="mono"> ]</span>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  z-index: 1;
}

.footer-inner {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 60px;
  padding-top: 60px;
  padding-bottom: 40px;
  align-items: start;
}

@media (max-width: 768px) {
  .footer-inner {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

/* Brand */
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.logo-icon {
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--accent);
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
}

.logo-text {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--text-primary);
}

.logo-accent {
  color: var(--accent);
}

.tagline {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.7;
  font-weight: 300;
}

/* Nav */
.footer-nav {
  display: flex;
  gap: 48px;
}

@media (max-width: 480px) {
  .footer-nav { gap: 32px; }
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-col-title {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 4px;
}

.footer-link {
  font-size: 0.85rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: var(--accent);
}

/* Bottom bar */
.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 28px;
  border-top: 1px solid var(--border);
  padding-top: 20px;
  flex-wrap: wrap;
  gap: 8px;
}

.copyright {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
}

.made-with {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.mono {
  font-family: var(--font-mono);
  color: var(--accent);
}
</style>
