import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/app/lib/db";
import { decrypt, createSession } from "@/app/lib/session";
import { clientIp, rateLimited } from "@/app/lib/ratelimit";

// Step 2 of password reset: code + new password in one shot. On success the
// OTP is cleared (single use) and a real session starts, so the person lands
// straight on their dashboard.
export async function POST(req: NextRequest) {
  try {
    // Same brute-force brake as OTP verification at signup.
    if (rateLimited(`reset:${clientIp(req)}`, 10, 10 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many attempts. Please try again in a few minutes." }, { status: 429 });
    }

    const { otp, password, tempToken } = await req.json();

    if (!otp || !password || !tempToken) {
      return NextResponse.json({ error: "Missing fields." }, { status: 400 });
    }

    const payload = await decrypt(tempToken);
    if (!payload || payload.purpose !== "reset-otp") {
      return NextResponse.json({ error: "Session expired. Please start again." }, { status: 401 });
    }

    const id = payload.sub as string;
    const role = payload.role as string;

    const clean = typeof password === "string" ? password.trim().slice(0, 200) : "";
    if (clean.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    // sub "0" means the email had no account - fall through to the same
    // generic rejection a wrong code gets.
    type OTPRow = { name: string; otp: string | null; otp_expires_at: string | null };
    const rows = (role === "mentor"
      ? await sql`SELECT name, otp, otp_expires_at FROM mentors WHERE id = ${id} LIMIT 1`
      : await sql`SELECT name, otp, otp_expires_at FROM mentees WHERE id = ${id} LIMIT 1`) as OTPRow[];
    const record = id === "0" ? undefined : rows[0];

    if (
      !record?.otp ||
      !record?.otp_expires_at ||
      new Date() > new Date(record.otp_expires_at) ||
      String(otp).trim() !== record.otp
    ) {
      return NextResponse.json({ error: "Incorrect or expired code. Try again." }, { status: 401 });
    }

    const hash = await bcrypt.hash(clean, 12);

    if (role === "mentor") {
      await sql`UPDATE mentors SET password_hash = ${hash}, otp = NULL, otp_expires_at = NULL WHERE id = ${id}`;
    } else {
      await sql`UPDATE mentees SET password_hash = ${hash}, otp = NULL, otp_expires_at = NULL WHERE id = ${id}`;
    }

    await createSession(id, role, record.name);

    return NextResponse.json({ success: true, role });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as { message?: string }).message ?? "Unexpected error" }, { status: 500 });
  }
}
