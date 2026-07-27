import type { Metadata } from "next";
import SignupForm from "@/app/components/SignupForm";

export const metadata: Metadata = { title: "Mentee sign up", robots: { index: false } };

export default function MenteeSignupPage() {
  return <SignupForm role="mentee" />;
}
