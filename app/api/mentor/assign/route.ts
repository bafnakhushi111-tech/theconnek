import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { sql } from "@/app/lib/db";
import { getSession } from "@/app/lib/session";

const FROM = "theconnek <hello@theconnek.com>";
const ADMIN = "hello@theconnek.in";

// Testing must never put mail in a real mentor's inbox. Outside production the
// mentor's copy is redirected to the admin address with the intended recipient
// written into the subject line.
function routeTo(intended: string): { to: string; prefix: string } {
  return process.env.NODE_ENV === "production"
    ? { to: intended, prefix: "" }
    : { to: ADMIN, prefix: `[DEV → ${intended}] ` };
}

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
    const menteeRows = (await sql`
      SELECT id, name, email, college, role FROM mentees
      WHERE id = ${menteeId} AND mentor_id IS NULL
      LIMIT 1
    `) as MenteeRow[];

    const mentee = menteeRows[0];
    if (!mentee) {
      return NextResponse.json({ error: "Mentee not found or already matched." }, { status: 404 });
    }

    type MentorRow = { name: string; email: string; company: string; role: string };
    const mentorRows = (await sql`
      SELECT name, email, company, role FROM mentors WHERE id = ${mentorId} LIMIT 1
    `) as MentorRow[];
    const mentor = mentorRows[0];

    // Three mentees per mentor keeps every match a real commitment. Checked
    // again here so the cap holds even if the button is bypassed.
    const load = (await sql`
      SELECT COUNT(*) AS count FROM mentees WHERE mentor_id = ${mentorId}
    `) as { count: string }[];
    if (Number(load[0]?.count ?? 0) >= 3) {
      return NextResponse.json(
        { error: "You're already mentoring 3 mentees, which is the cap for now." },
        { status: 409 }
      );
    }

    // Claim the mentee only if still unmatched (guards against two mentors
    // racing on the same profile).
    const claimed = (await sql`
      UPDATE mentees SET mentor_id = ${mentorId}
      WHERE id = ${menteeId} AND mentor_id IS NULL
      RETURNING id
    `) as { id: number }[];

    if (claimed.length === 0) {
      return NextResponse.json({ error: "Someone just matched with this mentee." }, { status: 409 });
    }

    if (process.env.RESEND_API_KEY && mentor) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const mentorFirst = mentor.name.split(" ")[0];
      const menteeFirst = mentee.name.split(" ")[0];
      const mentorMail = routeTo(mentor.email);

      // 1. The mentor. Deliberately not the mentee, who hears from us only once
      //    a time is actually fixed.
      await resend.emails.send({
        from: FROM,
        to: mentorMail.to,
        replyTo: ADMIN,
        subject: `${mentorMail.prefix}You're matched with ${menteeFirst}`,
        html: `
          <div style="background:#08090E;padding:40px 24px;font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
            <div style="max-width:520px;margin:0 auto;">
              <p style="margin:0 0 28px;font-size:17px;font-weight:800;color:#ffffff;">theconnek</p>
              <p style="margin:0 0 18px;font-size:16px;line-height:1.65;color:#CBD5E1;">Hi ${mentorFirst},</p>
              <p style="margin:0 0 18px;font-size:16px;line-height:1.65;color:#CBD5E1;">
                You have been matched with <strong style="color:#ffffff;">${mentee.name}</strong>, ${mentee.role} at ${mentee.college}. Thank you for offering your time.
              </p>
              <p style="margin:0 0 18px;font-size:16px;line-height:1.65;color:#8A9CB8;">
                The format is simple. One call over Zoom or Google Meet, around 15 minutes. No prep needed on your side. They come with specific questions about the work itself.
              </p>
              <p style="margin:0 0 18px;font-size:16px;line-height:1.65;color:#CBD5E1;">
                Could you reply with two or three windows that work for you over the next two weeks? We will fix a time and send the link across.
              </p>
              <p style="margin:0 0 6px;font-size:14px;line-height:1.6;color:#64748B;">
                Their contact details stay with us and are never shared, and yours are never shared with them.
              </p>
            </div>
          </div>
        `,
      });

      // 2. The admin copy, so a call can actually be scheduled.
      await resend.emails.send({
        from: FROM,
        to: ADMIN,
        subject: `Schedule a call: ${mentor.name} → ${mentee.name}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:500px;padding:32px;background:#f9fafb;border-radius:12px;">
            <p style="margin:0 0 4px;font-size:20px;font-weight:700;color:#111827;">New mentor match</p>
            <p style="margin:0 0 16px;font-size:13px;color:#374151;">The mentor has been asked for their availability. Watch for their reply, then fix a time.</p>
            <p style="margin:0 0 24px;font-size:13px;color:#6b7280;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</p>
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:13px;color:#6b7280;width:90px;">Mentor</td>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:13px;font-weight:600;color:#111827;">${mentor.name} &middot; ${mentor.role} at ${mentor.company}<br><a href="mailto:${mentor.email}" style="color:#4B6FA5;font-weight:500;">${mentor.email}</a></td>
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
