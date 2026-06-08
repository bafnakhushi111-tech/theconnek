"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorGlow({ accent = "#4B6FA5" }: { accent?: string }) {
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const [active, setActive] = useState(false);

  const springX = useSpring(x, { damping: 35, stiffness: 180 });
  const springY = useSpring(y, { damping: 35, stiffness: 180 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setActive(true);
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  if (!active) return null;

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        width: 520,
        height: 520,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${accent}12 0%, transparent 68%)`,
        pointerEvents: "none",
        zIndex: 2,
      }}
    />
  );
}
