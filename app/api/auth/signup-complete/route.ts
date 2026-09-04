import { NextRequest, NextResponse } from "next/server";
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
    return NextResponse.json({ error: (e as { message?: string }).message ?? "Unexpected error" }, { status: 500 });
  }
}
