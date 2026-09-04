import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/app/lib/db";
import { encrypt } from "@/app/lib/session";
import { generateOTP, sendOtpEmail } from "@/app/lib/otp";
import { clientIp, rateLimited } from "@/app/lib/ratelimit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Step 1 of password reset: email in, OTP out (to the inbox). The response is
// identical whether or not the account exists - a tempToken always comes back,
// but for unknown emails it carries sub "0" so every code entered against it
// fails with the same generic message. Nobody can use this endpoint to probe
// which emails have accounts.
export async function POST(req: NextRequest) {
  try {
    if (rateLimited(`forgot:${clientIp(req)}`, 6, 10 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many attempts. Please try again in a few minutes." }, { status: 429 });
    }

    const body = await req.json();
    const role = body.role === "mentor" ? "mentor" : "mentee";
    const email = (typeof body.email === "string" ? body.email : "").trim().slice(0, 254).toLowerCase();

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    type Row = { id: number; name: string; password_hash: string | null };
    const rows = (role === "mentor"
      ? await sql`SELECT id, name, password_hash FROM mentors WHERE email = ${email} LIMIT 1`
      : await sql`SELECT id, name, password_hash FROM mentees WHERE email = ${email} LIMIT 1`) as Row[];

    let userId = "0";

    // Any existing row gets the code - including waitlist members who never
    // set a password. For them, "reset" doubles as activation: they choose a
    // password and they're in. Only truly unknown emails get the silent path.
    if (rows[0]) {
      userId = String(rows[0].id);
      const otp = generateOTP();
      const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      if (role === "mentor") {
        await sql`UPDATE mentors SET otp = ${otp}, otp_expires_at = ${expires}, otp_attempts = 0 WHERE id = ${rows[0].id}`;
      } else {
        await sql`UPDATE mentees SET otp = ${otp}, otp_expires_at = ${expires}, otp_attempts = 0 WHERE id = ${rows[0].id}`;
      }
      await sendOtpEmail(email, rows[0].name, otp, "reset");
    }

    const tempToken = await encrypt({ sub: userId, role, purpose: "reset-otp" }, "10m");

    return NextResponse.json({ tempToken });
  } catch (e: unknown) {
    console.error("[api] error:", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
