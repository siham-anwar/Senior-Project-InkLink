'use client'

import { useCallback, useState } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CoverUploadProps {
  value?: string
  onChange: (url: string | undefined) => void
}

export function CoverUpload({ value, onChange }: CoverUploadProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        onChange(dataUrl)
      }
      reader.readAsDataURL(file)
    },
    [onChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleRemove = useCallback(() => {
    onChange(undefined)
  }, [onChange])

  if (value) {
    return (
      <div className="relative w-40">
        <img
          src={value}
          alt="Book cover"
          className="h-56 w-40 rounded-lg border border-border object-cover"
        />
        <Button
          variant="destructive"
          size="icon"
          className="absolute -right-2 -top-2 h-6 w-6"
          onClick={handleRemove}
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Remove cover</span>
        </Button>
      </div>
    )
  }

  return (
    <label
      className={cn(
        'flex h-56 w-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors',
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50 hover:bg-muted/50'
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <ImagePlus className="mb-2 h-8 w-8 text-muted-foreground" />
      <span className="text-xs text-muted-foreground">Upload Cover</span>
      <span className="text-xs text-muted-foreground">or drag & drop</span>
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleInputChange}
      />
    </label>
  )
}
