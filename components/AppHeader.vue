<template>
  <header class="header" :class="{ scrolled: isScrolled }">
    <div class="container header-inner">
      <!-- Logo -->
      <NuxtLink to="/" class="logo" aria-label="TextShareNow home">
        <span class="logo-icon">⟨/⟩</span>
        <span class="logo-text">TextShare<span class="logo-accent">Now</span></span>
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav class="nav-links" aria-label="Main navigation">
        <NuxtLink to="/" class="nav-link">Tool</NuxtLink>
        <NuxtLink to="/how-it-works" class="nav-link">How It Works</NuxtLink>
        <NuxtLink to="/faq" class="nav-link">FAQ</NuxtLink>
        <NuxtLink to="/blog" class="nav-link">Blog</NuxtLink>
        <NuxtLink to="/about" class="nav-link">About</NuxtLink>
      </nav>

      <!-- Status + Mobile Toggle -->
      <div class="header-right">
        <div class="status-badge" aria-label="Service status: online">
          <span class="status-dot" />
          <span class="status-text">Online</span>
        </div>

        <button
          class="mobile-toggle"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
          @click="menuOpen = !menuOpen"
        >
          <span :class="['toggle-bar', { open: menuOpen }]" />
          <span :class="['toggle-bar', { open: menuOpen }]" />
          <span :class="['toggle-bar', { open: menuOpen }]" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition name="slide-down">
      <nav
        v-if="menuOpen"
        id="mobile-menu"
        class="mobile-menu"
        aria-label="Mobile navigation"
      >
        <NuxtLink to="/"              class="mobile-link" @click="menuOpen = false">Tool</NuxtLink>
        <NuxtLink to="/how-it-works"  class="mobile-link" @click="menuOpen = false">How It Works</NuxtLink>
        <NuxtLink to="/faq"           class="mobile-link" @click="menuOpen = false">FAQ</NuxtLink>
        <NuxtLink to="/blog"          class="mobile-link" @click="menuOpen = false">Blog</NuxtLink>
        <NuxtLink to="/about"         class="mobile-link" @click="menuOpen = false">About</NuxtLink>
      </nav>
    </Transition>
  </header>
</template>

<script setup>
const isScrolled = ref(false)
const menuOpen   = ref(false)

onMounted(() => {
  const handler = () => { isScrolled.value = window.scrollY > 20 }
  window.addEventListener('scroll', handler, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', handler))
})

// Close menu on route change
const route = useRoute()
watch(() => route.path, () => { menuOpen.value = false })
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: transparent;
  transition: background 0.3s ease, border-color 0.3s ease;
  border-bottom: 1px solid transparent;
}

.header.scrolled {
  background: rgba(6, 10, 20, 0.9);
  backdrop-filter: blur(16px);
  border-bottom-color: var(--border-accent);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 68px;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.logo-icon {
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--accent);
  text-shadow: 0 0 12px rgba(0, 212, 255, 0.6);
}

.logo-text {
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--text-primary);
}

.logo-accent {
  color: var(--accent);
}

/* Nav links */
.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 6px 14px;
  border-radius: 8px;
  transition: color 0.2s, background 0.2s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--accent);
  background: var(--accent-dim);
}

/* Status badge */
.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: var(--accent-green);
  text-transform: uppercase;
}

.status-text {
  display: none;
}

@media (min-width: 640px) {
  .status-text { display: inline; }
}

/* Mobile toggle */
.mobile-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.toggle-bar {
  width: 22px;
  height: 2px;
  background: var(--text-secondary);
  border-radius: 2px;
  transition: all 0.25s ease;
  display: block;
}

.toggle-bar.open:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.toggle-bar.open:nth-child(2) { opacity: 0; }
.toggle-bar.open:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

@media (max-width: 768px) {
  .nav-links    { display: none; }
  .mobile-toggle { display: flex; }
}

/* Mobile menu */
.mobile-menu {
  background: rgba(6, 10, 20, 0.96);
  backdrop-filter: blur(16px);
  border-top: 1px solid var(--border-accent);
  padding: 16px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mobile-link {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 12px 16px;
  border-radius: 8px;
  transition: color 0.2s, background 0.2s;
}

.mobile-link:hover,
.mobile-link.router-link-active {
  color: var(--accent);
  background: var(--accent-dim);
}

/* Transition */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
