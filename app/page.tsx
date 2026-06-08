"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView, AnimatePresence, type Variants } from "framer-motion";
import Logo from "./components/Logo";
import Footer from "./components/Footer";
import Mentors from "./components/Mentors";
import SidePanel from "./components/SidePanel";
import TextReveal from "./components/TextReveal";
import MarqueeStrip from "./components/MarqueeStrip";
import CursorGlow from "./components/CursorGlow";
import TiltCard from "./components/TiltCard";
import ScrollProgress from "./components/ScrollProgress";

type UserType = "candidate" | "professional";

const CANDIDATE_ROLES = ["Consulting", "Strategy", "Finance", "Investment Banking", "Private Equity", "High-Growth Startups", "Other"];
const PROFESSIONAL_ROLES = ["Consulting", "Strategy", "Finance", "Investment Banking", "Private Equity", "Startups / VC", "Product & Technology", "Other"];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function FadeSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} className={className}>
      {children}
    </motion.div>
  );
}

const content = {
  candidate: {
    headline: "Real conversations.",
    headlineGradient: "Real careers.",
    sub: "Connect with peers figuring it out alongside you, and professionals willing to actually talk. No cold DMs. No pretending.",
    whyHeadline: "Networking isn't what it used to be.",
    why: [
      "Networking has become posting, reacting, and sending connection requests to people you'll never actually speak to. Nobody really talks anymore.",
      "The conversations that actually change careers, honest, specific, human, happen in small rooms, at the right events, or through the right introduction. Most people never get access to those rooms.",
    ],
    whyClose: "Connek is trying to change that. Not with an algorithm. Just by making it easier for people to actually talk to each other.",
    valuePropHeadline: "What you get.",
    valueProps: [
      { icon: "✦", title: "Talk to people who've been there", body: "Not influencers. People 2-3 steps ahead who remember what it felt like to figure it out, and are willing to talk." },
      { icon: "✦", title: "Find your people", body: "Peers who get the pressure you're under. People to be honest with, accountable to, and occasionally just vent to." },
      { icon: "✦", title: "A referral", body: "A warm introduction from someone inside is worth more than ten cold applications. And it starts with one real conversation." },
      { icon: "✦", title: "Career clarity", body: "Not sure which path is right? Talking to people across consulting, finance, and strategy helps you figure out where you actually want to go." },
    ],
    steps: [
      { step: "01", title: "Join the community", body: "Free to join. Tell us a bit about where you are and where you're headed." },
      { step: "02", title: "Connect with peers and professionals", body: "Find people at the same stage, or reach out to someone a few steps ahead who's open to talking." },
      { step: "03", title: "Just talk", body: "Have the conversation. That's really it." },
    ],
    extras: [],
    formTitle: "Come join us.",
    formSub: "Free to join. No algorithm. Just people.",
    institutionLabel: "College / University",
    institutionPlaceholder: "e.g. Symbiosis, NMIMS, Christ University",
    roleLabel: "Target role",
    roleOptions: CANDIDATE_ROLES,
  },
  professional: {
    headline: "A 30-minute conversation",
    headlineGradient: "can change someone's direction.",
    sub: "Connek connects you with students and early professionals genuinely trying to figure out their careers. No commitment. Talk when you want.",
    whyHeadline: "Someone helped you once.",
    why: [
      "There was a conversation, maybe a coffee chat, maybe a chance introduction, that gave you clarity when you needed it most. Something someone said that stuck.",
      "Most people don't get that conversation. Not because the people who could help aren't willing, but because there's no easy way to find each other.",
    ],
    whyClose: "Connek is that easy way.",
    valuePropHeadline: "What you get.",
    valueProps: [
      { icon: "✦", title: "Give what you wish you'd had", body: "The honest advice, the insider context, the things that took you years to figure out. Pass it on." },
      { icon: "✦", title: "No commitment required", body: "Show up when you want, talk to who you want. No quota, no schedule. Just conversations when it works for you." },
      { icon: "✦", title: "The people you meet will surprise you", body: "Smart, driven people who just didn't have the right network. Some of the best conversations come from unexpected places." },
    ],
    steps: [
      { step: "01", title: "Join the community", body: "Tell us about your background and what you're open to talking about." },
      { step: "02", title: "Set your availability", body: "Share how often you're open to chats. You're always in control of who you talk to." },
      { step: "03", title: "Talk when it works for you", body: "Someone reaches out. You decide if you want to connect. That's it." },
    ],
    extras: [],
    formTitle: "Join as a professional.",
    formSub: "Free. No commitment. Just conversations when you want them.",
    institutionLabel: "Company",
    institutionPlaceholder: "e.g. McKinsey, Goldman Sachs, your startup",
    roleLabel: "Position",
    roleOptions: PROFESSIONAL_ROLES,
  },
};

