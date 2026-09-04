"use client";

import { useState } from "react";
import { theme } from "@/app/lib/theme";

// Step 3 of signup: set a password now that the email is verified.
export default function PasswordStep({
  role,
  tempToken,
  onDone,
  onBack,
}: {
  role: "mentee" | "mentor";
  tempToken: string;
  onDone: (result: { done?: boolean; tempToken?: string }) => void;
  onBack: () => void;
}) {
  const C = theme[role];
  const btnText = role === "mentor" ? "#1A1330" : "#ffffff";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.03)",
    border: `1px solid ${theme.border}`,
    borderRadius: "12px",
    padding: "13px 16px",
    color: theme.body,
    fontSize: "16px",
    outline: "none",
  };
  const focus = (e: React.FocusEvent<HTMLElement>) => (e.target.style.borderColor = C.accent);
  const blur = (e: React.FocusEvent<HTMLElement>) => (e.target.style.borderColor = theme.border);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, tempToken }),
      });
      const data = await res.json();
      if (res.ok) {
        onDone(data);
      } else {
        setError(data.error ?? "Something went wrong.");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>Set a password</h1>
        <p style={{ margin: "8px 0 0", fontSize: "15px", color: theme.muted }}>You&apos;ll use this to sign in next time.</p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" style={{ fontSize: "14px", fontWeight: 500, color: theme.muted }}>Password</label>
          <input id="password" type="password" required autoFocus minLength={8} value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters"
            style={inputStyle} onFocus={focus} onBlur={blur} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirm" style={{ fontSize: "14px", fontWeight: 500, color: theme.muted }}>Confirm password</label>
          <input id="confirm" type="password" required minLength={8} value={confirm}
            onChange={(e) => setConfirm(e.target.value)} placeholder="Type it again"
            style={inputStyle} onFocus={focus} onBlur={blur} />
        </div>
      </div>

      {error && <p style={{ margin: 0, fontSize: "14px", color: theme.danger }}>{error}</p>}

      <button type="submit" disabled={loading}
        className="w-full font-bold py-3 rounded-2xl transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ background: C.accent, color: btnText, fontSize: "16px" }}>
        {loading ? "Saving..." : "Continue →"}
      </button>

      <button type="button" onClick={onBack}
        style={{ background: "none", border: "none", color: C.text, fontSize: "14px", cursor: "pointer", padding: 0 }}>
        ← Back
      </button>
    </form>
  );
}
