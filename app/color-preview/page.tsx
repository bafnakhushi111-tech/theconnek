export const metadata = {
  robots: { index: false, follow: false },
};

export default function ColorPreview() {
  const options = [
    {
      label: "Option A — Mint",
      accent: "#7ECFB8",
      accentLight: "#B5E8DA",
      accentRgb: "126,207,184",
      accentLRgb: "181,232,218",
      heroBg: "#0D1714",
    },
    {
      label: "Option B — Lavender",
      accent: "#A897E8",
      accentLight: "#C9BFEF",
      accentRgb: "168,151,232",
      accentLRgb: "201,191,239",
      heroBg: "#0F0D1A",
    },
    {
      label: "Option C — Champagne",
      accent: "#D4B896",
      accentLight: "#E8D5C0",
      accentRgb: "212,184,150",
      accentLRgb: "232,213,192",
      heroBg: "#18130D",
    },
  ];

  return (
    <main style={{ background: "#0F1219", minHeight: "100vh", padding: "40px 20px" }}>
      <p style={{ color: "#8A99B2", fontSize: 12, textAlign: "center", marginBottom: 48, letterSpacing: "0.1em", textTransform: "uppercase" }}>
        Professional view — light options
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 48, maxWidth: 640, margin: "0 auto" }}>
        {options.map(({ label, accent, accentLight, accentRgb, accentLRgb, heroBg }) => {
          const ab = (o: number) => `rgba(${accentRgb},${o})`;
          const al = (o: number) => `rgba(${accentLRgb},${o})`;
          return (
            <div key={label} style={{ borderRadius: 20, overflow: "hidden", border: "1px solid #1a2a45" }}>
              <div style={{ background: "#0D1020", padding: "12px 20px", borderBottom: "1px solid #1a2a45" }}>
                <p style={{ color: "#6B7FA3", fontSize: 13, fontWeight: 600 }}>{label}</p>
              </div>

              <div style={{ background: heroBg, padding: "40px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
                <div style={{ position: "relative", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
                  <div style={{ position: "absolute", top: -40, left: "20%", width: 200, height: 200, borderRadius: "50%", background: accent, opacity: 0.15, filter: "blur(60px)", pointerEvents: "none" }} />

                  {/* Toggle */}
                  <div style={{ display: "flex", alignItems: "center", borderRadius: 999, padding: 4, background: ab(0.12), border: `1px solid ${al(0.2)}`, position: "relative", zIndex: 1 }}>
                    <div style={{ padding: "8px 20px", borderRadius: 999, background: "transparent", color: al(0.45), fontSize: 13, fontWeight: 600 }}>
                      I&apos;m here to grow
                    </div>
                    <div style={{ padding: "8px 20px", borderRadius: 999, background: accent, color: "#0F1219", fontSize: 13, fontWeight: 700, boxShadow: `0 4px 20px ${ab(0.35)}` }}>
                      I want to give back
                    </div>
                  </div>

                  {/* Headline */}
                  <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                    <p style={{ color: "#fff", fontSize: 28, fontWeight: 800, lineHeight: 1.2, marginBottom: 6 }}>
                      A 30-minute conversation
                    </p>
                    <p style={{ color: accentLight, fontSize: 28, fontWeight: 800, lineHeight: 1.2 }}>
                      can change someone&apos;s direction.
                    </p>
                  </div>

                  {/* CTA */}
                  <a href="#" style={{ background: accent, color: "#0F1219", fontWeight: 700, padding: "14px 32px", borderRadius: 999, fontSize: 14, textDecoration: "none", boxShadow: `0 16px 32px ${ab(0.25)}`, position: "relative", zIndex: 1 }}>
                    Join the community →
                  </a>

                  {/* Card */}
                  <div style={{ width: "100%", borderRadius: 16, padding: "20px 24px", background: ab(0.07), border: `1px solid ${ab(0.18)}`, position: "relative", zIndex: 1 }}>
                    <div style={{ color: accentLight, fontSize: 18, marginBottom: 10 }}>✦</div>
                    <p style={{ color: "#fff", fontWeight: 600, fontSize: 14, marginBottom: 6 }}>Give what you wish you&apos;d had</p>
                    <p style={{ color: "#6B7FA3", fontSize: 13, lineHeight: 1.6 }}>The honest advice, the insider context — the things that took you years to figure out.</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
