import type { Metadata } from "next";
import AuthShell from "@/app/components/AuthShell";
import SignupForm from "@/app/components/SignupForm";

export const metadata: Metadata = { title: "Mentor sign up", robots: { index: false } };

export default function MentorSignupPage() {
  return (
    <AuthShell role="mentor">
      <SignupForm role="mentor" />
    </AuthShell>
  );
}
