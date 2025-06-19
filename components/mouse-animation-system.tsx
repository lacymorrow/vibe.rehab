"use client"

import { useState, useEffect } from "react"
import { useMouseIdle } from "../hooks/use-mouse-idle"
import { FakeMouse } from "./fake-mouse"

interface MouseAnimationSystemProps {
  idleTime?: number
  pauseBetweenCycles?: number
  enabled?: boolean
}

export function MouseAnimationSystem({
  idleTime = 3000,
  pauseBetweenCycles = 3000,
  enabled = true,
}: MouseAnimationSystemProps) {
  const { isIdle } = useMouseIdle(idleTime)
  const [animationKey, setAnimationKey] = useState(0)
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(enabled)

  useEffect(() => {
    setIsAnimationEnabled(enabled)
  }, [enabled])

  const handleAnimationComplete = () => {
    setTimeout(() => {
      setAnimationKey((prev) => prev + 1)
    }, pauseBetweenCycles)
  }

  if (!isAnimationEnabled) return null

  return <FakeMouse key={animationKey} isVisible={isIdle} onAnimationComplete={handleAnimationComplete} />
}