export default function Home() {
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>("candidate");
  const [form, setForm] = useState({ name: "", email: "", college: "", role: "", location: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);

  function handleToggle(type: UserType) {
    setUserType(type);
    setForm({ name: "", email: "", college: "", role: "", location: "" });
    setSubmitted(false);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, user_type: userType, location: form.location }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setSubmitted(true);
        router.push("/thank-you");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  const c = content[userType];

  const accent      = userType === "candidate" ? "#4B6FA5" : "#A897E8";
  const accentLight = userType === "candidate" ? "#7B9EC8" : "#C9BFEF";
  const accentRgb   = userType === "candidate" ? "75,111,165" : "168,151,232";
  const accentLRgb  = userType === "candidate" ? "123,158,200" : "201,191,239";
  const ab = (o: number) => `rgba(${accentRgb},${o})`;
  const al = (o: number) => `rgba(${accentLRgb},${o})`;
  const heroBg      = userType === "candidate" ? "#0D1628" : "#0F0D1A";

  return (
    <main className="min-h-screen text-white" style={{ background: "#08090E" }}>
      <ScrollProgress accent={accent} />
      <CursorGlow accent={accent} />

      {/* ── Nav ── */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ background: "rgba(8,9,14,0.85)", borderBottom: "1px solid #1a2a45" }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
      >
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
          <Logo variant="dark" size="sm" />
          <button
            onClick={() => setPanelOpen(true)}
            className="flex flex-col items-center justify-center gap-1.5 w-10 h-10 rounded-xl transition-colors"
            style={{ background: ab(0.12) }}
            aria-label="Open menu"
          >
            <span className="block w-5 h-px rounded-full" style={{ background: accentLight }} />
            <span className="block w-5 h-px rounded-full" style={{ background: accentLight }} />
            <span className="block w-3 h-px rounded-full" style={{ background: accentLight }} />
          </button>
        </div>
      </motion.nav>
      <SidePanel open={panelOpen} onClose={() => setPanelOpen(false)} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28" style={{ background: heroBg }}>
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.28, 0.2], background: accent }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl -translate-y-1/2"
          style={{ background: accent }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.18, 0.12] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full blur-3xl translate-y-1/3"
          style={{ background: accentLight }}
        />

        <div className="relative max-w-4xl mx-auto px-5 text-center">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="flex flex-col items-center">

            {/* Toggle */}
            <motion.div
              variants={fadeUp}
              className="flex items-center rounded-full p-1 mb-10"
              style={{ background: ab(0.15), border: `1px solid ${al(0.25)}` }}
            >
              <button
                onClick={() => handleToggle("candidate")}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                style={userType === "candidate"
                  ? { background: accent, color: "#ffffff" }
                  : { color: al(0.55) }}
              >
                I&apos;m here to grow
              </button>
              <button
                onClick={() => handleToggle("professional")}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                style={userType === "professional"
                  ? { background: accent, color: "#ffffff" }
                  : { color: al(0.55) }}
              >
                I want to give back
              </button>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={userType}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
                  <TextReveal text={c.headline} once={false} />
                  <br />
                  <TextReveal text={c.headlineGradient} style={{ color: accentLight }} once={false} delay={0.18} />
                </h1>

                <p className="text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: "#6B7FA3" }}>
                  {c.sub}
                </p>

                <motion.a
                  href="#waitlist"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-block font-bold px-8 py-4 rounded-full text-sm md:text-base"
                  style={{ background: accent, color: "#ffffff", boxShadow: `0 20px 40px ${ab(0.3)}` }}
                >
                  Join the community →
                </motion.a>
                <p className="text-xs mt-4" style={{ color: "#2A3A50" }}>Free to join · No spam · No algorithm</p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section style={{ borderBottom: "1px solid #1a2a45", background: "#08090E" }}>
        <div className="max-w-4xl mx-auto px-5 py-8 grid grid-cols-3 gap-4 text-center">
          {[
            { stat: "Real conversations", sub: "Not cold DMs" },
            { stat: "No algorithm", sub: "You choose who you talk to" },
            { stat: "Free, always", sub: "No catch" },
          ].map(({ stat, sub }) => (
            <div key={stat} className="flex flex-col items-center">
              <div className="text-lg sm:text-xl font-bold text-white">{stat}</div>
              <div className="text-xs sm:text-sm mt-1 leading-snug" style={{ color: "#6B7FA3" }}>{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Marquee ── */}
      <MarqueeStrip accent={accent} />

      {/* ── Peer community feature (candidates only) ── */}
      <AnimatePresence>
        {userType === "candidate" && (
          <motion.section
            key="peer-community"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden py-20"
            style={{ background: heroBg }}
          >
            <div className="max-w-4xl mx-auto px-5">
              <FadeSection>
                <p className="text-xs font-semibold uppercase tracking-widest text-center mb-3" style={{ color: accentLight }}>
                  More than just mentors
                </p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white mb-4">
                  Built for the full journey.
                </h2>
                <p className="text-center text-sm sm:text-base max-w-xl mx-auto mb-14" style={{ color: "#6B7FA3" }}>
                  While you wait for the right conversation, there&apos;s a whole community already figuring it out alongside you.
                </p>
              </FadeSection>
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, margin: "-80px" }}
                className="grid sm:grid-cols-3 gap-6"
              >
                {[
                  {
                    num: "01",
                    title: "Case competition prep",
                    body: "Find people to practice with. Real rounds with real people, not just watching recordings alone and hoping it clicks.",
                  },
                  {
                    num: "02",
                    title: "Guesstimate practice",
                    body: "A dedicated group to work through guesstimates together. The kind of repetition that actually builds confidence under pressure.",
                  },
                  {
                    num: "03",
                    title: "Study circles",
                    body: "Small groups targeting the same roles. Shared resources, honest feedback, and accountability, without the LinkedIn performativity.",
                  },
                ].map(({ num, title, body }) => (
                  <TiltCard
                    key={num}
                    variants={fadeUp}
                    className="rounded-2xl p-7"
                    style={{ background: ab(0.06), border: `1px solid ${ab(0.18)}` }}
                  >
                    <div className="text-3xl font-black mb-5 leading-none" style={{ color: ab(0.3) }}>{num}</div>
                    <h3 className="font-bold text-white text-base mb-3">{title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#6B7FA3" }}>{body}</p>
                  </TiltCard>
                ))}
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── Mentors grid (renders only once real people are added) ── */}
      <Mentors />

      {/* ── Why Connek ── */}
      <AnimatePresence mode="wait">
        <motion.div key={`why-${userType}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          <FadeSection className="max-w-3xl mx-auto px-5 py-20 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-snug text-white">
              <TextReveal text={c.whyHeadline} />
            </h2>
            {c.why.map((para, i) => (
              <p key={i} className="leading-relaxed mb-5 text-sm sm:text-base" style={{ color: "#6B7FA3" }}>{para}</p>
            ))}
            <p className="font-semibold text-base sm:text-lg" style={{ color: accentLight }}>{c.whyClose}</p>
          </FadeSection>
        </motion.div>
      </AnimatePresence>

      {/* ── Value props ── */}
      <section className="py-20" style={{ background: heroBg }}>
        <div className="max-w-4xl mx-auto px-5">
          <AnimatePresence mode="wait">
            <motion.div key={`vp-${userType}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <FadeSection>
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-12">{c.valuePropHeadline}</h2>
              </FadeSection>
              <motion.div
                key={`vp-grid-${userType}`}
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, margin: "-80px" }}
                className={`grid gap-5 ${userType === "candidate" ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}
              >
                {c.valueProps.map(({ icon, title, body }) => (
                  <TiltCard
                    key={title}
                    variants={fadeUp}
                    className="rounded-2xl p-6"
                    style={{ background: ab(0.08), border: `1px solid ${ab(0.2)}` }}
                  >
                    <div className="text-xl mb-4" style={{ color: accentLight }}>{icon}</div>
                    <h3 className="font-semibold text-white mb-2 text-sm sm:text-base">{title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#6B7FA3" }}>{body}</p>
                  </TiltCard>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-4xl mx-auto px-5 py-20">
        <FadeSection>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-12">How it works.</h2>
        </FadeSection>
        <AnimatePresence mode="wait">
          <motion.div key={`steps-${userType}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: "-80px" }}
              className="grid sm:grid-cols-3 gap-6 sm:gap-8"
            >
              {c.steps.map(({ step, title, body }, i) => (
                <motion.div key={step} variants={fadeUp} className="relative flex flex-col">
                  <h3 className="font-bold text-base mb-2 z-10" style={{ color: accentLight }}>{step}. {title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B7FA3" }}>{body}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── Join form ── */}
      <section id="waitlist" className="py-20" style={{ background: heroBg }}>
        <div className="max-w-lg mx-auto px-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={`form-${userType}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-2xl p-8 text-center"
                  style={{ background: ab(0.12), border: `1px solid ${ab(0.3)}` }}
                >
                  <div className="text-4xl mb-4">🎉</div>
                  <h3 className="text-xl font-bold mb-2 text-white">You&apos;re in.</h3>
                  <p className="text-sm" style={{ color: "#6B7FA3" }}>
                    We&apos;ll be in touch at <span className="text-white font-medium">{form.email}</span>.
                    <br className="hidden sm:block" />Share this with someone who should be in the room.
                  </p>
                </motion.div>
              ) : (
                <>
                  <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-3">{c.formTitle}</h2>
                  <p className="text-center text-sm sm:text-base mb-10" style={{ color: "#6B7FA3" }}>{c.formSub}</p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                      { label: "Full name", key: "name", type: "text", placeholder: "Priya Sharma" },
                      { label: "Email", key: "email", type: "email", placeholder: "priya@example.com" },
                      { label: "Location", key: "location", type: "text", placeholder: "e.g. Mumbai, Bangalore" },
                      { label: c.institutionLabel, key: "college", type: "text", placeholder: c.institutionPlaceholder },
                    ].map(({ label, key, type, placeholder }) => (
                      <div key={key}>
                        <label className="block text-sm font-medium mb-1" style={{ color: accentLight }}>{label}</label>
                        <input
                          type={type}
                          required
                          placeholder={placeholder}
                          value={form[key as keyof typeof form]}
                          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                          className="w-full rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                          style={{ background: ab(0.1), border: `1px solid ${ab(0.25)}` }}
                          onFocus={(e) => (e.target.style.border = `1px solid ${accent}`)}
                          onBlur={(e) => (e.target.style.border = `1px solid ${ab(0.25)}`)}
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: accentLight }}>{c.roleLabel}</label>
                      {userType === "professional" ? (
                        <input
                          type="text"
                          required
                          placeholder="e.g. Associate, VP Strategy, Founder"
                          value={form.role}
                          onChange={(e) => setForm({ ...form, role: e.target.value })}
                          className="w-full rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                          style={{ background: ab(0.1), border: `1px solid ${ab(0.25)}` }}
                          onFocus={(e) => (e.target.style.border = `1px solid ${accent}`)}
                          onBlur={(e) => (e.target.style.border = `1px solid ${ab(0.25)}`)}
                        />
                      ) : (
                        <select
                          required
                          value={form.role}
                          onChange={(e) => setForm({ ...form, role: e.target.value })}
                          className="w-full rounded-xl px-4 py-3 text-sm text-white focus:outline-none appearance-none"
                          style={{ background: ab(0.1), border: `1px solid ${ab(0.25)}` }}
                        >
                          <option value="" style={{ background: heroBg }}>Select a role</option>
                          {c.roleOptions.map((r) => (
                            <option key={r} value={r} style={{ background: heroBg }}>{r}</option>
                          ))}
                        </select>
                      )}
                    </div>
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full font-bold py-3 rounded-xl transition-colors disabled:opacity-50 mt-2 text-white"
                      style={{ background: accent }}
                    >
                      {loading ? "Joining..." : "Join →"}
                    </motion.button>
                  </form>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Footer ── */}
      <Footer />
    </main>
  );
}
