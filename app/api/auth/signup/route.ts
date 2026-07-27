import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/app/lib/db";
import { encrypt } from "@/app/lib/session";
import { generateOTP, sendOtpEmail } from "@/app/lib/otp";
import { clientIp, rateLimited } from "@/app/lib/ratelimit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(req: NextRequest) {
  try {
    if (rateLimited(`signup:${clientIp(req)}`, 6, 10 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many attempts. Please try again in a few minutes." }, { status: 429 });
    }

    const body = await req.json();
    const role = body.role === "mentor" ? "mentor" : "mentee";
    const name = clean(body.name, 100);
    const email = clean(body.email, 254).toLowerCase();
    const password = clean(body.password, 200);
    const institution = clean(body.institution, 150); // college (mentee) / company (mentor)
    const targetRole = clean(body.role_field, 100);
    const location = clean(body.location, 100) || null;
    const experience = clean(body.experience, 40) || null;
    let linkedin = clean(body.linkedin, 200) || null;
    if (linkedin && !/^https?:\/\//i.test(linkedin)) linkedin = `https://${linkedin}`;

    if (!name || !email || !password || !institution || !targetRole) {
      return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const hash = await bcrypt.hash(password, 12);
    const otp = generateOTP();
    const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    type Row = { id: number; password_hash: string | null };
    const existing = (role === "mentor"
      ? await sql`SELECT id, password_hash FROM mentors WHERE email = ${email} LIMIT 1`
      : await sql`SELECT id, password_hash FROM mentees WHERE email = ${email} LIMIT 1`) as Row[];

    let userId: number;

    if (existing[0]) {
      // Already on the waitlist. If they've already activated (password set),
      // send them to login rather than silently resetting their password.
      if (existing[0].password_hash) {
        return NextResponse.json(
          { error: "You already have an account. Please log in instead." },
          { status: 409 }
        );
      }
      userId = existing[0].id;
      // Activate: set the password, refresh profile fields, stage the OTP.
      if (role === "mentor") {
        await sql`
          UPDATE mentors SET
            name = ${name}, password_hash = ${hash}, company = ${institution},
            role = ${targetRole}, location = ${location}, experience = ${experience},
            linkedin = COALESCE(${linkedin}, linkedin), otp = ${otp}, otp_expires_at = ${expires}
          WHERE id = ${userId}
        `;
      } else {
        await sql`
          UPDATE mentees SET
            name = ${name}, password_hash = ${hash}, college = ${institution},
            role = ${targetRole}, location = ${location}, experience = ${experience},
            linkedin = COALESCE(${linkedin}, linkedin), otp = ${otp}, otp_expires_at = ${expires}
          WHERE id = ${userId}
        `;
      }
    } else {
      // Brand-new account.
      const inserted = (role === "mentor"
        ? await sql`
            INSERT INTO mentors (name, email, company, role, location, experience, linkedin, password_hash, otp, otp_expires_at)
            VALUES (${name}, ${email}, ${institution}, ${targetRole}, ${location}, ${experience}, ${linkedin}, ${hash}, ${otp}, ${expires})
            RETURNING id
          `
        : await sql`
            INSERT INTO mentees (name, email, college, role, location, experience, linkedin, password_hash, otp, otp_expires_at)
            VALUES (${name}, ${email}, ${institution}, ${targetRole}, ${location}, ${experience}, ${linkedin}, ${hash}, ${otp}, ${expires})
            RETURNING id
          `) as { id: number }[];
      userId = inserted[0].id;
    }

    await sendOtpEmail(email, name, otp);

    const tempToken = await encrypt({ sub: String(userId), role, name, purpose: "otp" }, "10m");

    return NextResponse.json({ tempToken });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as { message?: string }).message ?? "Unexpected error" }, { status: 500 });
  }
}
