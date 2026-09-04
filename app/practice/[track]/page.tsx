import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import NavWithPanel from "../../components/NavWithPanel";
import Footer from "../../components/Footer";
import AuthStrip from "../../components/AuthStrip";
import { TRACKS, getTrack, countByShape, DIFFICULTY_LABEL, type Shape, type Difficulty } from "../../lib/practice";

type Params = { track: string };
type Search = { type?: string; level?: string };

export function generateStaticParams(): Params[] {
  return TRACKS.map((t) => ({ track: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { track: slug } = await params;
  const track = getTrack(slug);
  if (!track) return {};
  return {
    title: `${track.name} Guesstimates and Cases`,
    description: track.lede,
    alternates: { canonical: `/practice/${track.slug}` },
  };
}

/** Three bars, filled to the difficulty. Readable without reading. */
function DifficultyBars({ level, hue }: { level: Difficulty; hue: string }) {
  return (
    <span className="inline-flex items-end gap-[3px] h-[14px]" title={DIFFICULTY_LABEL[level]}>
      {[6, 10, 14].map((h, i) => (
        <span
          key={h}
          className="block w-[4px] rounded-[1px]"
          style={{ height: `${h}px`, background: i < level ? hue : "#1a2a45" }}
        />
      ))}
    </span>
  );
}

export default async function TrackPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const { track: slug } = await params;
  const { type, level } = await searchParams;
  const track = getTrack(slug);
  if (!track) notFound();

  const shape: Shape = type === "case" ? "case" : "guesstimate";
  const activeLevel = level === "1" || level === "2" || level === "3" ? Number(level) : null;

  const inShape = track.questions.filter((q) => q.shape === shape);
  const questions = activeLevel ? inShape.filter((q) => q.difficulty === activeLevel) : inShape;

  const base = `/practice/${track.slug}`;
  const levelHref = (l: number | null) => {
    const p = new URLSearchParams();
    if (shape === "case") p.set("type", "case");
    if (l) p.set("level", String(l));
    const qs = p.toString();
    return qs ? `${base}?${qs}` : base;
  };

  return (
    <main className="min-h-screen text-white" style={{ background: "#0F1219" }}>
      <NavWithPanel />
      <AuthStrip />

      <section className="px-5 pt-12 pb-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-[15px] mb-4" style={{ color: "#8090A8" }}>
            <Link href="/practice" style={{ color: "#7B9EC8" }}>
              Practice
            </Link>
            <span className="mx-2">/</span>
            {track.name}
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">{track.name}</h1>
          <p className="mt-4 text-[18px] leading-relaxed max-w-2xl" style={{ color: "#A6B6CE" }}>
            {track.lede}
          </p>

          {/* Shape tabs. Plain links, so the list works with no JavaScript. */}
          <div className="mt-8 flex gap-1" style={{ borderBottom: "1px solid #1a2a45" }}>
            {(["guesstimate", "case"] as Shape[]).map((s) => {
              const on = shape === s;
              return (
                <Link
                  key={s}
                  href={s === "case" ? `${base}?type=case` : base}
                  className="px-4 py-3 text-[17px] font-semibold -mb-px"
                  style={{
                    color: on ? "#FFFFFF" : "#A6B6CE",
                    borderBottom: `2px solid ${on ? track.hue : "transparent"}`,
                  }}
                >
                  {s === "guesstimate" ? "Guesstimates" : "Cases"}
                  <span className="ml-2 text-[15px]" style={{ color: "#8090A8" }}>
                    {countByShape(track, s)}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-[13.5px] font-semibold tracking-[0.12em] mr-1" style={{ color: "#8090A8" }}>
              LEVEL
            </span>
            {[null, 1, 2, 3].map((l) => {
              const on = activeLevel === l;
              return (
                <Link
                  key={String(l)}
                  href={levelHref(l)}
                  className="px-3.5 py-1.5 rounded-full text-[15.5px]"
                  style={{
                    color: on ? "#FFFFFF" : "#A6B6CE",
                    background: on ? track.hueSoft : "transparent",
                    border: `1px solid ${on ? track.hueBorder : "#1a2a45"}`,
                  }}
                >
                  {l ? DIFFICULTY_LABEL[l as Difficulty] : "All"}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20">
        <div className="max-w-4xl mx-auto">
          {questions.length === 0 ? (
            <p className="py-14 text-center text-[17px]" style={{ color: "#A6B6CE" }}>
              Nothing at that level yet. <Link href={base} style={{ color: track.hue }}>Show all</Link>
            </p>
          ) : (
            <ul className="list-none p-0 m-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              {questions.map((q, i) => (
                <li key={q.slug}>
                  <Link
                    href={`/practice/${track.slug}/${q.slug}`}
                    className="grid grid-cols-[1fr_auto] sm:grid-cols-[36px_1fr_auto] gap-x-5 gap-y-3 items-center py-5"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <span className="hidden sm:block text-[15px] tabular-nums" style={{ color: "#8090A8" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <span className="block min-w-0">
                      <span className="block text-[18px] font-semibold leading-snug">{q.title}</span>
                      <span className="mt-2 flex flex-wrap gap-2">
                        <span
                          className="text-[13px] px-2 py-[3px] rounded"
                          style={{ background: track.hueSoft, color: track.hue }}
                        >
                          {q.type}
                        </span>
                        <span
                          className="text-[13px] px-2 py-[3px] rounded"
                          style={{ background: "rgba(255,255,255,0.045)", color: "#A6B6CE" }}
                        >
                          {DIFFICULTY_LABEL[q.difficulty]}
                        </span>
                        {q.askedAt && (
                          <span
                            className="text-[13px] px-2 py-[3px] rounded"
                            style={{ border: "1px solid #1a2a45", color: "#8090A8" }}
                          >
                            asked at {q.askedAt}
                          </span>
                        )}
                      </span>
                    </span>

                    <span className="flex items-center gap-4 justify-self-end">
                      <DifficultyBars level={q.difficulty} hue={track.hue} />
                      <span className="text-[15px] tabular-nums" style={{ color: "#A6B6CE" }}>
                        {q.minutes} min
                      </span>
                      <span className="text-[18px]" style={{ color: track.hue }}>
                        &rarr;
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
