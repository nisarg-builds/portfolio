import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import type { Project } from '@/lib/projects'
import { ProjectIndex } from '../project-index'

const project: Project = {
  title: 'Isle',
  slug: 'isle',
  description: 'A short description.',
  fullDescription: '',
  tags: ['TypeScript'],
  image: '/images/projects/isle-hero.png',
  screenshots: ['/images/projects/isle-hero.png'],
  link: '/isle',
  featured: false,
  order: 0,
}

describe('ProjectIndex', () => {
  it('shows the logo when the project has one', () => {
    const html = renderToStaticMarkup(
      <ProjectIndex projects={[{ ...project, logo: '/images/projects/isle-logo.png' }]} />,
    )

    expect(html).toContain('isle-logo.png')
    expect(html).not.toContain('isle-hero.png')
  })

  it('shows no image at all when the project has no logo', () => {
    const html = renderToStaticMarkup(<ProjectIndex projects={[project]} />)

    expect(html).not.toContain('<img')
  })

  it('shows the first five projects and pages the rest', () => {
    const projects = Array.from({ length: 7 }, (_, i) => ({
      ...project,
      title: `Project ${i + 1}`,
      slug: `project-${i + 1}`,
    }))
    const html = renderToStaticMarkup(<ProjectIndex projects={projects} />)

    expect(html.match(/<h3/g)).toHaveLength(5)
    expect(html).toContain('Project 5')
    expect(html).not.toContain('Project 6')
    expect(html).toContain('aria-label="Page 2"')
    expect(html).toContain('01–05 of 07')
  })

  it('shows no page controls for five projects or fewer', () => {
    const projects = Array.from({ length: 5 }, (_, i) => ({ ...project, slug: `p-${i}` }))

    expect(renderToStaticMarkup(<ProjectIndex projects={projects} />)).not.toContain('Project pages')
  })
})
