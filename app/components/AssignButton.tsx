"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { theme } from "@/app/lib/theme";

// Matching is permanent and sends the intro emails, so it takes two taps:
// one to open the confirm state, one to commit. A stray click costs nothing.
export default function AssignButton({ menteeId, menteeName }: { menteeId: number; menteeName: string }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const firstName = (menteeName || "them").split(" ")[0];

  async function handleAssign() {
    setLoading(true);
    setError("");
    try {
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
        setError(data.error ?? "Failed to match.");
        setConfirming(false);
      }
    } catch {
      setError("Something went wrong. Try again.");
      setConfirming(false);
    }
    setLoading(false);
  }

  if (done) {
    return <span className="text-xs font-bold" style={{ color: theme.success }}>Matched!</span>;
  }

  if (confirming) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xs leading-relaxed" style={{ margin: 0, color: theme.muted }}>
          This is a commitment: {firstName} becomes your mentee and we email you to set up the call.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleAssign}
            disabled={loading}
            className="flex-1 text-xs font-bold py-2 px-3 rounded-xl transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ background: theme.mentor.accent, color: "#1A1330" }}
          >
            {loading ? "Matching..." : "Yes, match us"}
          </button>
          <button
            onClick={() => { setConfirming(false); setError(""); }}
            disabled={loading}
            className="text-xs font-bold py-2 px-3 rounded-xl transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ background: "rgba(255,255,255,0.05)", color: theme.muted, border: `1px solid ${theme.border}` }}
          >
            Cancel
          </button>
        </div>
        {error && <p className="text-xs" style={{ margin: 0, color: theme.danger }}>{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={() => setConfirming(true)}
        className="w-full text-xs font-bold py-2 px-4 rounded-xl transition-opacity hover:opacity-80"
        style={{ background: theme.mentor.accent, color: "#1A1330" }}
      >
        Mentor {firstName}
      </button>
      {error && <p className="text-xs" style={{ margin: 0, color: theme.danger }}>{error}</p>}
    </div>
  );
}
