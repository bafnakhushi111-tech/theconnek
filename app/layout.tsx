import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Analytics from "./components/Analytics";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://theconnek.com"),
  title: "Connek — Real conversations. Real careers.",
  description: "A community where students and professionals have honest conversations about careers. No cold DMs. No algorithm. Just people.",
  openGraph: {
    title: "Connek — Real conversations. Real careers.",
    description: "A community where students and professionals have honest conversations about careers. No cold DMs. No algorithm. Just people.",
    url: "https://theconnek.com",
    siteName: "Connek",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Connek — Real conversations. Real careers.",
    description: "A community where students and professionals have honest conversations about careers. No cold DMs. No algorithm. Just people.",
    site: "@theconnek",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${plusJakartaSans.className} min-h-full flex flex-col`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
