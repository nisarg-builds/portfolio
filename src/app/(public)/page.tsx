import { getProjects } from '@/lib/firebase/projects'
import { getAboutSettings } from '@/lib/firebase/about'
import { HeroSection } from '@/components/sections/hero-section'
import { AboutSection } from '@/components/sections/about-section'
import { ProjectsSection } from '@/components/sections/projects-section'
import { ContactSection } from '@/components/sections/contact-section'
import { SITE_CONFIG } from '@/lib/constants'

export const revalidate = 0

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Nisarg Chaudhary',
  url: SITE_CONFIG.url,
  jobTitle: 'Software Developer & Designer',
  description: SITE_CONFIG.description,
  sameAs: [
    'https://github.com/nisarg-11-here',
    'https://www.linkedin.com/in/nisargchaudhary/',
    'https://www.instagram.com/nisarg.11/',
  ],
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'University of Saskatchewan',
  },
  knowsAbout: ['Software Development', 'Frontend Engineering', 'Design', 'Studio Arts'],
}

export default async function HomePage() {
  const [projects, aboutSettings] = await Promise.all([
    getProjects(),
    getAboutSettings(),
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <HeroSection />
        <AboutSection portraitUrl={aboutSettings.portraitUrl} portraitCrop={aboutSettings.portraitCrop} />
        <ProjectsSection projects={projects} />
        <ContactSection />
      </main>
    </>
  )
}
