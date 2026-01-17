"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { Upload, type File, X, FileSpreadsheet, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void
  selectedFile: File | null
  onClear: () => void
  isProcessing: boolean
}

const ALLOWED_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
  "application/vnd.ms-excel", // xls
  "text/csv", // csv
]

const ALLOWED_EXTENSIONS = [".xlsx", ".xls", ".csv"]

export function FileUploadZone({ onFileSelect, selectedFile, onClear, isProcessing }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateFile = (file: File): boolean => {
    const extension = "." + file.name.split(".").pop()?.toLowerCase()
    const isValidExtension = ALLOWED_EXTENSIONS.includes(extension)
    const isValidType = ALLOWED_TYPES.includes(file.type) || file.type === ""

    if (!isValidExtension) {
      setError(`Formato no permitido. Solo se aceptan archivos ${ALLOWED_EXTENSIONS.join(", ")}`)
      return false
    }
    setError(null)
    return true
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file && validateFile(file)) {
        onFileSelect(file)
      }
    },
    [onFileSelect],
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file && validateFile(file)) {
        onFileSelect(file)
      }
    },
    [onFileSelect],
  )

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (selectedFile) {
    return (
      <div className="border-2 border-primary/50 rounded-lg p-6 bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
            </div>
          </div>
          {!isProcessing && (
            <button
              onClick={onClear}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
              aria-label="Eliminar archivo"
            >
              <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-12 transition-all duration-300 cursor-pointer",
          isDragging
            ? "border-accent bg-accent/10 scale-[1.02]"
            : "border-border hover:border-primary hover:bg-primary/5",
          error && "border-destructive",
        )}
      >
        <label className="flex flex-col items-center gap-4 cursor-pointer">
          <div
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
              isDragging ? "bg-gradient-to-br from-primary to-accent text-foreground scale-110" : "bg-secondary",
            )}
          >
            <Upload className="w-8 h-8" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-lg text-foreground">
              {isDragging ? "Suelta el archivo aquí" : "Arrastra y suelta tu archivo"}
            </p>
            <p className="text-muted-foreground mt-1">o haz clic para seleccionar</p>
          </div>
          <input type="file" className="hidden" onChange={handleFileInput} accept=".xlsx,.xls,.csv" />
          <div className="flex gap-2 flex-wrap justify-center mt-2">
            {["XLSX", "CSV"].map((type) => (
              <span
                key={type}
                className="px-3 py-1 text-xs font-mono border border-primary/50 rounded bg-primary/10 text-primary"
              >
                {type}
              </span>
            ))}
          </div>
        </label>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
