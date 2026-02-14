import Stripe from 'stripe';

let _stripe: Stripe | null = null;

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
      apiVersion: '2024-06-20',
      typescript: true,
    });
  }
  return _stripe;
}
