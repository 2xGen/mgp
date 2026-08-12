import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { updateSubscription } from '@/app/actions';

export const runtime = 'nodejs';

function subscriptionIdFrom(
  ref: string | Stripe.Subscription | null | undefined
): string | null {
  if (!ref) return null;
  return typeof ref === 'string' ? ref : ref.id;
}

async function handler(req: NextRequest) {
  // Must be the raw body string — do not JSON.parse before verify.
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('Stripe webhook secret is not set.');
    return new NextResponse('Internal Server Error: Webhook secret not configured.', {
      status: 500,
    });
  }

  if (!signature) {
    return new NextResponse('Webhook Error: Missing Stripe-Signature header.', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid signature';
    console.error(`❌ Webhook signature verification failed: ${message}`);
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  const relevantEvents = new Set([
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
    'invoice.payment_succeeded',
  ]);

  if (!relevantEvents.has(event.type)) {
    return new NextResponse(null, { status: 200 });
  }

  try {
    let subscription: Stripe.Subscription;

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const subId = subscriptionIdFrom(session.subscription);
        if (!subId) {
          // Basil+ may finalize the subscription via later events; acknowledge OK.
          console.log(`Checkout session ${session.id} has no subscription yet.`);
          return new NextResponse('OK', { status: 200 });
        }
        subscription = await getStripe().subscriptions.retrieve(subId, {
          expand: ['items.data.price'],
        });
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionRef =
          invoice.parent?.subscription_details?.subscription ??
          (invoice as Stripe.Invoice & { subscription?: string | Stripe.Subscription | null })
            .subscription;
        const subId = subscriptionIdFrom(subscriptionRef);
        if (!subId) {
          console.log(`Invoice ${invoice.id} does not have a subscription.`);
          return new NextResponse('OK', { status: 200 });
        }
        subscription = await getStripe().subscriptions.retrieve(subId, {
          expand: ['items.data.price'],
        });
        break;
      }

      default:
        subscription = event.data.object as Stripe.Subscription;
        break;
    }

    await updateSubscription(subscription);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Webhook handler for ${event.type} failed:`, error);
    return new NextResponse(`Webhook handler failed: ${message}`, { status: 500 });
  }

  return new NextResponse(null, { status: 200 });
}

export { handler as POST };
