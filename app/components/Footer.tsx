import Logo from "./Logo";
import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "#0F1219", borderTop: "1px solid #1a2a45" }}>
      <div className="max-w-5xl mx-auto px-5 py-10 flex flex-col sm:flex-row items-center sm:justify-between gap-6">
        <div className="flex flex-col items-center sm:items-start gap-2">
          <Logo variant="dark" size="sm" />
          <p className="text-xs" style={{ color: "#8A99B2" }}>
            Real conversations. No cold DMs. No algorithm. Just people.
          </p>
          <a
            href="https://www.instagram.com/_the_connek"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium mt-1"
            style={{ color: "#7B9EC8" }}
          >
            @_the_connek on Instagram
          </a>
        </div>
        <div className="flex flex-col items-center sm:items-end gap-2 text-xs" style={{ color: "#7B9EC8" }}>
          <div className="flex gap-4">
            <Link href="/about" className="hover:opacity-80 transition-opacity" style={{ color: "#8A99B2" }}>About</Link>
            <Link href="/privacy" className="hover:opacity-80 transition-opacity" style={{ color: "#8A99B2" }}>Privacy</Link>
            <Link href="/terms" className="hover:opacity-80 transition-opacity" style={{ color: "#8A99B2" }}>Terms</Link>
          </div>
          <span>© {new Date().getFullYear()} theconnek · Made in India</span>
        </div>
      </div>
    </footer>
  );
}
