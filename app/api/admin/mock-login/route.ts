import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/app/lib/db";
import { encrypt, SESSION_COOKIE } from "@/app/lib/session";

// LOCAL DEV ONLY. Logs you in as a real user of the chosen role (skips the
// email + OTP round-trip) so the dashboards can be tested with real data.
// Hard-disabled in production.
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production." }, { status: 403 });
  }

  const params = new URL(req.url).searchParams;
  const role = params.get("role") === "mentor" ? "mentor" : "mentee";
  const idParam = params.get("id");

  type Row = { id: number; name: string };
  let user: Row | undefined;

  if (idParam) {
    const rows = (role === "mentor"
      ? await sql`SELECT id, name FROM mentors WHERE id = ${idParam} LIMIT 1`
      : await sql`SELECT id, name FROM mentees WHERE id = ${idParam} LIMIT 1`) as Row[];
    user = rows[0];
  } else {
    const rows = (role === "mentor"
      ? await sql`SELECT id, name FROM mentors ORDER BY id LIMIT 1`
      : await sql`SELECT id, name FROM mentees ORDER BY id LIMIT 1`) as Row[];
    user = rows[0];
  }

  if (!user) {
    return NextResponse.json({ error: `No ${role} found to log in as.` }, { status: 404 });
  }

  const token = await encrypt({ sub: String(user.id), role, name: user.name });
  // ?next=/practice lets the practice pages be checked as a signed-in user of
  // either role. Relative paths only, so this cannot be used as an open redirect.
  const nextParam = params.get("next");
  const dest = nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")
    ? nextParam
    : `/${role}/dashboard`;

  const res = NextResponse.redirect(new URL(dest, req.nextUrl.origin));
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
