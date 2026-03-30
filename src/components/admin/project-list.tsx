'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()
  const [projects, setProjects] = useState(initialProjects)
  const [isReordering, setIsReordering] = useState(false)

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

  async function handleMove(index: number, direction: 'up' | 'down') {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= projects.length) return

    setIsReordering(true)
    const reordered = [...projects]
    const [moved] = reordered.splice(index, 1)
    reordered.splice(newIndex, 0, moved)
    setProjects(reordered)

    const orderedSlugs = reordered.map((p) => p.slug)
    await fetch('/api/admin/projects', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderedSlugs }),
    })
    setIsReordering(false)
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
    <div className="space-y-3">
      {projects.map((project, index) => (
        <div
          key={project.slug}
          className="flex items-center gap-4 bg-bg-surface border border-border rounded-lg p-4 hover:border-border-hover transition-colors"
        >
          {/* Reorder buttons */}
          <div className="flex flex-col gap-1">
            <button
              onClick={() => handleMove(index, 'up')}
              disabled={index === 0 || isReordering}
              className="text-text-tertiary hover:text-text-primary disabled:opacity-30 p-1 cursor-pointer disabled:cursor-default"
              aria-label="Move up"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>
            <button
              onClick={() => handleMove(index, 'down')}
              disabled={index === projects.length - 1 || isReordering}
              className="text-text-tertiary hover:text-text-primary disabled:opacity-30 p-1 cursor-pointer disabled:cursor-default"
              aria-label="Move down"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>

          {/* Thumbnail */}
          <div className="w-16 h-16 rounded-md bg-bg-elevated overflow-hidden shrink-0">
            {project.image ? (
              <Image
                src={project.image}
                alt={project.title}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-tertiary text-xs">
                No img
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-text-primary truncate">{project.title}</h3>
              {project.featured && (
                <span className="text-xs bg-accent/15 text-accent px-2 py-0.5 rounded-full shrink-0">
                  Featured
                </span>
              )}
            </div>
            <p className="text-sm text-text-tertiary truncate">{project.description}</p>
            {project.tags.length > 0 && (
              <p className="text-xs text-text-tertiary mt-1">
                {project.tags.length} tag{project.tags.length !== 1 ? 's' : ''}
              </p>
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
      ))}
    </div>
  )
}
