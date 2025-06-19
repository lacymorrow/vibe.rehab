"use client"

import type React from "react"

import { useScrollAnimation, use3DScroll } from "../hooks/use-scroll-animation"

interface Scroll3DCardProps {
  children: React.ReactNode
  className?: string
}

export function Scroll3DCard({ children, className = "" }: Scroll3DCardProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2, triggerOnce: false })
  const scrollProgress = use3DScroll()

  const rotateX = isVisible ? Math.sin(scrollProgress * Math.PI * 2) * 5 : 15
  const rotateY = isVisible ? Math.cos(scrollProgress * Math.PI * 2) * 3 : 0
  const translateZ = isVisible ? 0 : -50

  return (
    <div style={{ perspective: "1000px" }} className="transform-gpu">
      <div
        ref={ref}
        className={`transition-all duration-700 ease-out transform-gpu ${className}`}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`,
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>
    </div>
  )
}
