import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TARGET = "/ai-assistant/step-1"; // redirect to new Step 1 route

const REMOVED_PATHS = new Set([
  "/step-1",
  "/step-2",
  "/step-3",
  "/intake",
  "/category",
  "/upload",
  // namespaced variants that might still exist in code:
  "/ai-assistant/step-3",
  "/ai-assistant/upload",
  // Redirect old step-4 and step-5 to new structure
  "/ai-assistant/step-4",
  "/ai-assistant/step-5",
]);

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const path = url.pathname;
  
  // Handle specific redirects for old step routes
  if (path === "/ai-assistant/step-4") {
    url.pathname = "/ai-assistant/step-1";
    return NextResponse.redirect(url);
  }
  if (path === "/ai-assistant/step-5") {
    url.pathname = "/ai-assistant/step-2";
    return NextResponse.redirect(url);
  }
  
  if (REMOVED_PATHS.has(path)) {
    url.pathname = TARGET;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
} 