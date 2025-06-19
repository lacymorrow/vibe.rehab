"use client"

import { useState, useEffect } from "react"

interface FakeMouseProps {
  isVisible: boolean
  onAnimationComplete?: () => void
}

export function FakeMouse({ isVisible, onAnimationComplete }: FakeMouseProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isClicking, setIsClicking] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [animationStep, setAnimationStep] = useState(0)
  const [selectedText, setSelectedText] = useState<{
    element: string
    startX: number
    startY: number
    endX: number
    endY: number
  } | null>(null)

  useEffect(() => {
    if (!isVisible) {
      setAnimationStep(0)
      setSelectedText(null)
      // Don't reset position immediately to avoid glitch
      return
    }

    const sequence = async () => {
      // Start from a safe position
      const startX = window.innerWidth / 2
      const startY = window.innerHeight / 2 - 200
      setPosition({ x: startX, y: startY })

      // Step 1: Move to and select part of the main headline
      await new Promise((resolve) => setTimeout(resolve, 800))
      setAnimationStep(1)
      const headlineX = window.innerWidth / 2 - 120
      const headlineY = window.innerHeight / 2 - 150
      setPosition({ x: headlineX, y: headlineY })

      await new Promise((resolve) => setTimeout(resolve, 1200))
      setIsClicking(true)
      setIsDragging(true)
      setSelectedText({
        element: "headline",
        startX: headlineX,
        startY: headlineY - 10,
        endX: headlineX + 180,
        endY: headlineY + 40,
      })

      await new Promise((resolve) => setTimeout(resolve, 300))
      setPosition({ x: headlineX + 180, y: headlineY })

      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsClicking(false)
      setIsDragging(false)

      // Step 2: Move to and select tagline text
      await new Promise((resolve) => setTimeout(resolve, 800))
      setSelectedText(null)
      setAnimationStep(2)
      const taglineX = window.innerWidth / 2 - 150
      const taglineY = window.innerHeight / 2 + 50
      setPosition({ x: taglineX, y: taglineY })

      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsClicking(true)
      setIsDragging(true)
      setSelectedText({
        element: "tagline",
        startX: taglineX,
        startY: taglineY - 5,
        endX: taglineX + 300,
        endY: taglineY + 25,
      })

      await new Promise((resolve) => setTimeout(resolve, 400))
      setPosition({ x: taglineX + 300, y: taglineY })

      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsClicking(false)
      setIsDragging(false)

      // Step 3: Move to and select review text
      await new Promise((resolve) => setTimeout(resolve, 600))
      setSelectedText(null)
      setAnimationStep(3)
      const reviewX = window.innerWidth / 2 - 200
      const reviewY = window.innerHeight / 2 + 300
      setPosition({ x: reviewX, y: reviewY })

      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsClicking(true)
      setIsDragging(true)
      setSelectedText({
        element: "review",
        startX: reviewX,
        startY: reviewY - 5,
        endX: reviewX + 250,
        endY: reviewY + 20,
      })

      await new Promise((resolve) => setTimeout(resolve, 500))
      setPosition({ x: reviewX + 250, y: reviewY })

      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsClicking(false)
      setIsDragging(false)
      setSelectedText(null)

      await new Promise((resolve) => setTimeout(resolve, 800))
      onAnimationComplete?.()
    }

    sequence()
  }, [isVisible, onAnimationComplete])

  if (!isVisible) return null

  return (
    <>
      <div
        className="fixed pointer-events-none z-50 transition-all duration-700 ease-out"
        style={{
          left: position.x,
          top: position.y,
          transform: "translate(-4px, -4px)",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" className="drop-shadow-lg">
          <path
            d="M2 2L2 16L6 12L9 12L12 18L14 17L11 11L16 11L2 2Z"
            fill={isClicking ? "#fbbf24" : "white"}
            stroke="black"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
        {isClicking && <div className="absolute -top-1 -left-1 w-6 h-6 bg-amber-400/30 rounded-full animate-ping" />}
      </div>

      {/* Selection highlights */}
      {selectedText && (
        <div
          className="fixed pointer-events-none z-40 bg-blue-400/20 border border-blue-400/40 transition-all duration-300 rounded-sm"
          style={{
            left: selectedText.startX,
            top: selectedText.startY,
            width: selectedText.endX - selectedText.startX,
            height: selectedText.endY - selectedText.startY,
          }}
        />
      )}
    </>
  )
}
