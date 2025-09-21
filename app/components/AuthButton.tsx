'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSupabase } from '@/components/SupabaseProvider';
import { User } from '@supabase/supabase-js';

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabase();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error getting user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignIn = () => {
    router.push('/login');
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-2 rounded-md bg-gray-200 text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      {!user ? (
        <button
          onClick={handleSignIn}
          className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
        >
          Sign In
        </button>
      ) : (
        <button
          onClick={handleSignOut}
          className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
        >
          Sign Out
        </button>
      )}
    </div>
  );
} 