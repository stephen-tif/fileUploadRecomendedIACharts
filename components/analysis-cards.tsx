"use client"

import { Plus, BarChart3, LineChart, PieChart, TrendingUp, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { AnalysisCard } from "@/lib/mock-data"

interface AnalysisCardsProps {
  cards: AnalysisCard[]
  onAddToDashboard: (card: AnalysisCard) => void
  addedCards: string[]
}

const chartIcons = {
  bar: BarChart3,
  line: LineChart,
  pie: PieChart,
  area: TrendingUp,
}

export function AnalysisCards({ cards, onAddToDashboard, addedCards }: AnalysisCardsProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="text-center py-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Análisis Completado
          </h2>
        </div>
        <p className="text-muted-foreground">
          La IA ha identificado {cards.length} visualizaciones relevantes para tus datos
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid gap-4">
        {cards.map((card, index) => {
          const Icon = chartIcons[card.chartType]
          const isAdded = addedCards.includes(card.id)

          return (
            <div
              key={card.id}
              className="border border-border rounded-xl p-5 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                {/* Chart type icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-accent" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-lg mb-1">{card.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{card.description}</p>

                  {/* AI Insight */}
                  <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground/90">{card.insight}</p>
                    </div>
                  </div>

                  {/* Add button */}
                  <Button
                    onClick={() => onAddToDashboard(card)}
                    disabled={isAdded}
                    className={`w-full ${
                      isAdded
                        ? "bg-accent/20 text-accent border border-accent/30"
                        : "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
                    }`}
                    variant={isAdded ? "outline" : "default"}
                  >
                    {isAdded ? (
                      <>
                        <span className="mr-2">✓</span>
                        Agregado al Dashboard
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar al Dashboard
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
