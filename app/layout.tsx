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
  metadataBase: new URL("https://www.theconnek.com"),
  title: {
    default: "theconnek | MBA Networking & Career Mentorship Community India",
    template: "%s | theconnek",
  },
  description: "theconnek connects MBA students and early professionals with industry mentors for real career conversations. No cold DMs, no algorithm. Free to join. Built for India.",
  keywords: "theconnek, connek, MBA networking India, career mentorship, MBA community, consulting career advice, IIM networking, case competition prep, guesstimate practice, career conversations, mentorship platform India",
  applicationName: "theconnek",
  openGraph: {
    title: "theconnek | MBA Networking & Career Mentorship Community India",
    description: "Real career conversations with professionals who've been there. No cold DMs. No algorithm. Free to join.",
    url: "https://www.theconnek.com",
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
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://www.theconnek.com/#organization",
    name: "theconnek",
    alternateName: ["connek", "the connek", "Connek"],
    url: "https://www.theconnek.com",
    logo: "https://www.theconnek.com/icon.svg",
    email: "hello@theconnek.com",
    description: "A community platform connecting MBA students and early professionals with industry mentors for real career conversations.",
    sameAs: ["https://www.instagram.com/_the_connek"],
    foundingLocation: {
      "@type": "Place",
      addressCountry: "IN",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.theconnek.com/#website",
    name: "theconnek",
    alternateName: ["connek", "the connek"],
    url: "https://www.theconnek.com",
    publisher: { "@id": "https://www.theconnek.com/#organization" },
    inLanguage: "en-IN",
  },
];

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
