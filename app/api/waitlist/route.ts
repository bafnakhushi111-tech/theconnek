import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const FROM = "theconnek <hello@theconnek.com>";

function adminEmail(name: string, email: string, college: string, role: string, user_type: string, location?: string, experience?: string) {
  const typeLabel = user_type === "professional" ? "Professional" : "Candidate";
  const institutionLabel = user_type === "professional" ? "Company" : "College";
  const roleLabel = user_type === "professional" ? "Current Role" : "Target Role";
  const rows = [
    ["Name", name],
    ["Email", email],
    ...(location ? [["Location", location]] : []),
    [institutionLabel, college],
    [roleLabel, role],
    ...(experience ? [["Experience", experience]] : []),
  ];
  return `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f9fafb;border-radius:12px;">
      <p style="margin:0 0 4px;font-size:20px;font-weight:700;color:#111827;">New ${typeLabel} signup — ${name}</p>
      <p style="margin:0 0 24px;font-size:13px;color:#6b7280;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</p>
      <table style="width:100%;border-collapse:collapse;">
        ${rows.map(([label, value]) => `
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:13px;color:#6b7280;width:110px;">${label}</td>
            <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:13px;font-weight:600;color:#111827;">${value}</td>
          </tr>
        `).join("")}
      </table>
    </div>
  `;
}

function welcomeEmail(name: string, user_type: string) {
  const isPro = user_type === "professional";
  const firstName = name.split(" ")[0];
  const headline = isPro
    ? `You're in, ${firstName}.`
    : `You're on the list, ${firstName}.`;
  const subtext = isPro
    ? "Thank you for offering your time. It genuinely matters."
    : "We're building a community for real career conversations. You're part of it from day one.";
  const step1 = isPro
    ? "We review your profile and find a student whose goals match your background."
    : "We review your profile and find a professional who has been where you're going.";
  const step2 = isPro
    ? "We make the introduction. One conversation, no pressure, no quota."
    : "We make the introduction. A real conversation, not a cold message.";
  const step3 = isPro
    ? "You decide how involved you want to be. Even one conversation a month makes a difference."
    : "You show up. Ask the questions you've been saving up.";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    </head>
    <body style="margin:0;padding:0;background:#08090E;font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#08090E;padding:48px 16px;">
        <tr><td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

            <!-- Logo -->
            <tr><td style="padding-bottom:40px;">
              <p style="margin:0;font-size:17px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;">theconnek</p>
            </td></tr>

            <!-- Headline -->
            <tr><td style="padding-bottom:12px;">
              <h1 style="margin:0;font-size:34px;font-weight:800;color:#ffffff;letter-spacing:-1px;line-height:1.15;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;">${headline}</h1>
            </td></tr>

            <!-- Subtext -->
            <tr><td style="padding-bottom:40px;">
              <p style="margin:0;font-size:16px;color:#8A9CB8;line-height:1.65;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;">${subtext}</p>
            </td></tr>

            <!-- What happens next label -->
            <tr><td style="padding-bottom:16px;">
              <p style="margin:0;font-size:10px;font-weight:700;color:#4B6FA5;text-transform:uppercase;letter-spacing:2px;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;">What happens next</p>
            </td></tr>

            ${[step1, step2, step3].map((step, i) => `
            <tr><td style="padding-bottom:14px;">
              <table cellpadding="0" cellspacing="0" width="100%" style="background:rgba(75,111,165,0.06);border:1px solid rgba(75,111,165,0.12);border-radius:10px;">
                <tr>
                  <td style="width:48px;text-align:center;padding:16px 0 16px 16px;vertical-align:top;">
                    <span style="display:inline-block;width:22px;height:22px;border-radius:50%;background:rgba(75,111,165,0.2);border:1px solid rgba(75,111,165,0.35);text-align:center;line-height:22px;font-size:10px;font-weight:800;color:#7B9EC8;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;">${i + 1}</span>
                  </td>
                  <td style="font-size:14px;color:#CBD5E1;line-height:1.65;padding:16px 16px 16px 8px;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;">${step}</td>
                </tr>
              </table>
            </td></tr>
            `).join("")}

            ${!isPro ? `
            <!-- Coming soon section -->
            <tr><td style="padding:28px 0 16px;">
              <p style="margin:0;font-size:10px;font-weight:700;color:#4B6FA5;text-transform:uppercase;letter-spacing:2px;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;">Coming soon, just for members</p>
            </td></tr>

            ${[
              ["📐", "Guesstimate practice", "Work through guesstimates with real people, not just recordings."],
              ["📚", "Study circles", "Small groups targeting the same roles. Shared resources, honest feedback, no LinkedIn performance."],
              ["🏆", "Case competitions", "Prep together with people who are as serious about it as you are."],
            ].map(([icon, title, desc]) => `
            <tr><td style="padding-bottom:10px;">
              <table cellpadding="0" cellspacing="0" width="100%" style="background:rgba(75,111,165,0.06);border:1px solid rgba(75,111,165,0.12);border-radius:10px;">
                <tr>
                  <td style="width:48px;text-align:center;font-size:18px;padding:14px 0 14px 14px;vertical-align:top;">${icon}</td>
                  <td style="padding:14px 14px 14px 8px;">
                    <p style="margin:0 0 3px;font-size:13px;font-weight:700;color:#E2E8F0;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;">${title}</p>
                    <p style="margin:0;font-size:12px;color:#64748B;line-height:1.55;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;">${desc}</p>
                  </td>
                </tr>
              </table>
            </td></tr>
            `).join("")}
            ` : ""}

            <!-- Divider -->
            <tr><td style="padding:28px 0 24px;">
              <div style="height:1px;background:rgba(75,111,165,0.12);"></div>
            </td></tr>

            <!-- Share nudge -->
            <tr><td style="padding-bottom:20px;">
              <p style="margin:0;font-size:14px;color:#8A9CB8;line-height:1.65;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;">Know someone who would benefit? Share it. The more real people in the room, the better the conversations.</p>
            </td></tr>

            <tr><td style="padding-bottom:44px;">
              <a href="https://theconnek.com?ref=email" style="display:inline-block;padding:13px 26px;background:#4B6FA5;color:#ffffff;text-decoration:none;border-radius:99px;font-size:13px;font-weight:700;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;letter-spacing:0.2px;">Share theconnek</a>
            </td></tr>

            <!-- Footer -->
            <tr><td>
              <p style="margin:0;font-size:12px;color:#1E293B;line-height:1.7;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;">theconnek · Built in India · <a href="https://theconnek.com/privacy" style="color:#334155;text-decoration:none;">Privacy</a> · <a href="https://theconnek.com/terms" style="color:#334155;text-decoration:none;">Terms</a></p>
              <p style="margin:4px 0 0;font-size:11px;color:#0F172A;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;">You're receiving this because you signed up at theconnek.com.</p>
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

      await Promise.all([
        resend.emails.send({
          from: FROM,
          to: email,
          subject: `You're in — welcome to Connek`,
          html: welcomeEmail(name, user_type),
        }),
        resend.emails.send({
          from: FROM,
          to: "hello@theconnek.in",
          subject: `New ${typeLabel} signup: ${name}`,
          html: adminEmail(name, email, college, role, user_type, location, experience),
        }),
      ]);
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const e = err as { message?: string };
    return NextResponse.json({ error: e.message || "Unexpected error" }, { status: 500 });
  }
}
