"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { theme } from "@/app/lib/theme";

export default function LogoutButton({ role }: { role: "mentee" | "mentor" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push(`/${role}/login`);
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="text-xs font-medium px-4 py-2 rounded-full transition-opacity hover:opacity-80"
      style={{ border: `1px solid ${theme.border}`, color: theme.muted }}
    >
      {loading ? "..." : "Sign out"}
    </button>
  );
}
