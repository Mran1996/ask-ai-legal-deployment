import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

async function getDocument(id: string) {
  const cookieStore = cookies();
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
  return data;
}

export default async function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doc = await getDocument(id);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">{doc.title}</h1>
      <div className="prose max-w-none whitespace-pre-wrap">{doc.content}</div>
      {/* keep your existing editor/Save/Download controls here */}
    </div>
  );
}
