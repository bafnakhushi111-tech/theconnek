import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, email, college, role, user_type } = await req.json();

  if (!name || !email || !college || !role) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  const { error } = await supabase.from("waitlist").insert({ name, email, college, role, user_type: user_type || "candidate" });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "This email is already on the waitlist." }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Notify owner of new signup
  if (process.env.RESEND_API_KEY) {
    const typeLabel = user_type === "professional" ? "Professional" : "Candidate";
    const institutionLabel = user_type === "professional" ? "Company" : "College";
    const roleLabel = user_type === "professional" ? "Current Role" : "Target Role";
    await resend.emails.send({
      from: "hello@theconnek.com",
      to: "bafnakhushi111@gmail.com",
      subject: `New ${typeLabel} signup: ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f9fafb;border-radius:12px;">
          <p style="margin:0 0 4px;font-size:20px;font-weight:700;color:#111827;">New Connekt signup — ${typeLabel}</p>
          <p style="margin:0 0 24px;font-size:13px;color:#6b7280;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</p>
          <table style="width:100%;border-collapse:collapse;">
            ${[["Name", name], ["Email", email], [institutionLabel, college], [roleLabel, role]].map(([label, value]) => `
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:13px;color:#6b7280;width:110px;">${label}</td>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:13px;font-weight:600;color:#111827;">${value}</td>
              </tr>
            `).join("")}
          </table>
          <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;">View all signups at your Supabase dashboard.</p>
        </div>
      `,
    });
  }

  return NextResponse.json({ success: true });
}
