import { NextRequest, NextResponse } from "next/server";
import { encrypt } from "@/app/lib/session";

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production." }, { status: 403 });
  }

  const role = new URL(req.url).searchParams.get("role") === "mentor" ? "mentor" : "mentee";
  const token = await encrypt({ sub: "1", role, name: "Khushi Bafna" });

  const res = NextResponse.redirect(new URL(`/${role}/dashboard`, req.url));
  res.cookies.set("connek_session", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
