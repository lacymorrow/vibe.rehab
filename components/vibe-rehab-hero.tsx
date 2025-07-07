"use client";

import type React from "react";

import { useState, useEffect, Suspense, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Check } from "lucide-react";
import { useParallax, use3DScroll } from "@/hooks/use-scroll-animation";
import { PaymentDialog } from "@/components/payment-dialog";
import { ContactDialog } from "@/components/contact-dialog";
import { EmailContactDialog } from "@/components/email-contact-dialog";
import { AnimatedSection } from "@/components/animated-section";
import { Logo } from "@/components/logo";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";

const services = {
  project: {
    name: "Finish Your Project",
    price: 249,
    description:
      "From broken MVP to production-ready SaaS. We handle the technical debt, add missing features, and get you to market.",
    features: [
      "Fix bugs and complete features",
      "Security audit and optimization",
      "Production deployment",
      "Launch strategy and support",
    ],
    priceId:
      process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PROJECT || "price_1234567890",
  },
  review: {
    name: "Code Review",
    price: 99,
    description:
      "Pair-programming code audit with roadmap and security recommendations.",
    features: [
      "Comprehensive code audit",
      "Security vulnerability assessment",
      "Performance optimization recommendations",
      "Detailed improvement roadmap",
    ],
    priceId:
      process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_REVIEW || "price_0987654321",
  },
};

const placeholderExamples = [
  "https://mybrokenapp.com",
  "john@example.com",
  "https://github.com/username/my-project",
  "My React app crashes when users login...",
  "https://staging.mysite.com",
  "sarah.dev@gmail.com",
  "https://github.com/company/legacy-code",
  "Need help with my Next.js deployment...",
  "https://beta.mystartup.io",
  "dev@mycompany.com",
  "https://github.com/me/abandoned-saas",
  "My database queries are super slow...",
];

// Input detection functions
const detectInputType = (
  input: string
): "github" | "url" | "email" | "message" => {
  const trimmedInput = input.trim();

  // GitHub URL patterns
  const githubPatterns = [
    /^https?:\/\/(www\.)?github\.com\/[\w\-.]+\/[\w\-.]+/i,
    /^github\.com\/[\w\-.]+\/[\w\-.]+/i,
    /^[\w\-.]+\/[\w\-.]+$/, // username/repo format
  ];

  // Email pattern
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // URL pattern (more general)
  const urlPattern = /^https?:\/\/[^\s]+/i;

  // Check for GitHub
  if (githubPatterns.some((pattern) => pattern.test(trimmedInput))) {
    return "github";
  }

  // Check for email
  if (emailPattern.test(trimmedInput)) {
    return "email";
  }

  // Check for general URL
  if (urlPattern.test(trimmedInput)) {
    return "url";
  }

  // Default to message
  return "message";
};

