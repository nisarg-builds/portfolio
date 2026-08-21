import { SectionMarker } from '@/components/ui/section-marker'
import { Reveal } from '@/components/ui/reveal'
import { ProjectIndex } from '@/components/ui/project-index'
import { WORK_INTRO } from '@/lib/site-data'
import type { Project } from '@/lib/projects'

/**
 * The work hangs on the opposite ground from the rest of the page — a white
 * wall in dark mode, a dark room in light mode. The inversion is the only
 * structural device the site uses to say "this part matters most".
 */
export function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="ground-invert py-20 lg:py-28">
      <div className="gutter mx-auto max-w-[1440px]">
        <SectionMarker
          number="02"
          label="Selected work"
          annotation={String(projects.length).padStart(2, '0')}
        />

        <Reveal className="mt-10 mb-12 lg:mt-14 lg:mb-16">
          <h2 className="max-w-[16ch] font-(family-name:--font-display) text-3xl font-bold leading-[0.98] tracking-[-0.04em]">
            The work, and what it <span className="emph">taught me.</span>
          </h2>
          <p className="mt-5 max-w-[54ch] text-base text-text-secondary">
            {WORK_INTRO}
          </p>
        </Reveal>

        <ProjectIndex projects={projects} />
      </div>
    </section>
  )
}
