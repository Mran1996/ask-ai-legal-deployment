import { loadStripe } from '@stripe/stripe-js';
import type { ProductName } from './stripe-config';

// Check if the publishable key is available
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (!publishableKey) {
  console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set');
}

const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

export async function redirectToCheckout(plan: ProductName) {
  try {
    if (!stripePromise) {
      throw new Error('Stripe publishable key is not configured');
    }

    const stripe = await stripePromise;

    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    // Create checkout session
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ plan }),
    });

    const { sessionId, error } = await response.json();

    if (error) {
      throw new Error(error);
    }

    // Redirect to Stripe checkout
    const result = await stripe.redirectToCheckout({
      sessionId,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }
  } catch (error) {
    console.error('Error in redirectToCheckout:', error);
    throw error;
  }
} 