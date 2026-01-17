"use client"

import { Plus, BarChart3, LineChart, PieChart, TrendingUp, Sparkles, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { AnalysisCard } from "@/lib/mock-data"

interface AnalysisSidebarProps {
  cards: AnalysisCard[]
  onAddToDashboard: (card: AnalysisCard) => void
  addedCards: string[]
  onNewAnalysis: () => void
  onClose: () => void
}

const chartIcons = {
  bar: BarChart3,
  line: LineChart,
  pie: PieChart,
  area: TrendingUp,
}

export function AnalysisSidebar({ cards, onAddToDashboard, addedCards, onNewAnalysis, onClose }: AnalysisSidebarProps) {
  return (
    <div className="h-full flex flex-col bg-card/95 backdrop-blur-md border-r border-border fixed inset-0 z-50 md:relative md:z-auto">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <h2 className="font-semibold text-foreground">Sugerencias IA</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground">{cards.length} visualizaciones detectadas</p>
      </div>

      {/* Cards list - scrollable */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {cards.map((card, index) => {
          const Icon = chartIcons[card.chartType]
          const isAdded = addedCards.includes(card.id)

          return (
            <div
              key={card.id}
              className="border border-border rounded-lg p-3 bg-background/50 hover:border-primary/50 transition-all duration-300 animate-in fade-in slide-in-from-left-2"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Header with icon */}
              <div className="flex items-start gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground text-sm leading-tight">{card.title}</h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{card.description}</p>

              {/* AI Insight - compact */}
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-md p-2 mb-3">
                <p className="text-xs text-foreground/80 line-clamp-2">{card.insight}</p>
              </div>

              {/* Add button */}
              <Button
                onClick={() => onAddToDashboard(card)}
                disabled={isAdded}
                size="sm"
                className={`w-full text-xs h-8 ${
                  isAdded
                    ? "bg-accent/20 text-accent border border-accent/30"
                    : "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
                }`}
                variant={isAdded ? "outline" : "default"}
              >
                {isAdded ? (
                  <>
                    <span className="mr-1">✓</span>
                    Agregado
                  </>
                ) : (
                  <>
                    <Plus className="w-3 h-3 mr-1" />
                    Agregar
                  </>
                )}
              </Button>
            </div>
          )
        })}
      </div>

      {/* Footer action */}
      <div className="p-3 border-t border-border">
        <Button
          onClick={onNewAnalysis}
          variant="outline"
          size="sm"
          className="w-full border-border bg-transparent hover:bg-secondary text-xs"
        >
          <Upload className="w-3 h-3 mr-2" />
          Analizar otro archivo
        </Button>
      </div>
    </div>
  )
}
