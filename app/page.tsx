"use client"

import { useState, useCallback, useEffect } from "react"
import { FileUploadZone } from "@/components/file-upload-zone"
import { LoadingAnimation } from "@/components/loading-animation"
import { AnalysisSidebar } from "@/components/analysis-sidebar"
import { DashboardGrid } from "@/components/dashboard-grid"
import { InteractiveBackground } from "@/components/interactive-background"
import type { AnalysisCard } from "@/lib/mock-data"
import { saveDashboardCharts, loadDashboardCharts, clearDashboardCharts } from "@/lib/dashboard-storage"
import { uploadFile, getChartData, type UploadResponse, type ChartRecommendation } from "@/lib/api"
import { transformRecommendationToCard, enrichCardWithData } from "@/lib/data-transform"
import { LayoutDashboard, Upload, Plus, PanelLeftOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

type AppState = "dashboard" | "upload" | "uploading" | "results"

export default function Home() {
  const [state, setState] = useState<AppState>("dashboard")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [analysisResults, setAnalysisResults] = useState<AnalysisCard[]>([])
  const [dashboardCharts, setDashboardCharts] = useState<AnalysisCard[]>([])
  const [addedCardIds, setAddedCardIds] = useState<string[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [uploadResponse, setUploadResponse] = useState<UploadResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const savedCharts = loadDashboardCharts()
    if (savedCharts && savedCharts.length > 0) {
      setDashboardCharts(savedCharts)
      setAddedCardIds(savedCharts.map((c) => c.id))
    }
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (isInitialized) {
      if (dashboardCharts.length > 0) {
        saveDashboardCharts(dashboardCharts)
      } else {
        clearDashboardCharts()
      }
    }
  }, [dashboardCharts, isInitialized])

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file)
  }, [])

  const handleClear = useCallback(() => {
    setSelectedFile(null)
    setProgress(0)
    setState("upload")
    setAnalysisResults([])
  }, [])

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return
    
    setState("uploading")
    setProgress(0)
    setError(null)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 8 + 3
        })
      }, 400)

      // Upload file to Flask API
      const response = await uploadFile(selectedFile)
      console.log(response)
      clearInterval(progressInterval)
      setProgress(100)
      
      // Transform recommendations to cards (without data first)
      const recommendationsWithoutData = response.recommendations.map((rec, index) =>
        transformRecommendationToCard(rec, index, response.file_info.filepath)
      )
      
      setUploadResponse(response)
      setAnalysisResults(recommendationsWithoutData as AnalysisCard[])
      
      // Small delay to show 100% progress
      setTimeout(() => {
        setState("results")
        setShowSidebar(true)
      }, 500)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir el archivo')
      setState("upload")
      setProgress(0)
      console.error('Upload error:', err)
    }
  }, [selectedFile])

  const handleAddToDashboard = useCallback(async (card: AnalysisCard) => {
    // Check if card is already in dashboard to prevent duplicates
    if (addedCardIds.includes(card.id)) {
      console.warn('Card already added to dashboard')
      return
    }

    // If card already has data, add it directly
    if (card.data && card.data.length > 0) {
      setDashboardCharts((prev) => [...prev, card])
      setAddedCardIds((prev) => [...prev, card.id])
      return
    }

    // If card doesn't have data, we need to fetch it
    if (!uploadResponse) {
      console.error('No upload response available')
      return
    }

    // Find the original recommendation
    const recommendationIndex = analysisResults.findIndex((c) => c.id === card.id)
    if (recommendationIndex === -1) {
      console.error('Recommendation not found')
      return
    }

    const recommendation = uploadResponse.recommendations[recommendationIndex]

    try {
      // Fetch chart data and enrich the card
      const enrichedCard = await enrichCardWithData(
        card,
        uploadResponse.file_info.filepath,
        recommendation,
        getChartData
      )

      setDashboardCharts((prev) => [...prev, enrichedCard])
      setAddedCardIds((prev) => [...prev, enrichedCard.id])
    } catch (err) {
      console.error('Error fetching chart data:', err)
      setError('Error al obtener los datos del gráfico')
    }
  }, [uploadResponse, analysisResults, addedCardIds])

  const handleRemoveFromDashboard = useCallback((id: string) => {
    setDashboardCharts((prev) => prev.filter((chart) => chart.id !== id))
    setAddedCardIds((prev) => prev.filter((cardId) => cardId !== id))
  }, [])

  const handleReorderCharts = useCallback((newCharts: AnalysisCard[]) => {
    setDashboardCharts(newCharts)
  }, [])

  const handleBackToDashboard = useCallback(() => {
    setState("dashboard")
    setSelectedFile(null)
    setProgress(0)
    setShowSidebar(false)
  }, [])

  const handleGoToUpload = useCallback(() => {
    setState("upload")
    setShowSidebar(false)
  }, [])

  // Remove the mock progress interval - now handled in handleUpload

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <InteractiveBackground />

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex h-screen">
        {showSidebar && state === "results" && (
          <div className="w-full md:w-1/4 md:min-w-[280px] md:max-w-[350px] h-full animate-in slide-in-from-left duration-300">
            <AnalysisSidebar
              cards={analysisResults}
              onAddToDashboard={handleAddToDashboard}
              addedCards={addedCardIds}
              onNewAnalysis={handleGoToUpload}
              onClose={() => setShowSidebar(false)}
            />
          </div>
        )}

        <div className="flex-1 w-full h-full overflow-y-auto">
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 mb-6 text-center md:text-left">
              <div className="w-full md:w-auto">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1">
                  Dashboard de Análisis IA
                </h1>
                <p className="text-sm text-muted-foreground">Visualiza y gestiona tus análisis de datos inteligentes</p>
              </div>

              <div className="w-full md:w-auto flex items-center justify-center md:justify-end gap-2">
                {state === "results" && !showSidebar && (
                  <Button
                    onClick={() => setShowSidebar(true)}
                    variant="outline"
                    size="sm"
                    className="border-border bg-transparent hover:bg-secondary"
                  >
                    <PanelLeftOpen className="w-4 h-4 mr-2" />
                    Sugerencias
                  </Button>
                )}
                {(state === "dashboard" || state === "results") && (
                  <Button
                    onClick={handleGoToUpload}
                    size="sm"
                    className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Analizar Archivo
                  </Button>
                )}
              </div>
            </div>

            {/* Dashboard principal - visible en dashboard y results */}
            {(state === "dashboard" || state === "results") && (
              <div className="space-y-4 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LayoutDashboard className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">Mi Dashboard</h2>
                  </div>
                  <span className="text-xs text-muted-foreground px-2 py-1 bg-secondary rounded-full">
                    {dashboardCharts.length} gráfico{dashboardCharts.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {dashboardCharts.length > 0 ? (
                  <DashboardGrid
                    charts={dashboardCharts}
                    onRemoveChart={handleRemoveFromDashboard}
                    onReorderCharts={handleReorderCharts}
                  />
                ) : (
                  <div className="border border-dashed border-border rounded-xl p-12 text-center bg-card/30">
                    <LayoutDashboard className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Dashboard vacío</h3>
                    <p className="text-muted-foreground mb-4">
                      Sube un archivo para que la IA analice tus datos y genere visualizaciones
                    </p>
                    <Button
                      onClick={handleGoToUpload}
                      className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar gráficos
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Vista de carga de archivo */}
            {state === "upload" && (
              <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="border border-border rounded-xl p-6 md:p-8 bg-card/80 backdrop-blur-sm shadow-2xl shadow-primary/5">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-foreground mb-1 uppercase tracking-wide">
                          Nuevo Análisis
                        </h2>
                        <p className="text-sm text-muted-foreground">Solo se permiten archivos XLSX y CSV</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBackToDashboard}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        Volver al Dashboard
                      </Button>
                    </div>

                    <FileUploadZone
                      onFileSelect={handleFileSelect}
                      selectedFile={selectedFile}
                      onClear={handleClear}
                      isProcessing={false}
                    />

                    {selectedFile && (
                      <>
                        {error && (
                          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                            {error}
                          </div>
                        )}
                        <button
                          onClick={handleUpload}
                          className="w-full py-3 px-6 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={state === "uploading"}
                        >
                          {state === "uploading" ? "Analizando..." : "Analizar con IA"}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-center text-sm text-muted-foreground mt-6">
                  Formatos soportados: <span className="text-primary font-mono">XLSX</span> y{" "}
                  <span className="text-accent font-mono">CSV</span>
                </p>
              </div>
            )}

            {/* Vista de carga/procesamiento */}
            {state === "uploading" && selectedFile && (
              <div className="max-w-xl mx-auto animate-in fade-in duration-300">
                <div className="border border-border rounded-xl p-6 md:p-8 bg-card/80 backdrop-blur-sm shadow-2xl shadow-primary/5">
                  <LoadingAnimation progress={Math.min(progress, 100)} fileName={selectedFile.name} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
