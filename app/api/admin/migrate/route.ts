import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/app/lib/db";

export async function GET(req: NextRequest) {
  const secret = new URL(req.url).searchParams.get("secret");
  if (secret !== (process.env.MIGRATE_SECRET ?? "connek-local-2026")) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  await sql`ALTER TABLE mentees ADD COLUMN IF NOT EXISTS password_hash TEXT`;
  await sql`ALTER TABLE mentees ADD COLUMN IF NOT EXISTS otp TEXT`;
  await sql`ALTER TABLE mentees ADD COLUMN IF NOT EXISTS otp_expires_at TIMESTAMPTZ`;
  await sql`ALTER TABLE mentees ADD COLUMN IF NOT EXISTS mentor_id INTEGER`;
  await sql`ALTER TABLE mentors ADD COLUMN IF NOT EXISTS password_hash TEXT`;
  await sql`ALTER TABLE mentors ADD COLUMN IF NOT EXISTS otp TEXT`;
  await sql`ALTER TABLE mentors ADD COLUMN IF NOT EXISTS otp_expires_at TIMESTAMPTZ`;

  return NextResponse.json({ success: true, message: "Migration complete." });
}
