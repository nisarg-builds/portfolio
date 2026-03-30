'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'

interface ImageUploadProps {
  label: string
  storagePath: string
  currentUrl?: string
  onUploaded: (url: string) => void
}

export function ImageUpload({ label, storagePath, currentUrl, onUploaded }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    setError('')
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('path', `${storagePath}/${Date.now()}-${file.name}`)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Upload failed')

      const { url } = await res.json()
      setPreview(url)
      onUploaded(url)
    } catch {
      setError('Upload failed. Please try again.')
      setPreview(currentUrl ?? null)
    } finally {
      setIsUploading(false)
      URL.revokeObjectURL(objectUrl)
    }
  }, [storagePath, currentUrl, onUploaded])

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-2">{label}</label>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-accent bg-accent/5'
            : 'border-border hover:border-border-hover'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        {preview ? (
          <div className="relative">
            <Image
              src={preview}
              alt="Preview"
              width={300}
              height={200}
              className="mx-auto rounded-md object-cover max-h-48"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-bg/70 flex items-center justify-center rounded-md">
                <div className="text-sm text-text-secondary">Uploading...</div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-4">
            <svg className="mx-auto mb-2 text-text-tertiary" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="text-sm text-text-tertiary">
              Click or drag an image to upload
            </p>
          </div>
        )}
      </div>
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  )
}
