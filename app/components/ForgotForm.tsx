"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { theme } from "@/app/lib/theme";

// Two steps on one page: ask for the email, then the code from that email
// plus the new password. Mirrors LoginForm's styling so the auth pages feel
// like one family.
export default function ForgotForm({ role }: { role: "mentee" | "mentor" }) {
  const router = useRouter();
  const C = theme[role];
  const btnText = role === "mentor" ? "#1A1330" : "#ffffff";

  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      const data = await res.json();
      if (res.ok) {
        setTempToken(data.tempToken);
        setStep("reset");
      } else {
        setError(data.error ?? "Something went wrong. Try again.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    }
    setLoading(false);
  }

  async function resetPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, password, tempToken }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/${role}/dashboard`);
        return;
      }
      setError(data.error ?? "Something went wrong. Try again.");
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
  const focus = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = C.accent);
  const blur = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = theme.border);

  if (step === "email") {
    return (
      <form onSubmit={requestCode} className="flex flex-col gap-6">
        <div>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
            Reset your password
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: "14px", color: theme.muted }}>
            Enter your email and we&apos;ll send you a 6-digit code.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" style={{ fontSize: "13px", fontWeight: 500, color: theme.muted }}>Email</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com" style={inputStyle} onFocus={focus} onBlur={blur} />
        </div>

        {error && <p style={{ margin: 0, fontSize: "13px", color: theme.danger }}>{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full font-bold py-3 rounded-2xl transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: C.accent, color: btnText, fontSize: "15px" }}>
          {loading ? "Sending..." : "Send code →"}
        </button>

        <p style={{ margin: 0, fontSize: "13px", color: theme.muted, textAlign: "center" }}>
          Remembered it? <Link href={`/${role}/login`} style={{ color: C.text, fontWeight: 600 }}>Back to sign in</Link>
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={resetPassword} className="flex flex-col gap-6">
      <div>
        <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
          Check your inbox
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: "14px", color: theme.muted }}>
          If an account exists for {email}, a code is on its way. Enter it below with your new password.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="otp" style={{ fontSize: "13px", fontWeight: 500, color: theme.muted }}>6-digit code</label>
          <input id="otp" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="000000" style={{ ...inputStyle, letterSpacing: "6px", fontFamily: "monospace" }}
            onFocus={focus} onBlur={blur} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" style={{ fontSize: "13px", fontWeight: 500, color: theme.muted }}>New password</label>
          <input id="password" type="password" required minLength={8} value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters" style={inputStyle} onFocus={focus} onBlur={blur} />
        </div>
      </div>

      {error && <p style={{ margin: 0, fontSize: "13px", color: theme.danger }}>{error}</p>}

      <button type="submit" disabled={loading}
        className="w-full font-bold py-3 rounded-2xl transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ background: C.accent, color: btnText, fontSize: "15px" }}>
        {loading ? "Resetting..." : "Set new password →"}
      </button>

      <p style={{ margin: 0, fontSize: "13px", color: theme.muted, textAlign: "center" }}>
        Wrong email?{" "}
        <button type="button" onClick={() => { setStep("email"); setOtp(""); setError(""); }}
          style={{ color: C.text, fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: "13px" }}>
          Start again
        </button>
      </p>
    </form>
  );
}
