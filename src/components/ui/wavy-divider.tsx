'use client'

import { motion } from 'framer-motion'

interface WavyDividerProps {
  className?: string
  width?: number
}

export function WavyDivider({ className, width = 200 }: WavyDividerProps) {
  return (
    <svg
      width="100%"
      height="12"
      viewBox="0 0 287 15"
      fill="none"
      preserveAspectRatio="none"
      className={`mt-2 ${className ?? ''}`}
      style={{ maxWidth: `${width}px` }}
    >
      <motion.path
        d="M2 6.5C2 6.5 4.6 13 11.8 13C19 13 25.5 2 33.3 2C41 2 46.9 13 55.9 13C65 13 67.6 2 76.8 2C86 2 90.2 13 100.1 13C110 13 111.8 2 120.9 2C130 2 134.9 13 144.2 13C153.5 13 156.6 2 165.1 2C173.5 2 177.2 13 188.3 13C199.5 13 199.9 2 209.2 2C218.5 2 223 13 232.5 13C242 13 244 2 253.3 2C262.6 2 269 13 274.5 13C280 13 285 8.5 285 7.5"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{
          pathLength: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.3 },
        }}
      />
    </svg>
  )
}
