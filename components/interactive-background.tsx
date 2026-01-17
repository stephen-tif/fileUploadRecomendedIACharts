"use client"

import { useEffect, useRef, useCallback } from "react"

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>(0)

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const { width, height } = canvas
    const mouse = mouseRef.current

    ctx.clearRect(0, 0, width, height)

    const maxDimension = Math.max(width, height)
    const glowRadius = maxDimension * 0.75

    const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, glowRadius)
    gradient.addColorStop(0, "rgba(30, 64, 175, 0.15)")
    gradient.addColorStop(0.15, "rgba(30, 58, 138, 0.12)")
    gradient.addColorStop(0.3, "rgba(23, 37, 84, 0.09)")
    gradient.addColorStop(0.5, "rgba(15, 23, 42, 0.06)")
    gradient.addColorStop(0.7, "rgba(15, 23, 42, 0.03)")
    gradient.addColorStop(1, "transparent")

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    animationRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("touchmove", handleTouchMove)

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchmove", handleTouchMove)
      cancelAnimationFrame(animationRef.current)
    }
  }, [animate])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />
}
