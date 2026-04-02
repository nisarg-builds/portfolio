'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ImageUpload } from './image-upload'

interface ProjectData {
  slug: string
  title: string
  description: string
  fullDescription: string
  tags: string[]
  image: string
  screenshots: string[]
  link: string
  featured: boolean
  role?: string
}

interface ProjectFormProps {
  mode: 'create' | 'edit'
  initialData?: ProjectData
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function ProjectForm({ mode, initialData }: ProjectFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState(initialData?.title ?? '')
  const [slug, setSlug] = useState(initialData?.slug ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [fullDescription, setFullDescription] = useState(initialData?.fullDescription ?? '')
  const [tagsInput, setTagsInput] = useState(initialData?.tags.join(', ') ?? '')
  const [link, setLink] = useState(initialData?.link ?? '')
  const [role, setRole] = useState(initialData?.role ?? '')
  const [featured, setFeatured] = useState(initialData?.featured ?? false)
  const [heroImage, setHeroImage] = useState(initialData?.image ?? '')
  const [screenshots, setScreenshots] = useState<string[]>(initialData?.screenshots ?? [])

  function handleTitleChange(value: string) {
    setTitle(value)
    if (mode === 'create') {
      setSlug(slugify(value))
    }
  }

  function handleScreenshotUploaded(url: string) {
    setScreenshots((prev) => [...prev, url])
  }

  function removeScreenshot(index: number) {
    setScreenshots((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const projectData = {
      slug,
      title,
      description,
      fullDescription,
      tags,
      image: heroImage,
      screenshots,
      link,
      featured,
      ...(role ? { role } : {}),
    }

    try {
      const res = await fetch('/api/admin/projects', {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save project')
      }

      router.push('/admin/projects')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClasses =
    'w-full bg-bg border border-border rounded-md px-4 py-2.5 text-text-primary focus:border-accent focus:outline-none text-sm'
  const labelClasses = 'block text-sm font-medium text-text-secondary mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label className={labelClasses}>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
          className={inputClasses}
          placeholder="My Awesome Project"
        />
      </div>

      <div>
        <label className={labelClasses}>Slug</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          className={inputClasses}
          placeholder="my-awesome-project"
          disabled={mode === 'edit'}
        />
        {mode === 'edit' && (
          <p className="text-xs text-text-tertiary mt-1">Slug cannot be changed after creation.</p>
        )}
      </div>

      <div>
        <label className={labelClasses}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={2}
          className={inputClasses}
          placeholder="A short description for the project card"
        />
      </div>

      <div>
        <label className={labelClasses}>Full Description</label>
        <textarea
          value={fullDescription}
          onChange={(e) => setFullDescription(e.target.value)}
          rows={6}
          className={inputClasses}
          placeholder="Detailed description for the project detail page"
        />
      </div>

      <div>
        <label className={labelClasses}>Tags (comma-separated)</label>
        <input
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className={inputClasses}
          placeholder="React, TypeScript, Firebase"
        />
      </div>

      <div>
        <label className={labelClasses}>Link</label>
        <input
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className={inputClasses}
          placeholder="https://github.com/..."
        />
      </div>

      <div>
        <label className={labelClasses}>Role (optional)</label>
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={inputClasses}
          placeholder="Full-Stack Developer"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="featured"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="w-4 h-4 rounded border-border accent-accent"
        />
        <label htmlFor="featured" className="text-sm text-text-secondary">
          Featured project
        </label>
      </div>

      <ImageUpload
        label="Hero Image"
        storagePath="projects/heroes"
        currentUrl={heroImage || undefined}
        onUploaded={setHeroImage}
      />

      <div>
        <label className={labelClasses}>Screenshots</label>
        <div className="space-y-3">
          {screenshots.map((url, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 bg-bg-surface border border-border rounded-md p-3">
              <img src={url} alt={`Screenshot ${i + 1}`} className="w-full sm:w-20 h-24 sm:h-14 object-cover rounded" />
              <span className="flex-1 text-xs sm:text-sm text-text-tertiary truncate">{url}</span>
              <button
                type="button"
                onClick={() => removeScreenshot(i)}
                className="text-text-tertiary hover:text-red-400 text-sm cursor-pointer self-end sm:self-auto"
              >
                Remove
              </button>
            </div>
          ))}
          <ImageUpload
            label=""
            storagePath="projects/screenshots"
            onUploaded={handleScreenshotUploaded}
          />
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 pt-4">
        <button
          type="button"
          onClick={() => router.push('/admin/projects')}
          className="border border-border rounded-md px-6 py-3 sm:py-2.5 text-sm text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors cursor-pointer text-center"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-accent text-bg rounded-md px-6 py-3 sm:py-2.5 text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting
            ? 'Saving...'
            : mode === 'create'
              ? 'Create Project'
              : 'Update Project'}
        </button>
      </div>
    </form>
  )
}
