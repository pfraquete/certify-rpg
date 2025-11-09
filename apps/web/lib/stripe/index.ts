import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

// Stripe product configuration
export const STRIPE_PRODUCTS = {
  STARTER_PACK: {
    name: "Pacote Iniciante",
    credits: 50,
    price: 9.99,
    priceId: process.env.STRIPE_PRICE_STARTER || "",
  },
  BASIC_PACK: {
    name: "Pacote Básico",
    credits: 100,
    price: 17.99,
    priceId: process.env.STRIPE_PRICE_BASIC || "",
  },
  PRO_PACK: {
    name: "Pacote Pro",
    credits: 250,
    price: 39.99,
    priceId: process.env.STRIPE_PRICE_PRO || "",
  },
  ULTIMATE_PACK: {
    name: "Pacote Ultimate",
    credits: 500,
    price: 69.99,
    priceId: process.env.STRIPE_PRICE_ULTIMATE || "",
  },
} as const;

export type StripeProduct = keyof typeof STRIPE_PRODUCTS;
