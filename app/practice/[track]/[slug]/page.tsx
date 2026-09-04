import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import NavWithPanel from "../../../components/NavWithPanel";
import Footer from "../../../components/Footer";
import AuthStrip from "../../../components/AuthStrip";
import { getSession } from "../../../lib/session";
import { TRACKS, getQuestion, DIFFICULTY_LABEL } from "../../../lib/practice";
import Workspace from "./Workspace";

type Params = { track: string; slug: string };

export function generateStaticParams(): Params[] {
  return TRACKS.flatMap((t) => t.questions.map((q) => ({ track: t.slug, slug: q.slug })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { track, slug } = await params;
  const found = getQuestion(track, slug);
  if (!found) return {};
  const { track: t, question: q } = found;
  return {
    title: q.title,
    description: `${q.type} ${q.shape === "case" ? "case" : "guesstimate"} for ${t.name}. ${q.minutes} minute time box, with the full approach and the mistakes that sink most attempts.`,
    alternates: { canonical: `/practice/${t.slug}/${q.slug}` },
  };
}

/**
 * Reading the session must never take the page down. If SESSION_SECRET is
 * missing on an environment, the honest fallback is "logged out", not a 500.
 */
async function isSignedIn(): Promise<boolean> {
  try {
    return Boolean(await getSession());
  } catch {
    return false;
  }
}

export default async function QuestionPage({ params }: { params: Promise<Params> }) {
  const { track: trackSlug, slug } = await params;
  const found = getQuestion(trackSlug, slug);
  if (!found) notFound();

  const { track, question } = found;
  const signedIn = await isSignedIn();
  const shapeLabel = question.shape === "case" ? "Case" : "Guesstimate";
  const backHref = `/practice/${track.slug}${question.shape === "case" ? "?type=case" : ""}`;

  return (
    <main className="min-h-screen text-white" style={{ background: "#0F1219" }}>
      <NavWithPanel />
      <AuthStrip />

      <section className="px-5 pt-10 pb-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-[15px] mb-6" style={{ color: "#8090A8" }}>
            <Link href={signedIn ? "/mentee/dashboard" : "/practice"} style={{ color: "#7B9EC8" }}>
              {signedIn ? "Dashboard" : "Practice"}
            </Link>
            <span className="mx-2">/</span>
            <Link href={backHref} style={{ color: "#7B9EC8" }}>
              {track.short}
            </Link>
            <span className="mx-2">/</span>
            {shapeLabel}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_310px] gap-9 items-start">
            <div>
              <div
                className="p-6 sm:p-8"
                style={{
                  background: "rgba(255,255,255,0.015)",
                  border: "1px solid #1a2a45",
                  borderLeft: `3px solid ${track.hue}`,
                  borderRadius: "4px 16px 16px 4px",
                }}
              >
                <h1 className="text-[24px] sm:text-[30px] font-bold leading-[1.28] tracking-tight text-balance">
                  {question.title}
                </h1>
                <p className="mt-5 text-[15px]" style={{ color: "#8090A8" }}>
                  {question.type} &middot; {DIFFICULTY_LABEL[question.difficulty]} &middot; {question.minutes} minute box
                  {question.askedAt ? ` · reported from ${question.askedAt}` : ""}
                </p>
              </div>

              {signedIn ? (
                <div className="mt-10">
                  <Workspace
                    minutes={question.minutes}
                    storageKey={`practice:${track.slug}:${question.slug}`}
                    hue={track.hue}
                    hueSoft={track.hueSoft}
                    hueBorder={track.hueBorder}
                    moves={question.moves}
                    pitfalls={question.pitfalls}
                    answer={question.answer}
                  />
                </div>
              ) : (
                <div
                  className="mt-10 rounded-2xl p-7 sm:p-9 text-center"
                  style={{ background: track.hueSoft, border: `1px solid ${track.hueBorder}` }}
                >
                  <p className="text-[14px] font-bold tracking-[0.16em] m-0" style={{ color: track.hue }}>
                    MEMBERS ONLY
                  </p>
                  <h2 className="mt-4 text-[22px] sm:text-[26px] font-bold tracking-tight text-balance">
                    Sign in to solve this question
                  </h2>
                  <p className="mx-auto mt-3 max-w-md text-[17px] leading-relaxed" style={{ color: "#A6B6CE" }}>
                    You get a timer, a scratchpad that saves as you type, and the full approach the moment you
                    submit your answer.
                  </p>
                  <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      href="/mentee/signup"
                      className="font-bold text-[17px] rounded-xl px-7 py-4 text-white"
                      style={{ background: track.hue }}
                    >
                      Create a free account
                    </Link>
                    <Link
                      href="/mentee/login"
                      className="font-bold text-[17px] rounded-xl px-7 py-4"
                      style={{ border: "1px solid #1a2a45", color: "#DFE7F3" }}
                    >
                      Log in
                    </Link>
                  </div>
                  <p className="mt-4 text-[15px]" style={{ color: "#8090A8" }}>
                    Free, and it also gets you matched with a mentor.
                  </p>
                </div>
              )}
            </div>

            <aside className="flex flex-col gap-4 lg:sticky lg:top-24">
              <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid #1a2a45" }}>
                <h2 className="text-[17px] font-bold m-0">Hint</h2>
                <p className="mt-1.5 text-[15px]" style={{ color: "#8090A8" }}>
                  Take it only if you are stuck.
                </p>
                <p className="mt-4 text-[16.5px] leading-relaxed m-0" style={{ color: signedIn ? "#DFE7F3" : "#8090A8" }}>
                  {signedIn ? question.hints[0] : "Sign in to see the hint."}
                </p>
              </div>

              <div className="rounded-2xl p-6" style={{ border: "1px dashed #1a2a45" }}>
                <h2 className="text-[17px] font-bold m-0">Stuck on the logic?</h2>
                <p className="mt-2 text-[16px] leading-relaxed" style={{ color: "#A6B6CE" }}>
                  Bring your working to a 15 minute call with someone who has been asked this for real.
                </p>
                <Link
                  href={signedIn ? "/mentee/dashboard" : "/mentee/signup"}
                  className="mt-5 block text-center font-bold text-[16px] rounded-xl py-3.5"
                  style={{ border: "1px solid #1a2a45", color: "#DFE7F3" }}
                >
                  {signedIn ? "Check your match" : "Find a mentor"}
                </Link>
              </div>

              <Link
                href={backHref}
                className="text-[16px] font-semibold px-1"
                style={{ color: track.hue }}
              >
                &larr; More {track.short} questions
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
