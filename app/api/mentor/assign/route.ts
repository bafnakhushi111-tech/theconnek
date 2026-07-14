import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { sql } from "@/app/lib/db";
import { getSession } from "@/app/lib/session";

const FROM = "theconnek <hello@theconnek.com>";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "mentor") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const mentorId = session.sub as string;
    const { menteeId } = await req.json();

    if (!menteeId) {
      return NextResponse.json({ error: "menteeId required." }, { status: 400 });
    }

    type MenteeRow = { id: number; name: string; email: string; college: string; role: string };
    const menteeRows = await sql`
      SELECT id, name, email, college, role FROM mentees
      WHERE id = ${menteeId} AND mentor_id IS NULL
      LIMIT 1
    ` as MenteeRow[];

    const mentee = menteeRows[0];
    if (!mentee) {
      return NextResponse.json({ error: "Mentee not found or already assigned." }, { status: 404 });
    }

    type MentorRow = { name: string; company: string; role: string };
    const mentorRows = await sql`
      SELECT name, company, role FROM mentors WHERE id = ${mentorId} LIMIT 1
    ` as MentorRow[];

    const mentor = mentorRows[0];

    await sql`UPDATE mentees SET mentor_id = ${mentorId} WHERE id = ${menteeId}`;

    if (process.env.RESEND_API_KEY && mentor) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: FROM,
        to: "hello@theconnek.in",
        subject: `Mentor match: ${mentor.name} → ${mentee.name}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:500px;padding:32px;background:#f9fafb;border-radius:12px;">
            <p style="margin:0 0 4px;font-size:20px;font-weight:700;color:#111827;">New mentor match</p>
            <p style="margin:0 0 24px;font-size:13px;color:#6b7280;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</p>
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:13px;color:#6b7280;width:90px;">Mentor</td>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:13px;font-weight:600;color:#111827;">${mentor.name} &middot; ${mentor.role} at ${mentor.company}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:13px;color:#6b7280;">Mentee</td>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:13px;font-weight:600;color:#111827;">${mentee.name} &middot; ${mentee.college}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;font-size:13px;color:#6b7280;">Target role</td>
                <td style="padding:10px 0;font-size:13px;font-weight:600;color:#111827;">${mentee.role}</td>
              </tr>
            </table>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as { message?: string }).message ?? "Unexpected error" }, { status: 500 });
  }
}
