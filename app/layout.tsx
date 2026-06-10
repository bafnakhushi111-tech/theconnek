import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Analytics from "./components/Analytics";
import CookieBanner from "./components/CookieBanner";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://theconnek.com"),
  title: "theconnek | MBA Networking & Career Mentorship Community India",
  description: "theconnek connects MBA students and early professionals with industry mentors for real career conversations. No cold DMs, no algorithm. Free to join. Built for India.",
  keywords: "MBA networking India, career mentorship, MBA community, consulting career advice, IIM networking, case competition prep, guesstimate practice, career conversations, mentorship platform India",
  openGraph: {
    title: "theconnek | MBA Networking & Career Mentorship Community India",
    description: "Real career conversations with professionals who've been there. No cold DMs. No algorithm. Free to join.",
    url: "https://theconnek.com",
    siteName: "theconnek",
    type: "website",
    locale: "en_IN",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "theconnek, Real conversations. Real careers." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "theconnek | MBA Networking & Career Mentorship Community India",
    description: "Real career conversations with professionals who've been there. No cold DMs. No algorithm. Free to join.",
    site: "@_the_connek",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "https://theconnek.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "theconnek",
  url: "https://theconnek.com",
  logo: "https://theconnek.com/icon.svg",
  description: "A community platform connecting MBA students and early professionals with industry mentors for real career conversations.",
  sameAs: ["https://www.instagram.com/_the_connek"],
  foundingLocation: {
    "@type": "Place",
    addressCountry: "IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${plusJakartaSans.className} min-h-full flex flex-col`}>
        {children}
        <Analytics />
        <CookieBanner />
      </body>
    </html>
  );
}
