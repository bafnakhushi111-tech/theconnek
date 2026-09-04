import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Next 16 edge "proxy" (formerly middleware) guarding the portal.
// Kept in sync with app/lib/session.ts: same cookie name, same required
// secret (no insecure fallback).
const SESSION_COOKIE = "connek_session";

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET is not set (or too short).");
  }
  return new TextEncoder().encode(secret);
}

async function getRole(token: string | undefined): Promise<string | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    return (payload.role as string) ?? null;
  } catch {
    return null;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = await getRole(req.cookies.get(SESSION_COOKIE)?.value);

  // Protect dashboards - wrong/no role bounces to that role's login.
  if (pathname.startsWith("/mentee/dashboard") && role !== "mentee") {
    return NextResponse.redirect(new URL("/mentee/login", req.nextUrl.origin));
  }
  if (pathname.startsWith("/mentor/dashboard") && role !== "mentor") {
    return NextResponse.redirect(new URL("/mentor/login", req.nextUrl.origin));
  }

  // Already signed in? Skip the login/signup screens.
  if (role === "mentee" && (pathname === "/mentee/login" || pathname === "/mentee/signup")) {
    return NextResponse.redirect(new URL("/mentee/dashboard", req.nextUrl.origin));
  }
  if (role === "mentor" && (pathname === "/mentor/login" || pathname === "/mentor/signup")) {
    return NextResponse.redirect(new URL("/mentor/dashboard", req.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/mentee/:path*", "/mentor/:path*"],
};
