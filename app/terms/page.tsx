import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { Section } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms for using theconnek: your account, the practice library, and mentor matching.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="4 September 2026">
      <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#8093AE" }}>
        These terms cover your use of the theconnek website and your theconnek account. By using the site
        or creating an account, you agree to them. They&apos;re short on purpose.
      </p>

      <Section heading="What theconnek is">
        <p>
          theconnek is a community for honest career conversations between students and professionals. With
          an account you get a practice library of guesstimates and cases, a personal dashboard, and, for
          mentees, matching with a mentor for a real conversation. We match carefully and by hand, so an
          account does not guarantee a match, a mentor, a referral, or any specific outcome on a specific
          timeline.
        </p>
      </Section>

      <Section heading="Your account">
        <p>
          You create an account with your email, verified by a one-time code, and a password. You&apos;re
          responsible for keeping your password private and for what happens under your account. If you
          think someone else has access, reset your password from the login page or write to us. One
          account per person, and it must be your own identity.
        </p>
      </Section>

      <Section heading="Using the site">
        <p>When you join, you agree to:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>Give accurate information about yourself;</li>
          <li>Be at least 18 years old;</li>
          <li>Not misuse the site, attempt to disrupt it, or sign up on someone else&apos;s behalf without permission.</li>
        </ul>
      </Section>

      <Section heading="Conversations and conduct">
        <p>
          theconnek exists to make real, respectful conversations easier. When the community opens, we expect
          everyone to behave honestly and kindly. We&apos;re not a recruiter, we don&apos;t broker jobs, and we&apos;re
          not party to any arrangement you make with another person you meet through theconnek. Any advice,
          referral, or opportunity that comes from a conversation is between you and that person. We may
          suspend or remove an account that misuses the platform or treats others badly.
        </p>
      </Section>

      <Section heading="Your information">
        <p>
          How we handle the details you share is explained in our{" "}
          <Link href="/privacy" style={{ color: "#7B9EC8" }}>
            Privacy Policy
          </Link>
          . Please read it, it&apos;s part of these terms.
        </p>
      </Section>

      <Section heading="No guarantees">
        <p>
          The site is provided &ldquo;as is&rdquo; while we build. We can&apos;t promise it will always be
          available or error-free, and to the extent the law allows, we&apos;re not liable for losses arising
          from your use of the site. Practice content is for preparation and learning; it isn&apos;t
          professional or career advice, and answers are indicative, not definitive. Nothing here limits
          rights you have that can&apos;t be limited under applicable law.
        </p>
      </Section>

      <Section heading="Changes">
        <p>
          We may update these terms as theconnek grows. We&apos;ll change the date at the top when we do. Questions? Email{" "}
          <a href="mailto:hello@theconnek.in" style={{ color: "#7B9EC8" }}>
            hello@theconnek.in
          </a>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
