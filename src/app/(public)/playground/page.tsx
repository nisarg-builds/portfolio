import type { Metadata } from 'next'
import { SITE_CONFIG } from '@/lib/constants'
import { PlaygroundPageContent } from './playground-content'

export const metadata: Metadata = {
  title: 'Playground',
  description: 'Interactive experiments, generative art, and creative coding demos.',
  openGraph: {
    title: 'Playground | Nisarg Chaudhary',
    description: 'Interactive experiments, generative art, and creative coding demos.',
    url: `${SITE_CONFIG.url}/playground`,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Playground | Nisarg Chaudhary',
    description: 'Interactive experiments, generative art, and creative coding demos.',
  },
  alternates: {
    canonical: `${SITE_CONFIG.url}/playground`,
  },
}

export default function PlaygroundPage() {
  return <PlaygroundPageContent />
}
