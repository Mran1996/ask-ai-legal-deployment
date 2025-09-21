// This file is now reserved for server-side Supabase helpers only.
// No client instance is exported from here.

import { createClient } from '@supabase/supabase-js'

// Debug: Log Supabase configuration
console.log('🔌 Supabase Configuration:');
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set');
console.log('Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Check if we're in a build environment (where env vars might not be available)
const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV;
const isVercelBuild = process.env.VERCEL === '1' && process.env.NODE_ENV === 'production';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('❌ Missing Supabase URL');
  if (!isBuildTime && !isVercelBuild) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
  }
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase Anon Key');
  if (!isBuildTime && !isVercelBuild) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
}

// Create Supabase client with fallback for build time
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_project_url'
    ? process.env.NEXT_PUBLIC_SUPABASE_URL 
    : 'https://dummy.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your_supabase_anon_key'
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    : 'dummy_anon_key'
);

// Test connection only if not in build time
if (!isBuildTime && !isVercelBuild) {
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error('❌ Supabase connection error:', error.message);
    } else {
      console.log('✅ Supabase connected successfully');
    }
  });
} 