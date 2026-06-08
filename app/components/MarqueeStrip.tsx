"use client";

import { motion } from "framer-motion";

const ITEMS = [
  "Real conversations",
  "No cold DMs",
  "No algorithm",
  "Just people",
  "Free to join",
  "No gatekeeping",
  "Real conversations",
  "No cold DMs",
  "No algorithm",
  "Just people",
  "Free to join",
  "No gatekeeping",
];

export default function MarqueeStrip({ accent = "#4B6FA5" }: { accent?: string }) {
  return (
    <div
      style={{
        overflow: "hidden",
        borderTop: "1px solid #1a2a45",
        borderBottom: "1px solid #1a2a45",
        background: "#08090E",
        padding: "13px 0",
      }}
    >
      <motion.div
        style={{ display: "flex", width: "max-content" }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        {ITEMS.map((item, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              paddingRight: 36,
              color: "#3A4A60",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            {item}
            <span style={{ marginLeft: 36, color: accent, opacity: 0.4 }}>✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
