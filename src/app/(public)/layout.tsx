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
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-full focus:border-2 focus:border-ink focus:bg-lime focus:px-4 focus:py-2 focus:font-display focus:font-bold focus:text-ink"
      >
        Skip to content
      </a>
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
