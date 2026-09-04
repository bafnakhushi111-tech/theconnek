import Link from "next/link";
import { theme } from "@/app/lib/theme";
import Logo from "@/app/components/Logo";

const COPY: Record<"mentee" | "mentor", { headline: string; sub: string; points: string[] }> = {
  mentee: {
    headline: "Real conversations. That's it.",
    sub: "No cold DMs, no gatekeeping, no algorithm deciding who you get to talk to.",
    points: [
      "Matched by hand, not by an algorithm",
      "Case prep and guesstimate partners",
      "Honest conversations with people who've been there",
    ],
  },
  mentor: {
    headline: "Give the advice you wish you'd gotten.",
    sub: "One 30-minute conversation with someone who actually wants to listen, not extract a referral.",
    points: [
      "No cold outreach, no LinkedIn strategy",
      "You choose who you talk to",
      "Contact details stay private, always",
    ],
  },
};

export default function AuthShell({ role, children }: { role: "mentee" | "mentor"; children: React.ReactNode }) {
  const C = theme[role];
  const copy = COPY[role];

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2" style={{ background: theme.bg }}>
      {/* Branding panel - hidden on small screens to keep mobile to just the form */}
      <div
        className="hidden lg:flex flex-col justify-between px-12 py-12 relative overflow-hidden"
        style={{
          background: `radial-gradient(120% 100% at 0% 0%, ${C.soft} 0%, transparent 60%), ${theme.bg}`,
          borderRight: `1px solid ${theme.border}`,
        }}
      >
        <Link href="/"><Logo variant="dark" size="md" /></Link>

        <div style={{ maxWidth: 420 }}>
          <h2 style={{ margin: 0, fontSize: "34px", fontWeight: 800, color: theme.heading, letterSpacing: "-0.5px", lineHeight: 1.15 }}>
            {copy.headline}
          </h2>
          <p style={{ margin: "16px 0 28px", fontSize: "15px", color: theme.muted, lineHeight: 1.6 }}>{copy.sub}</p>
          <ul className="flex flex-col gap-3">
            {copy.points.map((p) => (
              <li key={p} className="flex items-start gap-2.5">
                <span style={{ marginTop: "3px", width: 6, height: 6, borderRadius: "50%", background: C.accent, flexShrink: 0 }} />
                <span style={{ fontSize: "14px", color: theme.body, lineHeight: 1.5 }}>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <p style={{ margin: 0, fontSize: "12px", color: theme.faint }}>theconnek &middot; Built in India</p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col items-center justify-center px-4 sm:px-6 py-12">
        <div style={{ width: "100%", maxWidth: "420px" }}>
          <Link href="/" className="lg:hidden block mb-8">
            <Logo variant="dark" size="sm" />
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
