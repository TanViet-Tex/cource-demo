"use client"

import * as React from "react"
import { Upload, X, File, FileText } from "lucide-react"

import { cn } from "~/app/utils/cn"
import { Button } from "~/app/components/ui/button"

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url?: string
  progress?: number
  error?: string
}

export interface FileUploadProps {
  files?: UploadedFile[]
  onFilesChange?: (files: UploadedFile[]) => void
  onDelete?: (fileId: string) => void
  maxFiles?: number
  maxSize?: number // bytes
  acceptedTypes?: string[]
  disabled?: boolean
  className?: string
}

const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      files = [],
      onFilesChange,
      onDelete,
      maxFiles = 10,
      maxSize = 10 * 1024 * 1024, // 10MB
      acceptedTypes = ["image/*", "application/pdf", ".doc", ".docx"],
      disabled,
      className,
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      if (disabled) return
      e.preventDefault()
      setIsDragging(true)
    }

    const handleDragLeave = () => {
      setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      if (disabled) return
      e.preventDefault()
      setIsDragging(false)
      const newFiles = Array.from(e.dataTransfer.files)
      handleFiles(newFiles)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const newFiles = Array.from(e.target.files)
        handleFiles(newFiles)
      }
    }

    const handleFiles = (newFiles: File[]) => {
      if (files.length + newFiles.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`)
        return
      }

      const processedFiles: UploadedFile[] = newFiles.map((file) => ({
        id: `${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 100,
      }))

      onFilesChange?.([ ...files, ...processedFiles])
    }

    const handleDelete = (fileId: string) => {
      const updated = files.filter((f) => f.id !== fileId)
      onFilesChange?.(updated)
      onDelete?.(fileId)
    }

    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return "0 Bytes"
      const k = 1024
      const sizes = ["Bytes", "KB", "MB"]
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
    }

    const getFileIcon = (type: string) => {
      if (type.startsWith("image/")) return <FileText className="h-4 w-4" />
      if (type === "application/pdf") return <FileText className="h-4 w-4" />
      return <File className="h-4 w-4" />
    }

    return (
      <div ref={ref} className={className}>
        {/* Drop zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative rounded-lg border-2 border-dashed p-6 text-center transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 bg-muted/5 hover:border-muted-foreground/50",
            disabled && "pointer-events-none opacity-50"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            onChange={handleInputChange}
            className="hidden"
            accept={acceptedTypes.join(",")}
            disabled={disabled}
          />

          <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm font-medium">
            Drag files here or{" "}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-primary hover:underline"
              disabled={disabled}
            >
              browse
            </button>
          </p>
          <p className="text-xs text-muted-foreground">
            Max {maxFiles} files, up to {formatFileSize(maxSize)} each
          </p>
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between rounded-lg border bg-card p-3"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getFileIcon(file.type)}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                {file.progress !== undefined && file.progress < 100 && (
                  <div className="ml-2 w-24">
                    <div className="h-1 w-full rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {file.error && (
                  <span className="ml-2 text-xs text-destructive">
                    {file.error}
                  </span>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(file.id)}
                  disabled={disabled}
                  className="ml-2 h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
)
FileUpload.displayName = "FileUpload"

export { FileUpload }
