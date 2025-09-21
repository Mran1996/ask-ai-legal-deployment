/**
 * Supabase Provider Component
 * 
 * This component provides Supabase client context throughout the application.
 * It initializes the Supabase browser client and makes it available to all
 * child components through React Context.
 * 
 * Features:
 * - Browser client initialization with environment variables
 * - Context provider for global access
 * - Custom hook for easy client access
 * - Error handling for missing environment variables
 * 
 * @param children - React components to be wrapped with Supabase context
 * @returns The application wrapped with Supabase client context
 */

'use client';

import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';
import { createContext, useContext, useState, ReactNode } from 'react';

// Database schema types (extend as needed)
interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          created_at?: string;
        };
      };
    };
  };
}

// Supabase context type
type SupabaseContextType = SupabaseClient<Database> | null;

// Create context with proper typing
const SupabaseContext = createContext<SupabaseContextType>(null);

interface SupabaseProviderProps {
  children: ReactNode;
}

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  // Initialize Supabase client with environment variables
  const [supabase] = useState<SupabaseClient<Database>>(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Use dummy values if not configured to prevent URL parsing errors
    const url = supabaseUrl && supabaseUrl !== 'your_supabase_project_url' 
      ? supabaseUrl 
      : 'https://dummy.supabase.co';
    const key = supabaseAnonKey && supabaseAnonKey !== 'your_supabase_anon_key'
      ? supabaseAnonKey
      : 'dummy_anon_key';

    return createBrowserClient<Database>(url, key);
  });

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
}

/**
 * Custom hook to access Supabase client
 * 
 * @returns Supabase client instance
 * @throws Error if used outside of SupabaseProvider
 */
export const useSupabase = (): SupabaseClient<Database> => {
  const context = useContext(SupabaseContext);
  
  if (context === null) {
    throw new Error(
      'useSupabase must be used within a SupabaseProvider. ' +
      'Make sure your component is wrapped with SupabaseProvider.'
    );
  }
  
  return context;
}; 