'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { useNutriStore } from '@/lib/nutritrack/hooks/useNutriStore';
import { useTodayMacros } from '@/lib/nutritrack/hooks/useTodayMacros';
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
  const targets = useNutriStore((s) => s.targets);
  const { consumed, proteinG, carbsG, fatG } = useTodayMacros();
  const { messages, sendMessage, isLoading } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isOnline = useSyncExternalStore(subscribeOnline, getOnlineSnapshot, getServerSnapshot);

  const target = targets?.dailyCalorieTarget ?? 2000;

  // Auto-scroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages.length]);

  return (
    <div className="flex h-full flex-col">
      {/* Compact summary bar */}
      <div className="flex shrink-0 items-center justify-between px-3 py-2">
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

      {/* Offline banner */}
      {!isOnline && (
        <div className="shrink-0 bg-nt-danger-light px-3 py-2 text-center text-xs font-medium text-nt-danger">
          You&apos;re offline — AI features unavailable
        </div>
      )}

      {/* Message area */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <WelcomeMessage />
          ) : (
            messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
          )}
        </div>
      </div>

      {/* Input — flush to bottom */}
      <ChatInput onSend={sendMessage} disabled={isLoading} offline={!isOnline} autoFocus />
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
