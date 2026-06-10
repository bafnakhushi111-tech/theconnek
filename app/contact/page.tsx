import type { Metadata } from "next";
import NavWithPanel from "../components/NavWithPanel";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Contact | theconnek",
  description: "Get in touch with the theconnek team.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen text-white flex flex-col" style={{ background: "#08090E" }}>
      <NavWithPanel />

      <section className="flex-1 flex flex-col items-center justify-center px-5 py-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#4B6FA5" }}>
          Get in touch
        </p>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Say hello.
        </h1>
        <p className="text-base sm:text-lg max-w-md mx-auto mb-12 leading-relaxed" style={{ color: "#8A9CB8" }}>
          Have a question, feedback, or just want to talk? We&apos;d love to hear from you.
        </p>

        <a
          href="mailto:hello@theconnek.in"
          className="group flex flex-col items-center gap-2 px-10 py-6 rounded-2xl transition-colors"
          style={{ background: "rgba(75,111,165,0.1)", border: "1px solid rgba(75,111,165,0.25)" }}
          onMouseEnter={undefined}
        >
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#4B6FA5" }}>
            Email us
          </span>
          <span className="text-xl sm:text-2xl font-bold" style={{ color: "#7B9EC8" }}>
            hello@theconnek.in
          </span>
          <span className="text-sm mt-1" style={{ color: "#3A4A60" }}>
            We reply within 24 hours
          </span>
        </a>
      </section>

      <Footer />
    </main>
  );
}