export default function Component() {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showEmailContactDialog, setShowEmailContactDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<
    typeof services.project | null
  >(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [nextPlaceholder, setNextPlaceholder] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [submittedValue, setSubmittedValue] = useState("");
  const [detectedType, setDetectedType] = useState<
    "github" | "url" | "email" | "message"
  >("message");
  const scrollY = useParallax();
  const scrollProgress = use3DScroll();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Rotate placeholder text with fade transition
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isFocused && !inputValue) {
        setIsTransitioning(true);

        // After fade out completes, update the text
        setTimeout(() => {
          setCurrentPlaceholder(
            (prev) => (prev + 1) % placeholderExamples.length
          );
          setNextPlaceholder((prev) => (prev + 1) % placeholderExamples.length);
          setIsTransitioning(false);
        }, 200); // Half of transition duration
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isFocused, inputValue]);

  const handleServiceClick = (service: typeof services.project) => {
    setSelectedService(service);
    setShowPaymentDialog(true);
  };

  const handleRoastClick = () => {
    // Set a default "roast" message and trigger the contact dialog
    setSubmittedValue("I want my work roasted");
    setDetectedType("message");
    setShowContactDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    const type = detectInputType(inputValue);
    setDetectedType(type);
    setSubmittedValue(inputValue);

    if (type === "email") {
      // Show email-specific dialog
      setShowEmailContactDialog(true);
    } else if (type === "url" || type === "github") {
      setShowContactDialog(true);
    } else {
      // Show contact dialog for other types
      setShowContactDialog(true);
    }
  };

  const handleContactDialogClose = () => {
    setShowContactDialog(false);
    setInputValue(""); // Clear the input when dialog closes
  };

  const handleEmailContactDialogClose = () => {
    setShowEmailContactDialog(false);
    setInputValue(""); // Clear the input when dialog closes
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div
      className="min-h-screen bg-blue-50 relative overflow-hidden font-['Inter_Tight',_'Inter',_sans-serif]"
      style={{ backgroundColor: "#f0f4f8" }}
    >
      {/* Dialogs */}
      {selectedService && (
        <PaymentDialog
          isOpen={showPaymentDialog}
          onClose={() => setShowPaymentDialog(false)}
          service={selectedService}
        />
      )}
      <ContactDialog
        isOpen={showContactDialog}
        onClose={handleContactDialogClose}
        submittedValue={submittedValue}
        detectedType={detectedType}
      />
      <EmailContactDialog
        isOpen={showEmailContactDialog}
        onClose={handleEmailContactDialogClose}
        email={submittedValue}
      />

      {/* Blueprint Background */}
      <div
        className="absolute inset-0 overflow-hidden z-0"
        style={{ opacity: 0.4 }}
      >
        {/* Blueprint Grid - More Prominent */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,50,150,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,50,150,0.15) 1px, transparent 1px),
              linear-gradient(rgba(0,50,150,0.08) 2px, transparent 2px),
              linear-gradient(90deg, rgba(0,50,150,0.08) 2px, transparent 2px),
              linear-gradient(rgba(0,50,150,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,50,150,0.04) 1px, transparent 1px)
            `,
            backgroundSize:
              "10px 10px, 10px 10px, 50px 50px, 50px 50px, 200px 200px, 200px 200px",
          }}
        />

        {/* Blueprint Annotations Layer */}
        <div className="absolute inset-0 font-mono text-xs text-blue-900/60 hidden md:block">
          {/* Main Title Block - More Detailed */}
          <div
            className="absolute top-1/4 left-10 border-2 border-blue-900/40 bg-blue-50/80 p-4 shadow-sm"
            style={{ transform: `translateY(${scrollY * 0.02}px)` }}
          >
            <div className="space-y-1 text-[11px] leading-tight">
              <div className="font-bold text-blue-900/80 border-b border-blue-900/30 pb-1 mb-2">
                VIBE REHABILITATION SYSTEMS
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div>PROJECT:</div>
                <div className="font-semibold">VIBE.REHAB</div>
                <div>DRAWING:</div>
                <div>HERO-001</div>
                <div>SCALE:</div>
                <div>1:1 @1920px</div>
                <div>REVISION:</div>
                <div className="font-bold">R2.1</div>
                <div>DATE:</div>
                <div>{new Date().toLocaleDateString()}</div>
                <div>DRAWN BY:</div>
                <div>V0.DEV</div>
                <div>CHECKED:</div>
                <div>APPROVED</div>
                <div>SHEET:</div>
                <div>1 OF 1</div>
              </div>
            </div>
          </div>

          {/* Comprehensive Dimension System */}
          <div
            className="absolute top-24 left-32"
            style={{ transform: `translateY(${scrollY * 0.03}px)` }}
          >
            {/* Main horizontal dimension chain */}
            <div className="flex items-center text-blue-900/50">
              <div className="flex flex-col items-center">
                <div className="w-px h-3 bg-blue-900/50"></div>
                <div className="w-px h-3 bg-blue-900/50 mt-1"></div>
              </div>
              <div className="w-24 h-px bg-blue-900/50 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-[10px] font-semibold bg-blue-50/80 px-1">
                  480px
                </div>
                <div className="absolute -top-1 left-0 w-px h-2 bg-blue-900/50"></div>
                <div className="absolute -top-1 right-0 w-px h-2 bg-blue-900/50"></div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-px h-3 bg-blue-900/50"></div>
                <div className="w-px h-3 bg-blue-900/50 mt-1"></div>
              </div>
            </div>

            {/* Secondary dimensions */}
            <div className="flex items-center text-blue-900/40 mt-6">
              <div className="w-px h-2 bg-blue-900/40"></div>
              <div className="w-16 h-px bg-blue-900/40 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-[9px] bg-blue-50/80 px-1">
                  320px
                </div>
              </div>
              <div className="w-px h-2 bg-blue-900/40"></div>
            </div>
          </div>

          {/* Vertical Dimension Chain */}
          <div
            className="absolute top-32 left-16 flex flex-col items-center text-blue-900/50"
            style={{ transform: `translateY(${scrollY * 0.04}px)` }}
          >
            <div className="flex items-center">
              <div className="h-px w-3 bg-blue-900/50"></div>
              <div className="h-px w-3 bg-blue-900/50 ml-1"></div>
            </div>
            <div className="h-32 w-px bg-blue-900/50 relative">
              <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 -rotate-90 text-[10px] font-semibold bg-blue-50/80 px-1 whitespace-nowrap">
                768px
              </div>
              <div className="absolute -top-1 left-0 h-px w-2 bg-blue-900/50"></div>
              <div className="absolute -bottom-1 left-0 h-px w-2 bg-blue-900/50"></div>
            </div>
            <div className="flex items-center">
              <div className="h-px w-3 bg-blue-900/50"></div>
              <div className="h-px w-3 bg-blue-900/50 ml-1"></div>
            </div>
          </div>

          {/* Detailed Component Callouts */}
          <div
            className="absolute top-48 right-16 text-blue-900/60"
            style={{ transform: `translateY(${scrollY * 0.025}px)` }}
          >
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-blue-900/50 bg-blue-100/50 rounded-full relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-blue-900/60 rounded-full"></div>
              </div>
              <div className="w-16 h-px bg-blue-900/50 relative">
                <div className="absolute top-0 right-0 w-2 h-px bg-blue-900/50 transform rotate-45 origin-right"></div>
                <div className="absolute top-0 right-0 w-2 h-px bg-blue-900/50 transform -rotate-45 origin-right"></div>
              </div>
              <div className="border border-blue-900/40 bg-blue-50/90 p-2 text-[10px] leading-tight">
                <div className="font-bold text-blue-900/80">PRIMARY CTA</div>
                <div className="text-blue-900/60 space-y-0.5 mt-1">
                  <div>Component: Button</div>
                  <div>Size: lg (px-8 py-4)</div>
                  <div>Radius: rounded-xl</div>
                  <div>Color: gray-900</div>
                  <div>Shadow: shadow-lg</div>
                  <div>Transform: 3D</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Detail Callouts */}
          <div
            className="absolute bottom-72 left-24 text-blue-900/60"
            style={{ transform: `translateY(${-scrollY * 0.03}px)` }}
          >
            <div className="flex items-center gap-3">
              <div className="border border-blue-900/40 bg-blue-50/90 p-2 text-[10px] leading-tight">
                <div className="font-bold text-blue-900/80">
                  TESTIMONIAL SECTION
                </div>
                <div className="text-blue-900/60 space-y-0.5 mt-1">
                  <div>Layout: Grid 3x1</div>
                  <div>Gap: gap-6</div>
                  <div>Cards: rounded-xl</div>
                  <div>Animation: perspective</div>
                  <div>Delay: 1000ms</div>
                </div>
              </div>
              <div className="w-16 h-px bg-blue-900/50 relative">
                <div className="absolute top-0 left-0 w-2 h-px bg-blue-900/50 transform rotate-45 origin-left"></div>
                <div className="absolute top-0 left-0 w-2 h-px bg-blue-900/50 transform -rotate-45 origin-left"></div>
              </div>
              <div className="w-3 h-3 border border-blue-900/50 bg-blue-100/50 rotate-45"></div>
            </div>
          </div>

          {/* Technical Specifications Panel */}
          <div
            className="absolute top-[35%] right-8 border-2 border-blue-900/40 bg-blue-50/90 p-3 shadow-sm text-[10px]"
            style={{ transform: `translateY(${scrollY * 0.015}px)` }}
          >
            <div className="text-blue-900/80 leading-tight space-y-2">
              <div className="font-bold border-b border-blue-900/30 pb-1 mb-2">
                TECHNICAL SPECIFICATIONS
              </div>

              <div className="space-y-1">
                <div className="font-semibold text-blue-900/70">
                  TYPOGRAPHY:
                </div>
                <div>Primary: Inter, sans-serif</div>
                <div>Mono: ui-monospace</div>
                <div>H1: 5xl-7xl (48-72px)</div>
                <div>Body: xl-2xl (20-24px)</div>
              </div>

              <div className="space-y-1">
                <div className="font-semibold text-blue-900/70">COLORS:</div>
                <div>Primary: #111827</div>
                <div>Secondary: #6B7280</div>
                <div>Background: #F9FAFB</div>
                <div>Accent: #3B82F6</div>
              </div>

              <div className="space-y-1">
                <div className="font-semibold text-blue-900/70">SPACING:</div>
                <div>Container: max-w-4xl</div>
                <div>Padding: px-6 py-8</div>
                <div>Margins: mb-20, mb-12</div>
                <div>Gaps: gap-8, gap-6</div>
              </div>
            </div>
          </div>

          {/* Construction Details */}
          <div
            className="absolute bottom-16 right-12 border-2 border-blue-900/40 bg-blue-50/90 p-3 text-[10px]"
            style={{ transform: `translateY(${-scrollY * 0.01}px)` }}
          >
            <div className="text-blue-900/80 leading-tight space-y-2">
              <div className="font-bold border-b border-blue-900/30 pb-1 mb-2">
                BUILD SPECIFICATIONS
              </div>

              <div className="space-y-1">
                <div className="font-semibold text-blue-900/70">FRAMEWORK:</div>
                <div>Next.js 14 (App Router)</div>
                <div>React 18.2+</div>
                <div>TypeScript 5.0+</div>
              </div>

              <div className="space-y-1">
                <div className="font-semibold text-blue-900/70">STYLING:</div>
                <div>Tailwind CSS 3.4+</div>
                <div>shadcn/ui components</div>
                <div>CSS Transforms (3D)</div>
              </div>

              <div className="space-y-1">
                <div className="font-semibold text-blue-900/70">
                  PERFORMANCE:
                </div>
                <div>Core Web Vitals: ✓</div>
                <div>Lighthouse: 95+</div>
                <div>Bundle: &lt;200KB</div>
              </div>
            </div>
          </div>

          {/* Section Markers with Detail */}
          <div
            className="absolute top-64 left-2 text-blue-900/50"
            style={{ transform: `translateY(${scrollY * 0.02}px)` }}
          >
            <div className="flex items-center gap-2 text-[11px]">
              <div className="w-6 h-px bg-blue-900/50"></div>
              <div className="w-6 h-6 border-2 border-blue-900/50 bg-blue-50/80 rounded-full flex items-center justify-center font-bold">
                A
              </div>
              <div className="w-6 h-px bg-blue-900/50"></div>
            </div>
            <div className="text-[9px] text-blue-900/40 mt-1 ml-8">
              HERO SECTION
            </div>
          </div>

          <div
            className="absolute bottom-32 left-2 text-blue-900/50"
            style={{ transform: `translateY(${-scrollY * 0.02}px)` }}
          >
            <div className="flex items-center gap-2 text-[11px]">
              <div className="w-6 h-px bg-blue-900/50"></div>
              <div className="w-6 h-6 border-2 border-blue-900/50 bg-blue-50/80 rounded-full flex items-center justify-center font-bold">
                B
              </div>
              <div className="w-6 h-px bg-blue-900/50"></div>
            </div>
            <div className="text-[9px] text-blue-900/40 mt-1 ml-8">
              CTA SECTION
            </div>
          </div>

          {/* Elevation Markers */}
          <div
            className="absolute top-[25%] right-1/4 text-blue-900/50"
            style={{ transform: `translateY(${scrollY * 0.03}px)` }}
          >
            <div className="flex items-center gap-2 text-[10px]">
              <div className="border border-blue-900/40 bg-blue-50/80 px-2 py-1 rounded">
                <div className="font-semibold">ELEVATION</div>
                <div>Z-INDEX: 10</div>
              </div>
              <div className="w-8 h-px bg-blue-900/50"></div>
              <div className="w-2 h-2 bg-blue-900/50 rotate-45"></div>
            </div>
          </div>

          {/* Flow Diagram */}
          <div
            className="absolute top-[40%] left-1/3"
            style={{ transform: `translateY(${scrollY * 0.02}px)` }}
          >
            <svg width="120" height="60" className="text-blue-900/40">
              <defs>
                <marker
                  id="blueprintArrow"
                  markerWidth="8"
                  markerHeight="6"
                  refX="7"
                  refY="3"
                  orient="auto"
                  fill="currentColor"
                >
                  <polygon points="0 0, 8 3, 0 6" />
                </marker>
              </defs>
              <path
                d="M10 30 L50 30 L50 15 L90 15"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                markerEnd="url(#blueprintArrow)"
                strokeDasharray="3,2"
              />
              <circle cx="10" cy="30" r="3" fill="currentColor" />
              <text
                x="15"
                y="45"
                fontSize="9"
                fill="currentColor"
                className="font-mono"
              >
                USER FLOW
              </text>
            </svg>
          </div>

          {/* Grid Reference System */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-8 text-[9px] text-blue-900/40">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border border-blue-900/40 bg-green-200/50"></div>
              <span>IMPLEMENTED</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border border-blue-900/40 bg-yellow-200/50"></div>
              <span>IN DEVELOPMENT</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border border-blue-900/40 bg-red-200/50"></div>
              <span>REQUIRES REVIEW</span>
            </div>
          </div>

          {/* Coordinate System */}
          <div className="absolute bottom-4 right-4 text-[9px] text-blue-900/40 font-mono">
            <div>COORDINATES:</div>
            <div>X: 1920px</div>
            <div>Y: 1080px</div>
            <div>ORIGIN: TOP-LEFT</div>
          </div>

          {/* Revision Cloud */}
          <div
            className="absolute top-[55%] left-8"
            style={{ transform: `translateY(${scrollY * 0.02}px)` }}
          >
            <svg width="80" height="40" className="text-blue-900/30">
              <path
                d="M10 20 Q15 10, 25 15 Q35 5, 45 15 Q55 10, 65 20 Q70 30, 60 25 Q50 35, 40 25 Q30 35, 20 25 Q10 30, 10 20 Z"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                strokeDasharray="2,1"
              />
              <text
                x="25"
                y="24"
                fontSize="8"
                fill="currentColor"
                className="font-mono"
              >
                REV 2.1
              </text>
            </svg>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <AnimatedSection animation="perspective" className="mb-20">
          <header className="flex items-center justify-between">
            <Logo />
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleRoastClick}
                className="text-slate-900 hover:text-gray-700 font-medium transition-colors duration-300 underline underline-offset-4 hover:no-underline"
              >
                Roast my 💩
              </button>
              <Button
                onClick={() => handleServiceClick(services.project)}
                className="bg-slate-900 hover:bg-blue-900 text-white font-medium px-6 py-2 rounded-lg transition-all duration-300 transform-gpu hover:translate-z-2 hover:rotate-x-2"
              >
                Get Started
              </Button>
            </div>
          </header>
        </AnimatedSection>

        {/* Hero Content */}
        <div
          className="max-w-4xl mx-auto text-center"
          style={{ perspective: "1500px" }}
        >
          {/* Badge */}
          <AnimatedSection animation="flip" delay={200} className="mb-8">
            <Badge className="bg-blue-50 hover:bg-blue-50 text-slate-700 border-blue-200 px-4 py-2 text-sm font-medium transform-gpu transition-transform duration-300">
              11 projects launched • Book Now
            </Badge>
          </AnimatedSection>

          {/* Main Headline */}
          <AnimatedSection animation="rotate3D" delay={400} className="mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight transform-gpu">
              <span
                className="inline-block transform-gpu transition-transform duration-700 hover:rotate-y-6"
                style={{ transformStyle: "preserve-3d" }}
              >
                We Fix Your
              </span>
              <br />
              <span
                className="text-slate-900 inline-block transform-gpu transition-transform duration-700 hover:rotate-y-[-6deg] relative"
                style={{
                  transformStyle: "preserve-3d",
                  transitionDelay: "100ms",
                }}
              >
                <span className="line-through text-slate-400 mr-4">trash</span>
                <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
                  Vibe Code
                </span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 font-light max-w-3xl mx-auto leading-relaxed mb-6">
              Stop staring at that half-finished site or app. We'll finish what
              you started and get you earning in 2-4 weeks.
            </p>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              ✨ No judgment, just results. We've seen <em>much</em> worse.
            </p>
          </AnimatedSection>

          {/* Main CTA */}
          <AnimatedSection
            animation="perspective"
            delay={600}
            className="mb-20"
          >
            <div className="max-w-3xl mx-auto">
              {/* Main Form Container */}
              <div className="relative group">
                {/* Subtle background glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 via-slate-100 to-blue-100 rounded-3xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                {/* Main form */}
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.06)] overflow-hidden"
                >
                  {/* Subtle top border accent */}
                  <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>

                  <div className="p-8">
                    {/* Input container */}
                    <div className="relative mb-6">
                      <div className="relative">
                        <PlaceholdersAndVanishInput
                          placeholders={placeholderExamples}
                          onChange={(e) => setInputValue(e.target.value)}
                          onSubmit={handleSubmit}
                        />

                        {/* Subtle input glow on focus */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/5 via-transparent to-blue-400/5 opacity-0 focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                      </div>
                      {/* Floating label hint */}
                      <div className="text-xs text-slate-500 font-medium mt-2">
                        Share your project URL, repo, email, or describe your
                        issue
                      </div>
                    </div>

                    {/* Submit button */}
                    <Button
                      size="lg"
                      type="submit"
                      className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-blue-900 hover:via-blue-800 hover:to-blue-900 text-white font-medium text-xl px-8 py-5 rounded-xl transition-all duration-700 shadow-lg hover:shadow-xl group relative overflow-hidden"
                      onClick={() => {
                        formRef.current?.submit();
                      }}
                    >
                      {/* Button background shimmer */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                      <span className="relative flex items-center justify-center">
                        Fix My Code
                        <ArrowRight className="ml-3 w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </Button>
                  </div>

                  {/* Bottom section */}
                  <div className="px-8 pb-6 border-t border-slate-100/50">
                    <div className="flex items-center justify-center gap-6 text-sm text-slate-500 pt-4">
                      <span className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        Free consultation
                      </span>
                      <div className="w-px h-4 bg-slate-200"></div>
                      <span className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        2-4 week delivery
                      </span>
                      <div className="w-px h-4 bg-slate-200"></div>
                      <span className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                        Starting at $99
                      </span>
                    </div>
                  </div>
                </form>
              </div>

              {/* Alternative action */}
              <div className="mt-8 text-center">
                <div className="flex items-center justify-center gap-4 text-sm">
                  <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent flex-1 max-w-20"></div>
                  <span className="text-slate-400 font-medium">or</span>
                  <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent flex-1 max-w-20"></div>
                </div>

                <button
                  type="button"
                  onClick={handleRoastClick}
                  className="mt-4 text-slate-600 hover:text-slate-900 font-medium transition-all duration-300 relative group"
                >
                  <span className="relative">
                    Just roast my work for free
                    <div className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-transparent via-slate-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </span>
                </button>
              </div>
            </div>
          </AnimatedSection>

          {/* Services Grid */}
          <div className="mb-20 relative z-20">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Main Service */}
              <div className="md:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-left relative z-30 hover:shadow-xl transition-all duration-300">
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                  Finish Your Project
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  From security nightmare to production-ready SaaS. We handle
                  the technical debt, add missing features, and get you to
                  market.
                </p>
                <div className="space-y-3 mb-6">
                  {[
                    "Fix bugs and complete features",
                    "Security audit and optimization",
                    "Production deployment",
                    "Launch strategy and support",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-slate-900 flex-shrink-0" />
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-4">
                  Starting at $249
                </div>
                <Button
                  onClick={() => handleServiceClick(services.project)}
                  className="bg-slate-900 hover:bg-blue-900 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 relative z-40 pointer-events-auto"
                  style={{ position: "relative", zIndex: 50 }}
                >
                  Finish My Project
                </Button>
              </div>

              {/* Supporting Services */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-left relative z-30 hover:shadow-lg transition-all duration-300">
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">
                    Code Review
                  </h4>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg text-slate-400 line-through">
                      $149
                    </span>
                    <div className="text-2xl font-bold text-slate-900">$99</div>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">
                    Pair-programming code audit with roadmap and security
                    recommendations.
                  </p>
                  <Button
                    onClick={() => handleServiceClick(services.review)}
                    variant="outline"
                    className="w-full border-gray-300 text-slate-700 hover:bg-gray-50 transition-all duration-300 relative z-40 pointer-events-auto"
                    style={{ position: "relative", zIndex: 50 }}
                  >
                    Book Review
                  </Button>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-left relative z-30 hover:shadow-lg transition-all duration-300">
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">
                    Roast My Work
                  </h4>
                  <div className="text-2xl font-bold text-slate-900 mb-3">
                    Free
                  </div>
                  <p className="text-slate-600 text-sm mb-4">
                    Brutally honest feedback about your project.
                  </p>
                  <Button
                    onClick={handleRoastClick}
                    variant="outline"
                    className="w-full border-gray-300 text-slate-700 hover:bg-gray-50 transition-all duration-300 relative z-40 pointer-events-auto"
                    style={{ position: "relative", zIndex: 50 }}
                  >
                    Roast Me
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <AnimatedSection animation="perspective" delay={1000}>
            <h3 className="text-2xl font-semibold text-slate-900 mb-8">
              Trusted by indie founders
            </h3>
            <div
              className="grid md:grid-cols-3 gap-6"
              style={{ perspective: "1000px" }}
            >
              {[
                {
                  quote:
                    "Had a half-built SaaS sitting for 8 months. They finished it in 3 weeks. Now doing $15k MRR.",
                  name: "Alex K.",
                  title: "Founder, IndieMRR",
                },
                {
                  quote:
                    "My AI platform was stuck in development hell. They got it production-ready and helped me scale to 10k users.",
                  name: "Cait Russell",
                  title: "Founder, Lunra.ai",
                },
                {
                  quote:
                    "Abandoned my project for a year. They revived it and got me to $12k MRR. Best investment ever.",
                  name: "Marco T.",
                  title: "Solo dev, LaunchFast",
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-left transform-gpu transition-all duration-700 hover:translate-z-4 hover:rotate-y-3 hover:shadow-xl"
                  style={{
                    transitionDelay: `${index * 150}ms`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <p className="text-slate-700 mb-4 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full transform-gpu transition-transform duration-300 hover:rotate-y-180"></div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {testimonial.name}
                      </p>
                      <p className="text-slate-500 text-sm">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Final CTA Section */}
          <AnimatedSection
            animation="rotate3D"
            delay={1200}
            className="mt-20 py-16"
          >
            <div
              className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-12 border border-slate-200 transform-gpu transition-all duration-700 hover:translate-z-6 hover:rotate-x-2 hover:shadow-2xl"
              style={{ transformStyle: "preserve-3d" }}
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Ready to finish your project?
              </h2>
              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                Stop letting your ideas collect dust. Let's turn your abandoned
                project into your next success story.
              </p>
              <Button
                size="lg"
                onClick={() => handleServiceClick(services.project)}
                className="bg-slate-900 hover:bg-blue-900 text-white font-medium text-lg px-10 py-4 rounded-xl transition-all duration-500 shadow-lg hover:shadow-2xl group transform-gpu hover:translate-z-4 hover:rotate-x-3"
                style={{ transformStyle: "preserve-3d" }}
              >
                Finish My Project
                <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-z-2" />
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
