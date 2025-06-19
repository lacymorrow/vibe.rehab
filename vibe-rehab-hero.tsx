"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Check } from "lucide-react"
import { useParallax, use3DScroll } from "./hooks/use-scroll-animation"
import { WaitlistDialog } from "./components/waitlist-dialog"
import { PaymentDialog } from "./components/payment-dialog"
import { AnimatedSection } from "./components/animated-section"
import { Logo } from "./components/logo"

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
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PROJECT || "price_1234567890",
  },
  review: {
    name: "Code Review",
    price: 99,
    description: "Pair-programming code audit with roadmap and security recommendations.",
    features: [
      "Comprehensive code audit",
      "Security vulnerability assessment",
      "Performance optimization recommendations",
      "Detailed improvement roadmap",
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_REVIEW || "price_0987654321",
  },
}

export default function Component() {
  const [showWaitlistDialog, setShowWaitlistDialog] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [selectedService, setSelectedService] = useState<typeof services.project | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const scrollY = useParallax()
  const scrollProgress = use3DScroll()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleServiceClick = (service: typeof services.project) => {
    setSelectedService(service)
    setShowPaymentDialog(true)
  }

  const handleRoastClick = () => {
    setShowWaitlistDialog(true)
  }

  return (
    <div
      className="min-h-screen bg-blue-50 relative overflow-hidden font-['Inter_Tight',_'Inter',_sans-serif]"
      style={{ backgroundColor: "#f0f4f8" }}
    >
      {/* Dialogs */}
      <WaitlistDialog isOpen={showWaitlistDialog} onClose={() => setShowWaitlistDialog(false)} />
      {selectedService && (
        <PaymentDialog
          isOpen={showPaymentDialog}
          onClose={() => setShowPaymentDialog(false)}
          service={selectedService}
        />
      )}

      {/* Blueprint Background */}
      <div className="absolute inset-0 overflow-hidden z-0" style={{ opacity: 0.4 }}>
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
            backgroundSize: "10px 10px, 10px 10px, 50px 50px, 50px 50px, 200px 200px, 200px 200px",
          }}
        />

        {/* Blueprint Annotations Layer */}
        <div className="absolute inset-0 font-mono text-xs text-blue-900/60">
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
          <div className="absolute top-24 left-32" style={{ transform: `translateY(${scrollY * 0.03}px)` }}>
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
                <div className="font-bold text-blue-900/80">TESTIMONIAL SECTION</div>
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
              <div className="font-bold border-b border-blue-900/30 pb-1 mb-2">TECHNICAL SPECIFICATIONS</div>

              <div className="space-y-1">
                <div className="font-semibold text-blue-900/70">TYPOGRAPHY:</div>
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
              <div className="font-bold border-b border-blue-900/30 pb-1 mb-2">BUILD SPECIFICATIONS</div>

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
                <div className="font-semibold text-blue-900/70">PERFORMANCE:</div>
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
            <div className="text-[9px] text-blue-900/40 mt-1 ml-8">HERO SECTION</div>
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
            <div className="text-[9px] text-blue-900/40 mt-1 ml-8">CTA SECTION</div>
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
          <div className="absolute top-[40%] left-1/3" style={{ transform: `translateY(${scrollY * 0.02}px)` }}>
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
              <text x="15" y="45" fontSize="9" fill="currentColor" className="font-mono">
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
          <div className="absolute top-[55%] left-8" style={{ transform: `translateY(${scrollY * 0.02}px)` }}>
            <svg width="80" height="40" className="text-blue-900/30">
              <path
                d="M10 20 Q15 10, 25 15 Q35 5, 45 15 Q55 10, 65 20 Q70 30, 60 25 Q50 35, 40 25 Q30 35, 20 25 Q10 30, 10 20 Z"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                strokeDasharray="2,1"
              />
              <text x="25" y="24" fontSize="8" fill="currentColor" className="font-mono">
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
        <div className="max-w-4xl mx-auto text-center" style={{ perspective: "1500px" }}>
          {/* Badge */}
          <AnimatedSection animation="flip" delay={200} className="mb-8">
            <Badge className="bg-blue-50 hover:bg-blue-50 text-slate-700 border-blue-200 px-4 py-2 text-sm font-medium transform-gpu transition-transform duration-300">
              6 projects completed • Book Now
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
                style={{ transformStyle: "preserve-3d", transitionDelay: "100ms" }}
              >
                <span className="line-through text-slate-400 mr-4">trash</span>
                <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
                  Vibe Code
                </span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 font-light max-w-3xl mx-auto leading-relaxed mb-6">
              Stop staring at that half-finished site or app. We'll finish what you started and get you earning in 2-4
              weeks.
            </p>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              ✨ No judgment, just results. We've seen <em>much</em> worse.
            </p>
          </AnimatedSection>

          {/* Main CTA */}
          <AnimatedSection animation="perspective" delay={600} className="mb-20">
            <Button
              size="lg"
              onClick={handleRoastClick}
              variant="outline"
              className="bg-transparent border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-medium text-lg px-8 py-4 rounded-xl transition-all duration-500 shadow-lg hover:shadow-2xl mb-4 group transform-gpu hover:translate-z-4 hover:rotate-x-3"
              style={{ transformStyle: "preserve-3d" }}
            >
              Sign up to be roasted
              <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-z-2" />
            </Button>
            <Button
              size="lg"
              onClick={() => handleServiceClick(services.project)}
              className="bg-slate-900 hover:bg-blue-900 text-white font-medium text-lg px-8 py-4 rounded-xl transition-all duration-500 shadow-lg hover:shadow-2xl mb-4 group transform-gpu hover:translate-z-4 hover:rotate-x-3 ml-4"
              style={{ transformStyle: "preserve-3d" }}
            >
              Let's Finish This Thing
              <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-z-2" />
            </Button>
            <p className="text-slate-500 text-sm">Starting at $99 • 2-4 week delivery</p>
          </AnimatedSection>

          {/* Services Grid */}
          <div className="mb-20 relative z-20">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Main Service */}
              <div className="md:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-left relative z-30 hover:shadow-xl transition-all duration-300">
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">Finish Your Project</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  From security nightmare to production-ready SaaS. We handle the technical debt, add missing features,
                  and get you to market.
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
                <div className="text-3xl font-bold text-slate-900 mb-4">Starting at $249</div>
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
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">Code Review</h4>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg text-slate-400 line-through">$149</span>
                    <div className="text-2xl font-bold text-slate-900">$99</div>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">
                    Pair-programming code audit with roadmap and security recommendations.
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
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">Roast My Work</h4>
                  <div className="text-2xl font-bold text-slate-900 mb-3">Free</div>
                  <p className="text-slate-600 text-sm mb-4">Brutally honest feedback about your project.</p>
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
            <h3 className="text-2xl font-semibold text-slate-900 mb-8">Trusted by indie founders</h3>
            <div className="grid md:grid-cols-3 gap-6" style={{ perspective: "1000px" }}>
              {[
                {
                  quote: "Had a half-built SaaS sitting for 8 months. They finished it in 3 weeks. Now doing $15k MRR.",
                  name: "Alex K.",
                  title: "Founder, IndieMRR",
                },
                {
                  quote: "My MVP was a mess. They rebuilt it properly and helped me launch. Hit $8k MRR in month 2.",
                  name: "Sarah L.",
                  title: "Creator, DevToolkit",
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
                  <p className="text-slate-700 mb-4 leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full transform-gpu transition-transform duration-300 hover:rotate-y-180"></div>
                    <div>
                      <p className="font-medium text-slate-900">{testimonial.name}</p>
                      <p className="text-slate-500 text-sm">{testimonial.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Final CTA Section */}
          <AnimatedSection animation="rotate3D" delay={1200} className="mt-20 py-16">
            <div
              className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-12 border border-slate-200 transform-gpu transition-all duration-700 hover:translate-z-6 hover:rotate-x-2 hover:shadow-2xl"
              style={{ transformStyle: "preserve-3d" }}
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to finish your project?</h2>
              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                Stop letting your ideas collect dust. Let's turn your abandoned project into your next success story.
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
  )
}
