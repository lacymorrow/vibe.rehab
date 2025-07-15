"use client";

import { RoastCard, type Roast } from "@/components/roast-card";
import { AnimatedSection } from "@/components/animated-section";

// Sample roast data - in production, this would come from a CMS or database
const sampleRoasts: Roast[] = [
  {
    id: "startup-landing-disaster",
    title: "StartupXYZ: When 'Move Fast' Means Breaking Everything",
    url: "https://example-startup.com",
    roastDate: "2024-01-15",
    severity: "nuclear",
    summary: "A masterclass in how not to build a landing page. Loading time? 12 seconds. Mobile experience? What mobile experience?",
    issues: [
      "12-second load time with 47 unoptimized images",
      "Contact form submits to nowhere (literally returns 404)",
      "Mobile menu covers the entire screen and won't close",
      "SEO so bad Google probably blocked their number"
    ],
    tags: ["Performance", "Mobile", "SEO", "Forms"],
    screenshot: "https://images.unsplash.com/photo-1555421689-d68471e189f2?w=800&h=400&fit=crop"
  },
  {
    id: "ecommerce-checkout-nightmare",
    title: "BuyStuffOnline: The Checkout Process From Hell",
    url: "https://example-shop.com",
    roastDate: "2024-01-10",
    severity: "spicy",
    summary: "An e-commerce site where buying is harder than building the product yourself. 7-step checkout with surprise fees at step 6.",
    issues: [
      "7-step checkout process (industry standard is 2-3)",
      "Shipping costs revealed only at step 6",
      "Password requirements: minimum 47 characters, 3 emojis",
      "Cart expires every 30 seconds"
    ],
    tags: ["E-commerce", "UX", "Checkout", "Conversion"],
    screenshot: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop"
  },
  {
    id: "portfolio-comic-sans",
    title: "DevPortfolio2024: Comic Sans Unironically",
    url: "https://example-portfolio.com",
    roastDate: "2024-01-08",
    severity: "medium",
    summary: "A developer portfolio that screams 'I learned HTML yesterday'. Features include auto-playing music and a visitor counter from 1999.",
    issues: [
      "Entire site in Comic Sans (not ironically)",
      "Auto-playing MIDI music on page load",
      "Animated GIF background that induces seizures",
      "Contact info is a screenshot of an email address"
    ],
    tags: ["Portfolio", "Design", "Typography", "Audio"],
    screenshot: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=400&fit=crop"
  },
  {
    id: "saas-pricing-maze",
    title: "CloudyMcCloudFace: Pricing Page Requires PhD in Mathematics",
    url: "https://example-saas.com",
    roastDate: "2024-01-05",
    severity: "spicy",
    summary: "A SaaS pricing page so complex it makes tax forms look simple. 17 tiers, 94 features, and calculator required.",
    issues: [
      "17 different pricing tiers (why?)",
      "Feature comparison table requires horizontal scrolling",
      "'Contact us' for every useful feature",
      "Prices in Bitcoin only"
    ],
    tags: ["SaaS", "Pricing", "UX", "Conversion"],
    screenshot: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop"
  },
  {
    id: "agency-parallax-overload",
    title: "CreativeAgencyXYZ: Death by Parallax Scrolling",
    url: "https://example-agency.com",
    roastDate: "2024-01-02",
    severity: "mild",
    summary: "When your creative agency site is so creative it forgets to be usable. Features 37 parallax sections and zero actual information.",
    issues: [
      "37 parallax scrolling sections",
      "Menu only appears after 10 seconds of hovering",
      "Contact info hidden in source code comments",
      "Every click triggers a full-page animation"
    ],
    tags: ["Agency", "Animation", "UX", "Performance"],
    screenshot: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop"
  },
  {
    id: "restaurant-pdf-menu",
    title: "FoodPlace: Menu is a 47MB PDF",
    url: "https://example-restaurant.com",
    roastDate: "2023-12-28",
    severity: "medium",
    summary: "A restaurant website where finding the menu is harder than getting a reservation. Spoiler: it's a 47MB PDF that crashes mobile browsers.",
    issues: [
      "Menu is a 47MB uncompressed PDF",
      "Online ordering redirects to competitor",
      "Hours of operation only in Latin",
      "Background video of chef crying"
    ],
    tags: ["Restaurant", "Mobile", "PDF", "Performance"],
    screenshot: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop"
  }
];

export function RoastsList() {
  return (
    <section id="roasts" className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Recent Roasts</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Learn from others' mistakes. These sites asked for honesty, and we delivered.
          </p>
        </AnimatedSection>
        
        <AnimatedSection className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleRoasts.map((roast, index) => (
            <div
              key={roast.id}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <RoastCard roast={roast} />
            </div>
          ))}
        </AnimatedSection>
        
        <AnimatedSection className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            Think your site can handle the heat?
          </p>
          <div className="flex justify-center">
            <a 
              href="/#contact"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Submit Your Site for Roasting
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}