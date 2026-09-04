import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/app/lib/db";
import { decrypt, encrypt } from "@/app/lib/session";
import { clientIp, rateLimited } from "@/app/lib/ratelimit";

// Step 2 of signup: verify the code emailed in step 1. On success this only
// proves the mailbox is theirs - it hands back a tempToken for the password
// step, not a real session.
export async function POST(req: NextRequest) {
  try {
    // Hard brake on OTP brute force: a 6-digit code inside a 10-min window is
    // only safe if guesses are capped. 10 tries / 10 min makes it impractical.
    if (rateLimited(`verify:${clientIp(req)}`, 10, 10 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many attempts. Please try again in a few minutes." }, { status: 429 });
    }

    const { otp, tempToken } = await req.json();

    if (!otp || !tempToken) {
      return NextResponse.json({ error: "Missing fields." }, { status: 400 });
    }

    const payload = await decrypt(tempToken);
    if (!payload || payload.purpose !== "signup-otp") {
      return NextResponse.json({ error: "Session expired. Please start again." }, { status: 401 });
    }

    const id = payload.sub as string;
    const role = payload.role as string;

    type OTPRow = { otp: string | null; otp_expires_at: string | null };
    const rows = (role === "mentor"
      ? await sql`SELECT otp, otp_expires_at FROM mentors WHERE id = ${id} LIMIT 1`
      : await sql`SELECT otp, otp_expires_at FROM mentees WHERE id = ${id} LIMIT 1`) as OTPRow[];

    const record = rows[0];

    if (!record?.otp || !record?.otp_expires_at) {
      return NextResponse.json({ error: "No code found. Please start again." }, { status: 401 });
    }

    if (new Date() > new Date(record.otp_expires_at)) {
      return NextResponse.json({ error: "Code expired. Please start again." }, { status: 401 });
    }

    if (String(otp).trim() !== record.otp) {
      return NextResponse.json({ error: "Incorrect code. Try again." }, { status: 401 });
    }

    // One-time use: clear the code so it cannot be replayed.
    if (role === "mentor") {
      await sql`UPDATE mentors SET otp = NULL, otp_expires_at = NULL WHERE id = ${id}`;
    } else {
      await sql`UPDATE mentees SET otp = NULL, otp_expires_at = NULL WHERE id = ${id}`;
    }

    const nextToken = await encrypt({ sub: id, role, purpose: "signup-password" }, "15m");

    return NextResponse.json({ tempToken: nextToken });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as { message?: string }).message ?? "Unexpected error" }, { status: 500 });
  }
}
