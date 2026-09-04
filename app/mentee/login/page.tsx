import type { Metadata } from "next";
import AuthShell from "@/app/components/AuthShell";
import LoginForm from "@/app/components/LoginForm";

export const metadata: Metadata = { title: "Mentee login", robots: { index: false } };

export default function MenteeLoginPage() {
  return (
    <AuthShell role="mentee">
      <LoginForm role="mentee" />
    </AuthShell>
  );
}
