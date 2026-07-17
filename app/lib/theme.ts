// Portal palette — matched to the live waitlist site (theconnek.com).
// Ground #0F1219, body #D5DEEC, captions #8A99B2. Mentee = blue, mentor = lavender.
export const theme = {
  bg: "#0F1219",
  border: "#1a2a45",
  heading: "#FFFFFF",
  body: "#D5DEEC",
  muted: "#8A99B2",
  faint: "#5A6B85",
  success: "#7ECFB8",
  danger: "#F87171",
  mentee: {
    accent: "#4B6FA5", // buttons / large accents
    text: "#7B9EC8", // small text / links
    soft: "rgba(75,111,165,0.10)",
    softer: "rgba(75,111,165,0.06)",
    border: "rgba(75,111,165,0.22)",
  },
  mentor: {
    accent: "#A897E8", // buttons / large accents
    text: "#C9BFEF", // small text / links
    soft: "rgba(168,151,232,0.10)",
    softer: "rgba(168,151,232,0.06)",
    border: "rgba(168,151,232,0.22)",
  },
} as const;

export type Palette = typeof theme.mentee;
