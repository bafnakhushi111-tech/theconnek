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
    <LegalPage title="Privacy Policy" updated="4 June 2026">
      <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#8093AE" }}>
        theconnek (&ldquo;theconnek&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) helps students and professionals
        have honest career conversations. This policy explains what we collect when you join our waitlist,
        why we collect it, and the choices you have. We&apos;ve written it in plain language on purpose.
      </p>

      <Section heading="Who we are">
        <p>
          theconnek is operated from India and is currently in a pre-launch / waitlist stage. For any
          privacy question, or to exercise the rights described below, contact us at{" "}
          <a href="mailto:hello@theconnek.com" style={{ color: "#7B9EC8" }}>
            hello@theconnek.com
          </a>
          .
        </p>
      </Section>

      <Section heading="What we collect">
        <p>When you fill in the join form, we collect only what you give us:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>Your name</li>
          <li>Your email address</li>
          <li>Your college / university (or, for professionals, your company / organisation)</li>
          <li>Your target role or current role / industry</li>
          <li>Your location (city)</li>
          <li>Your years of experience</li>
          <li>Whether you joined as someone looking to grow or someone looking to give back</li>
        </ul>
        <p>
          We do not collect payment information, government IDs, or sensitive personal data. We do not
          knowingly collect information from anyone under 18.
        </p>
      </Section>

      <Section heading="How we use it">
        <p>We use your information only to:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>Add you to the theconnek waitlist and let you know when we launch or open early access;</li>
          <li>Understand who&apos;s interested so we can build the right thing;</li>
          <li>Reach out to you about theconnek, if and when relevant.</li>
        </ul>
        <p>
          We do not sell your data, and we do not use it for advertising. Our legal basis for processing
          is your consent, which you give by submitting the form.
        </p>
      </Section>

      <Section heading="Who we share it with">
        <p>
          We don&apos;t sell or rent your information. We use a small number of trusted service providers
          purely to run theconnek, and they only process your data on our behalf:
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>
            <strong style={{ color: "#B8C6DC" }}>Neon</strong>, securely stores the waitlist database.
          </li>
          <li>
            <strong style={{ color: "#B8C6DC" }}>Resend</strong>, sends us a notification when you sign up,
            and may be used to email you.
          </li>
          <li>
            <strong style={{ color: "#B8C6DC" }}>Vercel</strong>, hosts the website.
          </li>
          <li>
            <strong style={{ color: "#B8C6DC" }}>Google Analytics & Microsoft Clarity</strong>, used for
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
          We keep your information for as long as you&apos;re on the waitlist and we&apos;re actively building
          theconnek. If you ask us to delete it, or you tell us you&apos;re no longer interested, we&apos;ll remove
          it promptly.
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
          <a href="mailto:hello@theconnek.com" style={{ color: "#7B9EC8" }}>
            hello@theconnek.com
          </a>
          . If you&apos;re not satisfied with how we handle a request, you may raise a grievance with us
          first, and you have the right to complain to the Data Protection Board of India.
        </p>
      </Section>

      <Section heading="Changes to this policy">
        <p>
          As theconnek grows from a waitlist into a full product, this policy will change. We&apos;ll update the
          date at the top whenever we do. See also our{" "}
          <Link href="/terms" style={{ color: "#7B9EC8" }}>
            Terms of Service
          </Link>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
