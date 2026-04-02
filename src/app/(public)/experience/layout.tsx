import type { Metadata } from 'next'
import { SITE_CONFIG } from '@/lib/constants'

const title = 'Experience'
const description =
  'Work experience of Nisarg Chaudhary — Developer I at Vendasta, building AI automation and listing data infrastructure.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: `${SITE_CONFIG.url}/experience`,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title,
    description,
  },
  alternates: {
    canonical: `${SITE_CONFIG.url}/experience`,
  },
}

export default function ExperienceLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
