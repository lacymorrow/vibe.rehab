"use client"

import type React from "react"

import { useScrollAnimation } from "../hooks/use-scroll-animation"

interface StaggeredGridProps {
  children: React.ReactNode[]
  className?: string
  staggerDelay?: number
}

export function StaggeredGrid({ children, className = "", staggerDelay = 100 }: StaggeredGridProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 })

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={`transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: `${index * staggerDelay}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
