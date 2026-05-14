import { Metadata } from "next";
import { siteConfig } from "@/config/site-config";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Vibe Rehab",
  description:
    "Vibe Rehab is a code fixing and MVP completion service. We help developers and entrepreneurs ship their broken AI projects in 1-4 weeks with flat-rate pricing.",
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
};

export default function AboutPage() {
  return (
    <article className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-3xl mx-auto px-4 prose prose-slate prose-lg prose-headings:font-light">
        <h1 className="text-3xl font-light text-slate-800">About Vibe Rehab</h1>

        <p>
          Vibe Rehab is a code fixing and project completion service built for
          developers, founders, and entrepreneurs who need their broken AI
          projects shipped — fast.
        </p>

        <h2>What We Do</h2>
        <p>
          We take your half-built, broken, or AI-generated codebase and turn it
          into something that actually works. Whether it is a single bug, a
          full-stack cleanup, or a complete project rescue, we diagnose the
          problem, fix it, and ship it back to you.
        </p>

        <h2>How It Works</h2>
        <ol>
          <li>
            <strong>Submit your project</strong> — share a URL, GitHub repo, or
            describe your issue.
          </li>
          <li>
            <strong>Free scoping call</strong> — we review your project and give
            you a clear diagnosis.
          </li>
          <li>
            <strong>We fix it</strong> — our team works on your project with
            flat-rate pricing. No surprises.
          </li>
          <li>
            <strong>Ship it</strong> — you get a working, deployed project in
            1-4 weeks.
          </li>
        </ol>

        <h2>Our Expertise</h2>
        <p>
          We specialize in React, Next.js, TypeScript, and modern web
          development. Our team has deep experience with AI-generated codebases,
          technical debt cleanup, and production deployments.
        </p>

        <h2>Pricing</h2>
        <p>
          Flat-rate pricing starting at $299. No hourly billing, no scope creep.
          Check our{" "}
          <Link href="/" className="text-amber-600 hover:text-amber-700">
            homepage
          </Link>{" "}
          for full pricing details.
        </p>

        <h2>Get Started</h2>
        <p>
          Ready to fix your broken project?{" "}
          <Link
            href="/#contact"
            className="text-amber-600 hover:text-amber-700"
          >
            Get a free scope call
          </Link>{" "}
          and we will take it from there. No judgment — we have seen much worse.
        </p>
      </div>
    </article>
  );
}
