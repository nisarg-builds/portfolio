import { getProjects } from '@/lib/firebase/projects'
import { getAboutSettings } from '@/lib/firebase/about'
import { HeroSection } from '@/components/sections/hero-section'
import { AboutSection } from '@/components/sections/about-section'
import { ProjectsSection } from '@/components/sections/projects-section'
import { ContactSection } from '@/components/sections/contact-section'

export const revalidate = 0

export default async function HomePage() {
  const [projects, aboutSettings] = await Promise.all([
    getProjects(),
    getAboutSettings(),
  ])

  return (
    <main>
      <HeroSection />
      <AboutSection portraitUrl={aboutSettings.portraitUrl} portraitCrop={aboutSettings.portraitCrop} />
      <ProjectsSection projects={projects} />
      <ContactSection />
    </main>
  )
}
