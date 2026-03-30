export const easings = {
  easeOut: [0.16, 1, 0.3, 1] as const,
  easeIn: [0.4, 0, 1, 1] as const,
  easeInOut: [0.65, 0, 0.35, 1] as const,
  spring: { type: 'spring' as const, stiffness: 300, damping: 24 },
  springBouncy: { type: 'spring' as const, stiffness: 400, damping: 17 },
  springGentle: { type: 'spring' as const, stiffness: 150, damping: 20 },
  snappy: [0.25, 0.46, 0.45, 0.94] as const,
}

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: easings.easeOut,
    },
  },
}

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

export const scrollFadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easings.easeOut,
    },
  },
}
