import { randomInt } from "crypto";
import { Resend } from "resend";

const FROM = "theconnek <hello@theconnek.com>";

// 6-digit numeric code. crypto.randomInt gives an unbiased draw across the
// full range (Math.random would be predictable and slightly biased).
export function generateOTP(): string {
  return String(randomInt(100000, 1000000));
}

export function otpEmail(name: string, otp: string): string {
  const firstName = (name || "there").split(" ")[0];
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
              <h1 style="margin:0;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;line-height:1.2;">Your login code</h1>
            </td></tr>
            <tr><td style="padding-bottom:28px;">
              <p style="margin:0;font-size:15px;color:#8A9CB8;line-height:1.65;">Hi ${firstName}, use the code below to sign in. It expires in 10 minutes.</p>
            </td></tr>
            <tr><td style="padding-bottom:32px;">
              <div style="background:rgba(75,111,165,0.1);border:1px solid rgba(75,111,165,0.3);border-radius:12px;padding:28px;text-align:center;">
                <span style="font-size:42px;font-weight:800;color:#ffffff;letter-spacing:14px;font-family:monospace;">${otp}</span>
              </div>
            </td></tr>
            <tr><td>
              <p style="margin:0;font-size:12px;color:#2A3A50;line-height:1.6;">If you didn&apos;t request this, you can safely ignore this email. This code will expire in 10 minutes.</p>
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

// Sends the OTP email if Resend is configured. In local dev without a key,
// it no-ops and logs the code so you can still test the flow.
export async function sendOtpEmail(to: string, name: string, otp: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[otp] RESEND_API_KEY not set - login code for ${to} is ${otp}`);
    return;
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Your theconnek login code",
    html: otpEmail(name, otp),
  });
}
