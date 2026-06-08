"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress({ accent = "#4B6FA5" }: { accent?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { damping: 30, stiffness: 200 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] h-[2px]"
      style={{ scaleX, transformOrigin: "left", background: accent }}
    />
  );
}
