"use client";

import { useMotionValue, useSpring, motion, type Variants, type TargetAndTransition } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function TiltCard({
  children,
  className = "",
  style = {},
  variants,
  whileHover,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variants?: Variants;
  whileHover?: TargetAndTransition;
}) {
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sRotX = useSpring(rotX, { damping: 25, stiffness: 220 });
  const sRotY = useSpring(rotY, { damping: 25, stiffness: 220 });
  const [hasFinePointer, setHasFinePointer] = useState(false);

  useEffect(() => {
    setHasFinePointer(window.matchMedia("(pointer: fine)").matches);
  }, []);

  if (!hasFinePointer) {
    return (
      <motion.div variants={variants} className={className} style={style}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={variants}
      whileHover={whileHover}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        rotX.set(-(((e.clientY - rect.top) / rect.height) - 0.5) * 12);
        rotY.set(((e.clientX - rect.left) / rect.width - 0.5) * 12);
      }}
      onMouseLeave={() => { rotX.set(0); rotY.set(0); }}
      style={{ rotateX: sRotX, rotateY: sRotY, transformPerspective: 800, ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
