import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter_Tight, Roboto_Mono } from "next/font/google";
import { siteConfig } from "@/config/site-config";
import { TIERS } from "@/lib/pricing";
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
        <meta charSet="utf-8" />
        <link rel="canonical" href={siteConfig.url} />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
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
                  logo: `${siteConfig.url}/logo.png`,
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
                ...Object.values(TIERS).map((tier) => ({
                  "@type": "Service",
                  name: tier.name,
                  description: tier.description,
                  provider: { "@id": `${siteConfig.url}#organization` },
                  serviceType: "Software Development",
                  areaServed: "Worldwide",
                  offers: {
                    "@type": "Offer",
                    priceCurrency: "USD",
                    price: String(tier.price),
                    description: `${tier.priceLabel} — ${tier.name}`,
                  },
                })),
              ],
            }),
          }}
        />
      </head>
      <body>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-slate-900 focus:rounded-md focus:shadow-lg">
          Skip to main content
        </a>
        <main id="main-content">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 py-6 text-center space-y-2">
            <nav className="flex items-center justify-center gap-4 text-xs text-slate-500">
              <a href="/" className="font-medium text-slate-600 hover:text-slate-800 transition-colors">Home</a>
              <span className="text-slate-300">·</span>
              <a href="/roasts" className="font-medium text-slate-600 hover:text-slate-800 transition-colors">Website Roasts</a>
              <span className="text-slate-300">·</span>
              <a href="/about" className="font-medium text-slate-600 hover:text-slate-800 transition-colors">About</a>
              <span className="text-slate-300">·</span>
              <a href="/privacy" className="font-medium text-slate-600 hover:text-slate-800 transition-colors">Privacy Policy</a>
            </nav>
            <p className="text-xs text-slate-500">
              Building a product? Try{' '}
              <a
                href="https://shipkit.io"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-slate-600 hover:text-slate-800 underline decoration-dotted underline-offset-4"
              >
                Shipkit
              </a>
              , the Next.js stack for startups.
            </p>
          </div>
        </footer>
        <WebVitals />
        <Script
          src="https://analytics.lacy.sh/script.js"
          data-website-id="7ea9eace-debb-4291-bc21-251a79dae897"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
