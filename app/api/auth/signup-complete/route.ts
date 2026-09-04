import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { sql } from "@/app/lib/db";
import { decrypt, createSession } from "@/app/lib/session";
import { clientIp, rateLimited } from "@/app/lib/ratelimit";

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

// Step 4 of signup: profile details. Finalizes the account and starts the
// real session - no further OTP needed, the mailbox was already verified.
export async function POST(req: NextRequest) {
  try {
    if (rateLimited(`signup-complete:${clientIp(req)}`, 10, 10 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many attempts. Please try again in a few minutes." }, { status: 429 });
    }

    const body = await req.json();
    const payload = await decrypt(body.tempToken);
    if (!payload || payload.purpose !== "signup-details") {
      return NextResponse.json({ error: "Session expired. Please start again." }, { status: 401 });
    }

    const id = payload.sub as string;
    const role = payload.role as string;

    const name = clean(body.name, 100);
    const institution = clean(body.institution, 150); // college (mentee) / company (mentor)
    const targetRole = clean(body.role_field, 100);
    const location = clean(body.location, 100) || null;
    const experience = clean(body.experience, 40) || null;
    let linkedin = clean(body.linkedin, 200) || null;
    if (linkedin && !/^https?:\/\//i.test(linkedin)) linkedin = `https://${linkedin}`;

    if (!name || !institution || !targetRole) {
      return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
    }

    if (role === "mentor") {
      await sql`
        UPDATE mentors SET
          name = ${name}, company = ${institution}, role = ${targetRole},
          location = ${location}, experience = ${experience}, linkedin = ${linkedin}
        WHERE id = ${id}
      `;

      // New mentors start unapproved. Tell the admin so they can vet and
      // approve; a mail failure must not block the signup itself.
      if (process.env.RESEND_API_KEY) {
        const esc = (v: string | null) =>
          String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const resend = new Resend(process.env.RESEND_API_KEY);
        resend.emails
          .send({
            from: "theconnek <hello@theconnek.com>",
            to: "hello@theconnek.in",
            subject: `Approve mentor: ${name}`,
            html: `
              <div style="font-family:Arial,sans-serif;max-width:500px;padding:32px;background:#f9fafb;border-radius:12px;">
                <p style="margin:0 0 4px;font-size:20px;font-weight:700;color:#111827;">New mentor awaiting approval</p>
                <p style="margin:0 0 20px;font-size:13px;color:#374151;">They cannot see mentee profiles until approved. To approve, run:<br><code>node scripts/approve-mentor.mjs their-email</code></p>
                <p style="margin:0;font-size:14px;color:#111827;"><strong>${esc(name)}</strong> &middot; ${esc(targetRole)} at ${esc(institution)}${location ? ` &middot; ${esc(location)}` : ""}</p>
                ${linkedin ? `<p style="margin:8px 0 0;font-size:13px;"><a href="${esc(linkedin)}" style="color:#4B6FA5;">${esc(linkedin)}</a></p>` : ""}
              </div>
            `,
          })
          .catch((err) => console.error("[signup-complete] mentor-approval mail failed:", err));
      }
    } else {
      await sql`
        UPDATE mentees SET
          name = ${name}, college = ${institution}, role = ${targetRole},
          location = ${location}, experience = ${experience}, linkedin = ${linkedin}
        WHERE id = ${id}
      `;
    }

    await createSession(id, role, name);

    return NextResponse.json({ success: true, role });
  } catch (e: unknown) {
    console.error("[api] error:", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
