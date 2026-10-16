'use client'

import { useRef, useState, type ReactNode } from 'react'
import { usePrefersReducedMotion } from '@/lib/hooks'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 5

function pad(n: number) {
  return String(n).padStart(2, '0')
}

interface ProjectPagesProps {
  /** Server-rendered index rows, in display order. */
  rows: ReactNode[]
}

/**
 * Five rows at a time: the first five projects, then the rest on later pages.
 * The page changes in place, so the home page stays static.
 */
export function ProjectPages({ rows }: ProjectPagesProps) {
  const [page, setPage] = useState(0)
  const listRef = useRef<HTMLUListElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  const pageCount = Math.ceil(rows.length / PAGE_SIZE)
  const start = page * PAGE_SIZE
  const end = Math.min(start + PAGE_SIZE, rows.length)

  function goTo(next: number) {
    setPage(next)
    // A shorter page can leave the reader below the list. Bring its top back.
    const list = listRef.current
    if (list && list.getBoundingClientRect().top < 0) {
      list.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' })
    }
  }

  return (
    <>
      <ul ref={listRef} className="scroll-mt-24 border-b border-(--color-line)">
        {rows.slice(start, end)}
      </ul>

      {pageCount > 1 && (
        <nav aria-label="Project pages" className="mt-4 flex items-center justify-between gap-4">
          <p className="meta numeral text-text-tertiary" aria-live="polite">
            {pad(start + 1)}–{pad(end)} of {pad(rows.length)}
          </p>
          <ul className="flex items-center">
            {Array.from({ length: pageCount }, (_, n) => (
              <li key={n}>
                <button
                  type="button"
                  onClick={() => goTo(n)}
                  aria-label={`Page ${n + 1}`}
                  aria-current={n === page ? 'page' : undefined}
                  className={cn(
                    'meta numeral inline-flex min-h-11 min-w-11 items-center justify-center transition-colors duration-200',
                    n === page ? 'text-accent' : 'text-text-tertiary hover:text-text-primary',
                  )}
                  data-cursor="interactive"
                >
                  {pad(n + 1)}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  )
}
