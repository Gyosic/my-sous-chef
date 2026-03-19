"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ChefHat, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useChatStore } from "@/hooks/use-chat-store";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { Button } from "@repo/ui/components/button";

interface ChatWindowProps {
  variant?: "inline" | "floating";
  welcomeMessage?: string;
}

export function ChatWindow({ variant = "floating" }: ChatWindowProps) {
  const closeChat = useChatStore((s) => s.closeChat);
  const setMessages = useChatStore((s) => s.setMessages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [rateLimited, setRateLimited] = useState(false);

  const transport = new DefaultChatTransport({ api: "/api/chat" });

  const initialMessage = [
    {
      id: "welcome",
      role: "assistant" as const,
      parts: [
        {
          type: "text" as const,
          text: "안녕하세요! 무엇을 도와드릴까요?",
        },
      ],
    },
  ];
  const { messages, sendMessage, status, error } = useChat({
    transport,
    messages: initialMessage,
  });

  useEffect(() => {
    setMessages(messages);
  }, [messages, setMessages]);

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (
      error?.message?.includes("429") ||
      error?.message?.includes("Too many")
    ) {
      setRateLimited(true);
    }
  }, [error]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(
    (text: string) => {
      if (!text.trim() || isLoading || rateLimited) return;
      sendMessage({ text });
    },
    [isLoading, rateLimited, sendMessage],
  );

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground text-sm">
            <ChefHat className="size-4" />
          </div>
          <div>
            <p className="font-medium text-sm">나의 수쉐프</p>
            <p className="text-muted-foreground text-xs">
              요리 보조 하는중 입니다. 무엇이든 물어보세요.
            </p>
          </div>
        </div>
        {variant === "floating" && (
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={closeChat}
          >
            <X className="size-4" />
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-3">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {status === "submitted" && (
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                <ChefHat className="size-4" />
              </div>
              <div className="rounded-2xl bg-muted px-3 py-2">
                <div className="flex gap-1">
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <ChatInput isLoading={isLoading} onSend={handleSend} />
    </div>
  );
}
