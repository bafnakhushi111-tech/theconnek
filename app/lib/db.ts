import { neon } from "@neondatabase/serverless";

// Single shared Neon client for the portal (auth, dashboards, matching).
// DATABASE_URL is required - fail loudly if it is missing rather than
// silently connecting to nothing.
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set.");
}

export const sql = neon(process.env.DATABASE_URL);
