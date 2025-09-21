import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error in callback:', error);
    const errorDescription = requestUrl.searchParams.get('error_description') || error;
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(errorDescription)}`
    );
  }

  if (code) {
    const cookieStore = cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_project_url'
        ? process.env.NEXT_PUBLIC_SUPABASE_URL 
        : 'https://dummy.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your_supabase_anon_key'
        ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        : 'dummy_anon_key',
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );
    
    try {
      console.log('🔄 Exchanging code for session...');
      
      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('❌ Auth callback error:', error);
        console.error('Error details:', error.message);
        
        // Handle specific PKCE error
        if (error.message.includes('code challenge') || error.message.includes('code verifier')) {
          return NextResponse.redirect(
            `${requestUrl.origin}/login?error=pkce_error&error_description=${encodeURIComponent('Authentication session expired. Please try signing in again.')}`
          );
        }
        
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=auth_callback_failed&error_description=${encodeURIComponent(error.message)}`
        );
      }

      // Successful authentication
      console.log('✅ Auth callback successful for user:', data.user?.email);
      console.log('🔄 Redirecting to account page:', `${requestUrl.origin}/account`);
      console.log('📊 Session data:', data.session);
      
      // Redirect to account page
      return NextResponse.redirect(`${requestUrl.origin}/account`);
    } catch (error) {
      console.error('❌ Auth callback exception:', error);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=auth_callback_exception&error_description=${encodeURIComponent('An unexpected error occurred during authentication')}`
      );
    }
  }

  // No code provided, redirect to login
  console.error('❌ No code provided in callback');
  return NextResponse.redirect(`${requestUrl.origin}/login?error=no_code_provided`);
}




