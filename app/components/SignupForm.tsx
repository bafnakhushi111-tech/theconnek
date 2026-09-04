"use client";

import { useState } from "react";
import Link from "next/link";
import { theme } from "@/app/lib/theme";
import OtpStep from "@/app/components/OtpStep";
import PasswordStep from "@/app/components/PasswordStep";
import DetailsStep from "@/app/components/DetailsStep";

type Step = "email" | "otp" | "password" | "details";
const STEPS: Step[] = ["email", "otp", "password", "details"];

function StepDots({ current, accent }: { current: Step; accent: string }) {
  const i = STEPS.indexOf(current);
  return (
    <div className="flex items-center gap-1.5 mb-6">
      {STEPS.map((s, idx) => (
        <div key={s} style={{
          height: 3, borderRadius: 99, flex: 1,
          background: idx <= i ? accent : theme.border,
          transition: "background 0.2s",
        }} />
      ))}
    </div>
  );
}

export default function SignupForm({ role }: { role: "mentee" | "mentor" }) {
  const C = theme[role];
  const otherRole = role === "mentee" ? "mentor" : "mentee";
  const btnText = role === "mentor" ? "#1A1330" : "#ffffff";

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, email }),
      });
      const data = await res.json();
      if (res.ok) {
        setTempToken(data.tempToken);
        setStep("otp");
      } else {
        setError(data.error ?? "Sign up failed.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    }
    setLoading(false);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.03)",
    border: `1px solid ${theme.border}`,
    borderRadius: "12px",
    padding: "13px 16px",
    color: theme.body,
    fontSize: "15px",
    outline: "none",
  };

  if (step === "otp") {
    return (
      <>
        <StepDots current={step} accent={C.accent} />
        <OtpStep role={role} email={email} tempToken={tempToken}
          onVerified={(next) => { setTempToken(next); setStep("password"); }}
          onBack={() => setStep("email")} />
      </>
    );
  }

  if (step === "password") {
    return (
      <>
        <StepDots current={step} accent={C.accent} />
        <PasswordStep role={role} tempToken={tempToken}
          onDone={(next) => { setTempToken(next); setStep("details"); }}
          onBack={() => setStep("otp")} />
      </>
    );
  }

  if (step === "details") {
    return (
      <>
        <StepDots current={step} accent={C.accent} />
        <DetailsStep role={role} tempToken={tempToken} onBack={() => setStep("password")} />
      </>
    );
  }

  return (
    <>
      <StepDots current={step} accent={C.accent} />
      <form onSubmit={handleEmailSubmit} className="flex flex-col gap-6">
        <div>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
            {role === "mentee" ? "Create your account" : "Join as a mentor"}
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: "14px", color: theme.muted }}>
            {role === "mentee"
              ? "Find someone who's been where you're going."
              : "A 30-minute conversation can change someone's direction."}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" style={{ fontSize: "13px", fontWeight: 500, color: theme.muted }}>Email</label>
          <input id="email" type="email" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com" style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = C.accent)}
            onBlur={(e) => (e.target.style.borderColor = theme.border)} />
        </div>

        {error && <p style={{ margin: 0, fontSize: "13px", color: theme.danger }}>{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full font-bold py-3 rounded-2xl transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: C.accent, color: btnText, fontSize: "15px" }}>
          {loading ? "Sending code..." : "Continue →"}
        </button>

        <div className="flex flex-col gap-2 text-center">
          <p style={{ margin: 0, fontSize: "13px", color: theme.muted }}>
            Already have an account? <Link href={`/${role}/login`} style={{ color: C.text, fontWeight: 600 }}>Sign in</Link>
          </p>
          <p style={{ margin: 0, fontSize: "13px", color: theme.faint }}>
            {role === "mentee" ? "Want to mentor instead?" : "Looking for a mentor?"}{" "}
            <Link href={`/${otherRole}/signup`} style={{ color: C.text }}>Sign up as a {otherRole}</Link>
          </p>
        </div>
      </form>
    </>
  );
}
