"use client";

import { Logo } from "@/components/logo";
import { AnimatedSection } from "@/components/animated-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Flame, AlertTriangle } from "lucide-react";
import Link from "next/link";

export function RoastsHero() {
  return (
    <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 sm:py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-red-50/50 to-background -z-10" />
      
      <AnimatedSection className="max-w-4xl mx-auto text-center space-y-8">
        <div className="flex justify-center mb-8">
          <Logo className="h-12 w-12" />
        </div>
        
        <Badge variant="destructive" className="gap-1">
          <Flame className="h-3 w-3" />
          Website Roasts
        </Badge>
        
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
          Your Site Sucks.
          <br />
          <span className="text-destructive">Let Us Tell You Why</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Brutal honesty about what's wrong with your website. No sugar-coating, 
          no fluff. Just raw truth that'll help you build something people actually want to use.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" variant="destructive" asChild>
            <Link href="#roasts">
              <AlertTriangle className="mr-2 h-4 w-4" />
              See The Roasts
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/#contact">
              Get Your Site Roasted
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Warning: May cause ego bruising and sudden urges to redesign everything
        </p>
      </AnimatedSection>
    </section>
  );
}