"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AssignButton({ menteeId }: { menteeId: number }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleAssign() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/mentor/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menteeId }),
    });
    const data = await res.json();
    if (res.ok) {
      setDone(true);
      router.refresh();
    } else {
      setError(data.error ?? "Failed to assign.");
    }
    setLoading(false);
  }

  if (done) {
    return <span className="text-xs font-bold" style={{ color: "#4ade80" }}>Matched!</span>;
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleAssign}
        disabled={loading}
        className="w-full text-xs font-bold py-2 px-4 rounded-xl transition-opacity hover:opacity-80 disabled:opacity-50"
        style={{ background: "#4B6FA5", color: "#fff" }}
      >
        {loading ? "Matching..." : "Choose this mentee"}
      </button>
      {error && <p className="text-xs" style={{ color: "#f87171" }}>{error}</p>}
    </div>
  );
}
