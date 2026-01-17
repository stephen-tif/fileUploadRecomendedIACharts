/**
 * Data transformation utilities
 * Converts API responses to frontend format
 */

import type { AnalysisCard } from './mock-data'
import type { ChartRecommendation, ChartDataResponse } from './api'

/**
 * Transform API recommendation to AnalysisCard format
 * Maps API chart types to frontend chart types
 */
export function transformRecommendationToCard(
  recommendation: ChartRecommendation,
  index: number,
  filepath: string
): Omit<AnalysisCard, 'data'> {
  // Map API chart types to frontend chart types
  // API: 'bar' | 'line' | 'pie' | 'scatter'
  // Frontend: 'bar' | 'line' | 'pie' | 'area'
  const chartTypeMap: Record<string, 'bar' | 'line' | 'pie' | 'area'> = {
    bar: 'bar',
    line: 'line',
    pie: 'pie',
    scatter: 'area', // Map scatter to area for frontend
  }

  const chartType = chartTypeMap[recommendation.chart_type] || 'bar'

  return {
    id: `rec-${index}-${Date.now()}`,
    title: recommendation.title,
    description: `${recommendation.chart_type} chart showing ${recommendation.parameters.x_axis}${recommendation.parameters.y_axis ? ` vs ${recommendation.parameters.y_axis}` : ''}`,
    chartType,
    insight: recommendation.insight,
  }
}

/**
 * Transform API chart data response to AnalysisCard data format
 */
export function transformChartDataToCardData(chartData: ChartDataResponse): Array<{ name: string; value: number; secondary?: number }> {
  const { data, chart_type } = chartData

  // Handle scatter plot - convert to area chart format
  if (chart_type === 'scatter' && data.data) {
    // For scatter, we'll use x_values and y_values if available
    if (data.x_values && data.y_values) {
      return data.x_values.map((x, i) => ({
        name: String(x),
        value: data.y_values![i],
      }))
    }
    // Or use the data array directly
    if (Array.isArray(data.data)) {
      return data.data.map((point: any) => ({
        name: String(point.x),
        value: point.y,
      }))
    }
  }

  // Handle bar, line, pie charts
  if (data.labels && data.values) {
    return data.labels.map((label, index) => ({
      name: String(label),
      value: data.values![index],
    }))
  }

  // Fallback: try to use data array
  if (Array.isArray(data.data)) {
    return data.data.map((item: any) => {
      const entry: { name: string; value: number; secondary?: number } = {
        name: String(item[Object.keys(item)[0]] || ''),
        value: Number(item[Object.keys(item)[1]] || 0),
      }
      // Check for secondary value (for area charts with targets)
      if (Object.keys(item).length > 2) {
        entry.secondary = Number(item[Object.keys(item)[2]] || 0)
      }
      return entry
    })
  }

  // Default empty array if no valid data format
  return []
}

/**
 * Complete AnalysisCard with chart data
 */
export async function enrichCardWithData(
  card: Omit<AnalysisCard, 'data'>,
  filepath: string,
  recommendation: ChartRecommendation,
  getChartDataFn: (filepath: string, chartType: string, parameters: { x_axis: string; y_axis?: string }, aggregation?: string) => Promise<ChartDataResponse>
): Promise<AnalysisCard> {
  try {
    const chartData = await getChartDataFn(
      filepath,
      recommendation.chart_type,
      recommendation.parameters,
      'sum'
    )

    const transformedData = transformChartDataToCardData(chartData)

    return {
      ...card,
      data: transformedData,
    }
  } catch (error) {
    console.error('Error fetching chart data:', error)
    // Return card with empty data on error
    return {
      ...card,
      data: [],
    }
  }
}
