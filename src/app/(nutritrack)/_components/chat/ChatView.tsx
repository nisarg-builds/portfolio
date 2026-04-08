'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { useNutriStore } from '@/lib/nutritrack/hooks/useNutriStore';
import { useChat } from '@/lib/nutritrack/hooks/useChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

function subscribeOnline(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getOnlineSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true;
}

export function ChatView() {
  const todayEntries = useNutriStore((s) => s.todayEntries);
  const targets = useNutriStore((s) => s.targets);
  const { messages, sendMessage, isLoading } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isOnline = useSyncExternalStore(subscribeOnline, getOnlineSnapshot, getServerSnapshot);

  const consumed = todayEntries.reduce((sum, e) => sum + e.nutrition.calories, 0);
  const proteinG = Math.round(todayEntries.reduce((sum, e) => sum + e.nutrition.proteinG, 0));
  const carbsG = Math.round(todayEntries.reduce((sum, e) => sum + e.nutrition.carbsG, 0));
  const fatG = Math.round(todayEntries.reduce((sum, e) => sum + e.nutrition.fatG, 0));
  const target = targets?.dailyCalorieTarget ?? 2000;

  // Auto-scroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages.length]);

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col">
      {/* Compact summary bar */}
      <div className="flex items-center justify-between border-b border-nt-border px-1 py-2.5">
        <p className="text-sm font-medium text-nt-text">
          {consumed}{' '}
          <span className="text-nt-text-soft">/ {target} kcal</span>
        </p>
        <div className="flex gap-3 text-xs text-nt-text-soft">
          <span>
            P <span className="font-medium text-nt-protein">{proteinG}g</span>
          </span>
          <span>
            C <span className="font-medium text-nt-carbs">{carbsG}g</span>
          </span>
          <span>
            F <span className="font-medium text-nt-fat">{fatG}g</span>
          </span>
        </div>
      </div>

      {/* Message area */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-1 py-4">
        {messages.length === 0 ? (
          <WelcomeMessage />
        ) : (
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={sendMessage} disabled={isLoading} offline={!isOnline} />
    </div>
  );
}

function WelcomeMessage() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 pt-12 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-nt-accent text-sm font-bold text-white">
        NB
      </div>
      <p className="text-sm font-medium text-nt-text">
        Hey! I&apos;m NutriBot
      </p>
      <p className="max-w-[280px] text-xs text-nt-text-soft">
        Tell me what you ate or snap a photo of your meal — I&apos;ll break
        down the calories, macros, and micronutrients for you.
      </p>
    </div>
  );
}
