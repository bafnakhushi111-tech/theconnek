"use client";

import { useEffect, useRef, useState } from "react";

const FIELDS = [
  { key: "assumptions", label: "ASSUMPTIONS", rows: 4, placeholder: "State every number you invent. A stated wrong number scores better than a silent right one." },
  { key: "working", label: "WORKING", rows: 5, placeholder: "1.5bn population × 0.42 urban × ..." },
  { key: "answer", label: "YOUR ANSWER", rows: 3, placeholder: "Your number, and one sentence on why it is not absurd." },
] as const;

type Move = { label: string; text: string };

type Saved = { notes: Record<string, string>; submitted: boolean; at?: string };

/**
 * The whole solving experience: timer, scratchpad, submit, then the approach.
 *
 * The approach stays hidden until an answer is submitted. Reading the structure
 * before attempting the question is the fastest way to learn nothing from it.
 */
export default function Workspace({
  minutes,
  storageKey,
  hue,
  hueSoft,
  hueBorder,
  moves,
  pitfalls,
  answer,
}: {
  minutes: number;
  storageKey: string;
  hue: string;
  hueSoft: string;
  hueBorder: string;
  moves: Move[];
  pitfalls: string[];
  answer: string;
}) {
  const [left, setLeft] = useState(minutes * 60);
  const [running, setRunning] = useState(false);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [nudge, setNudge] = useState(false);
  const loaded = useRef(false);
  const savedAt = useRef<string | null>(null);
  const revealRef = useRef<HTMLDivElement | null>(null);

  // Restore anything written on a previous visit, including whether it was submitted.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw) as Saved;
        // Restoring persisted work on mount is the one case this rule cannot
        // express: the server has no access to localStorage, so the values can
        // only arrive after hydration. Runs once per question.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setNotes(saved.notes ?? {});
        setSubmitted(Boolean(saved.submitted));
        savedAt.current = saved.at ?? null;
      }
    } catch {
      // Private browsing or blocked storage. The pad still works, it just will not persist.
    }
    loaded.current = true;
  }, [storageKey]);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ notes, submitted, at: submitted ? (savedAt.current ?? undefined) : undefined } satisfies Saved));
    } catch {
      // Same as above. Never let a storage failure break the page.
    }
  }, [notes, submitted, storageKey]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          window.clearInterval(id);
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const timeUp = left === 0;
  const hasAnswer = (notes.answer ?? "").trim().length > 0;

  function submit() {
    if (!hasAnswer) {
      setNudge(true);
      document.getElementById("answer")?.focus();
      return;
    }
    setRunning(false);
    savedAt.current = new Date().toISOString();
    setSubmitted(true);
    setNudge(false);
    window.setTimeout(() => revealRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Your working</h2>
        <div className="flex items-center gap-3 rounded-full pl-4 pr-1.5 py-1.5" style={{ border: "1px solid #1a2a45" }}>
          <span className="text-[19px] font-bold tabular-nums tracking-wide" style={{ color: timeUp ? "#F87171" : "#FFFFFF" }}>
            {mm}:{ss}
          </span>
          <span className="text-[14px]" style={{ color: "#8090A8" }}>
            {timeUp ? "up" : "left"}
          </span>
          <button
            type="button"
            onClick={() => {
              if (timeUp) {
                setLeft(minutes * 60);
                setRunning(false);
                return;
              }
              setRunning((r) => !r);
            }}
            className="text-[14px] font-bold rounded-full px-4 py-1.5 text-white"
            style={{ background: hue }}
          >
            {timeUp ? "Reset" : running ? "Pause" : left === minutes * 60 ? "Start" : "Resume"}
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-2xl overflow-hidden" style={{ border: "1px solid #1a2a45", background: "rgba(255,255,255,0.015)" }}>
        {FIELDS.map((f, i) => (
          <div key={f.key} style={{ borderBottom: i < FIELDS.length - 1 ? "1px solid #1a2a45" : undefined }}>
            <label htmlFor={f.key} className="block px-5 pt-4 text-[13px] font-bold tracking-[0.14em]" style={{ color: "#8090A8" }}>
              {f.label}
            </label>
            <textarea
              id={f.key}
              rows={f.rows}
              value={notes[f.key] ?? ""}
              onChange={(e) => setNotes((n) => ({ ...n, [f.key]: e.target.value }))}
              placeholder={f.placeholder}
              className="w-full bg-transparent border-0 resize-y px-5 pb-4 pt-2 text-[17px] leading-relaxed outline-none"
              style={{ color: "#DFE7F3", fontFamily: f.key === "working" ? "ui-monospace, SFMono-Regular, Menlo, monospace" : undefined }}
            />
          </div>
        ))}
      </div>

      {!submitted ? (
        <div className="mt-5">
          <button
            type="button"
            onClick={submit}
            className="w-full sm:w-auto font-bold text-[17px] rounded-xl px-8 py-4 text-white"
            style={{ background: hue, opacity: hasAnswer ? 1 : 0.55 }}
          >
            Submit answer and see the approach
          </button>
          <p className="mt-3 text-[15px]" style={{ color: nudge ? "#F87171" : "#8090A8" }}>
            {nudge
              ? "Write your answer first. Even a rough number counts."
              : "The approach stays hidden until you have attempted it. Saved in this browser as you type."}
          </p>
        </div>
      ) : (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="text-[15px] font-bold px-4 py-2 rounded-full" style={{ background: hueSoft, color: hue, border: `1px solid ${hueBorder}` }}>
            Submitted
          </span>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setLeft(minutes * 60);
            }}
            className="text-[15px] font-semibold underline"
            style={{ color: "#A6B6CE" }}
          >
            Try it again
          </button>
        </div>
      )}

      {submitted && (
        <div ref={revealRef} className="mt-12 scroll-mt-24">
          <p className="text-[14px] font-bold tracking-[0.18em] mb-3" style={{ color: "#8090A8" }}>
            THE ANSWER
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl p-6" style={{ border: "1px solid #1a2a45", background: "rgba(255,255,255,0.015)" }}>
              <p className="m-0 text-[13px] font-bold tracking-[0.14em]" style={{ color: "#8090A8" }}>
                WHAT YOU SAID
              </p>
              <p className="mt-3 mb-0 text-[17px] leading-relaxed whitespace-pre-wrap" style={{ color: "#DFE7F3" }}>
                {(notes.answer ?? "").trim()}
              </p>
            </div>

            <div className="rounded-2xl p-6" style={{ border: `1px solid ${hueBorder}`, background: hueSoft }}>
              <p className="m-0 text-[13px] font-bold tracking-[0.14em]" style={{ color: hue }}>
                WHERE IT SHOULD LAND
              </p>
              <p className="mt-3 mb-0 text-[17px] leading-relaxed" style={{ color: "#FFFFFF" }}>
                {answer}
              </p>
            </div>
          </div>

          <p className="mt-4 mb-0 text-[15px] leading-relaxed" style={{ color: "#8090A8" }}>
            Being outside the band is not a fail. Interviewers mark the structure, so read the moves below and
            check which one you skipped.
          </p>

          <h2 className="mt-12 text-2xl sm:text-3xl font-extrabold tracking-tight">
            How you get there: {moves.length - 1} moves, then a check.
          </h2>

          <ol className="list-none p-0 mt-7 mb-0">
            {moves.map((move) => (
              <li
                key={move.label}
                className="grid grid-cols-1 sm:grid-cols-[110px_1fr] gap-x-5 gap-y-2 py-5"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                <span className="text-[13px] font-bold tracking-[0.1em] uppercase pt-1" style={{ color: hue }}>
                  {move.label}
                </span>
                <p className="m-0 text-[17px] leading-[1.65]" style={{ color: "#DFE7F3" }}>
                  {move.text}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-8 rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid #1a2a45" }}>
            <h3 className="text-[13px] font-bold tracking-[0.14em] m-0" style={{ color: "#8090A8" }}>
              WHERE MOST ATTEMPTS LOSE THE ROOM
            </h3>
            <ul className="mt-4 list-none p-0 m-0 flex flex-col gap-3.5">
              {pitfalls.map((p) => (
                <li key={p} className="relative pl-6 text-[16px] leading-relaxed" style={{ color: "#A6B6CE" }}>
                  <span className="absolute left-0 top-[10px] w-1.5 h-1.5 rounded-full" style={{ border: `1px solid ${hue}` }} />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-6 text-[15px] leading-relaxed" style={{ color: "#8090A8" }}>
            There is no single correct figure here. The band and the structure are the answer, which is how these
            are actually marked.
          </p>
        </div>
      )}
    </div>
  );
}
