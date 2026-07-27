"use client";

import { useState } from "react";
import Link from "next/link";
import { theme } from "@/app/lib/theme";
import OtpStep from "@/app/components/OtpStep";

const ROLE_OPTIONS: Record<"mentee" | "mentor", string[]> = {
  mentee: ["Consulting", "Strategy", "Finance", "Investment Banking", "Private Equity", "Venture Capital", "Marketing", "Brand Management", "Sales & Business Development", "Operations & Supply Chain", "Human Resources", "Product Management", "General Management", "Entrepreneurship / Startups", "Data & Analytics", "Other"],
  mentor: ["Consulting", "Strategy", "Investment Banking", "Private Equity", "Venture Capital", "Corporate Finance", "Marketing", "Brand Management", "Sales & Business Development", "Operations & Supply Chain", "Human Resources", "Product Management", "General Management", "Entrepreneurship / Startups", "Data & Analytics", "Technology", "Other"],
};

const EXPERIENCE = ["0-2 years", "2-5 years", "5-10 years", "10+ years"];

export default function SignupForm({ role }: { role: "mentee" | "mentor" }) {
  const C = theme[role];
  const otherRole = role === "mentee" ? "mentor" : "mentee";
  const btnText = role === "mentor" ? "#1A1330" : "#ffffff";
  const isMentee = role === "mentee";

  const [step, setStep] = useState<1 | 2>(1);
  const [tempToken, setTempToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", password: "", institution: "", role_field: "", experience: "", location: "", linkedin: "",
  });

  function set(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, ...form }),
      });
      const data = await res.json();
      if (res.ok) {
        setTempToken(data.tempToken);
        setStep(2);
      } else {
        setError(data.error ?? "Sign up failed.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    }
    setLoading(false);
  }

  const base: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.03)",
    border: `1px solid ${theme.border}`,
    borderRadius: "12px",
    padding: "12px 14px",
    color: theme.body,
    fontSize: "15px",
    outline: "none",
  };
  const focus = (e: React.FocusEvent<HTMLElement>) => (e.target.style.borderColor = C.accent);
  const blur = (e: React.FocusEvent<HTMLElement>) => (e.target.style.borderColor = theme.border);
  const labelStyle: React.CSSProperties = { fontSize: "13px", fontWeight: 500, color: theme.muted };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: theme.bg }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <Link href="/" className="block mb-8">
          <span style={{ fontSize: "17px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>theconnek</span>
        </Link>

        {step === 1 ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
                {isMentee ? "Create your account" : "Join as a mentor"}
              </h1>
              <p style={{ margin: "8px 0 0", fontSize: "14px", color: theme.muted }}>
                {isMentee
                  ? "Find someone who's been where you're going."
                  : "A 30-minute conversation can change someone's direction."}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" style={labelStyle}>Full name</label>
                <input id="name" required value={form.name} onChange={(e) => set("name", e.target.value)}
                  placeholder="Your name" style={base} onFocus={focus} onBlur={blur} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" style={labelStyle}>Email</label>
                <input id="email" type="email" required value={form.email} onChange={(e) => set("email", e.target.value)}
                  placeholder="you@example.com" style={base} onFocus={focus} onBlur={blur} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" style={labelStyle}>Password</label>
                <input id="password" type="password" required minLength={8} value={form.password}
                  onChange={(e) => set("password", e.target.value)} placeholder="At least 8 characters"
                  style={base} onFocus={focus} onBlur={blur} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="institution" style={labelStyle}>{isMentee ? "College / University" : "Company"}</label>
                <input id="institution" required value={form.institution} onChange={(e) => set("institution", e.target.value)}
                  placeholder={isMentee ? "e.g. IIM Bangalore" : "e.g. McKinsey, your startup"}
                  style={base} onFocus={focus} onBlur={blur} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="role_field" style={labelStyle}>{isMentee ? "Target role" : "Field / Position"}</label>
                <select id="role_field" required value={form.role_field} onChange={(e) => set("role_field", e.target.value)}
                  style={{ ...base, appearance: "none", cursor: "pointer", color: form.role_field ? theme.body : theme.faint }}
                  onFocus={focus} onBlur={blur}>
                  <option value="" disabled style={{ color: "#000" }}>Select one</option>
                  {ROLE_OPTIONS[role].map((r) => <option key={r} value={r} style={{ color: "#000" }}>{r}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="experience" style={labelStyle}>Experience</label>
                <select id="experience" value={form.experience} onChange={(e) => set("experience", e.target.value)}
                  style={{ ...base, appearance: "none", cursor: "pointer", color: form.experience ? theme.body : theme.faint }}
                  onFocus={focus} onBlur={blur}>
                  <option value="" style={{ color: "#000" }}>Prefer not to say</option>
                  {EXPERIENCE.map((x) => <option key={x} value={x} style={{ color: "#000" }}>{x}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="location" style={labelStyle}>Location <span style={{ color: theme.faint }}>(optional)</span></label>
                <input id="location" value={form.location} onChange={(e) => set("location", e.target.value)}
                  placeholder="e.g. Mumbai" style={base} onFocus={focus} onBlur={blur} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="linkedin" style={labelStyle}>LinkedIn <span style={{ color: theme.faint }}>(optional)</span></label>
                <input id="linkedin" value={form.linkedin} onChange={(e) => set("linkedin", e.target.value)}
                  placeholder="linkedin.com/in/yourname" style={base} onFocus={focus} onBlur={blur} />
              </div>
            </div>

            {error && <p style={{ margin: 0, fontSize: "13px", color: theme.danger }}>{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full font-bold py-3 rounded-2xl transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: C.accent, color: btnText, fontSize: "15px" }}>
              {loading ? "Sending code..." : "Create account →"}
            </button>

            <div className="flex flex-col gap-2 text-center">
              <p style={{ margin: 0, fontSize: "13px", color: theme.muted }}>
                Already have an account? <Link href={`/${role}/login`} style={{ color: C.text, fontWeight: 600 }}>Sign in</Link>
              </p>
              <p style={{ margin: 0, fontSize: "13px", color: theme.faint }}>
                {isMentee ? "Want to mentor instead?" : "Looking for a mentor?"}{" "}
                <Link href={`/${otherRole}/signup`} style={{ color: C.text }}>Sign up as a {otherRole}</Link>
              </p>
            </div>
          </form>
        ) : (
          <OtpStep role={role} email={form.email} tempToken={tempToken} onBack={() => { setStep(1); setError(""); }} />
        )}
      </div>
    </div>
  );
}
