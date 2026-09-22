<template>
    <div>
        <section class="section pricing-hero">
            <div class="glow-blob glow-blob--1" aria-hidden="true" />
            <div class="glow-blob glow-blob--2" aria-hidden="true" />

            <div class="container">
                <div class="pricing-header">
                    <span class="section-label">Pricing</span>
                    <h1 class="section-title">
                        Upgrade to <span class="glow-text">TextShareNow Pro</span>
                    </h1>
                    <p class="section-subtitle">
                        Unlock premium features for power users. More storage, larger files, and priority support.
                    </p>
                </div>

                <div class="pricing-toggle">
                    <button
                        :class="['toggle-btn', { active: billingCycle === 'monthly' }]"
                        @click="billingCycle = 'monthly'"
                    >
                        Monthly
                    </button>
                    <button
                        :class="['toggle-btn', { active: billingCycle === 'yearly' }]"
                        @click="billingCycle = 'yearly'"
                    >
                        Yearly <span class="save-badge">Save $10</span>
                    </button>
                </div>

                <div class="pricing-cards">
                    <!-- Free Tier -->
                    <div class="pricing-card glass-card">
                        <div class="plan-header">
                            <h3 class="plan-name">Free</h3>
                            <div class="plan-price">
                                <span class="price-amount">$0</span>
                                <span class="price-period">forever</span>
                            </div>
                        </div>
                        <ul class="plan-features">
                            <li>5,000 character text limit</li>
                            <li>10 MB file upload</li>
                            <li>10 min text expiry</li>
                            <li>15 min file expiry</li>
                            <li>Basic sharing</li>
                        </ul>
                        <NuxtLink to="/" class="btn-secondary plan-btn">
                            Get Started Free
                        </NuxtLink>
                    </div>

                    <!-- Pro Tier -->
                    <div class="pricing-card glass-card pro-card">
                        <div class="pro-badge">Most Popular</div>
                        <div class="plan-header">
                            <h3 class="plan-name">Pro</h3>
                            <div class="plan-price">
                                <span class="price-amount glow-text">
                                    ${{ billingCycle === 'monthly' ? '5' : '50' }}
                                </span>
                                <span class="price-period">
                                    /{{ billingCycle === 'monthly' ? 'month' : 'year' }}
                                </span>
                            </div>
                        </div>
                        <ul class="plan-features">
                            <li>Unlimited text length</li>
                            <li>50 MB file upload</li>
                            <li>24 hour text expiry</li>
                            <li>7 day file expiry</li>
                            <li>Priority support</li>
                            <li>No ads</li>
                        </ul>
                        <button
                            class="btn-primary plan-btn"
                            :disabled="!paddleLoaded || loading"
                            @click="openCheckout"
                        >
                            <span v-if="loading">Loading checkout...</span>
                            <span v-else>Subscribe Now</span>
                        </button>
                    </div>
                </div>

                <p class="pricing-note">
                    Secure payment powered by Paddle. Cancel anytime.
                </p>
            </div>
        </section>
    </div>
</template>

<script setup>
import { initializePaddle } from "@paddle/paddle-js";

useSeo({
    title: "Pricing - TextShareNow Pro",
    description: "Upgrade to TextShareNow Pro for premium features. Extended storage, larger files, and priority support.",
    pagePath: "/pricing",
});

const config = useRuntimeConfig();
const billingCycle = ref("monthly");
const paddleLoaded = ref(false);
const loading = ref(false);
let paddle = null;

// Price IDs from Paddle live
const prices = {
    monthly: "pri_01m35488tqdy2pnnvh533vwfx1",
    yearly: "pri_01m35489m5w416gkynf6nz9ezm",
};

onMounted(async () => {
    if (!config.public.PADDLE_CLIENT_TOKEN || !config.public.PADDLE_ENV) {
        console.warn("Paddle credentials not configured");
        return;
    }

    try {
        paddle = await initializePaddle({
            token: config.public.PADDLE_CLIENT_TOKEN,
            environment: config.public.PADDLE_ENV,
        });
        paddleLoaded.value = true;
    } catch (error) {
        console.error("Failed to initialize Paddle:", error);
    }
});

function openCheckout() {
    if (!paddle) return;

    loading.value = true;

    paddle.Checkout.open({
        items: [{ priceId: prices[billingCycle.value], quantity: 1 }],
        settings: {
            variant: "one-page",
            theme: "dark",
            successUrl: "https://textsharenow-frontend-mo0pr2xdg-zain-rizvees-projects.vercel.app/pricing?success=true",
        },
    });

    // Reset loading state after checkout opens
    setTimeout(() => {
        loading.value = false;
    }, 1000);
}
</script>

<style scoped>
.pricing-hero {
    padding-top: 120px;
    padding-bottom: 80px;
    position: relative;
    overflow: hidden;
}

.glow-blob {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(80px);
    opacity: 0.12;
}

.glow-blob--1 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, #00d4ff, transparent);
    top: -100px;
    left: -100px;
}

.glow-blob--2 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, #7c3aed, transparent);
    bottom: -80px;
    right: 0;
}

.pricing-header {
    text-align: center;
    margin-bottom: 40px;
    position: relative;
    z-index: 1;
}

.pricing-toggle {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 48px;
    position: relative;
    z-index: 1;
}

.toggle-btn {
    font-family: var(--font-display);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 12px 24px;
    background: transparent;
    border: 1px solid var(--border-accent);
    color: var(--text-secondary);
    border-radius: var(--radius);
    cursor: pointer;
    transition: all 0.25s ease;
    display: flex;
    align-items: center;
    gap: 8px;
}

.toggle-btn.active {
    background: linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(0, 212, 255, 0.08));
    border-color: var(--accent);
    color: var(--accent);
}

.save-badge {
    font-size: 0.6rem;
    background: var(--accent-green);
    color: #060a14;
    padding: 2px 8px;
    border-radius: 100px;
}

.pricing-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    max-width: 800px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
}

@media (max-width: 768px) {
    .pricing-cards {
        grid-template-columns: 1fr;
        gap: 24px;
    }
}

.pricing-card {
    padding: 40px;
    text-align: center;
    position: relative;
}

.pro-card {
    border-color: var(--accent);
    box-shadow: 0 0 30px rgba(0, 212, 255, 0.15);
}

.pro-badge {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    font-family: var(--font-mono);
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    background: var(--accent);
    color: #060a14;
    padding: 4px 16px;
    border-radius: 100px;
    font-weight: 600;
}

.plan-header {
    margin-bottom: 32px;
}

.plan-name {
    font-size: 1.2rem;
    margin-bottom: 16px;
    color: var(--text-primary);
}

.plan-price {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 4px;
}

.price-amount {
    font-family: var(--font-display);
    font-size: 3rem;
    font-weight: 700;
    color: var(--text-primary);
}

.price-period {
    font-size: 0.9rem;
    color: var(--text-secondary);
}

.plan-features {
    list-style: none;
    text-align: left;
    margin-bottom: 32px;
}

.plan-features li {
    font-size: 0.9rem;
    color: var(--text-secondary);
    padding: 12px 0;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 12px;
}

.plan-features li::before {
    content: "✓";
    color: var(--accent-green);
    font-weight: 600;
}

.plan-btn {
    width: 100%;
    margin-top: 16px;
}

.pricing-note {
    text-align: center;
    margin-top: 40px;
    font-size: 0.85rem;
    color: var(--text-muted);
    position: relative;
    z-index: 1;
}
</style>
