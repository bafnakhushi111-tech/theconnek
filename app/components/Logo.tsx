interface LogoProps {
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
}

const config = {
  sm: { vw: 122, vh: 28, r: 9,  cx: 17, cy1: 5,  cy2: 23, sw: 3.5, dot: 2.8, tx: 24, ty: 21, fs: 20, ls: "-0.6" },
  md: { vw: 158, vh: 38, r: 13, cx: 23, cy1: 7,  cy2: 31, sw: 5,   dot: 4,   tx: 31, ty: 29, fs: 28, ls: "-0.9" },
  lg: { vw: 238, vh: 56, r: 19, cx: 33, cy1: 9,  cy2: 47, sw: 7,   dot: 5.5, tx: 45, ty: 43, fs: 42, ls: "-1.5" },
};

export default function Logo({ variant = "dark", size = "md" }: LogoProps) {
  const c = config[size];
  const arcColor  = "#4B6FA5";
  const dotColor  = "#7B9EC8";
  const textColor = variant === "dark" ? "#ffffff" : "#0D1628";

  return (
    <svg
      width={c.vw}
      height={c.vh}
      viewBox={`0 0 ${c.vw} ${c.vh}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Connek"
    >
      <path
        d={`M${c.cx} ${c.cy1} A${c.r} ${c.r} 0 1 0 ${c.cx} ${c.cy2}`}
        stroke={arcColor}
        strokeWidth={c.sw}
        strokeLinecap="round"
      />
      <circle cx={c.cx} cy={c.cy2} r={c.dot} fill={dotColor} />
      <text
        x={c.tx}
        y={c.ty}
        fontFamily="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
        fontWeight="800"
        fontSize={c.fs}
        fill={textColor}
        letterSpacing={c.ls}
      >
        onnek
      </text>
    </svg>
  );
}
