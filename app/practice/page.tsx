import type { Metadata } from "next";
import Link from "next/link";
import NavWithPanel from "../components/NavWithPanel";
import Footer from "../components/Footer";
import AuthStrip from "../components/AuthStrip";
import { TRACKS, countByShape } from "../lib/practice";

export const metadata: Metadata = {
  title: "Guesstimates and Case Practice for MBA Interviews",
  description:
    "Practise guesstimates and cases sorted by the job they prepare you for: strategy and consulting, product, finance, and marketing. Free, with the approach behind every question.",
  alternates: { canonical: "/practice" },
};

const STEPS = [
  { n: "01", title: "Read and start the clock", body: "Every question carries the time box it was actually asked in." },
  { n: "02", title: "Write your assumptions", body: "Assumptions, working, answer. Kept separate, because that is how it gets marked." },
  { n: "03", title: "Compare with the approach", body: "Not a single right number. The structure a strong answer follows, and where the number lands." },
  { n: "04", title: "Take it to a mentor", body: "Bring your working to a call with someone who has been asked this for real." },
];

export default function PracticePage() {
  return (
    <main className="min-h-screen text-white" style={{ background: "#0F1219" }}>
      <NavWithPanel />
      <AuthStrip />

      <section className="px-5 pt-16 pb-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-[15px] font-semibold tracking-[0.18em] mb-4" style={{ color: "#8090A8" }}>
            PRACTICE
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.08]">
            Pick the seat you&apos;re
            <br />
            trying to sit in.
          </h1>
          <p className="mt-5 text-[18px] sm:text-xl leading-relaxed max-w-2xl" style={{ color: "#A6B6CE" }}>
            Guesstimates and cases sorted by the job they prepare you for, not by a generic difficulty
            ladder. A product root-cause question and a consulting profitability case are not the same
            skill, so they don&apos;t live in the same pile.
          </p>
        </div>
      </section>

      <section className="px-5 pb-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TRACKS.map((track) => (
            <Link
              key={track.slug}
              href={`/practice/${track.slug}`}
              className="group flex flex-col gap-4 rounded-2xl p-6 transition-colors"
              style={{ background: track.hueSoft, border: `1px solid ${track.hueBorder}` }}
            >
              <span className="block h-[2px] w-10 rounded-full" style={{ background: track.hue }} />
              <div>
                <h2 className="text-xl font-bold tracking-tight">{track.name}</h2>
                <p className="mt-2 text-[17px] leading-relaxed" style={{ color: "#A6B6CE" }}>
                  {track.blurb}
                </p>
              </div>
              <div className="mt-auto flex items-end gap-7 pt-2">
                <span className="block">
                  <span className="block text-2xl font-extrabold leading-none" style={{ color: track.hue }}>
                    {countByShape(track, "guesstimate")}
                  </span>
                  <span className="block mt-1 text-[15px]" style={{ color: "#8090A8" }}>
                    guesstimates
                  </span>
                </span>
                <span className="block">
                  <span className="block text-2xl font-extrabold leading-none" style={{ color: track.hue }}>
                    {countByShape(track, "case")}
                  </span>
                  <span className="block mt-1 text-[15px]" style={{ color: "#8090A8" }}>
                    cases
                  </span>
                </span>
                <span className="ml-auto text-[17px] font-semibold" style={{ color: track.hue }}>
                  Open &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-5 pb-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-[15px] font-semibold tracking-[0.18em] mb-5" style={{ color: "#8090A8" }}>
            HOW A QUESTION WORKS
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-2xl overflow-hidden" style={{ border: "1px solid #1a2a45" }}>
            {STEPS.map((step, i) => (
              <div
                key={step.n}
                className="p-5"
                style={{
                  background: i === 3 ? "rgba(75,111,165,0.08)" : "rgba(255,255,255,0.015)",
                  borderRight: i < 3 ? "1px solid #1a2a45" : undefined,
                }}
              >
                <span className="text-[15px] font-bold tracking-[0.1em]" style={{ color: "#7B9EC8" }}>
                  {step.n}
                </span>
                <p className="mt-2 text-[18px] font-bold">{step.title}</p>
                <p className="mt-1.5 text-[16px] leading-relaxed" style={{ color: "#A6B6CE" }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/mentee/signup"
              className="inline-block font-bold px-8 py-4 rounded-full text-[17px] text-center text-white"
              style={{ background: "#4B6FA5", boxShadow: "0 16px 32px rgba(75,111,165,0.3)" }}
            >
              Create a free account &rarr;
            </Link>
            <Link
              href="/about"
              className="inline-block font-bold px-8 py-4 rounded-full text-[17px] text-center"
              style={{ border: "1px solid rgba(75,111,165,0.3)", color: "#7B9EC8" }}
            >
              What is theconnek?
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
