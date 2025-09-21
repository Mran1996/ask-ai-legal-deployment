'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

interface SubscriptionGuardProps {
  children: ReactNode;
}

export function SubscriptionGuard({ children }: SubscriptionGuardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          router.push('/sign-in');
          return;
        }
        // Remove subscription check and redirect logic
        setHasAccess(true);
      } catch (error) {
        // REMOVE or comment out this block:
        // console.error('Error checking subscription:', error);
        // router.push('/pricing');
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscription();
  }, [router, supabase]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return hasAccess ? <>{children}</> : null;
} 