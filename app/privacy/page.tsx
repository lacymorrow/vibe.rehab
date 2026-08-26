import { Metadata } from "next";
import { siteConfig } from "@/config/site-config";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Vibe Rehab privacy policy. Learn how we collect, use, and protect your personal information when you use our code fixing and MVP completion services.",
  openGraph: {
    title: "Privacy Policy | Vibe Rehab",
    description:
      "Vibe Rehab privacy policy. Learn how we collect, use, and protect your personal information when you use our code fixing and MVP completion services.",
    url: `${siteConfig.url}/privacy`,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/og?title=Privacy%20Policy`,
        width: 1200,
        height: 628,
        alt: "Vibe Rehab Privacy Policy",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: `${siteConfig.url}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <article className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-3xl mx-auto px-4 prose prose-slate prose-lg prose-headings:font-light">
        <h1 className="text-3xl font-light text-slate-800">Privacy Policy</h1>
        <p className="text-sm text-slate-500">
          Last updated: April 21, 2026
        </p>

        <h2>Information We Collect</h2>
        <p>
          When you use Vibe Rehab, we may collect the following information:
        </p>
        <ul>
          <li>
            <strong>Contact information</strong> — your name and email address
            when you submit the contact form or request a consultation.
          </li>
          <li>
            <strong>Project information</strong> — URLs, repository links, or
            descriptions of your project that you voluntarily provide.
          </li>
          <li>
            <strong>Payment information</strong> — processed securely by Stripe.
            We do not store credit card details on our servers.
          </li>
          <li>
            <strong>Usage data</strong> — anonymous analytics data collected via
            Umami (a privacy-focused analytics platform) including pages visited
            and referral source.
          </li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Respond to your inquiries and provide our services.</li>
          <li>Process payments for our code fixing and project completion services.</li>
          <li>Improve our website and services based on anonymous usage patterns.</li>
          <li>Send you updates about your project (only when you have engaged our services).</li>
        </ul>

        <h2>Third-Party Services</h2>
        <p>We use the following third-party services:</p>
        <ul>
          <li>
            <strong>Stripe</strong> — for secure payment processing.
          </li>
          <li>
            <strong>Resend</strong> — for transactional email delivery.
          </li>
          <li>
            <strong>Umami</strong> — for privacy-friendly website analytics (no
            cookies, no personal data tracking).
          </li>
          <li>
            <strong>Vercel</strong> — for website hosting.
          </li>
        </ul>

        <h2>Cookies</h2>
        <p>
          We do not use tracking cookies. Our analytics platform (Umami) is
          cookie-free and does not track individual users across sessions.
        </p>

        <h2>Data Retention</h2>
        <p>
          We retain your contact and project information only for the duration
          needed to provide our services. You can request deletion of your data
          at any time by contacting us.
        </p>

        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you.</li>
          <li>Request correction or deletion of your data.</li>
          <li>Opt out of any marketing communications.</li>
        </ul>

        <h2>Contact</h2>
        <p>
          For privacy-related questions, contact us at{" "}
          <Link
            href="/#contact"
            className="text-amber-600 hover:text-amber-700"
          >
            our contact form
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
