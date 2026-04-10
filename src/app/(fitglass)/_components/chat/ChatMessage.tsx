'use client';

import { motion } from 'framer-motion';
import type { ChatMessage as ChatMessageType } from '@/lib/fitglass/models/chat';
import { useFitGlassStore } from '@/lib/fitglass/hooks/useFitGlassStore';
import { cn } from '@/lib/utils';
import { FoodCard } from './FoodCard';
import { LoadingDots } from './LoadingDots';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn('flex', isUser ? 'justify-end' : 'justify-start')}
    >
      {isUser ? (
        <UserBubble message={message} />
      ) : (
        <AssistantBubble message={message} />
      )}
    </motion.div>
  );
}

function UserBubble({ message }: ChatMessageProps) {
  const user = useFitGlassStore((s) => s.user);
  const initial = user?.displayName?.charAt(0)?.toUpperCase() ?? 'U';

  return (
    <div className="flex max-w-[80%] items-end gap-2">
      <div className="flex flex-col items-end gap-1">
        {message.imageDataUrl && (
          <img
            src={message.imageDataUrl}
            alt="Uploaded food"
            className="max-h-40 rounded-xl object-cover"
          />
        )}
        {message.text && (
          <div className="rounded-[14px] rounded-br-[4px] bg-fg-chat-user px-3.5 py-2.5">
            <p className="text-sm text-fg-text">{message.text}</p>
          </div>
        )}
      </div>
      {/* User avatar */}
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-fg-accent bg-fg-surface text-[10px] font-bold text-fg-text">
        {initial}
      </div>
    </div>
  );
}

function AssistantBubble({ message }: ChatMessageProps) {
  return (
    <div className="flex max-w-[85%] items-end gap-2">
      {/* Avatar — aligned to bottom */}
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-fg-accent text-[10px] font-bold text-white">
        NB
      </div>

      <div className="flex flex-col gap-1.5">
        {message.isLoading ? (
          <div className="rounded-[14px] rounded-bl-[4px] border border-fg-border bg-fg-chat-ai px-3.5 py-2.5">
            <LoadingDots />
          </div>
        ) : (
          <>
            <div className="rounded-[14px] rounded-bl-[4px] border border-fg-border bg-fg-chat-ai px-3.5 py-2.5">
              <p
                className={cn('text-sm', message.isError ? 'text-fg-danger' : 'text-fg-text')}
              >
                {message.text}
              </p>
            </div>

            {message.foods && message.foods.length > 0 && (
              <div className="flex flex-col gap-2 pt-1">
                {message.foods.map((food, i) => (
                  <FoodCard key={`${message.id}-food-${i}`} food={food} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
