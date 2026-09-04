import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/app/lib/db";
import { createSession } from "@/app/lib/session";
import { clientIp, rateLimited } from "@/app/lib/ratelimit";

// Email is verified once, at signup (via OTP). Login itself is just
// email + password - no per-login OTP round trip.
export async function POST(req: NextRequest) {
  try {
    if (rateLimited(`login:${clientIp(req)}`, 8, 10 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many attempts. Please try again in a few minutes." }, { status: 429 });
    }

    const body = await req.json();
    const email = (body.email ?? "").trim().toLowerCase();
    const password = (body.password ?? "").trim();
    const role = body.role === "mentor" ? "mentor" : "mentee";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    type UserRow = { id: number; name: string; email: string; password_hash: string | null };
    const rows = (role === "mentor"
      ? await sql`SELECT id, name, email, password_hash FROM mentors WHERE email = ${email} LIMIT 1`
      : await sql`SELECT id, name, email, password_hash FROM mentees WHERE email = ${email} LIMIT 1`) as UserRow[];

    const user = rows[0];

    // Same generic message whether the account is missing, has no password, or
    // the password is wrong - never reveal which emails exist.
    if (!user || !user.password_hash || !(await bcrypt.compare(password, user.password_hash))) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    await createSession(String(user.id), role, user.name);

    return NextResponse.json({ success: true, role });
  } catch (e: unknown) {
    console.error("[api] error:", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
