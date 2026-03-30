'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Tag } from '@/components/ui/tag'

interface ProjectCardProps {
  title: string
  slug: string
  description: string
  image: string
  tags: string[]
  featured?: boolean
  className?: string
}

export function ProjectCard({
  title,
  slug,
  description,
  image,
  tags,
  featured,
  className,
}: ProjectCardProps) {
  return (
    <Link href={`/projects/${slug}`} className={cn('block', featured && 'md:col-span-2', className)}>
      <motion.article
        className="group h-full overflow-hidden rounded-lg border border-border bg-bg-surface transition-[border-color,box-shadow] duration-300 hover:border-border-hover hover:shadow-card"
        whileHover={{
          scale: 1.02,
          transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
        }}
        data-cursor="interactive"
      >
        <div className="overflow-hidden rounded-t-lg">
          <Image
            src={image}
            alt={title}
            width={featured ? 1200 : 600}
            height={featured ? 675 : 338}
            className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-5">
          <h3 className="text-text-primary text-lg font-medium font-display mb-2">
            {title}
          </h3>
          <p
            className={cn(
              'text-text-secondary text-sm mb-4',
              !featured && 'line-clamp-2',
            )}
          >
            {description}
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </div>
      </motion.article>
    </Link>
  )
}
