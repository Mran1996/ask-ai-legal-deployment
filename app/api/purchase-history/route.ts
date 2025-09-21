import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Check if we're in build time and skip operations
const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV;
const isVercelBuild = process.env.VERCEL === '1' && process.env.NODE_ENV === 'production';

// Initialize Supabase client only if not in build time
const supabase = (!isBuildTime && !isVercelBuild) ? createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
) : null;

export async function GET(req: Request) {
  // Skip during build time
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase client not available during build time' }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId"); // Optional if session-based

  if (!userId) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("payments")
    .select("id, document_name, price, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ purchases: [] }, { status: 500 });
  }

  return NextResponse.json({ purchases: data });
} 