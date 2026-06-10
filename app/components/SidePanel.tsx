"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Logo from "./Logo";

const NAV_LINKS: { label: string; href: string; external?: boolean; sub?: string }[] = [
  { label: "Home", href: "/" },
  { label: "Join", href: "/#waitlist" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Instagram", href: "https://instagram.com/_the_connek", external: true },
  { label: "Contact Us", href: "/contact", sub: "hello@theconnek.in" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
];

export default function SidePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full z-50 flex flex-col"
            style={{
              width: "min(320px, 85vw)",
              background: "#0A0E1A",
              borderLeft: "1px solid #1a2a45",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid #1a2a45" }}>
              <Logo variant="dark" size="sm" />
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                style={{ background: "rgba(75,111,165,0.12)", color: "#7B9EC8" }}
                aria-label="Close menu"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Links */}
            <nav className="flex flex-col px-4 py-6 gap-1 flex-1">
              {NAV_LINKS.map(({ label, href, external, sub }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.1, duration: 0.25 }}
                >
                  {external ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      onClick={onClose}
                      className="flex items-center justify-between w-full px-4 py-3 rounded-xl transition-colors group"
                      style={{ color: "#8093AE" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(75,111,165,0.1)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <span className="flex flex-col gap-0.5">
                        <span className="text-base font-medium">{label}</span>
                        {sub && <span className="text-xs" style={{ color: "#4B6FA5" }}>{sub}</span>}
                      </span>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-40 group-hover:opacity-80 transition-opacity flex-shrink-0">
                        <path d="M2 7H12M7 2L12 7L7 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  ) : (
                    <Link
                      href={href}
                      onClick={onClose}
                      className="flex items-center justify-between w-full px-4 py-3 rounded-xl transition-colors group"
                      style={{ color: "#8093AE" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(75,111,165,0.1)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <span className="text-base font-medium">{label}</span>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-40 group-hover:opacity-80 transition-opacity">
                        <path d="M2 7H12M7 2L12 7L7 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  )}
                </motion.div>
              ))}
            </nav>

            {/* Footer */}
            <div className="px-6 py-5" style={{ borderTop: "1px solid #1a2a45" }}>
              <a
                href="/#waitlist"
                onClick={onClose}
                className="block w-full text-center font-bold py-3 rounded-full text-sm transition-opacity hover:opacity-90"
                style={{ background: "#4B6FA5", color: "#fff" }}
              >
                Join the community →
              </a>
              <p className="text-center text-xs mt-3" style={{ color: "#2A3A50" }}>
                © {2026} theconnek · Real conversations. That&apos;s it.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
