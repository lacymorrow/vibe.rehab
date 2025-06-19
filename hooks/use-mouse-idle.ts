"use client"

import { useState, useEffect, useRef } from "react"

export function useMouseIdle(idleTime = 3000) {
  const [isIdle, setIsIdle] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      setIsIdle(false)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setIsIdle(true)
      }, idleTime)
    }

    const handleMouseLeave = () => {
      setIsIdle(true)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)

    // Start idle timer on mount
    timeoutRef.current = setTimeout(() => {
      setIsIdle(true)
    }, idleTime)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [idleTime])

  return { isIdle, mousePosition }
}
