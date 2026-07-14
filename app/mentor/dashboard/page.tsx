import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/app/lib/session";
import { sql } from "@/app/lib/db";
import LogoutButton from "@/app/components/LogoutButton";
import AssignButton from "@/app/components/AssignButton";

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

function getBadge(count: number): { label: string; icon: string; color: string; next: number | null } {
  if (count >= 5) return { label: "Top Mentor", icon: "🏆", color: "#F59E0B", next: null };
  if (count >= 3) return { label: "Rising", icon: "🌟", color: "#818CF8", next: 5 };
  if (count >= 1) return { label: "Starter", icon: "⭐", color: "#60A5FA", next: 3 };
  return { label: "No badge yet", icon: "🎯", color: "#4B6FA5", next: 1 };
}

export default async function MentorDashboard() {
  const session = await getSession();
  if (!session || session.role !== "mentor") redirect("/mentor/login");

  const id = session.sub as string;

  const mentorRows = await sql`
    SELECT id, name, company, role, location FROM mentors WHERE id = ${id} LIMIT 1
  ` as MentorRow[];

  const mentor: MentorRow = mentorRows[0] ?? {
    id: 0,
    name: session.name as string,
    company: "—",
    role: "—",
    location: null,
  };

  const assignedMentees = await sql`
    SELECT id, name, email, college, role, location, experience
    FROM mentees WHERE mentor_id = ${id}
    ORDER BY name
  ` as MenteeRow[];

  const availableMentees = await sql`
    SELECT id, name, email, college, role, location, experience
    FROM mentees WHERE mentor_id IS NULL
    ORDER BY name
  ` as MenteeRow[];

  const count = assignedMentees.length;
  const badge = getBadge(count);
  const firstName = mentor.name.split(" ")[0];

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
        <LogoutButton role="mentor" />
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-10">
        {/* Greeting */}
        <div>
          <h1 style={{ margin: 0, fontSize: "32px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
            Hi, {firstName}
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#8A9CB8" }}>
            {mentor.role} at {mentor.company}
            {mentor.location ? ` · ${mentor.location}` : ""}
          </p>
        </div>

        {/* Badge */}
        <section>
          <p
            style={{ margin: "0 0 16px", fontSize: "10px", fontWeight: 700, color: "#A897E8", textTransform: "uppercase", letterSpacing: "2px" }}
          >
            Your Impact
          </p>
          <div
            className="rounded-2xl p-5 flex items-center gap-4"
            style={{ background: "rgba(168,151,232,0.06)", border: "1px solid rgba(168,151,232,0.18)" }}
          >
            <span style={{ fontSize: "36px" }}>{badge.icon}</span>
            <div className="flex-1">
              <p style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: badge.color }}>
                {badge.label}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#8A9CB8" }}>
                {count === 0
                  ? "Choose your first mentee below to earn your Starter badge."
                  : count === 1
                  ? "1 mentee in your corner. Take on 2 more for Rising."
                  : `${count} ${count === 1 ? "mentee" : "mentees"} in your corner.${badge.next ? ` ${badge.next - count} more for the next badge.` : " You're a Top Mentor."}`}
              </p>
              {badge.next && (
                <div className="mt-3" style={{ background: "rgba(168,151,232,0.1)", borderRadius: "99px", height: "4px", width: "100%" }}>
                  <div
                    style={{
                      height: "100%",
                      borderRadius: "99px",
                      background: badge.color,
                      width: `${Math.min((count / badge.next) * 100, 100)}%`,
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Assigned Mentees */}
        {assignedMentees.length > 0 && (
          <section>
            <p
              style={{ margin: "0 0 16px", fontSize: "10px", fontWeight: 700, color: "#A897E8", textTransform: "uppercase", letterSpacing: "2px" }}
            >
              Your Mentees ({count})
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {assignedMentees.map((m) => (
                <MenteeCard key={m.id} mentee={m} assigned />
              ))}
            </div>
          </section>
        )}

        {/* Available Mentees */}
        <section>
          <p
            style={{ margin: "0 0 4px", fontSize: "10px", fontWeight: 700, color: "#A897E8", textTransform: "uppercase", letterSpacing: "2px" }}
          >
            Available Mentees
          </p>
          <p style={{ margin: "0 0 16px", fontSize: "13px", color: "#4B6FA5" }}>
            Review profiles and choose who you&apos;d like to mentor. We&apos;ll notify the team when you match.
          </p>

          {availableMentees.length === 0 ? (
            <div
              className="rounded-2xl p-6 text-center"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed #1a2a45" }}
            >
              <p style={{ margin: 0, fontSize: "15px", color: "#CBD5E1", fontWeight: 600 }}>
                No unmatched mentees right now
              </p>
              <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#4B6FA5" }}>
                Check back soon as more people join.
              </p>
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
    <div
      className="flex flex-col gap-3 rounded-2xl p-5"
      style={{ background: "rgba(168,151,232,0.04)", border: "1px solid #1a2a45" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-full text-sm font-bold"
          style={{ width: 40, height: 40, background: "rgba(168,151,232,0.15)", color: "#A897E8" }}
        >
          {initials}
        </div>
        <div>
          <p style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#E2E8F0" }}>{mentee.name}</p>
          <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#8A9CB8" }}>{mentee.college}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span
          className="text-xs px-2.5 py-1 rounded-full"
          style={{ background: "rgba(168,151,232,0.1)", color: "#A897E8" }}
        >
          {mentee.role}
        </span>
        {mentee.experience && (
          <span
            className="text-xs px-2.5 py-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.04)", color: "#8A9CB8" }}
          >
            {mentee.experience} yrs
          </span>
        )}
        {mentee.location && (
          <span
            className="text-xs px-2.5 py-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.04)", color: "#8A9CB8" }}
          >
            {mentee.location}
          </span>
        )}
      </div>

      {!assigned && <AssignButton menteeId={mentee.id} />}
      {assigned && (
        <span className="text-xs font-medium" style={{ color: "#4ade80" }}>
          ✓ You&apos;re mentoring this person
        </span>
      )}
    </div>
  );
}
