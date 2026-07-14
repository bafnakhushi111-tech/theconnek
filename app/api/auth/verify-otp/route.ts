import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/app/lib/db";
import { decrypt, createSession } from "@/app/lib/session";

export async function POST(req: NextRequest) {
  try {
    const { otp, tempToken } = await req.json();

    if (!otp || !tempToken) {
      return NextResponse.json({ error: "Missing fields." }, { status: 400 });
    }

    const payload = await decrypt(tempToken);
    if (!payload || payload.purpose !== "otp") {
      return NextResponse.json({ error: "Session expired. Please log in again." }, { status: 401 });
    }

    const id = payload.sub as string;
    const role = payload.role as string;
    const name = payload.name as string;

    type OTPRow = { otp: string | null; otp_expires_at: string | null };
    let rows: OTPRow[];

    if (role === "mentor") {
      rows = await sql`SELECT otp, otp_expires_at FROM mentors WHERE id = ${id} LIMIT 1` as OTPRow[];
    } else {
      rows = await sql`SELECT otp, otp_expires_at FROM mentees WHERE id = ${id} LIMIT 1` as OTPRow[];
    }

    const record = rows[0];

    if (!record?.otp || !record?.otp_expires_at) {
      return NextResponse.json({ error: "No code found. Please log in again." }, { status: 401 });
    }

    if (new Date() > new Date(record.otp_expires_at)) {
      return NextResponse.json({ error: "Code expired. Please log in again." }, { status: 401 });
    }

    if (otp.trim() !== record.otp) {
      return NextResponse.json({ error: "Incorrect code. Try again." }, { status: 401 });
    }

    if (role === "mentor") {
      await sql`UPDATE mentors SET otp = NULL, otp_expires_at = NULL WHERE id = ${id}`;
    } else {
      await sql`UPDATE mentees SET otp = NULL, otp_expires_at = NULL WHERE id = ${id}`;
    }

    await createSession(id, role, name);

    return NextResponse.json({ success: true, role });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as { message?: string }).message ?? "Unexpected error" }, { status: 500 });
  }
}
