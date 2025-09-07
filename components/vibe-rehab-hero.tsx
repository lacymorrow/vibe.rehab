"use client";

import type React from "react";

import { useState, useEffect, Suspense, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Check } from "lucide-react";
import { useParallax, use3DScroll } from "@/hooks/use-scroll-animation";
import { PaymentDialog } from "@/components/payment-dialog";
import { ContactDialog } from "@/components/contact-dialog";
import { AnimatedSection } from "@/components/animated-section";
import { Logo } from "@/components/logo";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { PointerHighlight } from "./ui/pointer-highlight";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Highlight,
  SectionSocialProof,
} from "@/app/_components/section-social-proof";
import { CardsMarquee } from "@/app/_components/cards-marquee";
import { IndieLaunchTweets } from "./indie-launch-tweets";
import { ThreeDMarqueeDemo } from "@/app/_components/section-marquee";

// Blueprint Background Component - Simplified for LCP
const BlueprintBackground = ({ isMobile }: { isMobile: boolean }) => (
  <div
    className="absolute inset-0 overflow-hidden z-0"
    style={{ opacity: 0.3 }}
  >
    {/* Simplified Blueprint Grid - Static for better LCP */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0,50,150,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,50,150,0.1) 1px, transparent 1px)
        `,
        backgroundSize: isMobile
          ? "20px 20px"
          : "15px 15px",
      }}
    />

    {/* Simplified Blueprint Annotations - No scroll transforms for LCP */}
    <div className="absolute inset-0 font-mono text-xs text-blue-900/50 hidden lg:block">
      {/* Main Title Block - Static */}
      <div className="absolute top-1/4 left-10 border-2 border-blue-900/30 bg-blue-50/70 p-4 shadow-sm">
        <div className="space-y-1 text-[11px] leading-tight">
          <div className="font-bold text-blue-900/70 border-b border-blue-900/20 pb-1 mb-2">
            VIBE REHABILITATION SYSTEMS
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div>PROJECT:</div>
            <div className="font-semibold">VIBE.REHAB</div>
            <div>DRAWING:</div>
            <div>HERO-001</div>
            <div>SCALE:</div>
            <div>1:1 @1920px</div>
          </div>
        </div>
      </div>

      {/* Status Indicators - Static */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-8 text-[9px] text-blue-900/30">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border border-blue-900/30 bg-green-200/40"></div>
          <span>IMPLEMENTED</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border border-blue-900/30 bg-blue-200/40"></div>
          <span>OPTIMIZED</span>
        </div>
      </div>
    </div>
  </div>
);

const services = {
  project: {
    name: "Finish Your Project",
    price: 999,
    discountedPrice: 2500,
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
    discountedPrice: 149,
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
  const [selectedService, setSelectedService] = useState<
    typeof services.project | null
  >(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(false);
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
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsLoaded(true);
    // Delay non-critical animations to improve LCP
    const animationTimer = setTimeout(() => {
      setAnimationsEnabled(true);
    }, 100);

    return () => clearTimeout(animationTimer);
  }, []);

  // Rotate placeholder text with fade transition - Only after animations are enabled
  useEffect(() => {
    if (!animationsEnabled) return;

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
  }, [isFocused, inputValue, animationsEnabled]);

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

    if (!inputValue.trim()) {
      // Optionally, add some visual feedback here, e.g., a toast notification
      // Or, set an error state to display a message to the user
      toast({
        title: "Input Required",
        description:
          "Please enter a project URL, repo, email, or describe your issue.",
        variant: "destructive",
      });
      return;
    }

    const type = detectInputType(inputValue);
    setDetectedType(type);
    setSubmittedValue(inputValue);

    if (type === "email") {
      // Show contact dialog with email prop
      setShowContactDialog(true);
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
    setSubmittedValue("");
    setDetectedType("message");
  };


  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div
      className="min-h-screen bg-blue-50 relative overflow-hidden font-sans"
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
        submittedValue={detectedType === "email" ? undefined : submittedValue}
        detectedType={detectedType === "email" ? undefined : detectedType}
        email={detectedType === "email" ? submittedValue : undefined}
      />

      <Toaster />

      {/* Blueprint Background - Simplified for LCP */}
      <BlueprintBackground isMobile={isMobile} />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8 flex flex-col gap-16 max-w-6xl">
        <AnimatedSection animation={animationsEnabled ? "perspective" : "none"} className="">
          <header className="flex items-center justify-between gap-3 sm:gap-4">
            <Logo className="flex-shrink" />
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleRoastClick}
                className="hidden sm:inline-flex text-sm sm:text-base text-slate-900 hover:text-gray-700 font-medium transition-colors duration-300 underline underline-offset-4 hover:no-underline"
              >
                Roast my 💩
              </button>
              <Button
                onClick={() => handleServiceClick(services.project)}
                className="bg-slate-900 hover:bg-blue-900 text-white font-medium text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3 rounded-lg transition-all duration-300"
                style={
                  isMobile
                    ? {}
                    : { transformStyle: "preserve-3d", transform: "translateZ(0)" }
                }
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
          <AnimatedSection animation={animationsEnabled ? "flip" : "none"} delay={200} className="mb-8">
            <Badge className="bg-blue-50 hover:bg-blue-50 text-slate-700 border-blue-200 px-4 py-2 text-sm font-medium">
              Now accepting new projects • Book Now
            </Badge>
          </AnimatedSection>

          {/* Main Headline */}
          <AnimatedSection
            animation={animationsEnabled ? (isMobile ? "fadeIn" : "rotate3D") : "none"}
            delay={400}
            className="mb-12"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              <span
                className={`inline-block ${animationsEnabled ? 'transition-transform duration-700 hover:rotate-y-6' : ''}`}
                style={
                  isMobile || !animationsEnabled
                    ? {}
                    : {
                        transformStyle: "preserve-3d",
                      }
                }
              >
                We Fix Your
              </span>
              <br />
              <span
                className={`text-slate-900 inline-block relative ${animationsEnabled ? 'transition-transform duration-700 hover:rotate-y-[-6deg]' : ''}`}
                style={
                  isMobile || !animationsEnabled
                    ? {}
                    : {
                        transformStyle: "preserve-3d",
                        transitionDelay: "100ms",
                      }
                }
              >
                <span className="line-through text-slate-400 mr-4">trash</span>
                <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text">
                  <PointerHighlight
                    rectangleClassName="bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 leading-loose"
                    pointerClassName="text-blue-500 h-3 w-3"
                    containerClassName="inline-block mx-1"
                  >
                    Vibe Code
                  </PointerHighlight>
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
          <AnimatedSection animation={animationsEnabled ? "perspective" : "none"} delay={600}>
            <div className="max-w-3xl mx-auto">
              {/* Main Form Container */}
              <div className="relative group">
                {/* Subtle background glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 via-slate-100 to-blue-100 rounded-3xl blur-sm opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-700"></div>

                {/* Main form */}
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className={`relative bg-white/80 ${
                    !isMobile ? "backdrop-blur-sm" : ""
                  } rounded-2xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.06)] overflow-hidden`}
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
                    >
                      {/* Button background shimmer */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] group-focus-within:translate-x-[100%] transition-transform duration-1000"></div>

                      <span className="relative flex items-center justify-center">
                        Fix My Code
                        <ArrowRight className="ml-3 w-6 h-6 transition-transform duration-300 group-hover:translate-x-1 group-focus-within:translate-x-1" />
                      </span>
                    </Button>
                  </div>

                  {/* Bottom section */}
                  <div className="px-8 pb-6 border-t border-slate-100/50">
                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-slate-500 pt-4">
                      <span className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        Free consultation
                      </span>
                      <div className="hidden sm:block w-px h-4 bg-slate-200"></div>
                      <span className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        2-4 week delivery
                      </span>
                      <div className="hidden sm:block w-px h-4 bg-slate-200"></div>
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
                    <div className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-transparent via-slate-400 to-transparent scale-x-0 group-hover:scale-x-100 group-focus-within:scale-x-100 transition-transform duration-300"></div>
                  </span>
                </button>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Services Grid */}
        <div className="relative z-20">
          <div className="grid md:grid-cols-3 gap-8 mx-auto">
            {/* Main Service */}
            <div className="md:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-left relative z-30 hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                Finish Your Project
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                From security nightmare to production-ready SaaS. We handle the
                technical debt, add missing features, and get you to market.
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
                <span className="text-lg">Starting at </span>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg text-slate-400 line-through">
                    ${services.project.discountedPrice}
                  </span>
                  <span className="text-2xl font-bold text-slate-900">
                    ${services.project.price}
                  </span>
                </div>
              </div>
              <Button
                onClick={() => {
                  setSubmittedValue("I want to finish my project");
                  setDetectedType("message");
                  setShowContactDialog(true);
                }}
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
                  Bug Fixes
                </h4>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg text-slate-400 line-through">
                    ${services.review.discountedPrice}
                  </span>
                  <div className="text-2xl font-bold text-slate-900">
                    ${services.review.price}
                  </div>
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
        <AnimatedSection animation="perspective" delay={200}>
          <SectionSocialProof />
        </AnimatedSection>

        {/* Final CTA Section */}
        <ThreeDMarqueeDemo />
      </div>
    </div>
  );
}
