"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { theme } from "@/app/lib/theme";

export default function LoginForm({ role }: { role: "mentee" | "mentor" }) {
  const router = useRouter();
  const C = theme[role];
  const otherRole = role === "mentee" ? "mentor" : "mentee";
  const btnText = role === "mentor" ? "#1A1330" : "#ffffff";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/${role}/dashboard`);
      } else {
        setError(data.error ?? "Login failed.");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
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

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-6">
      <div>
        <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>Welcome back</h1>
        <p style={{ margin: "8px 0 0", fontSize: "14px", color: theme.muted }}>Sign in to your {role} account</p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" style={{ fontSize: "13px", fontWeight: 500, color: theme.muted }}>Email</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com" style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = C.accent)}
            onBlur={(e) => (e.target.style.borderColor = theme.border)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" style={{ fontSize: "13px", fontWeight: 500, color: theme.muted }}>Password</label>
            <Link href={`/${role}/forgot-password`} style={{ fontSize: "13px", color: theme.faint }}>
              Forgot password?
            </Link>
          </div>
          <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password" style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = C.accent)}
            onBlur={(e) => (e.target.style.borderColor = theme.border)} />
        </div>
      </div>

      {error && <p style={{ margin: 0, fontSize: "13px", color: theme.danger }}>{error}</p>}

      <button type="submit" disabled={loading}
        className="w-full font-bold py-3 rounded-2xl transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ background: C.accent, color: btnText, fontSize: "15px" }}>
        {loading ? "Signing in..." : "Sign in →"}
      </button>

      <div className="flex flex-col gap-2 text-center">
        <p style={{ margin: 0, fontSize: "13px", color: theme.muted }}>
          New here? <Link href={`/${role}/signup`} style={{ color: C.text, fontWeight: 600 }}>Create an account</Link>
        </p>
        <p style={{ margin: 0, fontSize: "13px", color: theme.faint }}>
          Are you a {otherRole}? <Link href={`/${otherRole}/login`} style={{ color: C.text }}>Sign in here</Link>
        </p>
      </div>
    </form>
  );
}
