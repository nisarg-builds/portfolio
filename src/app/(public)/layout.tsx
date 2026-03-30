import { GrainOverlay } from '@/components/layout/grain-overlay'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { CustomCursor } from '@/components/layout/custom-cursor'
import { ScrollProgress } from '@/components/layout/scroll-progress'

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <GrainOverlay />
      <CustomCursor />
      <ScrollProgress />
      <Navigation />
      <div className="pt-14 lg:pt-16">{children}</div>
      <Footer />
    </>
  )
}
