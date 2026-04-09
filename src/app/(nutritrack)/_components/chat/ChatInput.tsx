'use client';

import { useState, useRef, useCallback, type KeyboardEvent, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ImagePreview } from './ImagePreview';

const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

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
    setImageFile(null);
    setImagePreview(null);
  }, [canSend, text, imageFile, onSend, resetTextarea]);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleTextChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
    // Auto-expand textarea
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`; // max ~4 rows
  }

  function handleImageSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image type
    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      setImageError('Please use a JPEG, PNG, or WebP image.');
      e.target.value = '';
      return;
    }

    setImageError(null);
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);

    // Reset file input so the same file can be re-selected
    e.target.value = '';
  }

  function removeImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
  }

  return (
    <div className="border-t border-nt-border bg-nt-bg px-3 pb-3 pt-2">
      {/* Offline banner */}
      {offline && (
        <p className="mb-2 text-center text-xs text-nt-danger">
          You&apos;re offline. AI chat requires internet.
        </p>
      )}

      {/* Image type error */}
      <AnimatePresence>
        {imageError && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-2 text-xs text-nt-danger"
          >
            {imageError}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Image preview strip */}
      <AnimatePresence>
        {imagePreview && (
          <div className="mb-2">
            <ImagePreview src={imagePreview} onRemove={removeImage} />
          </div>
        )}
      </AnimatePresence>

      <div className="flex items-end gap-2">
        {/* Image upload button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-nt-border bg-nt-card text-nt-text-soft transition-colors hover:bg-gray-50 disabled:opacity-50"
          aria-label="Upload food image"
          data-cursor="interactive"
        >
          <CameraIcon />
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
          className="max-h-24 min-h-[40px] flex-1 resize-none rounded-lg border border-nt-border bg-nt-card px-3 py-2 text-sm text-nt-text placeholder:text-nt-text-soft focus:border-nt-accent focus:outline-none disabled:opacity-50"
        />

        {/* Send button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          disabled={!canSend}
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors',
            canSend
              ? 'bg-nt-accent text-white'
              : 'bg-nt-border text-nt-text-soft',
          )}
          aria-label="Send message"
          data-cursor="interactive"
        >
          <SendIcon />
        </motion.button>
      </div>
    </div>
  );
}

function CameraIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}
