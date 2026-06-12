import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "You're in",
  description: "Welcome to theconnek. Share it with someone who should be here too.",
  robots: { index: false, follow: true },
};

export default function ThankYouLayout({ children }: { children: React.ReactNode }) {
  return children;
}
