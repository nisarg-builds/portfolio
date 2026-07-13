import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getProjects, getProjectBySlug, getProjectSlugs } from '@/lib/firebase/projects'
import { SITE_CONFIG } from '@/lib/constants'
import { TREEMAP_COLORS } from '@/lib/grid-layout'
import { cn } from '@/lib/utils'
import { StickerChip } from '@/components/ui/sticker-chip'
import { ProjectMascot } from '@/components/ui/project-mascot'
import { ArrowBolt } from '@/components/shapes'
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

  const hue = TREEMAP_COLORS[project.order % TREEMAP_COLORS.length]

  return (
    <main className="min-h-dvh px-5 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-12">
      <div className="mx-auto max-w-[960px]">
        {/* Hue band header */}
        <div
          className="relative overflow-hidden rounded-xl border-2 border-ink p-6 sm:p-8"
          style={{ backgroundColor: hue.bg, color: hue.text }}
        >
          <div
            className="pointer-events-none absolute -right-6 -top-8 w-36 rotate-12 sm:w-44"
            aria-hidden="true"
          >
            <ProjectMascot index={project.order} className="w-full" />
          </div>

          <div className="relative">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-wider uppercase opacity-80 transition-opacity hover:opacity-100"
              data-cursor="interactive"
            >
              <ArrowBolt direction="left" className="h-3.5 w-3.5" />
              Back to Projects
            </Link>

            <p className="mt-6 font-mono text-xs tracking-[0.15em] uppercase opacity-70 [font-variant-numeric:tabular-nums]">
              {String(project.order + 1).padStart(3, '0')}
              {project.role ? ` · ${project.role}` : ''}
            </p>
            <h1
              className="mt-2 max-w-[16ch] font-display text-4xl font-bold leading-[1.02]"
              style={{ color: hue.text }}
            >
              {project.title}
            </h1>
          </div>
        </div>

        {/* Hero image */}
        <div className="mt-5 overflow-hidden rounded-xl border-2 border-ink bg-paper">
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
        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            <p className="border-l-[3px] border-ink pl-5 text-base leading-relaxed text-ink-soft" data-cursor="text">
              {project.fullDescription}
            </p>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div>
              <h2 className="font-mono text-xs font-semibold tracking-[0.15em] text-ink-soft uppercase">
                Technologies
              </h2>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.tags.map((tag, i) => (
                  <StickerChip key={tag} index={i}>
                    {tag}
                  </StickerChip>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-mono text-xs font-semibold tracking-[0.15em] text-ink-soft uppercase">
                Links
              </h2>
              <div className="mt-3">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-ink px-5 py-2 font-display text-sm font-bold text-canvas transition-[transform,box-shadow] duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lift-blurple"
                  data-cursor="interactive"
                >
                  View on GitHub
                  <ArrowBolt className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Screenshots — taped to the page at slight angles */}
        {project.screenshots.length > 1 && (
          <div className="mt-14">
            <h2 className="font-display text-2xl font-bold text-ink">
              Screenshots
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
              {project.screenshots.slice(1).map((src, i) => (
                <div
                  key={i}
                  className={cn(
                    'overflow-hidden rounded-lg border-2 border-ink bg-paper',
                    i % 2 === 0 ? 'md:rotate-[0.5deg]' : 'md:-rotate-[0.5deg]',
                  )}
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

        {/* Prev / Next pager */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2">
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.slug}`}
              className="group flex items-center gap-4 rounded-xl border-2 border-ink bg-paper p-5 transition-[transform,box-shadow] duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lift"
              data-cursor="interactive"
              aria-label={`Previous project: ${prevProject.title}`}
            >
              <ArrowBolt
                direction="left"
                className="h-6 w-6 shrink-0 text-ink transition-transform duration-200 group-hover:-translate-x-1"
              />
              <span>
                <span className="block font-mono text-[10px] tracking-wider text-ink-faint uppercase">
                  Previous
                </span>
                <span className="block font-display text-lg font-bold text-ink">
                  {prevProject.title}
                </span>
              </span>
            </Link>
          ) : (
            <div aria-hidden="true" />
          )}
          {nextProject ? (
            <Link
              href={`/projects/${nextProject.slug}`}
              className="group flex items-center justify-end gap-4 rounded-xl border-2 border-ink bg-paper p-5 text-right transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:translate-x-0.5 hover:shadow-lift sm:col-start-2"
              data-cursor="interactive"
              aria-label={`Next project: ${nextProject.title}`}
            >
              <span>
                <span className="block font-mono text-[10px] tracking-wider text-ink-faint uppercase">
                  Next
                </span>
                <span className="block font-display text-lg font-bold text-ink">
                  {nextProject.title}
                </span>
              </span>
              <ArrowBolt className="h-6 w-6 shrink-0 text-ink transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          ) : (
            <div aria-hidden="true" />
          )}
        </div>
      </div>
    </main>
  )
}
