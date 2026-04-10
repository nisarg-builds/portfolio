'use client';

import { getFirebaseAuth } from './firebase-client';
import type { AnalyzeFoodResponse, UserContext } from '../models/chat';

/**
 * Call the FitGlass API route to analyze food.
 * Sends the Firebase ID token for authentication.
 */
export async function analyzeFood(
  text?: string,
  imageBase64?: string,
  imageMediaType?: 'image/jpeg' | 'image/png' | 'image/webp',
  userContext?: UserContext,
): Promise<AnalyzeFoodResponse> {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Please sign in to use the AI food analyzer.');
  }

  const idToken = await user.getIdToken();

  const response = await fetch('/api/fitglass/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ text, imageBase64, imageMediaType, userContext }),
  });

  const data: AnalyzeFoodResponse = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Please sign in to use the AI food analyzer.');
    }
    if (response.status === 429) {
      throw new Error("You've reached the hourly limit. Please try again later.");
    }
    throw new Error(data.error || 'Something went wrong. Please try again.');
  }

  return data;
}

/**
 * Convert a File object to base64 string (without data URL prefix).
 * Auto-resizes if over maxSizeBytes.
 */
export async function fileToBase64(
  file: File,
  maxSizeBytes = 5_000_000,
): Promise<{
  base64: string;
  mediaType: 'image/jpeg' | 'image/png' | 'image/webp';
}> {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'] as const;
  if (!validTypes.includes(file.type as (typeof validTypes)[number])) {
    throw new Error('Please upload a JPEG, PNG, or WebP image.');
  }

  let processedFile = file;
  if (file.size > maxSizeBytes) {
    processedFile = await resizeImage(file);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1];
      resolve({
        base64,
        mediaType: file.type as (typeof validTypes)[number],
      });
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(processedFile);
  });
}

/**
 * Resize an image by reducing dimensions and quality.
 */
async function resizeImage(file: File): Promise<File> {
  const img = new Image();
  const url = URL.createObjectURL(file);

  return new Promise((resolve, reject) => {
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      const maxDim = 1920;
      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Failed to resize image'));
          resolve(new File([blob], file.name, { type: 'image/jpeg' }));
        },
        'image/jpeg',
        0.7,
      );
    };
    img.onerror = () => reject(new Error('Failed to load image for resizing'));
    img.src = url;
  });
}
