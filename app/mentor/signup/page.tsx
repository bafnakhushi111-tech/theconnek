import type { Metadata } from "next";
import SignupForm from "@/app/components/SignupForm";

export const metadata: Metadata = { title: "Mentor sign up", robots: { index: false } };

export default function MentorSignupPage() {
  return <SignupForm role="mentor" />;
}
