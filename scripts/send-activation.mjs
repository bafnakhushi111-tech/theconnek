// Sends the "your account is ready" email to everyone still on the waitlist
// (rows with no password set). SAFE BY DEFAULT: running it plain is a dry run
// that only prints who WOULD get mail. Nothing is sent without --send.
//
//   node scripts/send-activation.mjs                  dry run (prints recipients)
//   node scripts/send-activation.mjs --test you@x.com sends ONE sample to that address
//   node scripts/send-activation.mjs --send           sends to all unactivated users
//   node scripts/send-activation.mjs --send --only mentees   (or mentors)
//
// Run from the connekt project root so node_modules and .env.local resolve.

import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";
import { readFileSync } from "fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^"|"$/g, "")])
);

const sql = neon(env.DATABASE_URL);
const FROM = "theconnek <hello@theconnek.com>";
const SITE = "https://www.theconnek.com";

const args = process.argv.slice(2);
const SEND = args.includes("--send");
const TEST = args.includes("--test") ? args[args.indexOf("--test") + 1] : null;
const ONLY = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;

function activationEmail(name, role) {
  const firstName = (name || "there").split(" ")[0];
  const path = role === "mentor" ? "/mentor/signup" : "/mentee/signup";
  const inside =
    role === "mentor"
      ? "Inside you'll find your mentor dashboard: the mentees waiting for a match, and the practice questions they are working through."
      : "Inside you'll find 600+ guesstimates and cases across Strategy, Product, Finance, Marketing, Operations and HR, plus your mentor match status.";
  return `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#08090E;font-family:'Plus Jakarta Sans',-apple-system,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#08090E;padding:48px 16px;">
        <tr><td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">
            <tr><td style="padding-bottom:32px;">
              <p style="margin:0;font-size:17px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">theconnek</p>
            </td></tr>
            <tr><td style="padding-bottom:12px;">
              <h1 style="margin:0;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;line-height:1.2;">Your account is ready</h1>
            </td></tr>
            <tr><td style="padding-bottom:24px;">
              <p style="margin:0;font-size:15px;color:#8A9CB8;line-height:1.65;">Hi ${firstName}, you joined the theconnek waitlist and your account is now live. Activating it takes under a minute:</p>
            </td></tr>
            <tr><td style="padding-bottom:24px;">
              <table cellpadding="0" cellspacing="0" style="width:100%;">
                <tr><td style="padding-bottom:10px;"><p style="margin:0;font-size:15px;color:#C9D6E8;line-height:1.6;"><strong style="color:#ffffff;">1.</strong> Open the activation page below</p></td></tr>
                <tr><td style="padding-bottom:10px;"><p style="margin:0;font-size:15px;color:#C9D6E8;line-height:1.6;"><strong style="color:#ffffff;">2.</strong> Enter this same email address</p></td></tr>
                <tr><td><p style="margin:0;font-size:15px;color:#C9D6E8;line-height:1.6;"><strong style="color:#ffffff;">3.</strong> Type the 6-digit code we send you, and choose a password</p></td></tr>
              </table>
            </td></tr>
            <tr><td style="padding-bottom:28px;">
              <a href="${SITE}${path}" style="display:inline-block;background:${role === "mentor" ? "#A897E8" : "#4B6FA5"};color:${role === "mentor" ? "#1A1330" : "#ffffff"};font-size:15px;font-weight:700;padding:14px 28px;border-radius:14px;text-decoration:none;">Activate my account</a>
            </td></tr>
            <tr><td style="padding-bottom:28px;">
              <p style="margin:0;font-size:14px;color:#8A9CB8;line-height:1.65;">${inside}</p>
            </td></tr>
            <tr><td>
              <p style="margin:0;font-size:12px;color:#2A3A50;line-height:1.6;">If the button doesn't work, go to ${SITE}${path} in your browser.</p>
            </td></tr>
            <tr><td style="padding-top:32px;">
              <p style="margin:0;font-size:12px;color:#1E293B;">theconnek &middot; Built in India</p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;
}

const SUBJECT = "Your theconnek account is ready";

async function recipients() {
  const out = [];
  if (ONLY !== "mentors") {
    const rows = await sql`
      SELECT name, email FROM mentees
      WHERE password_hash IS NULL AND email IS NOT NULL AND email <> ''
      ORDER BY id
    `;
    out.push(...rows.map((r) => ({ ...r, role: "mentee" })));
  }
  if (ONLY !== "mentees") {
    const rows = await sql`
      SELECT name, email FROM mentors
      WHERE password_hash IS NULL AND email IS NOT NULL AND email <> ''
      ORDER BY id
    `;
    out.push(...rows.map((r) => ({ ...r, role: "mentor" })));
  }
  return out;
}

const list = await recipients();

if (TEST) {
  const resend = new Resend(env.RESEND_API_KEY);
  await resend.emails.send({ from: FROM, to: TEST, subject: `[TEST] ${SUBJECT}`, html: activationEmail("Khushi", "mentee") });
  console.log(`Sent ONE test email (mentee variant) to ${TEST}. Nothing else sent.`);
  process.exit(0);
}

if (!SEND) {
  console.log(`DRY RUN. ${list.length} people would get "${SUBJECT}":`);
  for (const r of list) console.log(`  ${r.role.padEnd(6)}  ${r.email}  (${r.name || "no name"})`);
  console.log(`\nNothing was sent. Re-run with --send to send for real, or --test your@email.com for a sample.`);
  process.exit(0);
}

const resend = new Resend(env.RESEND_API_KEY);
let sent = 0, failed = 0;
for (const r of list) {
  try {
    await resend.emails.send({ from: FROM, to: r.email, subject: SUBJECT, html: activationEmail(r.name, r.role) });
    sent++;
    console.log(`sent  ${r.role}  ${r.email}`);
  } catch (e) {
    failed++;
    console.log(`FAIL  ${r.role}  ${r.email}  ${e?.message ?? e}`);
  }
  // Stay under Resend's request rate.
  await new Promise((res) => setTimeout(res, 600));
}
console.log(`\nDone: ${sent} sent, ${failed} failed, of ${list.length}.`);
