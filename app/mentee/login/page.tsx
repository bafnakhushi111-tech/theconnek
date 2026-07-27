import type { Metadata } from "next";
import LoginForm from "@/app/components/LoginForm";

export const metadata: Metadata = { title: "Mentee login", robots: { index: false } };

export default function MenteeLoginPage() {
  return <LoginForm role="mentee" />;
}
