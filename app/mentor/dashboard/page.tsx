import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/app/lib/session";
import { sql } from "@/app/lib/db";
import { theme } from "@/app/lib/theme";
import LogoutButton from "@/app/components/LogoutButton";
import AssignButton from "@/app/components/AssignButton";

const C = theme.mentor;

type MentorRow = {
  id: number;
  name: string;
  company: string;
  role: string;
  location: string | null;
};

type MenteeRow = {
  id: number;
  name: string;
  email: string;
  college: string;
  role: string;
  location: string | null;
  experience: string | null;
};

function getBadge(count: number): { label: string; icon: string; next: number | null } {
  if (count >= 5) return { label: "Top Mentor", icon: "🏆", next: null };
  if (count >= 3) return { label: "Rising", icon: "🌟", next: 5 };
  if (count >= 1) return { label: "Starter", icon: "⭐", next: 3 };
  return { label: "No badge yet", icon: "🎯", next: 1 };
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ margin: "0 0 4px", fontSize: "10px", fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "2px" }}>
      {children}
    </p>
  );
}

export default async function MentorDashboard() {
  const session = await getSession();
  if (!session || session.role !== "mentor") redirect("/mentor/login");

  const id = session.sub as string;

  const mentorRows = (await sql`
    SELECT id, name, company, role, location FROM mentors WHERE id = ${id} LIMIT 1
  `) as MentorRow[];

  const mentor: MentorRow = mentorRows[0] ?? {
    id: 0,
    name: (session.name as string) ?? "there",
    company: "—",
    role: "—",
    location: null,
  };

  const assignedMentees = (await sql`
    SELECT id, name, email, college, role, location, experience
    FROM mentees WHERE mentor_id = ${id}
    ORDER BY name
  `) as MenteeRow[];

  const availableMentees = (await sql`
    SELECT id, name, email, college, role, location, experience
    FROM mentees WHERE mentor_id IS NULL
    ORDER BY name
  `) as MenteeRow[];

  const count = assignedMentees.length;
  const badge = getBadge(count);
  const firstName = mentor.name.split(" ")[0];
  const remaining = badge.next ? badge.next - count : 0;

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${theme.border}` }}>
        <Link href="/">
          <span style={{ fontSize: "16px", fontWeight: 800, color: theme.heading, letterSpacing: "-0.5px" }}>theconnek</span>
        </Link>
        <LogoutButton role="mentor" />
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-11">
        {/* Greeting */}
        <div>
          <h1 style={{ margin: 0, fontSize: "32px", fontWeight: 800, color: theme.heading, letterSpacing: "-0.5px" }}>
            Hi, {firstName}
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: "14px", color: theme.muted }}>
            {mentor.role} at {mentor.company}
            {mentor.location ? ` · ${mentor.location}` : ""}
          </p>
        </div>

        {/* KPI row — compact impact summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-2xl p-5" style={{ background: C.softer, border: `1px solid ${C.border}` }}>
            <p style={{ margin: 0, fontSize: "30px", fontWeight: 800, color: theme.heading, lineHeight: 1 }}>{count}</p>
            <p style={{ margin: "8px 0 0", fontSize: "12px", color: theme.muted }}>{count === 1 ? "mentee" : "mentees"} in your corner</p>
          </div>
          <div className="rounded-2xl p-5 flex flex-col justify-between" style={{ background: C.softer, border: `1px solid ${C.border}` }}>
            <span style={{ fontSize: "26px", lineHeight: 1 }}>{badge.icon}</span>
            <p style={{ margin: "8px 0 0", fontSize: "13px", fontWeight: 700, color: C.text }}>{badge.label}</p>
          </div>
          <div className="rounded-2xl p-5 flex flex-col justify-center" style={{ background: C.softer, border: `1px solid ${C.border}` }}>
            {badge.next ? (
              <>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: theme.body }}>
                  {remaining} more {remaining === 1 ? "mentee" : "mentees"}
                </p>
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: theme.muted }}>to level up</p>
                <div className="mt-3" style={{ background: "rgba(168,151,232,0.12)", borderRadius: "99px", height: "4px", width: "100%" }}>
                  <div style={{ height: "100%", borderRadius: "99px", background: C.accent, width: `${Math.min((count / badge.next) * 100, 100)}%` }} />
                </div>
              </>
            ) : (
              <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: C.text }}>You&apos;re a Top Mentor 🎉</p>
            )}
          </div>
        </div>

        {/* Your Mentees */}
        {assignedMentees.length > 0 && (
          <section>
            <SectionLabel>Your Mentees ({count})</SectionLabel>
            <p style={{ margin: "0 0 16px", fontSize: "13px", color: theme.muted }}>
              The people you&apos;re mentoring. Call scheduling lands here next.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {assignedMentees.map((m) => (
                <MenteeCard key={m.id} mentee={m} assigned />
              ))}
            </div>
          </section>
        )}

        {/* Discover Mentees */}
        <section>
          <SectionLabel>Discover Mentees</SectionLabel>
          <p style={{ margin: "0 0 16px", fontSize: "13px", color: theme.muted }}>
            Review profiles and choose who you&apos;d like to mentor. We handle the introduction — no contact details shared.
          </p>

          {availableMentees.length === 0 ? (
            <div className="rounded-2xl p-6 text-center" style={{ background: "rgba(255,255,255,0.02)", border: `1px dashed ${theme.border}` }}>
              <p style={{ margin: 0, fontSize: "15px", color: theme.body, fontWeight: 600 }}>No unmatched mentees right now</p>
              <p style={{ margin: "6px 0 0", fontSize: "13px", color: C.text }}>Check back soon as more people join.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availableMentees.map((m) => (
                <MenteeCard key={m.id} mentee={m} assigned={false} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function MenteeCard({ mentee, assigned }: { mentee: MenteeRow; assigned: boolean }) {
  const initials = mentee.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col gap-3 rounded-2xl p-5" style={{ background: C.softer, border: `1px solid ${theme.border}` }}>
      <div className="flex items-center gap-3">
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-full text-sm font-bold"
          style={{ width: 40, height: 40, background: C.soft, color: C.text }}
        >
          {initials}
        </div>
        <div>
          <p style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#E8EEF7" }}>{mentee.name}</p>
          <p style={{ margin: "2px 0 0", fontSize: "12px", color: theme.muted }}>{mentee.college}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: C.soft, color: C.text }}>
          {mentee.role}
        </span>
        {mentee.experience && (
          <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.04)", color: theme.muted }}>
            {mentee.experience} yrs
          </span>
        )}
        {mentee.location && (
          <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.04)", color: theme.muted }}>
            {mentee.location}
          </span>
        )}
      </div>

      {!assigned && <AssignButton menteeId={mentee.id} />}
      {assigned && (
        <div
          className="mt-1 flex items-center justify-between rounded-xl px-3 py-2.5"
          style={{ background: "rgba(255,255,255,0.02)", border: `1px dashed ${theme.border}` }}
        >
          <span className="text-xs font-semibold" style={{ color: theme.success }}>✓ Mentoring</span>
          <span className="text-xs font-medium" style={{ color: theme.faint }}>Schedule call · soon</span>
        </div>
      )}
    </div>
  );
}
