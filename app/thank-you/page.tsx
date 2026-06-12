"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Logo from "../components/Logo";
import Footer from "../components/Footer";

const SHARE_URL = "https://www.theconnek.com/?ref=share";
const SHARE_TEXT =
  "I just joined theconnek, real career conversations with people who've been there. No cold DMs, no algorithm. Join me:";

export default function ThankYou() {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — no-op */
    }
  }

  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${SHARE_URL}`)}`;
  const x = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SHARE_URL)}`;

  return (
    <main className="min-h-screen flex flex-col text-white" style={{ background: "#08090E" }}>
      {/* Nav */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{ background: "rgba(8,9,14,0.85)", borderBottom: "1px solid #1a2a45" }}
      >
        <div className="max-w-3xl mx-auto px-5 py-3 flex items-center justify-between">
          <Link href="/">
            <Logo variant="dark" size="sm" />
          </Link>
        </div>
      </nav>

      <section className="flex-1 flex items-center justify-center px-5 py-20" style={{ background: "#0D1628" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg w-full text-center"
        >
          <div className="text-5xl mb-6">🎉</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">You&apos;re in.</h1>
          <p className="text-sm sm:text-base leading-relaxed mb-10" style={{ color: "#8A9CB8" }}>
            Thanks for joining theconnek. We&apos;re building this carefully and in small batches, we&apos;ll
            email you the moment there&apos;s a real conversation waiting for you. Keep an eye on your inbox
            (and your spam folder, just in case).
          </p>

          {/* What happens next */}
          <div
            className="rounded-2xl p-6 mb-10 text-left flex flex-col gap-4"
            style={{ background: "rgba(75,111,165,0.08)", border: "1px solid rgba(75,111,165,0.2)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#4B6FA5" }}>
              What happens next
            </p>
            {[
              "We review every signup personally, no bots, no auto-sorting.",
              "When your batch opens, you'll get an email with how to start your first conversation.",
              "Early members help shape what theconnek becomes. We'll actually listen.",
            ].map((line, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="font-bold text-sm" style={{ color: "#7B9EC8" }}>
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed" style={{ color: "#8093AE" }}>
                  {line}
                </span>
              </div>
            ))}
          </div>

          {/* Share */}
          <p className="font-semibold text-base mb-2 text-white">Know someone who should be in the room?</p>
          <p className="text-sm mb-6" style={{ color: "#8A9CB8" }}>
            theconnek gets better with the right people. Pass it on.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold px-6 py-3 rounded-full text-sm"
              style={{ background: "#4B6FA5", color: "#ffffff" }}
            >
              Share on WhatsApp
            </a>
            <a
              href={x}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold px-6 py-3 rounded-full text-sm"
              style={{ border: "1px solid rgba(75,111,165,0.4)", color: "#7B9EC8" }}
            >
              Share on X
            </a>
            <button
              onClick={copyLink}
              className="font-bold px-6 py-3 rounded-full text-sm"
              style={{ border: "1px solid rgba(75,111,165,0.4)", color: "#7B9EC8" }}
            >
              {copied ? "Copied ✓" : "Copy link"}
            </button>
          </div>

          <div className="mt-12">
            <Link href="/" className="text-sm" style={{ color: "#4B6FA5" }}>
              ← Back home
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
