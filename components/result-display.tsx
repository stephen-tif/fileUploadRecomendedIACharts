"use client"

import { CheckCircle, FileSpreadsheet, Calendar, HardDrive, Download, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileResult {
  name: string
  size: number
  type: string
  lastModified: Date
  status: "success" | "error"
  message: string
}

interface ResultDisplayProps {
  result: FileResult
  onReset: () => void
}

export function ResultDisplay({ result, onReset }: ResultDisplayProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getFileType = (type: string, name: string) => {
    const extension = name.split(".").pop()?.toLowerCase()
    if (extension === "xlsx" || extension === "xls") return "Excel Spreadsheet"
    if (extension === "csv") return "CSV File"
    return type || "Spreadsheet"
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Success header con gradiente */}
      <div className="flex flex-col items-center text-center py-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 animate-in zoom-in duration-300">
          <CheckCircle className="w-10 h-10 text-accent" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Archivo procesado</h2>
        <p className="text-muted-foreground mt-1">{result.message}</p>
      </div>

      {/* File details card */}
      <div className="border border-border rounded-lg overflow-hidden bg-card/50">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground uppercase tracking-wide text-sm">Detalles del archivo</h3>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground">Nombre</p>
              <p className="font-semibold text-foreground truncate">{result.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <HardDrive className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tamaño</p>
                <p className="font-semibold text-foreground">{formatFileSize(result.size)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha</p>
                <p className="font-semibold text-foreground text-sm">{formatDate(result.lastModified)}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">Tipo de archivo</p>
            <span className="px-3 py-1 text-xs font-mono bg-gradient-to-r from-primary to-accent text-primary-foreground rounded">
              {getFileType(result.type, result.name)}
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4">
        <Button
          onClick={onReset}
          variant="outline"
          className="flex-1 border border-border bg-transparent hover:bg-secondary"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Subir otro archivo
        </Button>
        <Button className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90">
          <Download className="w-4 h-4 mr-2" />
          Descargar
        </Button>
      </div>
    </div>
  )
}
