import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/app/lib/db";
import { encrypt } from "@/app/lib/session";
import { generateOTP, sendOtpEmail } from "@/app/lib/otp";
import { clientIp, rateLimited } from "@/app/lib/ratelimit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Step 1 of signup: email only. Verifying it owns that inbox happens next
// (OTP), then password, then the rest of their profile - see signup-password
// and signup-complete.
export async function POST(req: NextRequest) {
  try {
    if (rateLimited(`signup:${clientIp(req)}`, 6, 10 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many attempts. Please try again in a few minutes." }, { status: 429 });
    }

    const body = await req.json();
    const role = body.role === "mentor" ? "mentor" : "mentee";
    const email = (typeof body.email === "string" ? body.email : "").trim().slice(0, 254).toLowerCase();

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const otp = generateOTP();
    const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    type Row = { id: number; password_hash: string | null };
    const existing = (role === "mentor"
      ? await sql`SELECT id, password_hash FROM mentors WHERE email = ${email} LIMIT 1`
      : await sql`SELECT id, password_hash FROM mentees WHERE email = ${email} LIMIT 1`) as Row[];

    let userId: number;

    if (existing[0]) {
      // Already on the waitlist or mid-signup. If they've already activated
      // (password set), send them to login rather than restarting them.
      if (existing[0].password_hash) {
        return NextResponse.json(
          { error: "You already have an account. Please log in instead." },
          { status: 409 }
        );
      }
      userId = existing[0].id;
      if (role === "mentor") {
        await sql`UPDATE mentors SET otp = ${otp}, otp_expires_at = ${expires} WHERE id = ${userId}`;
      } else {
        await sql`UPDATE mentees SET otp = ${otp}, otp_expires_at = ${expires} WHERE id = ${userId}`;
      }
    } else {
      const inserted = (role === "mentor"
        ? await sql`
            INSERT INTO mentors (name, email, otp, otp_expires_at)
            VALUES ('', ${email}, ${otp}, ${expires})
            RETURNING id
          `
        : await sql`
            INSERT INTO mentees (name, email, otp, otp_expires_at)
            VALUES ('', ${email}, ${otp}, ${expires})
            RETURNING id
          `) as { id: number }[];
      userId = inserted[0].id;
    }

    await sendOtpEmail(email, "there", otp);

    const tempToken = await encrypt({ sub: String(userId), role, purpose: "signup-otp" }, "10m");

    return NextResponse.json({ tempToken });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as { message?: string }).message ?? "Unexpected error" }, { status: 500 });
  }
}
