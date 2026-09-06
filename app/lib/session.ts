import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";

// A real secret is REQUIRED. No hardcoded fallback - a predictable secret
// would let anyone forge a session cookie and impersonate any user.
function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET is not set (or is shorter than 32 chars). Set a strong random value in the environment."
    );
  }
  return new TextEncoder().encode(secret);
}

export const SESSION_COOKIE = "connek_session";

export async function encrypt(payload: JWTPayload, expiresIn: string = "7d") {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecret());
}

export async function decrypt(token: string | undefined): Promise<JWTPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    return payload;
  } catch {
    return null;
  }
}

export async function createSession(id: string, role: string, name: string) {
  // 12-hour token, and no maxAge on the cookie: a browser-session cookie dies
  // when the browser closes, so every new session asks for email and password
  // again (Khushi's call, 2026-09-06). The JWT expiry is the backstop for
  // browsers that are never closed.
  const token = await encrypt({ sub: id, role, name }, "12h");
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<JWTPayload | null> {
  const store = await cookies();
  return decrypt(store.get(SESSION_COOKIE)?.value);
}
