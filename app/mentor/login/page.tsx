import type { Metadata } from "next";
import LoginForm from "@/app/components/LoginForm";

export const metadata: Metadata = { title: "Mentor login", robots: { index: false } };

export default function MentorLoginPage() {
  return <LoginForm role="mentor" />;
}
