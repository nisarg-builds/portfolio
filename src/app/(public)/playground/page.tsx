import type { Metadata } from 'next'
import { DynamicHeading } from '@/components/ui/dynamic-heading'

export const metadata: Metadata = {
  title: 'Playground',
  description:
    'Interactive experiments, generative art, and creative coding demos.',
}

const experiments = [
  {
    title: 'Generative Art',
    description: 'Procedural patterns and creative coding with p5.js',
    emoji: '🎨',
    status: 'coming-soon' as const,
  },
  {
    title: 'Pathfinding Visualizer',
    description:
      'Interactive visualization of A*, BFS, and Dijkstra algorithms',
    emoji: '🔍',
    status: 'coming-soon' as const,
    link: 'https://github.com/nisarg-11-here/Pathfinding_Visualizer',
  },
]

export default function PlaygroundPage() {
  return (
    <main className="min-h-dvh px-5 pb-16 pt-24 sm:px-6 lg:px-8 lg:pt-32">
      <div className="mx-auto max-w-[1120px]">
        <DynamicHeading
          text="Playground"
          as="h1"
          className="font-(family-name:--font-display) text-3xl font-bold text-text-primary"
        />
        <svg
          width="100%"
          height="12"
          viewBox="0 0 287 15"
          fill="none"
          preserveAspectRatio="none"
          className="mt-2 max-w-[140px]"
        >
          <path
            d="M2 6.5C2 6.5 4.6 13 11.8 13C19 13 25.5 2 33.3 2C41 2 46.9 13 55.9 13C65 13 67.6 2 76.8 2C86 2 90.2 13 100.1 13C110 13 111.8 2 120.9 2C130 2 134.9 13 144.2 13C153.5 13 156.6 2 165.1 2C173.5 2 177.2 13 188.3 13C199.5 13 199.9 2 209.2 2C218.5 2 223 13 232.5 13C242 13 244 2 253.3 2C262.6 2 269 13 274.5 13C280 13 285 8.5 285 7.5"
            stroke="var(--color-accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <p className="mt-4 text-base text-text-secondary">
          Interactive experiments and creative coding.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {experiments.map((exp) => (
            <div
              key={exp.title}
              className="rounded-lg border border-border bg-bg-surface p-6 transition-[border-color] duration-300 hover:border-border-hover"
            >
              <span className="text-3xl">{exp.emoji}</span>
              <h3 className="mt-3 font-(family-name:--font-display) text-xl font-medium text-text-primary">
                {exp.title}
              </h3>
              <p className="mt-2 text-sm text-text-secondary">
                {exp.description}
              </p>
              <div className="mt-4">
                {exp.link ? (
                  <a
                    href={exp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-accent px-3 py-1.5 text-sm text-accent transition-all duration-200 hover:bg-accent hover:text-bg"
                    data-cursor="interactive"
                  >
                    View Project
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        d="M3.5 10.5L10.5 3.5M10.5 3.5H5M10.5 3.5V9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                ) : (
                  <span className="font-(family-name:--font-mono) text-xs text-text-tertiary italic">
                    Coming soon
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-text-tertiary italic">
          More experiments coming soon...
        </p>
      </div>
    </main>
  )
}
