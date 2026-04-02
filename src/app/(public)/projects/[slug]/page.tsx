import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getProjects, getProjectBySlug, getProjectSlugs } from '@/lib/firebase/projects'
import { SITE_CONFIG } from '@/lib/constants'
import type { Metadata } from 'next'

export const revalidate = 0

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getProjectSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return {}
  const url = `${SITE_CONFIG.url}/projects/${slug}`
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      url,
      type: 'article',
      images: [{ url: project.image || `${SITE_CONFIG.url}/og-image.png`, width: 1200, height: 630, alt: project.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: [project.image || `${SITE_CONFIG.url}/og-image.png`],
    },
    alternates: {
      canonical: url,
    },
  }
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-sm border border-border bg-bg-elevated px-2.5 py-0.5 font-(family-name:--font-mono) text-xs text-text-secondary">
      {children}
    </span>
  )
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const [project, projects] = await Promise.all([
    getProjectBySlug(slug),
    getProjects(),
  ])
  if (!project) notFound()

  const currentIndex = projects.findIndex((p) => p.slug === slug)
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null
  const nextProject =
    currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null

  return (
    <main className="min-h-dvh px-5 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-12">
      <div className="mx-auto max-w-[960px]">
        {/* Back link */}
        <Link
          href="/#projects"
          className="inline-flex items-center gap-1.5 text-sm text-text-tertiary transition-colors hover:text-text-primary"
          data-cursor="interactive"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Projects
        </Link>

        {/* Hero image */}
        <div className="mt-6 overflow-hidden rounded-xl border border-border">
          <div className="relative aspect-video lg:aspect-[21/9]">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 960px) 100vw, 960px"
              priority
            />
          </div>
        </div>

        {/* Content grid */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            <h1 className="font-(family-name:--font-display) text-3xl font-bold text-text-primary">
              {project.title}
            </h1>
            {project.role && (
              <p className="mt-2 text-sm text-accent">
                Role: {project.role}
              </p>
            )}
            <p className="mt-4 text-base text-text-secondary leading-relaxed">
              {project.fullDescription}
            </p>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div>
              <h2 className="font-(family-name:--font-display) text-sm font-medium text-text-tertiary uppercase tracking-wider">
                Technologies
              </h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-(family-name:--font-display) text-sm font-medium text-text-tertiary uppercase tracking-wider">
                Links
              </h2>
              <div className="mt-2">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-accent px-4 py-2 text-sm text-accent transition-all duration-200 hover:bg-accent hover:text-bg"
                  data-cursor="interactive"
                >
                  View on GitHub
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M3.5 10.5L10.5 3.5M10.5 3.5H5M10.5 3.5V9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Screenshots */}
        {project.screenshots.length > 1 && (
          <div className="mt-12">
            <h2 className="font-(family-name:--font-display) text-xl font-medium text-text-primary">
              Screenshots
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {project.screenshots.slice(1).map((src, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-lg border border-border"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={src}
                      alt={`${project.title} screenshot ${i + 2}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prev / Next navigation */}
        <div className="mt-16 flex items-center justify-between border-t border-border pt-8">
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.slug}`}
              className="group flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
              data-cursor="interactive"
              aria-label={`Previous project: ${prevProject.title}`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 12L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {prevProject.title}
            </Link>
          ) : (
            <div />
          )}
          {nextProject ? (
            <Link
              href={`/projects/${nextProject.slug}`}
              className="group flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
              data-cursor="interactive"
              aria-label={`Next project: ${nextProject.title}`}
            >
              {nextProject.title}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 4L10 8L6 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </main>
  )
}
