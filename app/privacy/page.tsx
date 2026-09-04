import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { Section } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How theconnek collects, uses, and protects your personal information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="4 September 2026">
      <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#8093AE" }}>
        theconnek (&ldquo;theconnek&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) helps students and professionals
        have honest career conversations. This policy explains what we collect when you create an account
        and use theconnek, why we collect it, and the choices you have. We&apos;ve written it in plain
        language on purpose.
      </p>

      <Section heading="Who we are">
        <p>
          theconnek is operated from India. For any privacy question, or to exercise the rights
          described below, contact us at{" "}
          <a href="mailto:hello@theconnek.in" style={{ color: "#7B9EC8" }}>
            hello@theconnek.in
          </a>
          .
        </p>
      </Section>

      <Section heading="What we collect">
        <p>When you create an account, we collect only what you give us:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>Your name</li>
          <li>Your email address, verified once with a one-time code</li>
          <li>A password, which we never store as-is: only a one-way cryptographic hash of it</li>
          <li>Your college / university (or, for professionals, your company / organisation)</li>
          <li>Your target role or current role / industry</li>
          <li>Your location (city) and years of experience</li>
          <li>Your LinkedIn URL, if you choose to share it</li>
          <li>Whether you joined as a mentee or a mentor, and, once matched, who you are matched with</li>
        </ul>
        <p>
          Your practice work (the answers you type on practice questions) is saved in your own browser,
          not on our servers. We do not collect payment information, government IDs, or sensitive
          personal data. We do not knowingly collect information from anyone under 18.
        </p>
      </Section>

      <Section heading="How we use it">
        <p>We use your information only to:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>Run your account: sign you in, verify your email, and let you reset your password;</li>
          <li>Match mentees with mentors and set up the resulting call over email;</li>
          <li>Send you emails that are part of the service, like verification codes and match updates;</li>
          <li>Understand how theconnek is used so we can build the right thing.</li>
        </ul>
        <p>
          Signing in uses one essential cookie that keeps your session secure. It isn&apos;t used for
          tracking or advertising. We do not sell your data, and we do not use it for advertising. Our
          legal basis for processing is your consent, which you give by creating an account.
        </p>
      </Section>

      <Section heading="Who we share it with">
        <p>
          We don&apos;t sell or rent your information. We use a small number of trusted service providers
          purely to run theconnek, and they only process your data on our behalf:
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>
            <strong style={{ color: "#B8C6DC" }}>Neon</strong> securely stores the member database.
          </li>
          <li>
            <strong style={{ color: "#B8C6DC" }}>Resend</strong> delivers the emails that are part of the
            service: verification codes, password resets, and match updates.
          </li>
          <li>
            <strong style={{ color: "#B8C6DC" }}>Vercel</strong> hosts the website.
          </li>
          <li>
            <strong style={{ color: "#B8C6DC" }}>Google Analytics & Microsoft Clarity</strong> provide
            anonymous website analytics, only if you accept cookies.
          </li>
        </ul>
        <p>
          Some of these providers may process data on servers outside India. We only work with providers
          that apply appropriate safeguards to protect your information.
        </p>
      </Section>

      <Section heading="How long we keep it">
        <p>
          We keep your information for as long as you have a theconnek account. If you ask us to delete
          your account, we&apos;ll remove your data promptly.
        </p>
      </Section>

      <Section heading="Your rights">
        <p>
          Under India&apos;s Digital Personal Data Protection Act, 2023 (and, where applicable, the GDPR for
          users in the UK/EU), you can ask us to:
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>Show you the personal data we hold about you;</li>
          <li>Correct anything that&apos;s wrong;</li>
          <li>Delete your data;</li>
          <li>Withdraw your consent at any time.</li>
        </ul>
        <p>
          To do any of these, email{" "}
          <a href="mailto:hello@theconnek.in" style={{ color: "#7B9EC8" }}>
            hello@theconnek.in
          </a>
          . If you&apos;re not satisfied with how we handle a request, you may raise a grievance with us
          first, and you have the right to complain to the Data Protection Board of India.
        </p>
      </Section>

      <Section heading="Grievance contact">
        <p>
          Under India&apos;s Digital Personal Data Protection Act, 2023, you can reach our grievance contact
          for any question or complaint about how your data is handled:
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>
            <strong style={{ color: "#B8C6DC" }}>The Founder</strong>, who also serves as Grievance Officer
          </li>
          <li>
            Email:{" "}
            <a href="mailto:bafnakhushi111@gmail.com" style={{ color: "#7B9EC8" }}>
              bafnakhushi111@gmail.com
            </a>
          </li>
        </ul>
        <p>
          We aim to acknowledge every grievance within a reasonable time and resolve it promptly.
        </p>
      </Section>

      <Section heading="Changes to this policy">
        <p>
          As theconnek grows, this policy will change. We&apos;ll update the date at the top whenever we
          do. See also our{" "}
          <Link href="/terms" style={{ color: "#7B9EC8" }}>
            Terms of Service
          </Link>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
