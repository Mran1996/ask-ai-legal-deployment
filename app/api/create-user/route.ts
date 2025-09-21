import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Check if we're in build time and skip operations
const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV;
const isVercelBuild = process.env.VERCEL === '1' && process.env.NODE_ENV === 'production';

// Initialize Supabase client only if not in build time
const supabase = (!isBuildTime && !isVercelBuild) ? createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
) : null;

export async function POST(req: Request) {
  // Skip during build time
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase client not available during build time' }, { status: 503 });
  }

  const { id, email, first_name, last_name } = await req.json()

  const { error } = await supabase
    .from('profiles')
    .insert([{ id, email, first_name, last_name }])

  if (error) {
    console.error('Profile insert failed:', error)
    return NextResponse.json({ error: error.message || 'Profile creation failed.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
} 