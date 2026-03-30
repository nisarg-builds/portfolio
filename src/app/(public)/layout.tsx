import { GrainOverlay } from '@/components/layout/grain-overlay'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { CustomCursor } from '@/components/layout/custom-cursor'
import { ScrollProgress } from '@/components/layout/scroll-progress'
import { PageTransition } from '@/components/layout/page-transition'

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-bg focus:outline-none"
      >
        Skip to content
      </a>
      <GrainOverlay />
      <CustomCursor />
      <ScrollProgress />
      <Navigation />
      <div id="main-content" className="pt-14 lg:pt-16">
        <PageTransition>{children}</PageTransition>
      </div>
      <Footer />
    </>
  )
}
