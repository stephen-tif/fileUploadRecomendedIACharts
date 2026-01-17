"use client"

import { useEffect, useState } from "react"
import { Brain, Sparkles, BarChart3, TrendingUp } from "lucide-react"

interface LoadingAnimationProps {
  progress: number
  fileName: string
}

export function LoadingAnimation({ progress, fileName }: LoadingAnimationProps) {
  const [dots, setDots] = useState("")
  const [currentPhase, setCurrentPhase] = useState(0)

  const phases = [
    { icon: Brain, text: "Leyendo estructura de datos" },
    { icon: Sparkles, text: "Identificando patrones" },
    { icon: BarChart3, text: "Generando visualizaciones" },
    { icon: TrendingUp, text: "Preparando análisis" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const phaseIndex = Math.min(Math.floor(progress / 25), 3)
    setCurrentPhase(phaseIndex)
  }, [progress])

  const CurrentIcon = phases[currentPhase].icon

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* AI Brain animation */}
      <div className="relative w-40 h-40 mb-8">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 animate-pulse-glow" />

        {/* Rotating ring */}
        <svg className="absolute inset-0 w-40 h-40 animate-spin-slow">
          <defs>
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="oklch(0.65 0.22 280)" />
              <stop offset="100%" stopColor="oklch(0.7 0.15 200)" />
            </linearGradient>
          </defs>
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="url(#ringGradient)"
            strokeWidth="2"
            strokeDasharray="20 10"
            opacity="0.5"
          />
        </svg>

        {/* Background ring */}
        <div className="absolute inset-4 rounded-full bg-secondary" />

        {/* Progress ring */}
        <svg className="absolute inset-4 w-32 h-32 -rotate-90">
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="oklch(0.65 0.22 280)" />
              <stop offset="100%" stopColor="oklch(0.7 0.15 200)" />
            </linearGradient>
          </defs>
          <circle
            cx="64"
            cy="64"
            r="58"
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 58}`}
            strokeDashoffset={`${2 * Math.PI * 58 * (1 - progress / 100)}`}
            style={{ transition: "stroke-dashoffset 0.3s ease" }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <CurrentIcon className="w-10 h-10 text-accent mx-auto mb-1 animate-pulse" />
            <span className="text-2xl font-bold text-foreground">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      {/* Status text */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <p className="text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            IA analizando tus datos{dots}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">{phases[currentPhase].text}</p>
        <p className="text-xs text-muted-foreground/70 font-mono truncate max-w-xs">{fileName}</p>
      </div>

      {/* Phase indicators */}
      <div className="flex gap-2 mt-8">
        {phases.map((phase, index) => {
          const Icon = phase.icon
          return (
            <div
              key={index}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                index <= currentPhase
                  ? "bg-gradient-to-br from-primary to-accent text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
          )
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-sm mt-8">
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300 ease-out bg-gradient-to-r from-primary to-accent"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
