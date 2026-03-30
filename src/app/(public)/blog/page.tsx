import type { Metadata } from 'next'
import { BlogPageContent } from './blog-content'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts on software development, design, and creative coding.',
}

export default function BlogPage() {
  return <BlogPageContent />
}
