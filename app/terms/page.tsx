import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { Section } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms for using the theconnek website and joining the waitlist.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="4 June 2026">
      <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#8093AE" }}>
        These terms cover your use of the theconnek website and waitlist while we&apos;re in our pre-launch
        stage. By using the site or joining the waitlist, you agree to them. They&apos;re short on purpose.
      </p>

      <Section heading="What theconnek is right now">
        <p>
          theconnek is a community for honest career conversations between students and professionals. Today
          the website is a waitlist, joining means you&apos;re expressing interest and asking to be notified.
          It does not guarantee access, a match, a mentor, a referral, or any specific outcome.
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
          referral, or opportunity that comes from a conversation is between you and that person.
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
          from your use of a pre-launch website. Nothing here limits rights you have that can&apos;t be limited
          under applicable law.
        </p>
      </Section>

      <Section heading="Changes">
        <p>
          We may update these terms as theconnek evolves from a waitlist into a product. We&apos;ll change the
          date at the top when we do. Questions? Email{" "}
          <a href="mailto:hello@theconnek.in" style={{ color: "#7B9EC8" }}>
            hello@theconnek.in
          </a>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
