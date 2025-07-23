"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, Calendar, Clock } from "lucide-react";
import { AnimatedSection } from "@/components/animated-section";
import { Logo } from "@/components/logo";
import type { RoastWithContent } from "@/lib/mdx";
import { MDXContent } from "@/components/mdx-content";

interface RoastDetailProps {
  roast: RoastWithContent;
}

export function RoastDetail({ roast }: RoastDetailProps) {
  const readingTime = Math.ceil(roast.content.split(" ").length / 200);

  return (
    <article className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/roasts"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">back to roasts</span>
          </Link>
          <Logo className="h-6 text-slate-600" />
        </div>
      </header>

      {/* Article Header */}
      <AnimatedSection className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-6">
          <h1 className="text-3xl sm:text-4xl font-light text-slate-800 leading-tight">
            {roast.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <time dateTime={roast.roastDate}>
                {new Date(roast.roastDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{readingTime} min read</span>
            </div>
            <span>•</span>
            <Link
              href={roast.url}
              target="_blank"
              className="flex items-center gap-1 text-amber-600 hover:text-amber-700 transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              <span>visit site</span>
            </Link>
          </div>

          <p className="text-lg text-slate-600 italic">"{roast.summary}"</p>

          <div className="flex flex-wrap gap-2">
            {roast.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="w-24 h-px bg-amber-300" />
        </div>
      </AnimatedSection>

      {/* Issues Overview */}
      <AnimatedSection className="max-w-4xl mx-auto px-4 pb-8">
        <div className="bg-amber-50/50 rounded-lg p-6 border border-amber-200/50">
          <h2 className="text-sm font-medium text-slate-700 uppercase tracking-wide mb-3">
            key issues identified
          </h2>
          <ul className="space-y-2">
            {roast.issues.map((issue, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-700">
                <span className="text-amber-500 mt-0.5 text-sm">•</span>
                <span className="text-sm leading-relaxed">{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      </AnimatedSection>

      {/* Article Content */}
      <AnimatedSection className="max-w-4xl mx-auto px-4 pb-16">
        <div className="prose prose-slate prose-lg prose-headings:font-light prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline prose-code:text-sm prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-900 prose-pre:text-slate-100 max-w-none">
          <MDXContent content={roast.content} />
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-6">
          <div className="w-24 h-px bg-amber-300 mx-auto" />
          <p className="text-slate-600 italic">is your site next?</p>
          <Link
            href="/#contact"
            className="inline-block text-amber-600 hover:text-amber-700 transition-colors underline decoration-dotted underline-offset-4"
          >
            submit your site for roasting
          </Link>
        </div>
      </footer>
    </article>
  );
}
