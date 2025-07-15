"use client";

import { RoastCard, type Roast } from "@/components/roast-card";
import { AnimatedSection } from "@/components/animated-section";

interface RoastsListProps {
  roasts: Roast[];
}

export function RoastsList({ roasts }: RoastsListProps) {
  return (
    <section id="roasts" className="px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-light text-slate-800 mb-3">
            recent roasts
          </h2>
        </div>
        
        <AnimatedSection className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roasts.map((roast, index) => (
            <div
              key={roast.id}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <RoastCard roast={roast} />
            </div>
          ))}
        </AnimatedSection>
        
        <AnimatedSection className="text-center mt-16">
          <div className="w-24 h-px bg-amber-300 mx-auto mb-6" />
          <p className="text-slate-600 mb-6 italic">
            think your site can handle the heat?
          </p>
          <div className="flex justify-center">
            <a 
              href="/#contact"
              className="text-amber-600 hover:text-amber-700 transition-colors underline decoration-dotted underline-offset-4 text-lg"
            >
              submit your site for roasting
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}