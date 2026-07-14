import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/app/lib/db";

export async function GET(req: NextRequest) {
  const params = new URL(req.url).searchParams;
  const secret = params.get("secret");
  const email = params.get("email");
  const role = params.get("role"); // "mentee" or "mentor"

  if (secret !== (process.env.MIGRATE_SECRET ?? "connek-local-2026")) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  // Run migration first
  await sql`ALTER TABLE mentees ADD COLUMN IF NOT EXISTS password_hash TEXT`;
  await sql`ALTER TABLE mentees ADD COLUMN IF NOT EXISTS otp TEXT`;
  await sql`ALTER TABLE mentees ADD COLUMN IF NOT EXISTS otp_expires_at TIMESTAMPTZ`;
  await sql`ALTER TABLE mentees ADD COLUMN IF NOT EXISTS mentor_id INTEGER`;
  await sql`ALTER TABLE mentors ADD COLUMN IF NOT EXISTS password_hash TEXT`;
  await sql`ALTER TABLE mentors ADD COLUMN IF NOT EXISTS otp TEXT`;
  await sql`ALTER TABLE mentors ADD COLUMN IF NOT EXISTS otp_expires_at TIMESTAMPTZ`;

  if (!email || !role) {
    return NextResponse.json({ success: true, message: "Migration done. Add ?email=you@example.com&role=mentee to also set a password." });
  }

  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  const password = Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const hash = await bcrypt.hash(password, 12);

  if (role === "mentor") {
    await sql`UPDATE mentors SET password_hash = ${hash} WHERE email = ${email.toLowerCase()}`;
  } else {
    await sql`UPDATE mentees SET password_hash = ${hash} WHERE email = ${email.toLowerCase()}`;
  }

  return NextResponse.json({
    success: true,
    migration: "done",
    email,
    role,
    password,
    loginUrl: `http://localhost:3000/${role}/login`,
  });
}
