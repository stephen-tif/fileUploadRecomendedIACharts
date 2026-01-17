import type { AnalysisCard } from "./mock-data"

const STORAGE_KEY = "dashboard-charts"

export function saveDashboardCharts(charts: AnalysisCard[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(charts))
  }
}

export function loadDashboardCharts(): AnalysisCard[] | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return null
      }
    }
  }
  return null
}

export function clearDashboardCharts(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY)
  }
}
