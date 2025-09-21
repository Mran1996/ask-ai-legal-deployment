import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Check if we're in build time and skip operations
const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV;
const isVercelBuild = process.env.VERCEL === '1' && process.env.NODE_ENV === 'production';

// Initialize Supabase client only if not in build time
const supabase = (!isBuildTime && !isVercelBuild) ? createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // must use service role key to bypass RLS
) : null;

export async function POST(req: Request) {
  console.log('Route triggered');
  
  // Skip during build time
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase client not available during build time' }, { status: 503 });
  }
  
  // Validate environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
    return NextResponse.json({ error: 'Missing NEXT_PUBLIC_SUPABASE_URL environment variable' }, { status: 500 });
  }
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
    return NextResponse.json({ error: 'Missing SUPABASE_SERVICE_ROLE_KEY environment variable' }, { status: 500 });
  }
  
  try {
    const { id, full_name, email, state, legal_category, plan } = await req.json();
    if (!id || !full_name || !email) {
      console.error('Missing required fields:', { id, full_name, email });
      return NextResponse.json({ error: 'Missing required fields: id, full_name, email' }, { status: 400 });
    }

    // Parse full_name into first_name and last_name
    const nameParts = full_name.trim().split(' ');
    const first_name = nameParts[0] || '';
    const last_name = nameParts.slice(1).join(' ') || '';

    console.log('Attempting to insert profile:', { id, email, first_name, last_name, full_name, state, legal_category, plan });

    const { error } = await supabase.from('profiles').insert([
      { 
        id, 
        email, 
        first_name, 
        last_name, 
        full_name,
        state: state || null,
        legal_category: legal_category || null,
        plan: plan || 'Pro',
      },
    ]);
    
    if (error) {
      console.error('Profile insert error:', error.message || String(error));
      return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
    }
    
    console.log('Profile created successfully for user:', id);
    return NextResponse.json({ message: 'Profile created successfully.' });
  } catch (e: any) {
    console.error('Profile API error:', e?.message || String(e));
    return NextResponse.json({ error: e?.message || String(e) }, { status: 500 });
  }
} 