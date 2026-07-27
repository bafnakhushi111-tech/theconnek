import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/app/lib/db";
import { encrypt } from "@/app/lib/session";
import { generateOTP, sendOtpEmail } from "@/app/lib/otp";
import { clientIp, rateLimited } from "@/app/lib/ratelimit";

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

    const otp = generateOTP();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    if (role === "mentor") {
      await sql`UPDATE mentors SET otp = ${otp}, otp_expires_at = ${expires.toISOString()} WHERE id = ${user.id}`;
    } else {
      await sql`UPDATE mentees SET otp = ${otp}, otp_expires_at = ${expires.toISOString()} WHERE id = ${user.id}`;
    }

    await sendOtpEmail(user.email, user.name, otp);

    // Short-lived token that only authorizes the OTP step - it cannot be used
    // as a real session (verify-otp checks purpose === "otp").
    const tempToken = await encrypt({ sub: String(user.id), role, name: user.name, purpose: "otp" }, "10m");

    return NextResponse.json({ tempToken });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as { message?: string }).message ?? "Unexpected error" }, { status: 500 });
  }
}
