import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/app/lib/session";
import { sql } from "@/app/lib/db";
import LogoutButton from "@/app/components/LogoutButton";

const WHATSAPP_GROUPS = [
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

export default async function MenteeDashboard() {
  const session = await getSession();
  if (!session || session.role !== "mentee") redirect("/mentee/login");

  const id = session.sub as string;

  const menteeRows = await sql`
    SELECT id, name, email, college, role, location, experience, mentor_id
    FROM mentees WHERE id = ${id} LIMIT 1
  ` as MenteeRow[];

  const mentee: MenteeRow = menteeRows[0] ?? {
    id: 0,
    name: session.name as string,
    email: "",
    college: "—",
    role: "—",
    location: null,
    experience: null,
    mentor_id: null,
  };

  let mentor: MentorRow | null = null;
  if (mentee.mentor_id) {
    const mentorRows = await sql`
      SELECT id, name, company, role, location FROM mentors WHERE id = ${mentee.mentor_id} LIMIT 1
    ` as MentorRow[];
    mentor = mentorRows[0] ?? null;
  }

  const firstName = mentee.name.split(" ")[0];

  return (
    <div className="min-h-screen" style={{ background: "#08090E" }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid #1a2a45" }}
      >
        <Link href="/">
          <span style={{ fontSize: "16px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
            theconnek
          </span>
        </Link>
        <LogoutButton role="mentee" />
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-10">
        {/* Greeting */}
        <div>
          <h1 style={{ margin: 0, fontSize: "32px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
            Hi, {firstName}
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#8A9CB8" }}>
            {mentee.college} &middot; {mentee.role}
            {mentee.location ? ` · ${mentee.location}` : ""}
          </p>
        </div>

        {/* Community Spaces */}
        <section>
          <p
            style={{ margin: "0 0 16px", fontSize: "10px", fontWeight: 700, color: "#4B6FA5", textTransform: "uppercase", letterSpacing: "2px" }}
          >
            Community Spaces
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {WHATSAPP_GROUPS.map((g) => (
              <div
                key={g.id}
                className="flex flex-col gap-3 rounded-2xl p-5"
                style={{ background: "rgba(75,111,165,0.06)", border: "1px solid #1a2a45" }}
              >
                <span style={{ fontSize: "28px" }}>{g.icon}</span>
                <div>
                  <p style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#E2E8F0" }}>{g.title}</p>
                  <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748B", lineHeight: 1.5 }}>{g.desc}</p>
                </div>
                <a
                  href={g.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-block text-xs font-bold py-2 px-4 rounded-xl text-center transition-opacity hover:opacity-80"
                  style={{ background: "#4B6FA5", color: "#fff" }}
                >
                  {g.label} →
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Mentor Section */}
        <section>
          <p
            style={{ margin: "0 0 16px", fontSize: "10px", fontWeight: 700, color: "#4B6FA5", textTransform: "uppercase", letterSpacing: "2px" }}
          >
            Your Mentor
          </p>

          {mentor ? (
            <div
              className="flex items-start gap-4 rounded-2xl p-5"
              style={{ background: "rgba(75,111,165,0.06)", border: "1px solid rgba(75,111,165,0.25)" }}
            >
              <div
                className="flex-shrink-0 flex items-center justify-center rounded-full text-sm font-bold"
                style={{ width: 44, height: 44, background: "rgba(75,111,165,0.2)", color: "#7B9EC8" }}
              >
                {mentor.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#E2E8F0" }}>{mentor.name}</p>
                <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#8A9CB8" }}>
                  {mentor.role} at {mentor.company}
                  {mentor.location ? ` · ${mentor.location}` : ""}
                </p>
              </div>
            </div>
          ) : (
            <div
              className="rounded-2xl p-6 text-center"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed #1a2a45" }}
            >
              <p style={{ margin: 0, fontSize: "15px", color: "#CBD5E1", fontWeight: 600 }}>
                Your mentor match is coming soon
              </p>
              <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#4B6FA5", lineHeight: 1.6 }}>
                We review profiles carefully. You&apos;ll hear from us once your mentor is confirmed.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
