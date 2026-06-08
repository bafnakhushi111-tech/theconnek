"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import SidePanel from "./SidePanel";

export default function NavWithPanel() {
  const [panelOpen, setPanelOpen] = useState(false);
  return (
    <>
      <nav
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{ background: "rgba(8,9,14,0.85)", borderBottom: "1px solid #1a2a45" }}
      >
        <div className="max-w-3xl mx-auto px-5 py-3 flex items-center justify-between">
          <Link href="/">
            <Logo variant="dark" size="sm" />
          </Link>
          <button
            onClick={() => setPanelOpen(true)}
            className="flex flex-col items-center justify-center gap-1.5 w-10 h-10 rounded-xl transition-colors"
            style={{ background: "rgba(75,111,165,0.12)" }}
            aria-label="Open menu"
          >
            <span className="block w-5 h-px rounded-full" style={{ background: "#7B9EC8" }} />
            <span className="block w-5 h-px rounded-full" style={{ background: "#7B9EC8" }} />
            <span className="block w-3 h-px rounded-full" style={{ background: "#7B9EC8" }} />
          </button>
        </div>
      </nav>
      <SidePanel open={panelOpen} onClose={() => setPanelOpen(false)} />
    </>
  );
}
