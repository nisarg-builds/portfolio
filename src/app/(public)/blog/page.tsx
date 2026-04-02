import type { Metadata } from 'next'
import { SITE_CONFIG } from '@/lib/constants'
import { BlogPageContent } from './blog-content'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts on software development, design, and creative coding.',
  openGraph: {
    title: 'Blog | Nisarg Chaudhary',
    description: 'Thoughts on software development, design, and creative coding.',
    url: `${SITE_CONFIG.url}/blog`,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Blog | Nisarg Chaudhary',
    description: 'Thoughts on software development, design, and creative coding.',
  },
  alternates: {
    canonical: `${SITE_CONFIG.url}/blog`,
  },
}

export default function BlogPage() {
  return <BlogPageContent />
}
