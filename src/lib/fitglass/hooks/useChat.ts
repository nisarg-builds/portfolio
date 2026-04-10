'use client';

import { useCallback } from 'react';
import { useFitGlassStore } from './useFitGlassStore';
import { fileToBase64 } from '../services/ai';
import { VALID_IMAGE_TYPES } from '../constants/imageTypes';
import type { ChatMessage } from '../models/chat';

const MAX_TEXT_LENGTH = 1000;

/**
 * Hook for managing the FitGlass chat interface.
 * Handles message creation, image conversion, and AI analysis.
 */
export function useChat() {
  const messages = useFitGlassStore((s) => s.chatMessages);
  const isLoading = useFitGlassStore((s) => s.isChatLoading);
  const addChatMessage = useFitGlassStore((s) => s.addChatMessage);
  const analyzeFood = useFitGlassStore((s) => s.analyzeFood);

  const sendMessage = useCallback(
    async (text: string, imageFile?: File) => {
      let imageBase64: string | undefined;
      let imageMediaType: 'image/jpeg' | 'image/png' | 'image/webp' | undefined;
      let imageDataUrl: string | undefined;

      // Validate image type — show inline error if invalid
      if (imageFile && !VALID_IMAGE_TYPES.includes(imageFile.type)) {
        addChatMessage({
          id: `msg-${Date.now()}-error`,
          role: 'assistant',
          text: 'Please upload a JPEG, PNG, or WebP image.',
          timestamp: new Date(),
          isError: true,
        });
        return;
      }

      // Convert image if provided (auto-resizes if >5MB)
      if (imageFile) {
        try {
          const result = await fileToBase64(imageFile);
          imageBase64 = result.base64;
          imageMediaType = result.mediaType;
          imageDataUrl = `data:${imageFile.type};base64,${result.base64}`;
        } catch (err) {
          addChatMessage({
            id: `msg-${Date.now()}-error`,
            role: 'assistant',
            text: err instanceof Error ? err.message : 'Failed to process image.',
            timestamp: new Date(),
            isError: true,
          });
          return;
        }
      }

      // Truncate text >1000 chars with warning
      let trimmedText = text;
      let wasTrimmed = false;
      if (text.length > MAX_TEXT_LENGTH) {
        trimmedText = text.slice(0, MAX_TEXT_LENGTH);
        wasTrimmed = true;
      }

      // Add user message to chat
      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}-user`,
        role: 'user',
        text: trimmedText,
        timestamp: new Date(),
        imageDataUrl,
        imageFile,
      };
      addChatMessage(userMessage);

      if (wasTrimmed) {
        addChatMessage({
          id: `msg-${Date.now()}-trim-warn`,
          role: 'assistant',
          text: 'Your message was trimmed to 1000 characters.',
          timestamp: new Date(),
        });
      }

      // Call store action (adds loading → response/error messages)
      await analyzeFood(trimmedText || undefined, imageBase64, imageMediaType);

      // After successful analysis, hint about profile if not set up
      const { chatMessages, profile: currentProfile } = useFitGlassStore.getState();
      const lastMsg = chatMessages[chatMessages.length - 1];
      if (lastMsg && !lastMsg.isError && !lastMsg.isLoading && !currentProfile) {
        addChatMessage({
          id: `msg-${Date.now()}-profile-hint`,
          role: 'assistant',
          text: 'Set up your profile to get personalized calorie targets.',
          timestamp: new Date(),
        });
      }
    },
    [addChatMessage, analyzeFood],
  );

  return { messages, sendMessage, isLoading };
}
