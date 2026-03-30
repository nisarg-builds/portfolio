import type { Metadata } from 'next'
import { PlaygroundPageContent } from './playground-content'

export const metadata: Metadata = {
  title: 'Playground',
  description:
    'Interactive experiments, generative art, and creative coding demos.',
}

export default function PlaygroundPage() {
  return <PlaygroundPageContent />
}
