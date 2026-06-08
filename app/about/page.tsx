import type { Metadata } from "next";
import Link from "next/link";
import Logo from "../components/Logo";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "About — Connek",
  description: "Why Khushi Bafna built Connek — and the networking gap she couldn't find a solution for.",
};

const FOUNDER = {
  name: "Khushi Bafna",
  title: "Founder, Connek",
  photo: "", // add "/team/khushi.jpg" when photo is ready
};

// Add advisors as they come on board (name + one credential line). Hidden while empty.
const ADVISORS: { name: string; credential: string }[] = [];

function initials(name: string) {
  return name.replace(/[[\]]/g, "").split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "C";
}

export default function AboutPage() {
  return (
    <main className="min-h-screen text-white" style={{ background: "#08090E" }}>
      {/* Nav */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{ background: "rgba(8,9,14,0.85)", borderBottom: "1px solid #1a2a45" }}
      >
        <div className="max-w-3xl mx-auto px-5 py-3 flex items-center justify-between">
          <Link href="/">
            <Logo variant="dark" size="sm" />
          </Link>
          <Link href="/#waitlist" className="text-sm font-semibold px-5 py-2 rounded-full" style={{ background: "#4B6FA5", color: "#fff" }}>
            Join the community
          </Link>
        </div>
      </nav>

      <section className="px-5 py-16" style={{ background: "#0D1628" }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold tracking-widest mb-3" style={{ color: "#4B6FA5" }}>
            OUR STORY
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Why we built Connek.
          </h1>
          <div className="flex flex-col gap-5 text-base sm:text-lg leading-relaxed" style={{ color: "#8093AE" }}>
            <p>
              I joined IIT Jodhpur&apos;s MBA programme and realised within weeks that the conversations
              that actually matter — which firm to target, how to crack a case interview, what consulting
              really looks like from the inside — were happening in rooms I wasn&apos;t in. I sent cold
              emails. I slid into LinkedIn DMs. Most went unanswered. The ones that didn&apos;t felt
              transactional.
            </p>
            <p>
              MBA networking has become a performance. You post on LinkedIn, do cold outreach, show up to
              events. But when you need a partner to practice guesstimates with at 11pm, or someone to do
              a case comp with, or a professional who&apos;ll give you honest advice about their field —
              there&apos;s no real place to find them. The conversations that change careers happen through
              luck and proximity, not effort. That felt wrong.
            </p>
            <p>
              Connek is built around the conversations I couldn&apos;t find. A community for real case
              prep, guesstimate practice, and mentor-mentee relationships built through proper matching —
              not cold DMs. No pedigree filter. No algorithm deciding who you should know. Just people
              who want to talk and people who want to listen.
            </p>
            <p style={{ color: "#B8C6DC" }}>
              We&apos;re just getting started. But if you&apos;ve ever felt locked out of the
              conversation, this is for you.
            </p>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="max-w-3xl mx-auto px-5 py-16">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {FOUNDER.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={FOUNDER.photo}
              alt={FOUNDER.name}
              className="w-24 h-24 rounded-full object-cover"
              style={{ border: "2px solid rgba(123,158,200,0.4)" }}
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
              style={{ background: "rgba(75,111,165,0.25)", color: "#7B9EC8" }}
            >
              {initials(FOUNDER.name)}
            </div>
          )}
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-white">{FOUNDER.name}</h2>
            <p className="text-sm font-medium mt-0.5 mb-3" style={{ color: "#7B9EC8" }}>
              {FOUNDER.title}
            </p>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#8093AE" }}>
              I&apos;m an extrovert who still couldn&apos;t crack the networking code. I was a dentist
              who wanted to pivot into business — so I did everything right. Cold emails. LinkedIn
              messages. Thoughtful, personalised outreach. Weeks would pass. No reply. I got into IIT
              Jodhpur&apos;s MBA thinking it would get easier. It didn&apos;t. The tools were the same,
              just louder. I built Connek because if someone like me — someone who genuinely wants to
              connect — was struggling this much, something was broken with the system, not with us.
            </p>
          </div>
        </div>

        {ADVISORS.length > 0 && (
          <div className="mt-14">
            <h3 className="text-lg font-bold text-white mb-6">Advisors</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {ADVISORS.map((a) => (
                <div
                  key={a.name}
                  className="rounded-xl p-4 flex items-center gap-4"
                  style={{ background: "rgba(75,111,165,0.08)", border: "1px solid rgba(75,111,165,0.2)" }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ background: "rgba(75,111,165,0.25)", color: "#7B9EC8" }}
                  >
                    {initials(a.name)}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{a.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#6B7FA3" }}>
                      {a.credential}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
