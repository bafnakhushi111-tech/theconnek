"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie_consent")) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem("cookie_consent", "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 text-sm"
      style={{ background: "#0D1628", border: "1px solid #1a2a45", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
    >
      <p style={{ color: "#6B7FA3" }} className="flex-1 text-xs leading-relaxed">
        We use cookies for analytics to improve your experience.{" "}
        <Link href="/privacy" className="underline" style={{ color: "#4B6FA5" }}>Privacy policy</Link>.
      </p>
      <button
        onClick={accept}
        className="shrink-0 text-xs font-bold px-4 py-2 rounded-xl text-white"
        style={{ background: "#4B6FA5" }}
      >
        Got it
      </button>
    </div>
  );
}
