import Stripe from 'stripe';
import type { BillingInterval, PlanId } from '@/lib/plans';

let _stripe: Stripe | null = null;

export type { BillingInterval };

/**
 * Returns the Stripe client. Throws only when called at runtime without STRIPE_SECRET_KEY.
 * Lazy init avoids breaking the build when env vars are not available (e.g. Vercel build).
 */
export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not set in the environment variables.');
    }
    _stripe = new Stripe(key, {
      apiVersion: '2026-07-29.dahlia',
      typescript: true,
    });
  }
  return _stripe;
}

function priceEnvMap(): Record<PlanId, Record<BillingInterval, string | undefined>> {
  return {
    starter: {
      monthly: process.env.STRIPE_STARTER_PRICE_ID,
      annual: process.env.STRIPE_STARTER_ANNUAL_PRICE_ID,
    },
    growth: {
      monthly: process.env.STRIPE_GROWTH_PRICE_ID,
      annual: process.env.STRIPE_GROWTH_ANNUAL_PRICE_ID,
    },
    enterprise: {
      monthly: process.env.STRIPE_ENTERPRISE_PRICE_ID,
      annual: process.env.STRIPE_ENTERPRISE_ANNUAL_PRICE_ID,
    },
  };
}

export function getStripePriceId(
  planId: PlanId,
  interval: BillingInterval = 'monthly'
): string | undefined {
  return priceEnvMap()[planId]?.[interval];
}

/** Map a Stripe price ID back to our plan (monthly or annual). */
export function planIdFromStripePriceId(priceId: string): PlanId | null {
  const map = priceEnvMap();
  for (const planId of Object.keys(map) as PlanId[]) {
    const prices = map[planId];
    if (prices.monthly === priceId || prices.annual === priceId) {
      return planId;
    }
  }
  return null;
}
