<template>
  <section class="section" aria-labelledby="features-title">
    <div class="container">
      <div class="section-header">
        <span class="section-label">Why TextShareNow</span>
        <h2 id="features-title" class="section-title">
          Built for <span class="glow-text">Speed</span>
        </h2>
        <p class="section-subtitle">
          Every decision in this tool is designed to save you time and protect your privacy.
        </p>
      </div>

      <div class="features-grid">
        <article
          v-for="(feature, i) in features"
          :key="feature.title"
          class="feature-card glass-card"
          :style="{ animationDelay: `${i * 0.07}s` }"
        >
          <div class="feature-icon-wrap" :style="{ background: feature.iconBg }">
            <span class="feature-icon">{{ feature.icon }}</span>
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-desc">{{ feature.description }}</p>
        </article>
      </div>

      <!-- Comparison table -->
      <div class="comparison glass-card">
        <h3 class="compare-title">
          <span class="section-label">Comparison</span><br />
          How We Stack Up
        </h3>
        <div class="compare-table-wrap">
          <table class="compare-table" aria-label="Feature comparison">
            <thead>
              <tr>
                <th scope="col">Feature</th>
                <th scope="col" class="highlight-col">TextShareNow</th>
                <th scope="col">Email Yourself</th>
                <th scope="col">QR Code Tools</th>
                <th scope="col">WhatsApp</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in comparisonRows" :key="row.feature">
                <td class="feature-name">{{ row.feature }}</td>
                <td class="highlight-col">
                  <span :class="row.us === true ? 'check' : row.us === false ? 'cross' : 'neutral'">
                    {{ row.us === true ? '✓' : row.us === false ? '✗' : row.us }}
                  </span>
                </td>
                <td>
                  <span :class="row.email === true ? 'check' : row.email === false ? 'cross' : 'neutral'">
                    {{ row.email === true ? '✓' : row.email === false ? '✗' : row.email }}
                  </span>
                </td>
                <td>
                  <span :class="row.qr === true ? 'check' : row.qr === false ? 'cross' : 'neutral'">
                    {{ row.qr === true ? '✓' : row.qr === false ? '✗' : row.qr }}
                  </span>
                </td>
                <td>
                  <span :class="row.wa === true ? 'check' : row.wa === false ? 'cross' : 'neutral'">
                    {{ row.wa === true ? '✓' : row.wa === false ? '✗' : row.wa }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const features = [
  {
    icon: '⚡',
    title: 'Under 10 Seconds',
    description: 'From paste to retrieve in less time than it takes to open your email app.',
    iconBg: 'rgba(0, 212, 255, 0.08)',
  },
  {
    icon: '🔒',
    title: 'Auto-Delete Privacy',
    description: 'Text is permanently deleted from our servers after first read or 10 minutes.',
    iconBg: 'rgba(0, 255, 135, 0.06)',
  },
  {
    icon: '📱',
    title: 'Works Both Ways',
    description: 'Mobile to desktop, desktop to mobile — the short code works in any direction.',
    iconBg: 'rgba(168, 85, 247, 0.08)',
  },
  {
    icon: '🌐',
    title: 'No App Required',
    description: 'Pure web-based. Open a browser on any device — that\'s all you need.',
    iconBg: 'rgba(0, 212, 255, 0.08)',
  },
  {
    icon: '🆓',
    title: 'Completely Free',
    description: 'No subscription, no credits, no hidden fees. Free for everyday use.',
    iconBg: 'rgba(255, 149, 0, 0.07)',
  },
  {
    icon: '🔑',
    title: 'No Account Needed',
    description: 'Zero sign-up. No email, no password. Open, share, done.',
    iconBg: 'rgba(0, 255, 135, 0.06)',
  },
]

const comparisonRows = [
  { feature: 'No account needed',    us: true,   email: false,  qr: true,   wa: false },
  { feature: 'Works phone → laptop', us: true,   email: true,   qr: '⚠️',  wa: true  },
  { feature: 'Works laptop → phone', us: true,   email: true,   qr: true,   wa: true  },
  { feature: 'Under 10 seconds',     us: true,   email: false,  qr: '⚠️',  wa: false },
  { feature: 'Auto-deletes data',    us: true,   email: false,  qr: false,  wa: false },
  { feature: 'Short, typeable code', us: true,   email: false,  qr: false,  wa: false },
  { feature: 'Works cross-network',  us: true,   email: true,   qr: '⚠️',  wa: true  },
]
</script>

<style scoped>
.section-header {
  margin-bottom: 48px;
}

/* Features grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 40px;
}

@media (max-width: 800px) {
  .features-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 520px) {
  .features-grid { grid-template-columns: 1fr; }
}

.feature-card {
  padding: 28px 22px;
  animation: fadeInUp 0.6s ease both;
}

.feature-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.feature-icon {
  font-size: 1.4rem;
}

.feature-title {
  font-family: var(--font-display);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  margin-bottom: 10px;
  color: var(--text-primary);
}

.feature-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.65;
  font-weight: 300;
}

/* Comparison */
.comparison {
  padding: 36px;
}

.compare-title {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  margin-bottom: 28px;
  line-height: 1.6;
}

.compare-table-wrap {
  overflow-x: auto;
}

.compare-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
}

.compare-table th {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
  padding: 8px 16px;
  text-align: center;
  border-bottom: 1px solid var(--border);
}

.compare-table th:first-child {
  text-align: left;
}

.compare-table td {
  padding: 12px 16px;
  text-align: center;
  border-bottom: 1px solid var(--border);
  color: var(--text-secondary);
}

.feature-name {
  text-align: left !important;
  color: var(--text-primary);
  font-weight: 500;
}

.highlight-col {
  background: rgba(0, 212, 255, 0.04);
  border-left: 1px solid var(--border-accent);
  border-right: 1px solid var(--border-accent);
  font-weight: 600;
}

.compare-table th.highlight-col {
  color: var(--accent);
}

.check   { color: var(--accent-green); font-weight: 700; }
.cross   { color: #ff4d6d; }
.neutral { color: var(--text-muted); }
</style>
