"use client";

import { motion } from "framer-motion";

type Mentor = {
  name: string;
  role: string; // e.g. "Engagement Manager"
  company: string; // e.g. "McKinsey India"
  bio: string; // one line
  photo?: string; // optional path in /public, e.g. "/mentors/priya.jpg". Falls back to initials.
};

// ⚠️ REPLACE WITH REAL PEOPLE before showing this publicly.
// Only add mentors who've actually agreed to be listed — even 4-6 real ones
// beat any amount of generic copy. The section stays hidden until this array
// has entries, so nothing fake ever ships.
//
// Example shape:
//   { name: "Priya Sharma", role: "Engagement Manager", company: "McKinsey India",
//     bio: "Ex-Bain. Helps students break into consulting.", photo: "/mentors/priya.jpg" },
const MENTORS: Mentor[] = [];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Mentors() {
  if (MENTORS.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-5 py-20">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-3">
        People you could talk to.
      </h2>
      <p className="text-center text-base sm:text-base mb-12 max-w-xl mx-auto" style={{ color: "#D5DEEC" }}>
        Real professionals who&apos;ve been where you are — and are genuinely open to a conversation.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {MENTORS.map((m) => (
          <motion.div
            key={`${m.name}-${m.company}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl p-6 flex flex-col items-center text-center"
            style={{ background: "rgba(75,111,165,0.08)", border: "1px solid rgba(75,111,165,0.2)" }}
          >
            {m.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={m.photo}
                alt={m.name}
                className="w-20 h-20 rounded-full object-cover mb-4"
                style={{ border: "2px solid rgba(123,158,200,0.4)" }}
              />
            ) : (
              <div
                className="w-20 h-20 rounded-full mb-4 flex items-center justify-center text-xl font-bold"
                style={{ background: "rgba(75,111,165,0.25)", color: "#7B9EC8" }}
              >
                {initials(m.name)}
              </div>
            )}
            <h3 className="font-bold text-white text-base">{m.name}</h3>
            <p className="text-sm font-medium mt-0.5" style={{ color: "#7B9EC8" }}>
              {m.role} · {m.company}
            </p>
            <p className="text-base mt-3 leading-relaxed" style={{ color: "#D5DEEC" }}>
              {m.bio}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
