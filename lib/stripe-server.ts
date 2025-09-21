import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
}); 

// Add this function to support create-checkout/route.ts
export async function createCheckoutSession(priceId: string, userId: string) {
  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: { userId },
    success_url: process.env.STRIPE_SUCCESS_URL || 'http://localhost:3000/success',
    cancel_url: process.env.STRIPE_CANCEL_URL || 'http://localhost:3000/cancel',
  });
} 