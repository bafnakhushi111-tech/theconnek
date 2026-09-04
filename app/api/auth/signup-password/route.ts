import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/app/lib/db";
import { decrypt, encrypt, createSession } from "@/app/lib/session";
import { clientIp, rateLimited } from "@/app/lib/ratelimit";

// Step 3 of signup: set a password now that the email is verified.
export async function POST(req: NextRequest) {
  try {
    if (rateLimited(`signup-password:${clientIp(req)}`, 10, 10 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many attempts. Please try again in a few minutes." }, { status: 429 });
    }

    const { password, tempToken } = await req.json();

    const payload = await decrypt(tempToken);
    if (!payload || payload.purpose !== "signup-password") {
      return NextResponse.json({ error: "Session expired. Please start again." }, { status: 401 });
    }

    const clean = typeof password === "string" ? password.trim().slice(0, 200) : "";
    if (clean.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const id = payload.sub as string;
    const role = payload.role as string;
    const hash = await bcrypt.hash(clean, 12);

    if (role === "mentor") {
      await sql`UPDATE mentors SET password_hash = ${hash} WHERE id = ${id}`;
    } else {
      await sql`UPDATE mentees SET password_hash = ${hash} WHERE id = ${id}`;
    }

    // Waitlist members already gave us their profile on the old join form.
    // If the row is complete, don't make them type it all again - finish the
    // signup right here and sign them in.
    type ProfileRow = { name: string | null; institution: string | null; role: string | null };
    const rows = (role === "mentor"
      ? await sql`SELECT name, company AS institution, role FROM mentors WHERE id = ${id} LIMIT 1`
      : await sql`SELECT name, college AS institution, role FROM mentees WHERE id = ${id} LIMIT 1`) as ProfileRow[];
    const profile = rows[0];

    if (profile?.name && profile?.institution && profile?.role) {
      await createSession(id, role, profile.name);
      return NextResponse.json({ done: true, role });
    }

    const nextToken = await encrypt({ sub: id, role, purpose: "signup-details" }, "15m");

    return NextResponse.json({ tempToken: nextToken });
  } catch (e: unknown) {
    console.error("[api] error:", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
