import NavWithPanel from "./NavWithPanel";

export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen text-white" style={{ background: "#08090E" }}>
      <NavWithPanel />

      <article className="max-w-3xl mx-auto px-5 py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">{title}</h1>
        <p className="text-sm mb-12" style={{ color: "#2A3A50" }}>
          Last updated {updated}
        </p>
        <div className="legal-body flex flex-col gap-6">{children}</div>
      </article>

      <footer
        className="py-8 text-center text-xs"
        style={{ background: "#08090E", borderTop: "1px solid #1a2a45", color: "#2A3A50" }}
      >
        <span>theconnek · Real conversations. That&apos;s it.</span>
      </footer>
    </main>
  );
}

export function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg sm:text-xl font-bold text-white">{heading}</h2>
      <div className="flex flex-col gap-3 text-sm sm:text-base leading-relaxed" style={{ color: "#8093AE" }}>
        {children}
      </div>
    </section>
  );
}
