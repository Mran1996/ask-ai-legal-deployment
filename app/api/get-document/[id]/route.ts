import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role to bypass RLS for testing
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: "", ...options });
          },
          getAll() {
            return cookieStore.getAll().map(c => ({ name: c.name, value: c.value }));
          },
          setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set({ name, value, ...options })
            );
          },
        },
      }
    );

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    
    if (error) throw new Error(error.message);
    if (!data) throw new Error("Document not found");
    
    return NextResponse.json(data);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message ?? "Failed to get document" }, { status: 500 });
  }
}
