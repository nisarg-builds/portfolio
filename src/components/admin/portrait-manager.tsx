'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ImageUpload } from './image-upload'
import { ImageEditor } from './image-editor'
import type { PortraitCrop } from '@/lib/firebase/about'

function isExternalUrl(url: string) {
  return url.startsWith('http://') || url.startsWith('https://')
}

function isBlobUrl(url: string) {
  return url.startsWith('blob:')
}

interface PortraitManagerProps {
  initialPortraitUrl: string
  initialGallery: string[]
  initialCrop: PortraitCrop | null
}

export function PortraitManager({ initialPortraitUrl, initialGallery, initialCrop }: PortraitManagerProps) {
  const [portraitUrl, setPortraitUrl] = useState(initialPortraitUrl)
  const [gallery, setGallery] = useState<string[]>(initialGallery)
  const [crop, setCrop] = useState<PortraitCrop | null>(initialCrop)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  async function saveAboutSettings(newPortraitUrl: string, newGallery: string[], newCrop: PortraitCrop | null = crop) {
    setIsSaving(true)
    setMessage('')

    try {
      const res = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portraitUrl: newPortraitUrl,
          portraitGallery: newGallery,
          portraitCrop: newCrop,
        }),
      })

      if (!res.ok) throw new Error('Failed to save')
      setMessage('Saved successfully')
      setTimeout(() => setMessage(''), 3000)
    } catch {
      setMessage('Failed to save. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleCropChange(newCrop: PortraitCrop | null) {
    setCrop(newCrop)
    await saveAboutSettings(portraitUrl, gallery, newCrop)
  }

  async function handleNewPortrait(url: string) {
    const newGallery = gallery.includes(url) ? gallery : [url, ...gallery]
    setPortraitUrl(url)
    setGallery(newGallery)
    await saveAboutSettings(url, newGallery)
  }

  async function handleSetActive(url: string) {
    setPortraitUrl(url)
    await saveAboutSettings(url, gallery)
  }

  async function handleEditorSave(editedUrl: string) {
    setIsEditorOpen(false)
    const newGallery = [editedUrl, ...gallery]
    setPortraitUrl(editedUrl)
    setGallery(newGallery)
    await saveAboutSettings(editedUrl, newGallery)
  }

  async function handleRemoveFromGallery(url: string) {
    const newGallery = gallery.filter((u) => u !== url)
    setGallery(newGallery)
    const newPortrait = url === portraitUrl ? (newGallery[0] ?? '') : portraitUrl
    if (url === portraitUrl) setPortraitUrl(newPortrait)
    await saveAboutSettings(newPortrait, newGallery)
  }

  return (
    <div className="max-w-2xl space-y-8">
      {/* Current portrait */}
      <div>
        <h2 className="text-lg font-medium text-text-primary mb-4">Current Portrait</h2>
        <div className="flex items-end gap-4">
          {portraitUrl ? (
            <div className="w-48 h-48 rounded-xl overflow-hidden border border-border">
              {isBlobUrl(portraitUrl) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={portraitUrl}
                  alt="Current portrait"
                  className="w-full h-full object-cover"
                />
              ) : failedImages.has(portraitUrl) ? (
                <div className="w-full h-full bg-bg-surface flex items-center justify-center text-text-tertiary text-xs text-center px-2">
                  Failed to load image
                </div>
              ) : (
                <Image
                  src={portraitUrl}
                  alt="Current portrait"
                  width={192}
                  height={192}
                  className="w-full h-full object-cover"
                  unoptimized={!isExternalUrl(portraitUrl) && !portraitUrl.startsWith('/')}
                  onError={() => setFailedImages((prev) => new Set(prev).add(portraitUrl))}
                />
              )}
            </div>
          ) : (
            <div className="w-48 h-48 rounded-xl bg-bg-surface border border-border flex items-center justify-center text-text-tertiary text-sm">
              No portrait set
            </div>
          )}
          {portraitUrl && (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setIsEditorOpen(true)}
                className="px-4 py-2 rounded-md border border-border text-sm text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors cursor-pointer"
              >
                Edit
              </button>
              {crop ? (
                <button
                  onClick={() => handleCropChange(null)}
                  className="px-4 py-2 rounded-md border border-red-400/30 text-sm text-red-400 hover:border-red-400 transition-colors cursor-pointer"
                >
                  Remove Crop
                </button>
              ) : null}
              <span className={`text-xs px-2 py-1 rounded-full text-center ${crop ? 'bg-accent/20 text-accent' : 'bg-bg-surface text-text-tertiary'}`}>
                {crop ? 'Cropped' : 'Full image'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Upload new */}
      <div>
        <h2 className="text-lg font-medium text-text-primary mb-4">Upload New Portrait</h2>
        <ImageUpload
          label=""
          storagePath="images/about"
          onUploaded={handleNewPortrait}
        />
      </div>

      {/* Gallery */}
      {gallery.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-text-primary mb-4">Portrait Gallery</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {gallery.map((url) => (
              <div
                key={url}
                className={`relative group rounded-lg overflow-hidden border-2 transition-colors ${
                  url === portraitUrl ? 'border-accent' : 'border-border hover:border-border-hover'
                }`}
              >
                {isBlobUrl(url) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={url}
                    alt="Portrait option"
                    className="w-full aspect-square object-cover cursor-pointer"
                    onClick={() => handleSetActive(url)}
                  />
                ) : failedImages.has(url) ? (
                  <div
                    className="w-full aspect-square bg-bg-surface flex items-center justify-center text-text-tertiary text-xs cursor-pointer"
                    onClick={() => handleSetActive(url)}
                  >
                    Failed to load
                  </div>
                ) : (
                  <Image
                    src={url}
                    alt="Portrait option"
                    width={150}
                    height={150}
                    className="w-full aspect-square object-cover cursor-pointer"
                    onClick={() => handleSetActive(url)}
                    unoptimized={!isExternalUrl(url) && !url.startsWith('/')}
                    onError={() => setFailedImages((prev) => new Set(prev).add(url))}
                  />
                )}
                {url === portraitUrl && (
                  <div className="absolute top-1 left-1 bg-accent text-bg text-xs px-1.5 py-0.5 rounded">
                    Active
                  </div>
                )}
                <button
                  onClick={() => handleRemoveFromGallery(url)}
                  className="absolute top-1 right-1 bg-bg/80 text-text-tertiary hover:text-red-400 rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  aria-label="Remove from gallery"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status */}
      {(isSaving || message) && (
        <div className={`text-sm ${message.includes('Failed') ? 'text-red-400' : 'text-text-tertiary'}`}>
          {isSaving ? 'Saving...' : message}
        </div>
      )}

      {/* Image Editor Modal */}
      {isEditorOpen && portraitUrl && (
        <ImageEditor
          imageUrl={portraitUrl}
          initialCrop={crop}
          onCropChange={handleCropChange}
          onSave={handleEditorSave}
          onCancel={() => setIsEditorOpen(false)}
        />
      )}
    </div>
  )
}
