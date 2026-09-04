// Approve (or un-approve) a mentor so they can see mentee profiles.
//
//   node scripts/approve-mentor.mjs someone@example.com          approve
//   node scripts/approve-mentor.mjs someone@example.com --revoke  un-approve
//   node scripts/approve-mentor.mjs --pending                     list who's waiting
//
// Run from the connekt project root.

import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";

const lines = readFileSync(".env.local", "utf8").split("\n");
const env = {};
for (const l of lines) {
  const i = l.indexOf("=");
  if (i > 0 && !l.startsWith("#")) env[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^"|"$/g, "").replace(/\r$/, "");
}
const sql = neon(env.DATABASE_URL);

const args = process.argv.slice(2);

if (args.includes("--pending")) {
  const rows = await sql`SELECT name, email, company, role FROM mentors WHERE NOT approved ORDER BY id`;
  if (rows.length === 0) { console.log("No mentors waiting for approval."); process.exit(0); }
  console.log(`${rows.length} awaiting approval:`);
  for (const r of rows) console.log(`  ${r.email}  ${r.name || "(no name yet)"}  ${r.role || ""} ${r.company ? "at " + r.company : ""}`);
  process.exit(0);
}

const email = (args.find((a) => !a.startsWith("--")) ?? "").trim().toLowerCase();
if (!email) { console.log("Usage: node scripts/approve-mentor.mjs email@example.com [--revoke] | --pending"); process.exit(1); }

const approve = !args.includes("--revoke");
const rows = await sql`UPDATE mentors SET approved = ${approve} WHERE email = ${email} RETURNING name, email`;
if (rows.length === 0) { console.log(`No mentor found with email ${email}`); process.exit(1); }
console.log(`${approve ? "Approved" : "Revoked"}: ${rows[0].name || rows[0].email}`);
