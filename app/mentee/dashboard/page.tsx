import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/app/lib/session";
import { sql } from "@/app/lib/db";
import { theme } from "@/app/lib/theme";
import { TRACKS, countByShape } from "@/app/lib/practice";
import LogoutButton from "@/app/components/LogoutButton";

export const metadata: Metadata = { title: "Your dashboard", robots: { index: false } };

type MenteeRow = {
  id: number; name: string; email: string; college: string; role: string;
  location: string | null; experience: string | null; mentor_id: number | null;
};

type MentorRow = { id: number; name: string; company: string; role: string; location: string | null };

function MatchCard({ mentor }: { mentor: MentorRow | null }) {
  const tone = mentor ? theme.success : "#D9A87C";
  return (
    <div
      className="rounded-2xl p-6 sm:p-7 flex flex-col gap-3"
      style={{ background: `${tone}14`, border: `1px solid ${tone}40` }}
    >
      <span className="flex items-center gap-2.5">
        <span className="block w-2 h-2 rounded-full" style={{ background: tone }} />
        <span className="text-[13px] font-bold tracking-[0.1em] uppercase" style={{ color: tone }}>
          {mentor ? "Matched" : "Finding your mentor"}
        </span>
      </span>

      <p className="text-[19px] sm:text-[21px] font-bold leading-snug" style={{ color: theme.heading }}>
        {mentor ? `You're matched with ${mentor.name}` : "We're still matching you"}
      </p>

      <p className="text-[15.5px] leading-relaxed" style={{ color: theme.muted }}>
        {mentor
          ? `${mentor.role} at ${mentor.company}${mentor.location ? ` · ${mentor.location}` : ""}. Your call gets scheduled over email.`
          : "We pair by hand, so it takes a few days. Practising is the useful thing to do meanwhile."}
      </p>

      <Link
        href="/practice"
        className="mt-1 self-start text-[15.5px] font-bold rounded-full px-5 py-2.5"
        style={{ border: `1px solid ${tone}66`, color: tone }}
      >
        {mentor ? "Practice for the call" : "Start practising"} &rarr;
      </Link>
    </div>
  );
}

export default async function MenteeDashboard() {
  const session = await getSession();
  if (!session || session.role !== "mentee") redirect("/mentee/login");

  const id = session.sub as string;

  const menteeRows = (await sql`
    SELECT id, name, email, college, role, location, experience, mentor_id
    FROM mentees WHERE id = ${id} LIMIT 1
  `) as MenteeRow[];

  const mentee: MenteeRow = menteeRows[0] ?? {
    id: 0, name: (session.name as string) ?? "there", email: "", college: "—", role: "—",
    location: null, experience: null, mentor_id: null,
  };

  let mentor: MentorRow | null = null;
  if (mentee.mentor_id) {
    const mentorRows = (await sql`
      SELECT id, name, company, role, location FROM mentors WHERE id = ${mentee.mentor_id} LIMIT 1
    `) as MentorRow[];
    mentor = mentorRows[0] ?? null;
  }

  const firstName = mentee.name.split(" ")[0];

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <header
        className="flex items-center justify-between px-5 sm:px-8 py-4"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <Link href="/">
          <span style={{ fontSize: "18px", fontWeight: 800, color: theme.heading, letterSpacing: "-0.5px" }}>
            theconnek
          </span>
        </Link>
        <LogoutButton role="mentee" />
      </header>

      {/* 1. Greeting and match status share one balanced hero. */}
      <section className="px-5 sm:px-8 pt-14 sm:pt-20 pb-14 sm:pb-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-14 items-center">
          <div>
            <p className="text-[13px] font-bold tracking-[0.14em] uppercase" style={{ color: theme.faint }}>
              Your dashboard
            </p>
            <h1
              className="mt-4 text-[38px] sm:text-[50px] font-extrabold tracking-tight leading-[1.04]"
              style={{ color: theme.heading }}
            >
              Hi, {firstName}
            </h1>
            <p className="mt-4 text-[17px] leading-relaxed" style={{ color: theme.muted }}>
              {mentee.college} &middot; {mentee.role}
              {mentee.location ? ` · ${mentee.location}` : ""}
            </p>
          </div>

          <MatchCard mentor={mentor} />
        </div>
      </section>

      {/* 2. Pick a track, then a question. */}
      <section className="px-5 sm:px-8 py-14" style={{ borderTop: `1px solid ${theme.border}` }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-[24px] sm:text-[28px] font-extrabold tracking-tight" style={{ color: theme.heading }}>
            What are you preparing for?
          </h2>
          <p className="mt-3 max-w-2xl text-[17px] leading-relaxed" style={{ color: theme.muted }}>
            Pick a track, choose a question, and write your answer against the clock. The approach is revealed
            the moment you submit.
          </p>

          <div className="mt-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TRACKS.map((track) => (
              <Link
                key={track.slug}
                href={`/practice/${track.slug}`}
                className="flex flex-col gap-4 rounded-2xl p-6 sm:p-7"
                style={{ background: track.hueSoft, border: `1px solid ${track.hueBorder}` }}
              >
                <span className="block h-[2px] w-10 rounded-full" style={{ background: track.hue }} />
                <div>
                  <h3 className="text-[21px] font-bold tracking-tight" style={{ color: theme.heading }}>
                    {track.name}
                  </h3>
                  <p className="mt-2 text-[16px] leading-relaxed" style={{ color: theme.muted }}>
                    {track.blurb}
                  </p>
                </div>
                <div className="mt-auto flex items-end gap-7 pt-2">
                  <span className="block">
                    <span className="block text-[26px] font-extrabold leading-none" style={{ color: track.hue }}>
                      {countByShape(track, "guesstimate")}
                    </span>
                    <span className="block mt-1.5 text-[14px]" style={{ color: theme.faint }}>
                      guesstimates
                    </span>
                  </span>
                  <span className="block">
                    <span className="block text-[26px] font-extrabold leading-none" style={{ color: track.hue }}>
                      {countByShape(track, "case")}
                    </span>
                    <span className="block mt-1.5 text-[14px]" style={{ color: theme.faint }}>
                      cases
                    </span>
                  </span>
                  <span className="ml-auto text-[16px] font-bold" style={{ color: track.hue }}>
                    Open &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
