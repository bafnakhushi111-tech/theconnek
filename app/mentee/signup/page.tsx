import type { Metadata } from "next";
import AuthShell from "@/app/components/AuthShell";
import SignupForm from "@/app/components/SignupForm";

export const metadata: Metadata = { title: "Mentee sign up", robots: { index: false } };

export default function MenteeSignupPage() {
  return (
    <AuthShell role="mentee">
      <SignupForm role="mentee" />
    </AuthShell>
  );
}
