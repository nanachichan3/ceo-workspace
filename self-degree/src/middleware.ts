import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const PROTECTED_PREFIXES = ["/dashboard", "/children", "/api/children", "/api/ai"];

// Public routes
const PUBLIC_PREFIXES = ["/", "/auth", "/api/waitlist", "/api/book"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes pass through
  if (
    PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Check for Supabase auth token
  const supabaseToken = request.cookies.get(
    "sb-access-token"
  )?.value;
  const supabaseSession = request.cookies.get("sb-refresh-token")?.value;

  if (!supabaseToken && !supabaseSession) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
