import type { Metadata } from "next";
import NavWithPanel from "../components/NavWithPanel";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "About — Connek",
  description: "Why we built Connek — and the networking gap we couldn't find a solution for.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen text-white" style={{ background: "#08090E" }}>
      <NavWithPanel />

      <section className="px-5 py-20" style={{ background: "#0D1628" }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold tracking-widest mb-3" style={{ color: "#4B6FA5" }}>
            OUR STORY
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-12 leading-tight">
            Why we built Connek.
          </h1>
          <div className="flex flex-col gap-6 text-base sm:text-lg leading-relaxed" style={{ color: "#8093AE" }}>
            <p>
              While I am doing my MBA programme, I realised within weeks that the conversations that
              actually matter, which firm to target, how to crack a case interview, what consulting
              really looks like from the inside, were happening in rooms I wasn&apos;t in. I sent cold
              emails. I slid into LinkedIn DMs. Most went unanswered. The ones that didn&apos;t felt
              transactional.
            </p>
            <p>
              MBA networking has become a performance. You post on LinkedIn, do cold outreach, show up to
              events. But when you need a partner to practice guesstimates with at 11pm, or someone to do
              a case competition with, or a professional who&apos;ll give you honest advice about their
              field, there&apos;s no real place to find them. The conversations that change careers happen
              through luck and proximity, not effort. That felt wrong.
            </p>
            <p>
              Connek is built around the conversations I couldn&apos;t find. A community for real case
              prep, guesstimate practice, and mentor-mentee relationships built through proper matching —
              not cold DMs. No pedigree filter. No algorithm deciding who you should know. Just people who want to talk and people who want to listen.
            </p>
            <p style={{ color: "#B8C6DC" }}>
              We&apos;re just getting started. But if you&apos;ve ever felt locked out of the
              conversation, this is for you.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
