'use client';

import { motion } from 'framer-motion';
import type { ChatMessage as ChatMessageType } from '@/lib/nutritrack/models/chat';
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
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {isUser ? (
        <UserBubble message={message} />
      ) : (
        <AssistantBubble message={message} />
      )}
    </motion.div>
  );
}

function UserBubble({ message }: { message: ChatMessageType }) {
  return (
    <div className="flex max-w-[80%] flex-col items-end gap-1">
      {message.imageDataUrl && (
        <img
          src={message.imageDataUrl}
          alt="Uploaded food"
          className="max-h-40 rounded-xl object-cover"
        />
      )}
      {message.text && (
        <div className="rounded-[14px] rounded-br-[4px] bg-nt-chat-user px-3.5 py-2.5">
          <p className="text-sm text-nt-text">{message.text}</p>
        </div>
      )}
    </div>
  );
}

function AssistantBubble({ message }: { message: ChatMessageType }) {
  return (
    <div className="flex max-w-[85%] gap-2">
      {/* Avatar */}
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-nt-accent text-[10px] font-bold text-white">
        NB
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-medium text-nt-text-soft">
          NutriBot
        </span>

        {message.isLoading ? (
          <div className="rounded-[14px] rounded-bl-[4px] bg-nt-chat-ai px-3.5 py-2.5">
            <LoadingDots />
          </div>
        ) : (
          <>
            <div className="rounded-[14px] rounded-bl-[4px] bg-nt-chat-ai px-3.5 py-2.5">
              <p
                className={`text-sm ${message.isError ? 'text-nt-danger' : 'text-nt-text'}`}
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
