import Stripe from 'stripe';

// Check if we're in build time and skip operations
const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV;
const isVercelBuild = process.env.VERCEL === '1' && process.env.NODE_ENV === 'production';

// Initialize Stripe client only if not in build time
const stripe = (!isBuildTime && !isVercelBuild && process.env.STRIPE_SECRET_KEY) ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil',
}) : null;
import { NextResponse } from 'next/server';
import { PRICE_MAP, PRODUCTS } from '@/lib/stripe-config';

export async function POST(req: Request) {
  try {
    // Skip during build time
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe client not available during build time' },
        { status: 503 }
      );
    }

    const { plan } = await req.json();

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan is required' },
        { status: 400 }
      );
    }

    // Get the price ID from environment or use a fallback
    const priceId = process.env.STRIPE_COURT_READY_PRICE_ID;
    
    if (!priceId) {
      return NextResponse.json(
        { error: 'Stripe price ID is not configured. Please set STRIPE_COURT_READY_PRICE_ID in your environment variables.' },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: { plan },
      success_url: process.env.STRIPE_SUCCESS_URL || 'http://localhost:3000/success',
      cancel_url: process.env.STRIPE_CANCEL_URL || 'http://localhost:3000/cancel',
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error in create-checkout:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
} 