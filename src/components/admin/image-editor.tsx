'use client'

import { useState, useEffect, useCallback } from 'react'

interface CropRect {
  x: number
  y: number
  width: number
  height: number
}

interface ImageEditorProps {
  imageUrl: string
  initialCrop?: CropRect | null
  onSave: (editedUrl: string) => void
  onCropChange: (crop: CropRect | null) => void
  onCancel: () => void
}

interface SliderControlProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  onChange: (value: number) => void
}

function SliderControl({ label, value, min, max, step = 1, unit = '%', onChange }: SliderControlProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm text-text-secondary">{label}</label>
        <span className="text-xs text-text-tertiary font-(family-name:--font-mono)">
          {step < 1 ? value.toFixed(1) : value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-border cursor-pointer accent-accent"
      />
    </div>
  )
}

const DEFAULTS = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  rotation: 0,
} as const

const CROP_DEFAULTS: CropRect = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
}

type Tab = 'adjustments' | 'crop'

function isCropDefault(crop: CropRect): boolean {
  return crop.x === 0 && crop.y === 0 && crop.width === 100 && crop.height === 100
}

interface AspectPreset {
  label: string
  ratio: number | null
}

const ASPECT_PRESETS: AspectPreset[] = [
  { label: 'Free', ratio: null },
  { label: '1:1', ratio: 1 },
  { label: '4:3', ratio: 4 / 3 },
  { label: '3:4', ratio: 3 / 4 },
]

