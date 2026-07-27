import { NextRequest } from "next/server";

// In-memory sliding-window limiter. Per serverless instance, so it is a
// best-effort brake on brute force / spam, not a hard global guarantee -
// good enough to make OTP guessing and password stuffing impractical.
const buckets = new Map<string, number[]>();

export function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/**
 * Returns true if the caller has EXCEEDED `limit` hits within `windowMs`.
 * `key` should scope the limit (e.g. `login:1.2.3.4`).
 */
export function rateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (buckets.get(key) || []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    buckets.set(key, recent);
    return true;
  }
  recent.push(now);
  buckets.set(key, recent);
  if (buckets.size > 5000) buckets.clear();
  return false;
}
