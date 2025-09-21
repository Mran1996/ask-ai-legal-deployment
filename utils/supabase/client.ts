import { createBrowserClient } from '@supabase/ssr';

export const createClient = (accessToken?: string) => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_project_url'
    ? process.env.NEXT_PUBLIC_SUPABASE_URL 
    : 'https://dummy.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your_supabase_anon_key'
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    : 'dummy_anon_key';

  return createBrowserClient(
    url,
    key,
    {
      global: {
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      },
    }
  );
};
