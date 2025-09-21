import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Check if we're in build time and skip operations
const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV;
const isVercelBuild = process.env.VERCEL === '1' && process.env.NODE_ENV === 'production';

// Initialize clients only if not in build time
const stripe = (!isBuildTime && !isVercelBuild && process.env.STRIPE_SECRET_KEY) ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
}) : null;

const supabase = (!isBuildTime && !isVercelBuild) ? createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
) : null;

export async function GET(req: Request) {
  try {
    // Skip during build time
    if (!stripe || !supabase) {
      return NextResponse.json({ error: 'Clients not available during build time' }, { status: 503 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) return NextResponse.json({ error: "Missing user ID" }, { status: 400 });

    const { data: billing, error } = await supabase
      .from("payments")
      .select("stripe_receipt_url")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !billing?.stripe_receipt_url) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
    }

    return NextResponse.json({ url: billing.stripe_receipt_url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 