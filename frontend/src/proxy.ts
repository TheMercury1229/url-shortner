import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── Route classification ─────────────────────────────────────────────────────

/**
 * Routes only accessible when NOT authenticated.
 * Authenticated users are redirected to /home.
 */
const GUEST_ONLY_ROUTES = ["/sign-in", "/sign-up"];

/**
 * Routes only accessible when authenticated.
 * Unauthenticated users are redirected to /sign-in.
 */
const PRIVATE_ROUTE_PREFIXES = ["/home", "/all-links"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isAuthenticated(request: NextRequest): boolean {
  return !!request.cookies.get("auth_token")?.value;
}

function isGuestOnly(pathname: string): boolean {
  return GUEST_ONLY_ROUTES.includes(pathname);
}

function isPrivate(pathname: string): boolean {
  return PRIVATE_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );
}

// ─── Proxy ────────────────────────────────────────────────────────────────────

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = isAuthenticated(request);

  // Authenticated user tries to access a guest-only page → send to /home
  if (authenticated && isGuestOnly(pathname)) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Unauthenticated user tries to access a private page → send to /sign-in
  if (!authenticated && isPrivate(pathname)) {
    const signIn = new URL("/sign-in", request.url);
    // Preserve the intended destination so we can redirect back after login
    signIn.searchParams.set("next", pathname);
    return NextResponse.redirect(signIn);
  }

  return NextResponse.next();
}

// ─── Matcher ──────────────────────────────────────────────────────────────────

export const config = {
  matcher: [
    /*
     * Run on all paths EXCEPT:
     *  - _next/static  (static assets)
     *  - _next/image   (image optimization)
     *  - favicon.ico, sitemap.xml, robots.txt
     *  - /api/*        (API routes — protected at the handler level)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api/).*)",
  ],
};
