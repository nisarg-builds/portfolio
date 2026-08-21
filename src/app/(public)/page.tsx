import { getProjects } from '@/lib/firebase/projects'
import { getAboutSettings } from '@/lib/firebase/about'
import { HeroSection } from '@/components/sections/hero-section'
import { AboutSection } from '@/components/sections/about-section'
import { ProjectsSection } from '@/components/sections/projects-section'
import { ContactSection } from '@/components/sections/contact-section'
import { SITE_CONFIG, SOCIAL_LINKS } from '@/lib/constants'
import { EXPERIENCE, PROFILE } from '@/lib/site-data'

/**
 * Revalidated rather than fully dynamic: the page is content, not a dashboard,
 * so visitors should get a cached render and admin edits should land within a
 * minute. The previous `revalidate = 0` re-queried Firestore on every request.
 */
export const revalidate = 60

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: PROFILE.name,
  url: SITE_CONFIG.url,
  jobTitle: EXPERIENCE.title,
  description: SITE_CONFIG.description,
  worksFor: { '@type': 'Organization', name: EXPERIENCE.company },
  sameAs: [SOCIAL_LINKS.github, SOCIAL_LINKS.linkedin, SOCIAL_LINKS.instagram],
  alumniOf: { '@type': 'CollegeOrUniversity', name: PROFILE.university },
  address: { '@type': 'PostalAddress', addressLocality: 'Saskatoon', addressRegion: 'SK', addressCountry: 'CA' },
  knowsAbout: [
    'Software Engineering',
    'Go',
    'Distributed Systems',
    'Frontend Engineering',
    'Design Engineering',
    'Studio Arts',
  ],
}

export default async function HomePage() {
  const [projects, aboutSettings] = await Promise.all([getProjects(), getAboutSettings()])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <AboutSection
        portraitUrl={aboutSettings.portraitUrl}
        portraitCrop={aboutSettings.portraitCrop}
      />
      <ProjectsSection projects={projects} />
      <ContactSection />
    </>
  )
}
