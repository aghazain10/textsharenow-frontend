import { Environment, Paddle } from "@paddle/paddle-node-sdk";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: resolve(__dirname, "../.env") });

const paddle = new Paddle(process.env.PADDLE_API_KEY!, {
  environment: process.env.PADDLE_ENV === "production"
    ? Environment.production
    : Environment.sandbox,
});

async function seed() {
  console.log("Creating TextShareNow Pro product...");

  const product = await paddle.products.create({
    name: "TextShareNow Pro",
    taxCategory: "saas",
    description: "Premium features for TextShareNow - extended storage, larger files, and more.",
  });

  console.log(`Product created: ${product.id}`);

  // Monthly price - $5/month
  const monthly = await paddle.prices.create({
    productId: product.id,
    description: "Pro monthly USD",
    unitPrice: { amount: "500", currencyCode: "USD" }, // 500 cents = $5.00
    billingCycle: { interval: "month", frequency: 1 },
  });

  console.log(`Monthly price created: ${monthly.id}`);

  // Yearly price - $50/year (save $10)
  const yearly = await paddle.prices.create({
    productId: product.id,
    description: "Pro yearly USD",
    unitPrice: { amount: "5000", currencyCode: "USD" }, // 5000 cents = $50.00
    billingCycle: { interval: "year", frequency: 1 },
  });

  console.log(`Yearly price created: ${yearly.id}`);

  console.log("\n=== SUMMARY ===");
  console.log(JSON.stringify({
    productId: product.id,
    monthlyPriceId: monthly.id,
    yearlyPriceId: yearly.id,
  }, null, 2));
}

seed().catch((e) => {
  console.error("Error seeding Paddle catalog:", e);
  process.exit(1);
});
