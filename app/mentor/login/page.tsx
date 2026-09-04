import type { Metadata } from "next";
import AuthShell from "@/app/components/AuthShell";
import LoginForm from "@/app/components/LoginForm";

export const metadata: Metadata = { title: "Mentor login", robots: { index: false } };

export default function MentorLoginPage() {
  return (
    <AuthShell role="mentor">
      <LoginForm role="mentor" />
    </AuthShell>
  );
}
