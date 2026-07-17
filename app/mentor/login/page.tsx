"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ACCENT = "#A897E8";
const ACCENT_SOFT = "rgba(168,151,232,0.12)";
const BORDER = "#1a2a45";

export default function MentorLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [tempToken, setTempToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role: "mentor" }),
    });
    const data = await res.json();
    if (res.ok) {
      setTempToken(data.tempToken);
      setStep(2);
    } else {
      setError(data.error ?? "Login failed.");
    }
    setLoading(false);
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const code = otp.join("");
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp: code, tempToken }),
    });
    const data = await res.json();
    if (res.ok) {
      router.push("/mentor/dashboard");
    } else {
      setError(data.error ?? "Verification failed.");
    }
    setLoading(false);
  }

  function handleOTPInput(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  }

  function handleOTPKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleOTPPaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) {
      const digits = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
      setOtp(digits);
      otpRefs.current[Math.min(pasted.length, 5)]?.focus();
      e.preventDefault();
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.03)",
    border: `1px solid ${BORDER}`,
    borderRadius: "12px",
    padding: "13px 16px",
    color: "#D5DEEC",
    fontSize: "15px",
    outline: "none",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#0F1219" }}
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <Link href="/" className="block mb-8">
          <span style={{ fontSize: "17px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
            theconnek
          </span>
        </Link>

        {step === 1 ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div>
              <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
                Welcome back
              </h1>
              <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#8A99B2" }}>
                Sign in to your mentor account
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" style={{ fontSize: "13px", fontWeight: 500, color: "#8A99B2" }}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = ACCENT)}
                  onBlur={(e) => (e.target.style.borderColor = BORDER)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" style={{ fontSize: "13px", fontWeight: 500, color: "#8A99B2" }}>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = ACCENT)}
                  onBlur={(e) => (e.target.style.borderColor = BORDER)}
                />
              </div>
            </div>

            {error && (
              <p style={{ margin: 0, fontSize: "13px", color: "#f87171" }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full font-bold py-3 rounded-2xl transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: ACCENT, color: "#fff", fontSize: "15px" }}
            >
              {loading ? "Sending code..." : "Continue →"}
            </button>

            <p style={{ textAlign: "center", fontSize: "13px", color: "#5A6B85" }}>
              Looking to grow?{" "}
              <Link href="/mentee/login" style={{ color: "#C9BFEF" }}>
                Mentee sign in
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="flex flex-col gap-6">
            <div>
              <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
                Check your email
              </h1>
              <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#8A99B2" }}>
                We sent a 6-digit code to{" "}
                <span style={{ color: "#D5DEEC" }}>{email}</span>
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label style={{ fontSize: "13px", fontWeight: 500, color: "#8A99B2" }}>
                Verification code
              </label>
              <div className="flex gap-2" onPaste={handleOTPPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOTPInput(i, e.target.value)}
                    onKeyDown={(e) => handleOTPKeyDown(i, e)}
                    style={{
                      flex: 1,
                      height: "52px",
                      textAlign: "center",
                      fontSize: "22px",
                      fontWeight: 700,
                      color: "#fff",
                      background: digit ? ACCENT_SOFT : "rgba(255,255,255,0.03)",
                      border: `1px solid ${digit ? ACCENT : BORDER}`,
                      borderRadius: "10px",
                      outline: "none",
                    }}
                  />
                ))}
              </div>
            </div>

            {error && (
              <p style={{ margin: 0, fontSize: "13px", color: "#f87171" }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || otp.join("").length < 6}
              className="w-full font-bold py-3 rounded-2xl transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: ACCENT, color: "#fff", fontSize: "15px" }}
            >
              {loading ? "Verifying..." : "Verify code →"}
            </button>

            <button
              type="button"
              onClick={() => { setStep(1); setOtp(["", "", "", "", "", ""]); setError(""); }}
              style={{ background: "none", border: "none", color: "#C9BFEF", fontSize: "13px", cursor: "pointer", padding: 0 }}
            >
              ← Back to login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
