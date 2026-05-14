import { Metadata } from "next";
import { siteConfig } from "@/config/site-config";
import { RoastsHero } from "@/components/roasts-hero";
import { RoastsList } from "@/components/roasts-list";
import { getRoastSummaries } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Website Roasts - Honest Code & Design Reviews",
  description: "Brutally honest website teardowns with actionable fixes and code reviews. Real site audits covering SEO, performance, accessibility, and security issues.",
  openGraph: {
    title: "Website Roasts - Honest Code Reviews | Vibe Rehab",
    description: "Brutally honest website teardowns with actionable fixes and code reviews. Real site audits covering SEO, performance, accessibility, and security issues.",
    url: `${siteConfig.url}/roasts`,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/og?title=Website%20Roasts`,
        width: 1200,
        height: 628,
        alt: "Website Roasts by Vibe Rehab",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Roasts - Honest Code Reviews | Vibe Rehab",
    description: "Brutally honest website teardowns with actionable fixes and code reviews. Real site audits covering SEO, performance, accessibility, and security issues.",
    images: [`${siteConfig.url}/og?title=Website%20Roasts`],
  },
  alternates: {
    canonical: `${siteConfig.url}/roasts`,
  },
};

export default function RoastsPage() {
  const roasts = getRoastSummaries();
  
  return (
    <main className="min-h-screen bg-slate-50 py-16">
      <RoastsHero />
      <RoastsList roasts={roasts} />
    </main>
  );
}