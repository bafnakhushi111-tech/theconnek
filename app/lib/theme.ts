// Portal palette - matched to the live waitlist site (theconnek.com).
// Ground #0F1219, body #E6EDF7, captions #B9C7DC. Mentee = blue, mentor = lavender.
export const theme = {
  bg: "#0F1219",
  border: "#1a2a45",
  heading: "#FFFFFF",
  body: "#E6EDF7",
  muted: "#B9C7DC",
  faint: "#97A7BF",
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
