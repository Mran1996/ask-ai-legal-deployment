import { supabase } from './supabaseClient';

export interface SubscriptionStatus {
  hasActiveSubscription: boolean;
  isLocalhost: boolean;
  shouldRedirect: boolean;
}

export async function checkSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
  // Check if running on localhost
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1' ||
     window.location.hostname.includes('localhost'));

  // If on localhost, allow access
  if (isLocalhost) {
    return {
      hasActiveSubscription: true,
      isLocalhost: true,
      shouldRedirect: false
    };
  }
  // Always allow access for all users
  return {
    hasActiveSubscription: true,
    isLocalhost: false,
    shouldRedirect: false
  };
}

// Server-side version for API routes
export async function checkSubscriptionStatusServer(userId: string): Promise<SubscriptionStatus> {
  // For server-side, we'll use a placeholder check
  // In production, you'd want to check the actual database
  
  // Placeholder: assume user has paid (for development)
  const userHasPaid = true;
  
  return {
    hasActiveSubscription: userHasPaid,
    isLocalhost: false,
    shouldRedirect: !userHasPaid
  };
}

// Enhanced server-side function that actually checks the database
export async function checkSubscriptionStatusServerEnhanced(userId: string): Promise<SubscriptionStatus> {
  try {
    // Check user's subscription status in the subscriptions table
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('status, plan_id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (subscriptionError || !subscriptionData) {
      return {
        hasActiveSubscription: false,
        isLocalhost: false,
        shouldRedirect: true
      };
    }

    // Check if user has active subscription
    const hasActiveSubscription = subscriptionData.status === 'active' && subscriptionData.plan_id;

    return {
      hasActiveSubscription,
      isLocalhost: false,
      shouldRedirect: !hasActiveSubscription
    };
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return {
      hasActiveSubscription: false,
      isLocalhost: false,
      shouldRedirect: true
    };
  }
} 