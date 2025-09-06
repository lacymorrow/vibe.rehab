import type { Metadata, Viewport } from "next";
import { Inter_Tight, Roboto_Mono } from "next/font/google";
import { siteConfig } from "@/config/site-config";
import "./globals.css";

// Web Vitals tracking
import { WebVitals } from '@/components/web-vitals';

const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-tight",
  preload: true,
  weight: ["400", "600", "700"],
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: siteConfig.metadataBase,
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  openGraph: siteConfig.openGraph,
  twitter: siteConfig.twitter,
  robots: siteConfig.robots,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  category: "technology",
  classification: "Software Development Services",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${interTight.variable} ${robotoMono.variable}`}
    >
      <head>
        <link rel="canonical" href={siteConfig.url} />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <meta
          name="google-site-verification"
          content="your-google-verification-code"
        />
        <meta name="theme-color" content="#ffffff" />
        <meta name="color-scheme" content="light dark" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${siteConfig.url}#organization`,
                  name: siteConfig.name,
                  description: siteConfig.description,
                  url: siteConfig.url,
                  logo: {
                    "@type": "ImageObject",
                    url: `${siteConfig.url}/logo.png`,
                  },
                  contactPoint: {
                    "@type": "ContactPoint",
                    contactType: "customer service",
                    availableLanguage: "English",
                  },
                  sameAs: [siteConfig.links.twitter, siteConfig.links.github],
                  foundingDate: "2024",
                  knowsAbout: [
                    "Web Development",
                    "Software Development",
                    "React",
                    "Next.js",
                    "TypeScript",
                    "Code Review",
                    "Technical Debt",
                    "MVP Development",
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": `${siteConfig.url}#website`,
                  url: siteConfig.url,
                  name: siteConfig.title,
                  description: siteConfig.description,
                  publisher: { "@id": `${siteConfig.url}#organization` },
                  inLanguage: "en-US",
                },
                {
                  "@type": "Service",
                  name: "Project Completion Service",
                  description: "Complete your unfinished MVP or web application with professional development services",
                  provider: { "@id": `${siteConfig.url}#organization` },
                  serviceType: "Software Development",
                  areaServed: "Worldwide",
                  offers: {
                    "@type": "Offer",
                    priceCurrency: "USD",
                    price: "999",
                    description: "Starting at $999 for project completion",
                  },
                },
                {
                  "@type": "Service",
                  name: "Code Review Service",
                  description: "Comprehensive code audit with security and performance recommendations",
                  provider: { "@id": `${siteConfig.url}#organization` },
                  serviceType: "Code Quality Assurance",
                  areaServed: "Worldwide",
                  offers: {
                    "@type": "Offer",
                    priceCurrency: "USD",
                    price: "99",
                    description: "Starting at $99 for code review",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body>
        {children}
        <WebVitals />
      </body>
    </html>
  );
}
