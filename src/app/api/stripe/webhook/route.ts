
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { updateSubscription } from '@/app/actions';

async function handler(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('Stripe webhook secret is not set.');
    return new NextResponse('Internal Server Error: Webhook secret not configured.', { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Error message: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }
  
  const relevantEvents = new Set([
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
    'invoice.payment_succeeded',
  ]);

  if (relevantEvents.has(event.type)) {
    try {
        let subscription: Stripe.Subscription;

        switch (event.type) {
             case 'checkout.session.completed':
                const session = event.data.object as Stripe.Checkout.Session;
                if (!session.subscription) {
                    console.log(`Checkout session ${session.id} did not create a subscription.`);
                    return new NextResponse('OK', { status: 200 });
                }
                subscription = await stripe.subscriptions.retrieve(session.subscription as string, {
                    expand: ['items.data.price.product']
                });
                break;
            
            case 'invoice.payment_succeeded':
                const invoice = event.data.object as Stripe.Invoice;
                 if (typeof invoice.subscription !== 'string') {
                    console.log(`Invoice ${invoice.id} does not have a subscription.`);
                    return new NextResponse('OK', { status: 200 });
                 }
                subscription = await stripe.subscriptions.retrieve(invoice.subscription, {
                    expand: ['items.data.price.product']
                });
                break;
            
            default: // handles subscription created, updated, deleted
                subscription = event.data.object as Stripe.Subscription;
                break;
        }

        await updateSubscription(subscription);

    } catch (error: any) {
        console.error(`Webhook handler for ${event.type} failed:`, error);
        return new NextResponse(`Webhook handler failed: ${error.message}`, { status: 500 });
    }
  } else {
      console.log(`Unhandled event type ${event.type}`);
  }

  return new NextResponse(null, { status: 200 });
}

export { handler as POST };

  