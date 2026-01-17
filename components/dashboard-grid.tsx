"use client"

import type React from "react"

import { useState } from "react"
import { X, GripVertical, Maximize2 } from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { AnalysisCard } from "@/lib/mock-data"

interface DashboardGridProps {
  charts: AnalysisCard[]
  onRemoveChart: (id: string) => void
  onReorderCharts: (charts: AnalysisCard[]) => void
}

const COLORS = [
  "oklch(0.65 0.22 280)",
  "oklch(0.7 0.15 200)",
  "oklch(0.6 0.2 260)",
  "oklch(0.75 0.12 220)",
  "oklch(0.55 0.18 290)",
]

export function DashboardGrid({ charts, onRemoveChart, onReorderCharts }: DashboardGridProps) {
  const [expandedChart, setExpandedChart] = useState<AnalysisCard | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === dropIndex) return

    const newCharts = [...charts]
    const [draggedChart] = newCharts.splice(draggedIndex, 1)
    newCharts.splice(dropIndex, 0, draggedChart)

    onReorderCharts(newCharts)
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  if (charts.length === 0) {
    return (
      <div className="border border-dashed border-border rounded-xl p-12 text-center bg-card/30">
        <p className="text-muted-foreground">Selecciona gráficos de las tarjetas de análisis para agregarlos aquí</p>
      </div>
    )
  }

  const renderChart = (card: AnalysisCard) => {
    switch (card.chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={card.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0 0)" />
              <XAxis dataKey="name" tick={{ fill: "oklch(0.7 0 0)", fontSize: 11 }} />
              <YAxis tick={{ fill: "oklch(0.7 0 0)", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1c3474",
                  border: "1px solid #1c3474",
                  borderRadius: "8px",
                  color: "oklch(0.65 0.22 280)",
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {card.data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )
      case "line":
        return (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={card.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0 0)" />
              <XAxis dataKey="name" tick={{ fill: "oklch(0.7 0 0)", fontSize: 11 }} />
              <YAxis tick={{ fill: "oklch(0.7 0 0)", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1c3474",
                  border: "1px solid #1c3474",
                  borderRadius: "8px",
                  color: "oklch(0.65 0.22 280)",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="oklch(0.7 0.15 200)"
                strokeWidth={3}
                dot={{ fill: "oklch(0.65 0.22 280)", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={card.data}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={60}
                paddingAngle={4}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
                labelLine={{ stroke: "oklch(0.5 0 0)" }}
              >
                {card.data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1c3474",
                  border: "1px solid #1c3474",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )
      case "area":
        return (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={card.data}>
              <defs>
                <linearGradient id={`gradient-${card.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.65 0.22 280)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="oklch(0.65 0.22 280)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0 0)" />
              <XAxis dataKey="name" tick={{ fill: "oklch(0.7 0 0)", fontSize: 11 }} />
              <YAxis tick={{ fill: "oklch(0.7 0 0)", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1c3474",
                  border: "1px solid #1c3474",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="value"
                name="Actual"
                stroke="oklch(0.65 0.22 280)"
                fill={`url(#gradient-${card.id})`}
                strokeWidth={2}
              />
              {card.data[0].secondary && (
                <Area
                  type="monotone"
                  dataKey="secondary"
                  name="Objetivo"
                  stroke="oklch(0.7 0.15 200)"
                  fill="transparent"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        )
      default:
        return null
    }
  }

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {charts.map((chart, index) => (
        <div
          key={chart.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
          className={`border rounded-xl bg-transparent overflow-hidden transition-all duration-200
            ${draggedIndex === index ? "opacity-50 scale-95" : ""}
            ${dragOverIndex === index ? "border-primary border-2 scale-[1.02]" : "border-border"}
          `}
        >
          {/* Chart header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
              <h3 className="font-medium text-foreground text-sm truncate">{chart.title}</h3>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setExpandedChart(chart)}
                className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              <button
                onClick={() => onRemoveChart(chart.id)}
                className="p-1.5 hover:bg-destructive/20 rounded-lg transition-colors"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
          </div>

          {/* Chart content */}
          <div className="p-3">{renderChart(chart)}</div>
        </div>
      ))}
    </div>

    {/* Expanded Chart Modal */}
    {expandedChart && (
      <Dialog open={!!expandedChart} onOpenChange={(open) => !open && setExpandedChart(null)}>
        <DialogContent className="w-[95%] sm:max-w-2xl md:max-w-4xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{expandedChart?.title}</DialogTitle>
          </DialogHeader>
          {expandedChart?.insight && (
            <div className="mt-4 p-3 bg-secondary/50 rounded-lg"> 
              <p className="text-sm text-muted-foreground">{expandedChart.insight}</p>
            </div>
          )}
          <div className="w-full h-auto sm:h-[500px] flex items-center justify-center">
            {renderChart(expandedChart)}
          </div>
        </DialogContent>
      </Dialog>
    )}
    </>
  )
}
