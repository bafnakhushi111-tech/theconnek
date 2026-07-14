import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import { sql } from "@/app/lib/db";
import { encrypt } from "@/app/lib/session";

const FROM = "theconnek <hello@theconnek.com>";

function generateOTP(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function otpEmail(name: string, otp: string): string {
  const firstName = name.split(" ")[0];
  return `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#08090E;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#08090E;padding:48px 16px;">
        <tr><td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">
            <tr><td style="padding-bottom:32px;">
              <p style="margin:0;font-size:17px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">theconnek</p>
            </td></tr>
            <tr><td style="padding-bottom:12px;">
              <h1 style="margin:0;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;line-height:1.2;">Your login code</h1>
            </td></tr>
            <tr><td style="padding-bottom:28px;">
              <p style="margin:0;font-size:15px;color:#8A9CB8;line-height:1.65;">Hi ${firstName}, use the code below to sign in. It expires in 10 minutes.</p>
            </td></tr>
            <tr><td style="padding-bottom:32px;">
              <div style="background:rgba(75,111,165,0.1);border:1px solid rgba(75,111,165,0.3);border-radius:12px;padding:28px;text-align:center;">
                <span style="font-size:42px;font-weight:800;color:#ffffff;letter-spacing:14px;font-family:monospace;">${otp}</span>
              </div>
            </td></tr>
            <tr><td>
              <p style="margin:0;font-size:12px;color:#2A3A50;line-height:1.6;">If you didn&apos;t request this, you can safely ignore this email. This code will expire in 10 minutes.</p>
            </td></tr>
            <tr><td style="padding-top:32px;">
              <p style="margin:0;font-size:12px;color:#1E293B;">theconnek &middot; Built in India</p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email ?? "").trim().toLowerCase();
    const password = (body.password ?? "").trim();
    const role = body.role === "mentor" ? "mentor" : "mentee";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    type UserRow = { id: number; name: string; email: string; password_hash: string | null };
    let rows: UserRow[];

    if (role === "mentor") {
      rows = await sql`SELECT id, name, email, password_hash FROM mentors WHERE email = ${email} LIMIT 1` as UserRow[];
    } else {
      rows = await sql`SELECT id, name, email, password_hash FROM mentees WHERE email = ${email} LIMIT 1` as UserRow[];
    }

    const user = rows[0];

    if (!user || !user.password_hash) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const otp = generateOTP();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    if (role === "mentor") {
      await sql`UPDATE mentors SET otp = ${otp}, otp_expires_at = ${expires} WHERE id = ${user.id}`;
    } else {
      await sql`UPDATE mentees SET otp = ${otp}, otp_expires_at = ${expires} WHERE id = ${user.id}`;
    }

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: FROM,
        to: user.email,
        subject: "Your theconnek login code",
        html: otpEmail(user.name, otp),
      });
    }

    const tempToken = await encrypt({ sub: String(user.id), role, name: user.name, purpose: "otp" }, "10m");

    return NextResponse.json({ tempToken });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as { message?: string }).message ?? "Unexpected error" }, { status: 500 });
  }
}
