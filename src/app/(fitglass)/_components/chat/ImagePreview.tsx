'use client';

import { motion } from 'framer-motion';

interface ImagePreviewProps {
  src: string;
  onRemove: () => void;
}

export function ImagePreview({ src, onRemove }: ImagePreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.15 }}
      className="relative inline-block"
    >
      <img
        src={src}
        alt="Food to analyze"
        className="h-16 w-16 rounded-lg object-cover"
      />
      <button
        onClick={onRemove}
        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-fg-text text-[10px] text-white"
        aria-label="Remove image"
        data-cursor="interactive"
      >
        ×
      </button>
    </motion.div>
  );
}
