import Link from "next/link";
import Logo from "./components/Logo";

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center text-center px-5 text-white"
      style={{ background: "#0F1219" }}
    >
      <div className="mb-8">
        <Logo variant="dark" size="md" />
      </div>

      <p className="text-sm font-semibold tracking-widest mb-3" style={{ color: "#7B9EC8" }}>
        404
      </p>
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
        This page wandered off.
      </h1>
      <p className="text-sm sm:text-base max-w-md mb-10 leading-relaxed" style={{ color: "#C2CEE0" }}>
        The link you followed doesn&apos;t exist (yet). The conversations, though, are still happening
        back home.
      </p>

      <Link
        href="/"
        className="inline-block font-bold px-8 py-4 rounded-full text-sm md:text-base"
        style={{ background: "#4B6FA5", color: "#ffffff", boxShadow: "0 20px 40px rgba(75,111,165,0.3)" }}
      >
        Back to theconnek →
      </Link>
    </main>
  );
}
