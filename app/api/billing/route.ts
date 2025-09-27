import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getUser } from '@/lib/auth'; // Adjust this import to your actual user auth util

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
});

export async function GET(req: NextRequest) {
  try {
    // Get user from session/auth (adjust as needed)
    const user = await getUser(req);
    if (!user || !user.stripeCustomerId) {
      return NextResponse.json({ error: 'No Stripe customer ID found.' }, { status: 401 });
    }

    // Fetch subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: 'all',
      limit: 1,
    });
    const subscription = subscriptions.data[0] || null;

    // Fetch payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: 'card',
    });

    // Fetch invoices
    const invoices = await stripe.invoices.list({
      customer: user.stripeCustomerId,
      limit: 10,
    });

    return NextResponse.json({
      subscription,
      paymentMethods: paymentMethods.data,
      invoices: invoices.data,
    });
  } catch (error) {
    console.error('[STRIPE BILLING API ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch billing data.' }, { status: 500 });
  }
}
