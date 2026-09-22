/**
 * Subscription utility for checking Paddle subscription status.
 * 
 * Usage in server routes:
 * import { checkSubscription } from '~/server/utils/subscription';
 * const { isSubscribed, subscription } = await checkSubscription(customerId);
 */

// Helper for Upstash Redis requests
async function upstashRequest(url: string, token: string, command: unknown[]) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });

  if (!response.ok) {
    throw new Error(`Upstash error: ${response.status}`);
  }

  return response.json();
}

export interface SubscriptionData {
  subscriptionId: string;
  status: string;
  priceId: string;
  currentPeriodEnd: string;
  updatedAt: string;
}

export interface SubscriptionCheckResult {
  isSubscribed: boolean;
  subscription: SubscriptionData | null;
}

/**
 * Check if a customer has an active subscription.
 * 
 * @param customerId - The Paddle customer ID
 * @returns Object with isSubscribed boolean and subscription data
 */
export async function checkSubscription(
  customerId: string
): Promise<SubscriptionCheckResult> {
  const config = useRuntimeConfig();
  const { UPSTASH_REDIS_REST_URL: redisUrl, UPSTASH_REDIS_REST_TOKEN: redisToken } = config;

  if (!redisUrl || !redisToken) {
    console.error("Redis credentials not configured");
    return { isSubscribed: false, subscription: null };
  }

  try {
    const key = `subscription:${customerId}`;
    const result = await upstashRequest(redisUrl, redisToken, ["GET", key]);

    if (!result.result) {
      return { isSubscribed: false, subscription: null };
    }

    const subscription: SubscriptionData = JSON.parse(result.result);
    
    // Check if subscription is active
    const isActive = subscription.status === "active" || 
                     subscription.status === "trialing" ||
                     subscription.status === "past_due";

    return {
      isSubscribed: isActive,
      subscription,
    };
  } catch (error) {
    console.error("Error checking subscription:", error);
    return { isSubscribed: false, subscription: null };
  }
}

/**
 * Check subscription status by subscription ID.
 * 
 * @param subscriptionId - The Paddle subscription ID
 * @returns Object with isSubscribed boolean and subscription data
 */
export async function checkSubscriptionById(
  subscriptionId: string
): Promise<SubscriptionCheckResult> {
  const config = useRuntimeConfig();
  const { UPSTASH_REDIS_REST_URL: redisUrl, UPSTASH_REDIS_REST_TOKEN: redisToken } = config;

  if (!redisUrl || !redisToken) {
    console.error("Redis credentials not configured");
    return { isSubscribed: false, subscription: null };
  }

  try {
    // Look up customer ID from subscription ID
    const subKey = `sub:${subscriptionId}`;
    const customerResult = await upstashRequest(redisUrl, redisToken, ["GET", subKey]);

    if (!customerResult.result) {
      return { isSubscribed: false, subscription: null };
    }

    const customerId = customerResult.result;
    return checkSubscription(customerId);
  } catch (error) {
    console.error("Error checking subscription by ID:", error);
    return { isSubscribed: false, subscription: null };
  }
}
