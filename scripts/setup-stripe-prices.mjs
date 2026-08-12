/**
 * One-off: create MyGoProfile Stripe products + EUR prices (test mode).
 * Usage: node scripts/setup-stripe-prices.mjs
 * Requires STRIPE_SECRET_KEY in env or pass as first arg.
 */
import Stripe from 'stripe';

const key =
  process.env.STRIPE_SECRET_KEY ||
  process.argv[2];

if (!key) {
  console.error('Missing STRIPE_SECRET_KEY');
  process.exit(1);
}

const stripe = new Stripe(key, { apiVersion: '2026-07-29.dahlia' });

const plans = [
  { id: 'starter', name: 'MyGoProfile Starter', monthly: 2900, annual: 29000 },
  { id: 'growth', name: 'MyGoProfile Growth', monthly: 4900, annual: 49000 },
  { id: 'enterprise', name: 'MyGoProfile Agency', monthly: 9900, annual: 99000 },
];

async function main() {
  const out = {};

  for (const plan of plans) {
    let product;
    try {
      const existing = await stripe.products.search({
        query: `metadata['plan_id']:'${plan.id}'`,
      });
      product = existing.data[0];
    } catch {
      product = undefined;
    }

    if (!product) {
      const listed = await stripe.products.list({ limit: 100, active: true });
      product = listed.data.find((p) => p.metadata?.plan_id === plan.id);
    }

    if (!product) {
      product = await stripe.products.create({
        name: plan.name,
        description: `Google Business Profile optimization with AI — ${plan.name.replace('MyGoProfile ', '')}`,
        // SaaS — business use (required when Stripe Tax is enabled)
        tax_code: 'txcd_10103001',
        metadata: { plan_id: plan.id, app: 'mygoprofile' },
      });
      console.error('Created product', product.id, plan.id);
    } else {
      console.error('Reusing product', product.id, plan.id);
      if (!product.tax_code) {
        product = await stripe.products.update(product.id, {
          tax_code: 'txcd_10103001',
        });
        console.error('Set tax_code on', product.id);
      }
    }

    const prices = await stripe.prices.list({
      product: product.id,
      active: true,
      limit: 20,
    });

    async function findOrCreate(interval, amount) {
      const match = prices.data.find(
        (p) =>
          p.currency === 'eur' &&
          p.recurring?.interval === interval &&
          p.unit_amount === amount
      );
      if (match) return match;
      return stripe.prices.create({
        product: product.id,
        currency: 'eur',
        unit_amount: amount,
        recurring: { interval },
        metadata: { plan_id: plan.id, interval, app: 'mygoprofile' },
      });
    }

    const monthly = await findOrCreate('month', plan.monthly);
    const annual = await findOrCreate('year', plan.annual);
    out[plan.id] = {
      product: product.id,
      monthly: monthly.id,
      annual: annual.id,
    };
    console.error(plan.id, 'monthly', monthly.id, 'annual', annual.id);
  }

  console.log(JSON.stringify(out, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
