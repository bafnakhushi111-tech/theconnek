import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "dev-secret-32-chars-change-in-prod!"
);

async function getRole(token: string | undefined): Promise<string | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET, { algorithms: ["HS256"] });
    return (payload.role as string) ?? null;
  } catch {
    return null;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("connek_session")?.value;
  const role = await getRole(token);

  if (pathname.startsWith("/mentee/dashboard")) {
    if (role !== "mentee") {
      return NextResponse.redirect(new URL("/mentee/login", req.url));
    }
  }

  if (pathname.startsWith("/mentor/dashboard")) {
    if (role !== "mentor") {
      return NextResponse.redirect(new URL("/mentor/login", req.url));
    }
  }

  if (pathname === "/mentee/login" && role === "mentee") {
    return NextResponse.redirect(new URL("/mentee/dashboard", req.url));
  }

  if (pathname === "/mentor/login" && role === "mentor") {
    return NextResponse.redirect(new URL("/mentor/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/mentee/:path*", "/mentor/:path*"],
};
