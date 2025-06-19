"use client"

import type React from "react"

import { useScrollAnimation } from "../hooks/use-scroll-animation"

interface AnimatedSectionProps {
  children: React.ReactNode
  animation?: "fadeIn" | "slideUp" | "slideLeft" | "slideRight" | "scale" | "rotate3D" | "flip" | "perspective"
  delay?: number
  className?: string
}

export function AnimatedSection({ children, animation = "fadeIn", delay = 0, className = "" }: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 })

  const getAnimationClasses = () => {
    const baseClasses = "transition-all duration-1000 ease-out"

    switch (animation) {
      case "fadeIn":
        return `${baseClasses} ${isVisible ? "opacity-100" : "opacity-0"}`
      case "slideUp":
        return `${baseClasses} ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`
      case "slideLeft":
        return `${baseClasses} ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`
      case "slideRight":
        return `${baseClasses} ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`
      case "scale":
        return `${baseClasses} ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`
      case "rotate3D":
        return `${baseClasses} ${isVisible ? "opacity-100 rotate-x-0" : "opacity-0 -rotate-x-12"}`
      case "flip":
        return `${baseClasses} ${isVisible ? "opacity-100 rotate-y-0" : "opacity-0 rotate-y-12"}`
      case "perspective":
        return `${baseClasses} ${isVisible ? "opacity-100 translate-z-0 rotate-x-0" : "opacity-0 translate-z-[-100px] rotate-x-6"}`
      default:
        return baseClasses
    }
  }

  const getContainerStyle = () => {
    if (animation === "rotate3D" || animation === "flip" || animation === "perspective") {
      return { perspective: "1000px", transformStyle: "preserve-3d" as const }
    }
    return {}
  }

  return (
    <div style={getContainerStyle()}>
      <div ref={ref} className={`${getAnimationClasses()} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
        {children}
      </div>
    </div>
  )
}
