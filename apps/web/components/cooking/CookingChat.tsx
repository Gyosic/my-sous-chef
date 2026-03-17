"use client";

import { useRef, useEffect } from "react";
import type { ChatMessage } from "@/hooks/useCookingSocket";

interface CookingChatProps {
  messages: ChatMessage[];
  currentAiResponse: string;
}

export function CookingChat({ messages, currentAiResponse }: CookingChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, currentAiResponse]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 px-4 py-3">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-neutral-900 text-white"
                : "bg-muted text-foreground"
            }`}
          >
            {msg.content}
          </div>
        </div>
      ))}

      {/* Streaming AI response */}
      {currentAiResponse && (
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-2xl bg-muted px-4 py-2.5 text-sm leading-relaxed text-foreground">
            {currentAiResponse}
            <span className="inline-block w-1.5 h-4 ml-0.5 bg-neutral-400 animate-pulse" />
          </div>
        </div>
      )}

      {messages.length === 0 && !currentAiResponse && (
        <div className="flex h-full items-center justify-center">
          <p className="text-sm text-muted-foreground">
            음성으로 질문하거나 텍스트를 입력해주세요
          </p>
        </div>
      )}
    </div>
  );
}
