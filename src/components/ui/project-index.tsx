import Image from 'next/image'
import Link from 'next/link'
import type { Project } from '@/lib/projects'
import { ProjectPages } from './project-pages'

function Arrow({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M3.5 10.5 10.5 3.5M10.5 3.5H5m5.5 0V9"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * The work, set as an index rather than a grid of tiles.
 *
 * A row is type only, plus the project's logo when it has one. A project
 * without a logo shows no image here: its screenshots are on the detail page.
 */
export function ProjectIndex({ projects }: { projects: Project[] }) {
  // Rows render here, on the server. ProjectPages only picks which page shows.
  const rows = projects.map((project, index) => (
    <li key={project.slug} className="border-t border-(--color-line)">
      <Link
        href={`/projects/${project.slug}`}
        className="group block py-6 sm:py-7 lg:py-8"
        data-cursor="interactive"
      >
        <div className="flex items-start gap-4 sm:gap-6 lg:items-baseline lg:gap-8">
          <span
            className="numeral mt-1.5 shrink-0 text-[0.6875rem] text-text-tertiary transition-colors duration-300 group-hover:text-accent lg:mt-0"
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, '0')}
          </span>

          <div className="min-w-0 flex-1 lg:grid lg:grid-cols-12 lg:items-baseline lg:gap-8">
            <h3 className="font-(family-name:--font-display) text-2xl font-medium tracking-[-0.03em] text-text-primary transition-transform duration-500 ease-out group-hover:translate-x-1.5 lg:col-span-5">
              {project.logo && (
                // Inline and sized in em, so the logo scales with the
                // title and the row keeps the title's baseline.
                <span
                  // App icons ship square; the platform rounds them. This does the same.
                  className="relative mr-[0.4em] inline-block size-[1.2em] overflow-hidden rounded-[22%] align-[-0.25em]"
                  aria-hidden="true"
                >
                  <Image
                    src={project.logo}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="48px"
                  />
                </span>
              )}
              {project.title}
            </h3>

            <div className="mt-3 lg:col-span-5 lg:mt-0">
              {project.role && (
                <p className="meta text-accent">{project.role}</p>
              )}
              <p className="meta mt-1.5 text-text-tertiary normal-case tracking-[0.06em]">
                {project.tags.join('  ·  ')}
              </p>
            </div>

            <div className="mt-3 flex items-center gap-4 lg:col-span-2 lg:mt-0 lg:justify-end">
              {project.year && (
                <span className="meta numeral text-text-tertiary">
                  {project.year}
                </span>
              )}
              <Arrow className="text-text-tertiary transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent" />
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm text-text-secondary sm:hidden">
          {project.description}
        </p>
      </Link>
    </li>
  ))

  return <ProjectPages rows={rows} />
}