export function ImageEditor({ imageUrl, initialCrop, onSave, onCropChange, onCancel }: ImageEditorProps) {
  const [brightness, setBrightness] = useState<number>(DEFAULTS.brightness)
  const [contrast, setContrast] = useState<number>(DEFAULTS.contrast)
  const [saturation, setSaturation] = useState<number>(DEFAULTS.saturation)
  const [blur, setBlur] = useState<number>(DEFAULTS.blur)
  const [rotation, setRotation] = useState<number>(DEFAULTS.rotation)
  const [isApplying, setIsApplying] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('adjustments')
  const [crop, setCrop] = useState<CropRect>(initialCrop ?? { ...CROP_DEFAULTS })
  const [aspectRatio, setAspectRatio] = useState<number | null>(null)

  function resetAll() {
    setBrightness(DEFAULTS.brightness)
    setContrast(DEFAULTS.contrast)
    setSaturation(DEFAULTS.saturation)
    setBlur(DEFAULTS.blur)
    setRotation(DEFAULTS.rotation)
  }

  function resetCrop() {
    setCrop({ ...CROP_DEFAULTS })
    setAspectRatio(null)
  }

  function updateCrop(field: keyof CropRect, value: number) {
    setCrop((prev) => {
      const next = { ...prev, [field]: value }

      if (field === 'x') {
        next.x = Math.min(value, 100 - next.width)
      } else if (field === 'y') {
        next.y = Math.min(value, 100 - next.height)
      } else if (field === 'width') {
        next.width = Math.max(10, Math.min(value, 100 - next.x))
        if (aspectRatio !== null) {
          next.height = Math.max(10, Math.min(next.width / aspectRatio, 100 - next.y))
        }
      } else if (field === 'height') {
        next.height = Math.max(10, Math.min(value, 100 - next.y))
        if (aspectRatio !== null) {
          next.width = Math.max(10, Math.min(next.height * aspectRatio, 100 - next.x))
        }
      }

      return next
    })
  }

  function handleAspectPreset(ratio: number | null) {
    setAspectRatio(ratio)
    if (ratio !== null) {
      setCrop((prev) => {
        const newWidth = Math.min(prev.width, 100 - prev.x)
        const newHeight = Math.max(10, Math.min(newWidth / ratio, 100 - prev.y))
        const adjustedWidth = Math.max(10, newHeight * ratio)
        return { ...prev, width: adjustedWidth, height: newHeight }
      })
    }
  }

  function handleSaveCrop() {
    onCropChange(isCropDefault(crop) ? null : crop)
    onCancel()
  }

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onCancel()
  }, [onCancel])

  useEffect(() => {
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [handleEscape])

  async function handleApply() {
    setIsApplying(true)
    try {
      // Fetch through our own proxy API to avoid CORS issues with canvas
      const proxyUrl = imageUrl.startsWith('http')
        ? `/api/admin/proxy-image?url=${encodeURIComponent(imageUrl)}`
        : imageUrl
      const imageRes = await fetch(proxyUrl)
      if (!imageRes.ok) throw new Error('Failed to fetch image')
      const imageBlob = await imageRes.blob()
      const bitmapSource = URL.createObjectURL(imageBlob)

      const img = new window.Image()
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = bitmapSource
      })

      const canvas = document.createElement('canvas')
      const isRotated90or270 = rotation === 90 || rotation === 270
      canvas.width = isRotated90or270 ? img.naturalHeight : img.naturalWidth
      canvas.height = isRotated90or270 ? img.naturalWidth : img.naturalHeight

      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Could not get canvas context')

      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`

      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2)

      URL.revokeObjectURL(bitmapSource)

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b)
            else reject(new Error('Failed to create blob'))
          },
          'image/webp',
          0.9,
        )
      })

      const timestamp = Date.now()
      const filename = `edited-${timestamp}.webp`
      const formData = new FormData()
      formData.append('file', blob, filename)
      formData.append('path', `images/about/${filename}`)

      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      if (!res.ok) {
        const status = res.status
        throw new Error(`Upload failed with status ${status}`)
      }

      const data = await res.json()
      if (!data.url || typeof data.url !== 'string') {
        throw new Error('Upload returned invalid URL')
      }
      onSave(data.url)
    } catch (err) {
      console.error('Failed to apply edits:', err)
      const message = err instanceof Error ? err.message : 'Unknown error'
      if (message.includes('Failed to load image')) {
        alert('Could not load the image. It may have been deleted or the URL is invalid.')
      } else if (message.includes('Upload failed')) {
        alert(`Upload failed: ${message}. Check your network connection and try again.`)
      } else if (message.includes('cross-origin') || message.includes('tainted')) {
        alert('This image cannot be edited due to cross-origin restrictions. Try uploading the image first.')
      } else {
        alert(`Failed to apply edits: ${message}`)
      }
    } finally {
      setIsApplying(false)
    }
  }

  const filterStyle = {
    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`,
    transform: `rotate(${rotation}deg)`,
  }

  const cropPreviewScale = 100 / crop.width
  const cropPreviewTranslateX = -crop.x * cropPreviewScale
  const cropPreviewTranslateY = -crop.y * cropPreviewScale

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/90 backdrop-blur-sm">
      <div className="w-full max-w-3xl mx-4 rounded-xl bg-bg-surface border border-border p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-(family-name:--font-display) text-xl font-bold text-text-primary">
            Edit Image
          </h2>
          <button
            onClick={onCancel}
            className="text-text-tertiary hover:text-text-primary text-xl cursor-pointer"
            aria-label="Close editor"
          >
            &times;
          </button>
        </div>

        <div className="flex justify-center mb-6 bg-bg rounded-lg p-4 border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Edit preview"
            className="max-h-80 rounded-md object-contain"
            style={filterStyle}
          />
        </div>

        <div className="flex gap-2 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab('adjustments')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'adjustments'
                ? 'border-accent text-accent'
                : 'border-transparent text-text-tertiary hover:text-text-secondary'
            }`}
          >
            Adjustments
          </button>
          <button
            onClick={() => setActiveTab('crop')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'crop'
                ? 'border-accent text-accent'
                : 'border-transparent text-text-tertiary hover:text-text-secondary'
            }`}
          >
            Crop
          </button>
        </div>

        {activeTab === 'adjustments' && (
          <div className="space-y-4">
            <SliderControl label="Brightness" value={brightness} min={0} max={200} onChange={setBrightness} />
            <SliderControl label="Contrast" value={contrast} min={0} max={200} onChange={setContrast} />
            <SliderControl label="Saturation" value={saturation} min={0} max={200} onChange={setSaturation} />
            <SliderControl label="Blur" value={blur} min={0} max={10} step={0.5} unit="px" onChange={setBlur} />

            <div>
              <label className="block text-sm text-text-secondary mb-2">Rotation</label>
              <div className="flex gap-2">
                {[0, 90, 180, 270].map((deg) => (
                  <button
                    key={deg}
                    onClick={() => setRotation(deg)}
                    className={`px-3 py-1.5 rounded-md text-sm border transition-colors cursor-pointer ${
                      rotation === deg
                        ? 'bg-accent text-bg border-accent'
                        : 'border-border text-text-secondary hover:border-border-hover'
                    }`}
                  >
                    {deg}&deg;
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'crop' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-text-secondary mb-2">Aspect Ratio</label>
              <div className="flex gap-2">
                {ASPECT_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handleAspectPreset(preset.ratio)}
                    className={`px-3 py-1.5 rounded-md text-sm border transition-colors cursor-pointer ${
                      aspectRatio === preset.ratio
                        ? 'bg-accent text-bg border-accent'
                        : 'border-border text-text-secondary hover:border-border-hover'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <SliderControl
                label="Left offset"
                value={crop.x}
                min={0}
                max={90}
                unit="%"
                onChange={(v) => updateCrop('x', v)}
              />
              <SliderControl
                label="Top offset"
                value={crop.y}
                min={0}
                max={90}
                unit="%"
                onChange={(v) => updateCrop('y', v)}
              />
              <SliderControl
                label="Crop width"
                value={crop.width}
                min={10}
                max={100}
                unit="%"
                onChange={(v) => updateCrop('width', v)}
              />
              <SliderControl
                label="Crop height"
                value={crop.height}
                min={10}
                max={100}
                unit="%"
                onChange={(v) => updateCrop('height', v)}
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">Crop Preview</label>
              <div className="bg-bg rounded-lg p-4 border border-border">
                <div
                  className="relative mx-auto overflow-hidden rounded-md"
                  style={{
                    width: '100%',
                    maxWidth: '400px',
                    aspectRatio: `${crop.width} / ${crop.height}`,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Crop preview"
                    className="absolute top-0 left-0 max-w-none"
                    style={{
                      width: `${cropPreviewScale * 100}%`,
                      height: `${cropPreviewScale * 100}%`,
                      objectFit: 'cover',
                      transform: `translate(${cropPreviewTranslateX}%, ${cropPreviewTranslateY}%)`,
                    }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={resetCrop}
              className="text-sm text-text-tertiary hover:text-text-primary cursor-pointer"
            >
              Remove Crop
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <button
            onClick={activeTab === 'adjustments' ? resetAll : resetCrop}
            className="text-sm text-text-tertiary hover:text-text-primary cursor-pointer"
          >
            {activeTab === 'adjustments' ? 'Reset All' : 'Reset Crop'}
          </button>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-md border border-border text-sm text-text-secondary hover:text-text-primary cursor-pointer"
            >
              Cancel
            </button>
            {activeTab === 'crop' && (
              <button
                onClick={handleSaveCrop}
                className="px-4 py-2 rounded-md border border-accent text-sm text-accent hover:bg-accent/10 cursor-pointer"
              >
                Save Crop
              </button>
            )}
            <button
              onClick={handleApply}
              disabled={isApplying}
              className="px-4 py-2 rounded-md bg-accent text-bg text-sm font-medium hover:bg-accent-hover disabled:opacity-50 cursor-pointer"
            >
              {isApplying ? 'Applying...' : 'Apply Edits'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
