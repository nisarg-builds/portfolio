'use client';

import { useCallback } from 'react';
import { useNutriStore } from './useNutriStore';
import { fileToBase64 } from '../services/ai';
import type { ChatMessage } from '../models/chat';

/**
 * Hook for managing the NutriTrack chat interface.
 * Handles message creation, image conversion, and AI analysis.
 */
export function useChat() {
  const messages = useNutriStore((s) => s.chatMessages);
  const isLoading = useNutriStore((s) => s.isChatLoading);
  const addChatMessage = useNutriStore((s) => s.addChatMessage);
  const analyzeFood = useNutriStore((s) => s.analyzeFood);

  const sendMessage = useCallback(
    async (text: string, imageFile?: File) => {
      let imageBase64: string | undefined;
      let imageMediaType: 'image/jpeg' | 'image/png' | 'image/webp' | undefined;
      let imageDataUrl: string | undefined;

      // Convert image if provided
      if (imageFile) {
        const result = await fileToBase64(imageFile);
        imageBase64 = result.base64;
        imageMediaType = result.mediaType;
        imageDataUrl = `data:${imageFile.type};base64,${result.base64}`;
      }

      // Add user message to chat
      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}-user`,
        role: 'user',
        text,
        timestamp: new Date(),
        imageDataUrl,
        imageFile,
      };
      addChatMessage(userMessage);

      // Call store action (adds loading → response/error messages)
      await analyzeFood(text || undefined, imageBase64, imageMediaType);
    },
    [addChatMessage, analyzeFood],
  );

  return { messages, sendMessage, isLoading };
}
