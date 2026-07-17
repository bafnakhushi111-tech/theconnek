import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/app/lib/session";
import { sql } from "@/app/lib/db";
import { theme } from "@/app/lib/theme";
import LogoutButton from "@/app/components/LogoutButton";

const C = theme.mentee;

const COMMUNITY_SPACES = [
  {
    id: "guesstimate",
    icon: "📐",
    title: "Guesstimate Group",
    desc: "Work through guesstimates with real people, not just recordings.",
    link: "#",
    label: "Join group",
  },
  {
    id: "casecomp",
    icon: "🏆",
    title: "Case Competition",
    desc: "Prep together with people who are as serious about it as you are.",
    link: "#",
    label: "Join group",
  },
  {
    id: "study",
    icon: "📚",
    title: "Study Material",
    desc: "Shared resources, honest feedback, no LinkedIn performance.",
    link: "#",
    label: "Access resources",
  },
];

type MenteeRow = {
  id: number;
  name: string;
  email: string;
  college: string;
  role: string;
  location: string | null;
  experience: string | null;
  mentor_id: number | null;
};

type MentorRow = {
  id: number;
  name: string;
  company: string;
  role: string;
  location: string | null;
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ margin: "0 0 16px", fontSize: "10px", fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "2px" }}>
      {children}
    </p>
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
    id: 0,
    name: (session.name as string) ?? "there",
    email: "",
    college: "—",
    role: "—",
    location: null,
    experience: null,
    mentor_id: null,
  };

  let mentor: MentorRow | null = null;
  if (mentee.mentor_id) {
    const mentorRows = (await sql`
      SELECT id, name, company, role, location FROM mentors WHERE id = ${mentee.mentor_id} LIMIT 1
    `) as MentorRow[];
    mentor = mentorRows[0] ?? null;
  }

  const firstName = mentee.name.split(" ")[0];
  const matched = Boolean(mentor);

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${theme.border}` }}>
        <Link href="/">
          <span style={{ fontSize: "16px", fontWeight: 800, color: theme.heading, letterSpacing: "-0.5px" }}>theconnek</span>
        </Link>
        <LogoutButton role="mentee" />
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-11">
        {/* Greeting + status */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 style={{ margin: 0, fontSize: "32px", fontWeight: 800, color: theme.heading, letterSpacing: "-0.5px" }}>
              Hi, {firstName}
            </h1>
            <p style={{ margin: "6px 0 0", fontSize: "14px", color: theme.muted }}>
              {mentee.college} &middot; {mentee.role}
              {mentee.location ? ` · ${mentee.location}` : ""}
            </p>
          </div>
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              fontSize: "12px",
              fontWeight: 600,
              background: matched ? "rgba(126,207,184,0.10)" : C.soft,
              color: matched ? theme.success : C.text,
              border: `1px solid ${matched ? "rgba(126,207,184,0.25)" : C.border}`,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: matched ? theme.success : C.text }} />
            {matched ? "Matched" : "Finding your mentor"}
          </span>
        </div>

        {/* Your Mentor — promoted to the top */}
        <section>
          <SectionLabel>Your Mentor</SectionLabel>
          {mentor ? (
            <div className="rounded-2xl p-5" style={{ background: C.softer, border: `1px solid ${C.border}` }}>
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-full text-sm font-bold"
                  style={{ width: 46, height: 46, background: C.soft, color: C.text }}
                >
                  {mentor.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#E8EEF7" }}>{mentor.name}</p>
                  <p style={{ margin: "3px 0 0", fontSize: "13px", color: theme.muted }}>
                    {mentor.role} at {mentor.company}
                    {mentor.location ? ` · ${mentor.location}` : ""}
                  </p>
                </div>
              </div>

              {/* Call block — the zero-contact scheduling lands here */}
              <div
                className="mt-4 rounded-xl px-4 py-3.5 flex items-center justify-between gap-3"
                style={{ background: "rgba(255,255,255,0.02)", border: `1px dashed ${theme.border}` }}
              >
                <div className="flex items-center gap-2.5">
                  <span style={{ fontSize: "16px" }}>📅</span>
                  <p style={{ margin: 0, fontSize: "13px", color: theme.body }}>
                    Your call gets scheduled here — no emails or numbers exchanged.
                  </p>
                </div>
                <span style={{ fontSize: "11px", fontWeight: 600, color: theme.faint, whiteSpace: "nowrap" }}>Coming soon</span>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl p-6 text-center" style={{ background: "rgba(255,255,255,0.02)", border: `1px dashed ${theme.border}` }}>
              <p style={{ margin: 0, fontSize: "15px", color: theme.body, fontWeight: 600 }}>Your mentor match is on the way</p>
              <p style={{ margin: "6px auto 0", maxWidth: 360, fontSize: "13px", color: C.text, lineHeight: 1.6 }}>
                We review profiles by hand and pair you with someone who has walked your path. You&apos;ll hear from us the moment it&apos;s confirmed.
              </p>
            </div>
          )}
        </section>

        {/* Community Spaces */}
        <section>
          <SectionLabel>Community Spaces</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {COMMUNITY_SPACES.map((g) => (
              <div key={g.id} className="flex flex-col gap-3 rounded-2xl p-5" style={{ background: C.softer, border: `1px solid ${theme.border}` }}>
                <span style={{ fontSize: "28px" }}>{g.icon}</span>
                <div>
                  <p style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#E8EEF7" }}>{g.title}</p>
                  <p style={{ margin: "4px 0 0", fontSize: "13px", color: theme.muted, lineHeight: 1.5 }}>{g.desc}</p>
                </div>
                <a
                  href={g.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-block text-xs font-bold py-2 px-4 rounded-xl text-center transition-opacity hover:opacity-80"
                  style={{ background: C.accent, color: "#fff" }}
                >
                  {g.label} →
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
