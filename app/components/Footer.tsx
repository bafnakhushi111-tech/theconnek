import Logo from "./Logo";

export default function Footer() {
  return (
    <footer style={{ background: "#08090E", borderTop: "1px solid #1a2a45" }}>
      <div className="max-w-5xl mx-auto px-5 py-10 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
        <div className="flex flex-col items-center sm:items-start gap-2">
          <Logo variant="dark" size="sm" />
          <p className="text-xs" style={{ color: "#3A4A60" }}>
            Real conversations. No cold DMs. No algorithm. Just people.
          </p>
        </div>
        <div className="flex flex-col items-center sm:items-end gap-1 text-xs" style={{ color: "#2A3A50" }}>
          <span>© {2026} Connek</span>
          <span>Made in India</span>
        </div>
      </div>
    </footer>
  );
}
