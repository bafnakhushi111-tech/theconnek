import { ImageResponse } from "next/og";

export const alt = "Connek — Real conversations. Real careers.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The brand "C" arc mark + dot, drawn as an inline SVG (matches app/components/Logo.tsx).
const markSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="none"><path d="M60 18 A42 42 0 1 0 60 102" stroke="#4B6FA5" stroke-width="11" stroke-linecap="round"/><circle cx="60" cy="102" r="8" fill="#7B9EC8"/></svg>`;
const markSrc = `data:image/svg+xml;utf8,${encodeURIComponent(markSvg)}`;

// Load Plus Jakarta Sans from Google Fonts so the wordmark renders at the right weight.
async function loadFont(weight: number, text: string): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/);
    if (!src) return null;
    const res = await fetch(src[1]);
    if (res.status !== 200) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function Image() {
  const headline = "Connek";
  const tagline = "Real conversations. Real careers.";
  const sub = "Coffee chats with consultants, bankers, and PE professionals — for students, not cold DMs.";

  const [bold, regular] = await Promise.all([
    loadFont(800, headline + tagline),
    loadFont(500, sub + "theconnek.com"),
  ]);

  const fonts = [
    bold && { name: "Jakarta", data: bold, weight: 800 as const, style: "normal" as const },
    regular && { name: "Jakarta", data: regular, weight: 500 as const, style: "normal" as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 800 | 500; style: "normal" }[];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 90px",
          background: "linear-gradient(135deg, #08090E 0%, #0D1628 55%, #16233D 100%)",
          fontFamily: "Jakarta",
        }}
      >
        {/* Brand lockup */}
        <div style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 48 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={markSrc} width={92} height={92} alt="" />
          <span style={{ fontSize: 64, fontWeight: 800, color: "#ffffff", letterSpacing: "-2px" }}>
            {headline}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 68,
            fontWeight: 800,
            letterSpacing: "-2.5px",
            lineHeight: 1.12,
          }}
        >
          <span style={{ color: "#ffffff" }}>Real conversations.</span>
          <span style={{ color: "#7B9EC8" }}>Real careers.</span>
        </div>

        <div
          style={{
            marginTop: 34,
            fontSize: 30,
            fontWeight: 500,
            color: "#6B7FA3",
            lineHeight: 1.45,
            maxWidth: 880,
            display: "flex",
          }}
        >
          {sub}
        </div>

        <div
          style={{
            marginTop: "auto",
            paddingTop: 40,
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 26,
            fontWeight: 500,
            color: "#4B6FA5",
          }}
        >
          <span style={{ display: "flex", width: 10, height: 10, borderRadius: 5, background: "#4B6FA5" }} />
          theconnek.com
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined }
  );
}
