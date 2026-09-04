import type { Metadata } from "next";
import AuthShell from "@/app/components/AuthShell";
import ForgotForm from "@/app/components/ForgotForm";

export const metadata: Metadata = { title: "Reset password", robots: { index: false } };

export default function MentorForgotPasswordPage() {
  return (
    <AuthShell role="mentor">
      <ForgotForm role="mentor" />
    </AuthShell>
  );
}
