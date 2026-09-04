"use client";

import { useState, useRef } from "react";
import { theme } from "@/app/lib/theme";

// Step 2 of signup: enter the 6-digit code emailed in step 1. On success,
// hands the caller a new tempToken for the password step - it does not
// create a session or navigate anywhere itself.
export default function OtpStep({
  role,
  email,
  tempToken,
  onVerified,
  onBack,
}: {
  role: "mentee" | "mentor";
  email: string;
  tempToken: string;
  onVerified: (nextTempToken: string) => void;
  onBack: () => void;
}) {
  const C = theme[role];
  const btnText = role === "mentor" ? "#1A1330" : "#ffffff";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: otp.join(""), tempToken }),
      });
      const data = await res.json();
      if (res.ok) {
        onVerified(data.tempToken);
      } else {
        setError(data.error ?? "Verification failed.");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  function handleInput(i: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[i] = digit;
    setOtp(next);
    if (digit && i < 5) refs.current[i + 1]?.focus();
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  }

  function handlePaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) {
      setOtp(pasted.split("").concat(Array(6).fill("")).slice(0, 6));
      refs.current[Math.min(pasted.length, 5)]?.focus();
      e.preventDefault();
    }
  }

  return (
    <form onSubmit={handleVerify} className="flex flex-col gap-6">
      <div>
        <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>Check your email</h1>
        <p style={{ margin: "8px 0 0", fontSize: "14px", color: theme.muted }}>
          We sent a 6-digit code to <span style={{ color: theme.body }}>{email}</span>
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label style={{ fontSize: "13px", fontWeight: 500, color: theme.muted }}>Verification code</label>
        <div className="flex gap-2" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input key={i} ref={(el) => { refs.current[i] = el; }} type="text" inputMode="numeric" maxLength={1}
              value={digit} onChange={(e) => handleInput(i, e.target.value)} onKeyDown={(e) => handleKeyDown(i, e)}
              style={{
                flex: 1, height: "52px", textAlign: "center", fontSize: "22px", fontWeight: 700, color: "#fff",
                background: digit ? C.soft : "rgba(255,255,255,0.03)",
                border: `1px solid ${digit ? C.accent : theme.border}`, borderRadius: "10px", outline: "none",
              }} />
          ))}
        </div>
      </div>

      {error && <p style={{ margin: 0, fontSize: "13px", color: theme.danger }}>{error}</p>}

      <button type="submit" disabled={loading || otp.join("").length < 6}
        className="w-full font-bold py-3 rounded-2xl transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ background: C.accent, color: btnText, fontSize: "15px" }}>
        {loading ? "Verifying..." : "Verify code →"}
      </button>

      <button type="button" onClick={onBack}
        style={{ background: "none", border: "none", color: C.text, fontSize: "13px", cursor: "pointer", padding: 0 }}>
        ← Back
      </button>
    </form>
  );
}
