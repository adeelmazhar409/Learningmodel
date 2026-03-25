import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* ── Routes that require authentication ── */
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/onboarding",
  "/diagnostic",
  "/record",
  "/study-packs",
  "/roadmap",
];

/* ── Routes only for guests (redirect to dashboard if already logged in) ── */
const GUEST_ONLY = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* Read the persisted auth from the cookie/storage.
     Zustand persist writes to localStorage which is not
     accessible in middleware, so we check a lightweight
     httpOnly cookie that the backend sets on login instead.
     In mock mode (no backend) we skip the check entirely. */
  const token = request.cookies.get("np_token")?.value;

  const isProtected = PROTECTED_PREFIXES.some(p => pathname.startsWith(p));
  const isGuestOnly = GUEST_ONLY.some(p => pathname.startsWith(p));

  /* Not logged in and trying to access a protected route */
  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  /* Logged in and trying to access login/signup */
  if (isGuestOnly && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  /* Run middleware on all routes except static files and API routes */
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
