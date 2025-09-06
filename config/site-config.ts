import type { Metadata } from "next";

type SiteConfig = {
  name: string;
  title: string;
  tagline: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    github: string;
  };
  keywords: string[];
  authors: {
    name: string;
    url: string;
  }[];
  creator: string;
  metadataBase: URL;
  openGraph: Metadata["openGraph"];
  twitter: Metadata["twitter"];
  robots: Metadata["robots"];
};

export const siteConfig: SiteConfig = {
  name: "Vibe Rehab",
  title: "Vibe Rehab",
  tagline: "We Fix Vibe Code",
  description:
    "Let's finish your MVP. We'll get you earning in 2-4 weeks. No judgment, just results.",
  url: "https://vibe.rehab",
  ogImage: "https://vibe.rehab/og",
  links: {
    twitter: "https://twitter.com/viberehab",
    github: "https://github.com/viberehab",
  },
  keywords: [
    "code fixing",
    "web development",
    "app development",
    "MVP completion",
    "technical debt",
    "code review",
    "software development",
    "startup development",
    "React",
    "Next.js",
    "TypeScript",
  ],
  authors: [
    {
      name: "Vibe Rehab",
      url: "https://vibe.rehab",
    },
  ],
  creator: "Vibe Rehab",
  metadataBase: new URL("https://vibe.rehab"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vibe.rehab",
    title: "Vibe Rehab - We Fix Your Code",
    description:
      "Stop staring at that half-finished site or app. We'll finish what you started and get you earning in 2-4 weeks. No judgment, just results.",
    siteName: "Vibe Rehab",
    images: [
      {
        url: "https://vibe.rehab/og",
        width: 1200,
        height: 628,
        alt: "Vibe Rehab - We Fix Your Code",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibe Rehab - We Fix Your Code",
    description:
      "Stop staring at that half-finished site or app. We'll finish what you started and get you earning in 2-4 weeks. No judgment, just results.",
    images: ["https://vibe.rehab/og"],
    creator: "@viberehab",
    site: "@viberehab",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
