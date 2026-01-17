/**
 * API Service for Flask Backend
 * Handles all communication with the Flask REST API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://recomended-chart-ws.vercel.app/api'

export interface ChartRecommendation {
  title: string
  chart_type: 'bar' | 'line' | 'pie' | 'scatter'
  parameters: {
    x_axis: string
    y_axis?: string
  }
  insight: string
}

export interface UploadResponse {
  status: string
  message: string
  file_info: {
    filename: string
    size: number
    filepath: string
  }
  recommendations: ChartRecommendation[]
  data_summary: {
    shape: {
      rows: number
      columns: number
    }
    columns: string[]
    column_types: Record<string, string>
  }
}

export interface ChartDataResponse {
  chart_type: string
  data: {
    labels?: string[]
    values?: number[]
    data?: Array<Record<string, any>>
    x_values?: number[]
    y_values?: number[]
  }
  parameters: {
    x_axis: string
    y_axis?: string
  }
  aggregation: string
}

export interface ChartData {
  labels?: string[]
  values?: number[]
  data?: Array<{ name: string; value: number; secondary?: number }>
}

/**
 * Upload a file and get chart recommendations
 */
export async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error uploading file' }))
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

/**
 * Get aggregated chart data for a specific chart
 */
export async function getChartData(
  filepath: string,
  chartType: string,
  parameters: { x_axis: string; y_axis?: string },
  aggregation: string = 'sum'
): Promise<ChartDataResponse> {
  const response = await fetch(`${API_BASE_URL}/chart/data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filepath,
      chart_type: chartType,
      parameters,
      aggregation,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error fetching chart data' }))
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

/**
 * Health check endpoint
 */
export async function checkHealth(): Promise<{ status: string }> {
  const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`)
  
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`)
  }

  return response.json()
}
