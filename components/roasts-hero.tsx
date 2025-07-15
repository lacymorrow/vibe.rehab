"use client";

import { Logo } from "@/components/logo";
import { AnimatedSection } from "@/components/animated-section";

export function RoastsHero() {
  return (
    <section className="relative flex flex-col items-center justify-center px-4 py-16 sm:py-24">
      
      <AnimatedSection className="max-w-4xl mx-auto text-center space-y-8">
        <div className="flex justify-center mb-8">
          <Logo className="" />
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl sm:text-6xl font-light tracking-wide text-slate-800">
            <span className="italic">honestly</span>, your site needs work
          </h1>
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light italic">
            brutal (but helpful) website critiques
          </p>
          
          <div className="w-16 h-px bg-amber-300 mx-auto mt-8" />
        </div>
      </AnimatedSection>
    </section>
  );
}