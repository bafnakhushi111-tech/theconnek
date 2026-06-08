"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function TextReveal({
  text,
  className = "",
  style = {},
  delay = 0,
  once = true,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  once?: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-30px" });
  const words = text.split(" ");

  return (
    <span ref={ref} className={className} style={{ display: "inline", ...style }}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", paddingBottom: "0.05em" }}
        >
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ y: "108%", opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: "108%", opacity: 0 }}
            transition={{
              duration: 0.55,
              delay: delay + i * 0.055,
              ease: [0.33, 1, 0.68, 1],
            }}
          >
            {word}{i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
