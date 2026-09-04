"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { theme } from "@/app/lib/theme";

const ROLE_OPTIONS: Record<"mentee" | "mentor", string[]> = {
  mentee: ["Consulting", "Strategy", "Finance", "Investment Banking", "Private Equity", "Venture Capital", "Marketing", "Brand Management", "Sales & Business Development", "Operations & Supply Chain", "Human Resources", "Product Management", "General Management", "Entrepreneurship / Startups", "Data & Analytics", "Other"],
  mentor: ["Consulting", "Strategy", "Investment Banking", "Private Equity", "Venture Capital", "Corporate Finance", "Marketing", "Brand Management", "Sales & Business Development", "Operations & Supply Chain", "Human Resources", "Product Management", "General Management", "Entrepreneurship / Startups", "Data & Analytics", "Technology", "Other"],
};

const EXPERIENCE = ["0-2 years", "2-5 years", "5-10 years", "10+ years"];

// Step 4 (final) of signup: the profile itself. The account is finalized and
// a real session starts here - no further verification needed.
export default function DetailsStep({
  role,
  tempToken,
  onBack,
}: {
  role: "mentee" | "mentor";
  tempToken: string;
  onBack: () => void;
}) {
  const router = useRouter();
  const C = theme[role];
  const btnText = role === "mentor" ? "#1A1330" : "#ffffff";
  const isMentee = role === "mentee";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", institution: "", role_field: "", experience: "", location: "", linkedin: "",
  });

  function set(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/signup-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tempToken }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/${role}/dashboard`);
      } else {
        setError(data.error ?? "Sign up failed.");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
          {isMentee ? "Tell us about you" : "A bit about you"}
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: "14px", color: theme.muted }}>
          {isMentee
            ? "This is what mentors see before choosing to talk to you."
            : "This is what mentees see when they're deciding who to reach out to."}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" style={labelStyle}>Full name</label>
          <input id="name" required autoFocus value={form.name} onChange={(e) => set("name", e.target.value)}
            placeholder="Your name" style={base} onFocus={focus} onBlur={blur} />
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
        {loading ? "Creating account..." : "Create account →"}
      </button>

      <button type="button" onClick={onBack}
        style={{ background: "none", border: "none", color: C.text, fontSize: "13px", cursor: "pointer", padding: 0 }}>
        ← Back
      </button>
    </form>
  );
}
