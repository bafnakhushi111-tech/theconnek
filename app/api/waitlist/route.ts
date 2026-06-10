import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Database not configured." }, { status: 500 });
    }
    const sql = neon(process.env.DATABASE_URL);
    const { name, email, college, role, user_type, location, experience } = await req.json();

    if (!name || !email || !college || !role) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    try {
      if (user_type === "professional") {
        await sql`
          INSERT INTO mentors (name, email, company, role, location, experience)
          VALUES (${name}, ${email}, ${college}, ${role}, ${location || null}, ${experience || null})
        `;
      } else {
        await sql`
          INSERT INTO mentees (name, email, college, role, location, experience)
          VALUES (${name}, ${email}, ${college}, ${role}, ${location || null}, ${experience || null})
        `;
      }
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string };
      if (e.code === "23505") {
        return NextResponse.json({ error: "This email is already on the waitlist." }, { status: 409 });
      }
      return NextResponse.json({ error: e.message || "Database error" }, { status: 500 });
    }

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const typeLabel = user_type === "professional" ? "Professional" : "Candidate";
      const institutionLabel = user_type === "professional" ? "Company" : "College";
      const roleLabel = user_type === "professional" ? "Current Role" : "Target Role";
      await resend.emails.send({
        from: "hello@theconnek.in",
        to: "bafnakhushi111@gmail.com",
        subject: `New ${typeLabel} signup: ${name}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f9fafb;border-radius:12px;">
            <p style="margin:0 0 4px;font-size:20px;font-weight:700;color:#111827;">New Connekt signup — ${typeLabel}</p>
            <p style="margin:0 0 24px;font-size:13px;color:#6b7280;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</p>
            <table style="width:100%;border-collapse:collapse;">
              ${[["Name", name], ["Email", email], ...(location ? [["Location", location]] : []), [institutionLabel, college], [roleLabel, role], ...(experience ? [["Experience", experience]] : [])].map(([label, value]) => `
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:13px;color:#6b7280;width:110px;">${label}</td>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:13px;font-weight:600;color:#111827;">${value}</td>
                </tr>
              `).join("")}
            </table>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const e = err as { message?: string };
    return NextResponse.json({ error: e.message || "Unexpected error" }, { status: 500 });
  }
}
