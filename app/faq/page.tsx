import type { Metadata } from "next";
import Link from "next/link";
import NavWithPanel from "../components/NavWithPanel";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Common questions about theconnek, the free networking and mentorship community for students and professionals in India.",
  alternates: { canonical: "/faq" },
};

const FAQS = [
  { q: "Is theconnek free?", a: "Yes, completely. No subscription, no premium tier, no catch. theconnek is free for both students and professionals." },
  { q: "Who is this for?", a: "Any student, undergraduate, postgraduate, MBA, or otherwise, who wants real career conversations. And professionals who are open to sharing their journey. No pedigree filter, no college cutoff." },
  { q: "How does matching work?", a: "We match based on your background, target role, and what you're looking for, then make the introduction. You're always in control of who you talk to." },
  { q: "Do I need to be from a top college?", a: "No. There's no pedigree filter. If you're serious about your career and willing to have real conversations, you belong here." },
  { q: "How soon will I hear back after joining?", a: "We review every signup personally and onboard in small batches. You'll get an email the moment a conversation is ready for you." },
  { q: "I'm a professional — how much time does this take?", a: "As much or as little as you want. No quota, no schedule. One conversation a month is enough to make a real difference for someone." },
  { q: "What is a study circle?", a: "A small group of students targeting the same roles, think shared resources, honest feedback, and accountability without the LinkedIn performativity." },
  { q: "What's guesstimate practice?", a: "A dedicated group to work through guesstimates together. The kind of repetition that actually builds confidence under pressure, with real people, not just recordings." },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function FAQPage() {
  return (
    <main className="min-h-screen text-white" style={{ background: "#0F1219" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <NavWithPanel />

      <section className="px-5 py-20" style={{ background: "#0D1628" }}>
        <div className="max-w-2xl mx-auto">
          <p className="text-sm font-semibold tracking-widest mb-3" style={{ color: "#7B9EC8" }}>FAQ</p>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-12 leading-tight">
            Common questions.
          </h1>

          <div className="flex flex-col gap-4">
            {FAQS.map(({ q, a }) => (
              <div
                key={q}
                className="rounded-2xl p-6"
                style={{ background: "rgba(75,111,165,0.06)", border: "1px solid rgba(75,111,165,0.15)" }}
              >
                <p className="font-semibold text-white text-sm sm:text-base mb-2">{q}</p>
                <p className="text-base leading-relaxed" style={{ color: "#D5DEEC" }}>{a}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-col sm:flex-row gap-4">
            <Link
              href="/#waitlist"
              className="inline-block font-bold px-8 py-4 rounded-full text-sm text-center text-white"
              style={{ background: "#4B6FA5", boxShadow: "0 16px 32px rgba(75,111,165,0.3)" }}
            >
              Join the community, it&apos;s free →
            </Link>
            <Link
              href="/contact"
              className="inline-block font-bold px-8 py-4 rounded-full text-sm text-center"
              style={{ border: "1px solid rgba(75,111,165,0.3)", color: "#7B9EC8" }}
            >
              Still have questions?
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
