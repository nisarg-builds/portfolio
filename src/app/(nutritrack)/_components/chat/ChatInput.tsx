'use client';

import { useState, useRef, useCallback, useEffect, type KeyboardEvent, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { VALID_IMAGE_TYPES } from '@/lib/nutritrack/constants/imageTypes';
import { ImagePreview } from './ImagePreview';

interface ChatInputProps {
  onSend: (text: string, imageFile?: File) => void;
  disabled?: boolean;
  offline?: boolean;
  autoFocus?: boolean;
}

export function ChatInput({ onSend, disabled, offline, autoFocus }: ChatInputProps) {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSend = !disabled && !offline && (text.trim().length > 0 || imageFile !== null);

  // Revoke blob URL on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const resetTextarea = useCallback(() => {
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, []);

  const handleSend = useCallback(() => {
    if (!canSend) return;
    onSend(text.trim(), imageFile ?? undefined);
    resetTextarea();
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
  }, [canSend, text, imageFile, imagePreview, onSend, resetTextarea]);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleTextChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
  }

  function handleImageSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      setImageError('Please use a JPEG, PNG, or WebP image.');
      e.target.value = '';
      return;
    }

    setImageError(null);
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    e.target.value = '';
  }

  function removeImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
  }

  return (
    <div className="shrink-0 px-3 pb-18 pt-1 lg:pb-2">
      {/* Offline inline warning */}
      {offline && (
        <p className="mb-1.5 text-center text-xs text-nt-danger">
          Offline — AI chat requires internet.
        </p>
      )}

      {/* Image type error */}
      <AnimatePresence>
        {imageError && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-1.5 text-xs text-nt-danger"
          >
            {imageError}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Image preview strip */}
      <AnimatePresence>
        {imagePreview && (
          <div className="mb-1.5">
            <ImagePreview src={imagePreview} onRemove={removeImage} />
          </div>
        )}
      </AnimatePresence>

      {/* Pill-shaped input bar */}
      <div className="flex items-end gap-1.5 rounded-full bg-nt-card px-1.5 py-1">
        {/* Camera / attach button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-nt-text-soft transition-colors hover:text-nt-text disabled:opacity-50"
          aria-label="Upload food image"
          data-cursor="interactive"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </motion.button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageSelect}
          className="hidden"
          aria-hidden="true"
        />

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Describe your food..."
          disabled={disabled}
          autoFocus={autoFocus}
          rows={1}
          className="max-h-24 min-h-[32px] flex-1 resize-none border-none bg-transparent py-1 text-sm text-nt-text shadow-none outline-none placeholder:text-nt-text-soft focus:border-none focus:outline-none focus:ring-0 disabled:opacity-50"
        />

        {/* Send button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          disabled={!canSend}
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors',
            canSend
              ? 'bg-nt-accent text-white'
              : 'text-nt-text-soft',
          )}
          aria-label="Send message"
          data-cursor="interactive"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
