'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface ProjectItem {
  slug: string
  title: string
  description: string
  tags: string[]
  image: string
  featured: boolean
  order: number
}

interface ProjectListProps {
  initialProjects: ProjectItem[]
}

export function ProjectList({ initialProjects }: ProjectListProps) {
  const [projects, setProjects] = useState(initialProjects)
  const [isReordering, setIsReordering] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)
  const dragNode = useRef<HTMLDivElement | null>(null)

  async function handleDelete(slug: string) {
    if (!window.confirm(`Delete project "${slug}"? This cannot be undone.`)) return

    const res = await fetch('/api/admin/projects', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    })

    if (res.ok) {
      setProjects((prev) => prev.filter((p) => p.slug !== slug))
    }
  }

  async function persistOrder(reordered: ProjectItem[]) {
    setIsReordering(true)
    const orderedSlugs = reordered.map((p) => p.slug)
    try {
      await fetch('/api/admin/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedSlugs }),
      })
    } catch {
      setProjects(initialProjects)
    } finally {
      setIsReordering(false)
    }
  }

  async function handleMove(index: number, direction: 'up' | 'down') {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= projects.length) return

    const reordered = [...projects]
    const [moved] = reordered.splice(index, 1)
    reordered.splice(newIndex, 0, moved)
    setProjects(reordered)
    await persistOrder(reordered)
  }

  function handleDragStart(e: React.DragEvent, index: number) {
    setDragIndex(index)
    dragNode.current = e.currentTarget as HTMLDivElement
    e.dataTransfer.effectAllowed = 'move'
    requestAnimationFrame(() => {
      if (dragNode.current) {
        dragNode.current.style.opacity = '0.4'
      }
    })
  }

  function handleDragEnter(index: number) {
    if (dragIndex === null || dragIndex === index) return
    setDropIndex(index)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  async function handleDrop(e: React.DragEvent, targetIndex: number) {
    e.preventDefault()
    if (dragIndex === null || dragIndex === targetIndex) return

    const reordered = [...projects]
    const [moved] = reordered.splice(dragIndex, 1)
    reordered.splice(targetIndex, 0, moved)
    setProjects(reordered)
    setDragIndex(null)
    setDropIndex(null)
    if (dragNode.current) dragNode.current.style.opacity = '1'
    await persistOrder(reordered)
  }

  function handleDragEnd() {
    setDragIndex(null)
    setDropIndex(null)
    if (dragNode.current) {
      dragNode.current.style.opacity = '1'
      dragNode.current = null
    }
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-16 text-text-tertiary">
        <p className="text-lg mb-2">No projects yet</p>
        <p className="text-sm">Click &quot;+ Add Project&quot; to create your first project.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {projects.map((project, index) => (
        <div
          key={project.slug}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragEnter={() => handleDragEnter(index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
          className={`bg-bg-surface border rounded-lg p-3 sm:p-4 transition-all cursor-grab active:cursor-grabbing ${
            dropIndex === index && dragIndex !== null
              ? 'border-accent bg-accent/5'
              : 'border-border hover:border-border-hover'
          } ${isReordering ? 'pointer-events-none opacity-60' : ''}`}
        >
          {/* Mobile: stacked layout */}
          <div className="flex items-start gap-3 sm:hidden">
            {/* Left: reorder + thumbnail */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div className="flex gap-1">
                <button
                  onClick={() => handleMove(index, 'up')}
                  disabled={index === 0 || isReordering}
                  className="text-text-tertiary hover:text-text-primary disabled:opacity-30 p-1 cursor-pointer disabled:cursor-default"
                  aria-label="Move up"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                </button>
                <button
                  onClick={() => handleMove(index, 'down')}
                  disabled={index === projects.length - 1 || isReordering}
                  className="text-text-tertiary hover:text-text-primary disabled:opacity-30 p-1 cursor-pointer disabled:cursor-default"
                  aria-label="Move down"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>
              <div className="w-14 h-14 rounded-md bg-bg-elevated overflow-hidden">
                {project.image ? (
                  <Image src={project.image} alt={project.title} width={56} height={56} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-tertiary text-[10px]">No img</div>
                )}
              </div>
            </div>

            {/* Right: info + actions */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-medium text-text-primary text-sm truncate">{project.title}</h3>
                {project.featured && (
                  <span className="text-[10px] bg-accent/15 text-accent px-1.5 py-0.5 rounded-full shrink-0">Featured</span>
                )}
              </div>
              <p className="text-xs text-text-tertiary truncate mb-2">{project.description}</p>
              <div className="flex gap-2">
                <a
                  href={`/admin/projects/${project.slug}/edit`}
                  className="px-3 py-1.5 text-xs rounded-md border border-border text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors"
                >
                  Edit
                </a>
                <button
                  onClick={() => handleDelete(project.slug)}
                  className="px-3 py-1.5 text-xs rounded-md border border-border text-text-secondary hover:text-red-400 hover:border-red-400/50 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Desktop: horizontal layout */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Drag handle */}
            <div className="flex flex-col items-center gap-0.5 text-text-tertiary shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="9" cy="6" r="1.5" />
                <circle cx="15" cy="6" r="1.5" />
                <circle cx="9" cy="12" r="1.5" />
                <circle cx="15" cy="12" r="1.5" />
                <circle cx="9" cy="18" r="1.5" />
                <circle cx="15" cy="18" r="1.5" />
              </svg>
            </div>

            {/* Reorder buttons */}
            <div className="flex flex-col gap-1 shrink-0">
              <button
                onClick={() => handleMove(index, 'up')}
                disabled={index === 0 || isReordering}
                className="text-text-tertiary hover:text-text-primary disabled:opacity-30 p-0.5 cursor-pointer disabled:cursor-default"
                aria-label="Move up"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </button>
              <button
                onClick={() => handleMove(index, 'down')}
                disabled={index === projects.length - 1 || isReordering}
                className="text-text-tertiary hover:text-text-primary disabled:opacity-30 p-0.5 cursor-pointer disabled:cursor-default"
                aria-label="Move down"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>

            {/* Thumbnail */}
            <div className="w-16 h-16 rounded-md bg-bg-elevated overflow-hidden shrink-0">
              {project.image ? (
                <Image src={project.image} alt={project.title} width={64} height={64} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-tertiary text-xs">No img</div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-text-primary truncate">{project.title}</h3>
                {project.featured && (
                  <span className="text-xs bg-accent/15 text-accent px-2 py-0.5 rounded-full shrink-0">Featured</span>
                )}
              </div>
              <p className="text-sm text-text-tertiary truncate">{project.description}</p>
              {project.tags.length > 0 && (
                <div className="flex gap-1.5 mt-1.5 flex-wrap">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="text-xs bg-bg-elevated text-text-tertiary px-1.5 py-0.5 rounded">{tag}</span>
                  ))}
                  {project.tags.length > 4 && (
                    <span className="text-xs text-text-tertiary">+{project.tags.length - 4}</span>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`/admin/projects/${project.slug}/edit`}
                className="px-3 py-1.5 text-sm rounded-md border border-border text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors"
              >
                Edit
              </a>
              <button
                onClick={() => handleDelete(project.slug)}
                className="px-3 py-1.5 text-sm rounded-md border border-border text-text-secondary hover:text-red-400 hover:border-red-400/50 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
