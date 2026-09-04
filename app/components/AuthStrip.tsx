import Link from "next/link";
import { getSession } from "@/app/lib/session";
import { sql } from "@/app/lib/db";

type MenteeRow = { name: string; mentor_id: number | null };
type MentorRow = { name: string; company: string; role: string };

type StripProps = {
  tone: string;
  label: string;
  headline: string;
  detail: string;
  cta: string;
  href: string;
};

/**
 * Works out what the strip should say, or null if there is nothing to show.
 * Kept separate from rendering so the database call sits in its own try/catch
 * and no JSX is ever constructed inside one.
 */
async function loadStrip(): Promise<StripProps | null> {
  let session: Awaited<ReturnType<typeof getSession>> = null;
  try {
    session = await getSession();
  } catch {
    return null;
  }
  if (!session) return null;

  const id = String(session.sub ?? "");
  const role = session.role === "mentor" ? "mentor" : "mentee";

  try {
    if (role === "mentee") {
      const rows = (await sql`SELECT name, mentor_id FROM mentees WHERE id = ${id} LIMIT 1`) as MenteeRow[];
      const mentee = rows[0];
      if (!mentee) return null;

      let mentor: MentorRow | null = null;
      if (mentee.mentor_id) {
        const m = (await sql`
          SELECT name, company, role FROM mentors WHERE id = ${mentee.mentor_id} LIMIT 1
        `) as MentorRow[];
        mentor = m[0] ?? null;
      }

      if (mentor) {
        return {
          tone: "#7ECFB8",
          label: "Matched",
          headline: `You're matched with ${mentor.name}`,
          detail: `${mentor.role} at ${mentor.company}. Bring your working to the call.`,
          cta: "Open dashboard",
          href: "/mentee/dashboard",
        };
      }

      return {
        tone: "#D9A87C",
        label: "Finding your mentor",
        headline: `Hi ${mentee.name.split(" ")[0]}, we're still matching you`,
        detail: "We pair by hand, so it takes a few days. Practice is the useful thing to do meanwhile.",
        cta: "Open dashboard",
        href: "/mentee/dashboard",
      };
    }

    const rows = (await sql`SELECT name FROM mentors WHERE id = ${id} LIMIT 1`) as { name: string }[];
    const mentor = rows[0];
    if (!mentor) return null;

    const counts = (await sql`
      SELECT
        COUNT(*) FILTER (WHERE mentor_id = ${id}) AS mine,
        COUNT(*) FILTER (WHERE mentor_id IS NULL) AS waiting
      FROM mentees
    `) as { mine: string; waiting: string }[];

    const mine = Number(counts[0]?.mine ?? 0);
    const waiting = Number(counts[0]?.waiting ?? 0);

    return {
      tone: "#A897E8",
      label: "Mentor",
      headline:
        mine === 0
          ? `Hi ${mentor.name.split(" ")[0]}, you haven't picked a mentee yet`
          : `${mine} ${mine === 1 ? "mentee" : "mentees"} in your corner`,
      detail:
        waiting === 0
          ? "Everyone is matched right now. These are the questions they are working through."
          : `${waiting} waiting to be matched. These are the questions they are working through.`,
      cta: "Open dashboard",
      href: "/mentor/dashboard",
    };
  } catch {
    return null;
  }
}

/**
 * Slim status bar shown under the nav to anyone who is signed in, so a person
 * always knows where their match stands without opening the dashboard.
 *
 * Renders nothing for logged-out visitors, and nothing if the session or the
 * database is unavailable. A status bar must never take a content page down.
 */
export default async function AuthStrip() {
  const props = await loadStrip();
  if (!props) return null;
  return <Strip {...props} />;
}

export function Strip({ tone, label, headline, detail, cta, href }: StripProps) {
  return (
    <div style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid #1a2a45" }}>
      <div className="max-w-5xl mx-auto px-5 py-3.5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="flex items-center gap-2.5 shrink-0">
          <span className="block w-2 h-2 rounded-full" style={{ background: tone }} />
          <span className="text-[13px] font-bold tracking-[0.1em] uppercase" style={{ color: tone }}>
            {label}
          </span>
        </span>

        <span className="min-w-0">
          <span className="block text-[17px] font-semibold leading-snug" style={{ color: "#EAF0F8" }}>
            {headline}
          </span>
          <span className="block text-[15.5px] leading-snug mt-0.5" style={{ color: "#B9C7DC" }}>
            {detail}
          </span>
        </span>

        <Link
          href={href}
          className="ml-auto text-[15.5px] font-bold whitespace-nowrap rounded-full px-4 py-2"
          style={{ border: `1px solid ${tone}55`, color: tone }}
        >
          {cta} &rarr;
        </Link>
      </div>
    </div>
  );
}
