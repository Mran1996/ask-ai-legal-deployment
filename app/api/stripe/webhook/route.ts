import Stripe from 'stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

async function updateUserSubscription(
  customerId: string,
  subscriptionId: string,
  status: string
) {
  try {
    const { data: users, error: queryError } = await supabase
      .from('users')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (queryError || !users) {
      console.error('Error finding user:', queryError);
      return;
    }

    const { error: updateError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: users.id,
        stripe_subscription_id: subscriptionId,
        status: status,
        updated_at: new Date().toISOString(),
      });

    if (updateError) {
      console.error('Error updating subscription:', updateError);
    }
  } catch (error) {
    console.error('Error in updateUserSubscription:', error);
  }
}

export async function POST(req: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set.');
    }
    
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature found' },
        { status: 400 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-05-28.basil',
    });

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await updateUserSubscription(
          subscription.customer as string,
          subscription.id,
          subscription.status
        );
        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object;
        // Handle successful checkout
        // You might want to send a welcome email, provision resources, etc.
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        // Handle successful payment
        // You might want to update usage limits, send receipt, etc.
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        // Handle failed payment
        // You might want to notify the user, restrict access, etc.
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error in webhook handler:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
} 