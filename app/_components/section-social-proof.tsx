"use client";
import { Marquee } from "@/components/magicui/marquee";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

// Small utility to highlight the content of specific section of a testimonial content
export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-700/[0.2] dark:text-emerald-500 px-1 py-0.5",
        className
      )}
    >
      {children}
    </span>
  );
};

const TESTIMONIALS = [
  {
    id: 0,
    name: "Cait Russell",
    designation: "Founder, Lunra.ai",
    content:
      "I was stuck on a project for a year. They revived it and got me to $12k MRR. Best investment ever.",
  },
  {
    id: 1,
    name: "Alex Lesner",
    designation: "Founder",
    content:
      "Had a half-built SaaS sitting for 8 months. They finished it in 3 weeks. Now doing $15k MRR.",
  },
  {
    id: 2,
    name: "Jonny Henly",
    designation: "Indie Hacker",
    content:
      "Abandoned my project for a year. They revived it and got me to $12k MRR. Best investment ever.",
  },
  {
    id: 3,
    name: "Sarah Schattenfield",
    designation: "CTO, Harper",
    content:
      "My React app was a complete mess. They cleaned it up and deployed it in 2 weeks. Amazing work!",
  },
  {
    id: 4,
    name: "Grayson Hearn",
    designation: "Founder",
    content:
      "Broken authentication, messy code, no deployment. They fixed everything and got me live in 3 weeks.",
  },
];

interface TestimonialCardProps {
  name: string;
  designation: string;
  content: string;
}

const TestimonialCard = ({
  name,
  designation,
  content,
}: TestimonialCardProps) => {
  return (
    <figure
      className={cn(
        "relative h-full w-72 sm:w-80 cursor-pointer overflow-hidden rounded-xl border p-6 flex-shrink-0",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <blockquote className="text-sm leading-relaxed mb-4">
        "{content}"
      </blockquote>
      <div className="flex flex-col">
        <figcaption className="text-sm font-semibold dark:text-white">
          {name}
        </figcaption>
        <p className="text-xs font-medium text-gray-500 dark:text-white/40">
          {designation}
        </p>
      </div>
    </figure>
  );
};

export function SectionSocialProof() {
  const [hoverCapable, setHoverCapable] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mql = window.matchMedia("(hover: hover)");
      setHoverCapable(mql.matches);
    }
  }, []);
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          What Our Clients Say
        </h3>
        <p className="text-slate-600">
          From broken projects to successful launches
        </p>
      </div>

      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <Marquee
          pauseOnHover={hoverCapable}
          className="[--duration:20s] sm:[--duration:25s] [--gap:1.5rem] sm:[--gap:2rem]"
          repeat={8}
        >
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard key={testimonial.id} {...testimonial} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white"></div>
      </div>
    </div>
  );
}
