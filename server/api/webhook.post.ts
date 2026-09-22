/**
 * POST /api/webhook
 * Receives Paddle webhook events and processes them.
 * 
 * This endpoint handles:
 * - transaction.completed
 * - subscription.created
 * - subscription.updated
 * - subscription.canceled
 * 
 * Signature verification ensures events are authentic.
 */

import { Paddle, Environment } from "@paddle/paddle-node-sdk";

const paddle = new Paddle(process.env.PADDLE_API_KEY!, {
  environment: process.env.PADDLE_ENV === "production"
    ? Environment.production
    : Environment.sandbox,
});

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

// Store subscription in Redis
async function storeSubscription(
  redisUrl: string,
  redisToken: string,
  customerId: string,
  subscriptionId: string,
  status: string,
  priceId: string,
  currentPeriodEnd: string
) {
  const key = `subscription:${customerId}`;
  const data = JSON.stringify({
    subscriptionId,
    status,
    priceId,
    currentPeriodEnd,
    updatedAt: new Date().toISOString(),
  });

  // Store with no TTL (subscriptions persist)
  await upstashRequest(redisUrl, redisToken, ["SET", key, data]);
  
  // Also index by subscription ID for quick lookups
  const subKey = `sub:${subscriptionId}`;
  await upstashRequest(redisUrl, redisToken, ["SET", subKey, customerId]);
}

// Remove subscription from Redis
async function removeSubscription(
  redisUrl: string,
  redisToken: string,
  customerId: string,
  subscriptionId: string
) {
  const key = `subscription:${customerId}`;
  await upstashRequest(redisUrl, redisToken, ["DEL", key]);
  
  const subKey = `sub:${subscriptionId}`;
  await upstashRequest(redisUrl, redisToken, ["DEL", subKey]);
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { UPSTASH_REDIS_REST_URL: redisUrl, UPSTASH_REDIS_REST_TOKEN: redisToken } = config;
  const webhookSecret = config.PADDLE_WEBHOOK_SECRET;

  // Read raw body for signature verification
  const rawBody = await readRawBody(event);
  const signature = getRequestHeader(event, "paddle-signature") || "";

  // Pre-validation
  if (!signature || !rawBody) {
    throw createError({ statusCode: 400, message: "Missing signature or body" });
  }

  // If no webhook secret configured, log and accept (for testing)
  if (!webhookSecret) {
    console.warn("PADDLE_WEBHOOK_SECRET not configured - accepting webhook without verification");
    try {
      const body = JSON.parse(rawBody);
      console.log("Webhook event (unverified):", body.event_type, body.data?.id);
      
      // Process the event even without verification for testing
      await processEvent(body, redisUrl, redisToken);
      
      return { received: true };
    } catch (error) {
      console.error("Webhook processing error:", error);
      throw createError({ statusCode: 500, message: "Webhook processing failed" });
    }
  }

  try {
    // Verify signature using Paddle SDK
    const eventData = await paddle.webhooks.unmarshal(
      rawBody,
      webhookSecret,
      signature
    );

    if (eventData) {
      console.log("Webhook event:", eventData.eventType, eventData.data?.id);
      await processEvent(eventData, redisUrl, redisToken);
    }

    return { received: true };
  } catch (error) {
    console.error("Webhook verification error:", error);
    // Return non-2xx so Paddle retries
    throw createError({ statusCode: 500, message: "Webhook verification failed" });
  }
});

// Process different event types
async function processEvent(
  event: any,
  redisUrl: string,
  redisToken: string
) {
  const eventType = event.eventType || event.event_type;
  const data = event.data || {};

  switch (eventType) {
    case "subscription.created":
    case "subscription.updated":
      await handleSubscriptionEvent(data, redisUrl, redisToken);
      break;
    
    case "subscription.canceled":
      await handleSubscriptionCanceled(data, redisUrl, redisToken);
      break;
    
    case "transaction.completed":
      await handleTransactionCompleted(data, redisUrl, redisToken);
      break;
    
    default:
      console.log(`Unhandled event type: ${eventType}`);
  }
}

// Handle subscription created/updated
async function handleSubscriptionEvent(
  data: any,
  redisUrl: string,
  redisToken: string
) {
  const customerId = data.customer_id;
  const subscriptionId = data.id;
  const status = data.status;
  const priceId = data.items?.[0]?.price_id;
  const currentPeriodEnd = data.current_billing_period?.ends_at;

  if (!customerId || !subscriptionId) {
    console.error("Missing customer_id or subscription_id in event");
    return;
  }

  await storeSubscription(
    redisUrl,
    redisToken,
    customerId,
    subscriptionId,
    status,
    priceId,
    currentPeriodEnd
  );

  console.log(`Subscription ${status}: ${subscriptionId} for customer ${customerId}`);
}

// Handle subscription canceled
async function handleSubscriptionCanceled(
  data: any,
  redisUrl: string,
  redisToken: string
) {
  const customerId = data.customer_id;
  const subscriptionId = data.id;

  if (!customerId || !subscriptionId) {
    console.error("Missing customer_id or subscription_id in cancel event");
    return;
  }

  await removeSubscription(redisUrl, redisToken, customerId, subscriptionId);

  console.log(`Subscription canceled: ${subscriptionId} for customer ${customerId}`);
}

// Handle transaction completed
async function handleTransactionCompleted(
  data: any,
  redisUrl: string,
  redisToken: string
) {
  // Log transaction for reference
  console.log(`Transaction completed: ${data.id} for ${data.total_amount} ${data.currency_code}`);
  
  // If this is a subscription transaction, ensure subscription is stored
  if (data.subscription_id) {
    const customerId = data.customer_id;
    const subscriptionId = data.subscription_id;
    
    if (customerId && subscriptionId) {
      // Ensure subscription exists in Redis
      const key = `subscription:${customerId}`;
      const existing = await upstashRequest(redisUrl, redisToken, ["GET", key]);
      
      if (!existing.result) {
        // Create subscription record from transaction data
        await storeSubscription(
          redisUrl,
          redisToken,
          customerId,
          subscriptionId,
          "active",
          data.items?.[0]?.price_id,
          data.current_billing_period?.ends_at
        );
      }
    }
  }
}
