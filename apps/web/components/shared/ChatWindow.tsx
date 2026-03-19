"use client";

import { ChefHat, X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { Button } from "@repo/ui/components/button";
import { useChatStore } from "@/hooks/use-chat-store";
import { useCookingSessionContext } from "@/components/provider/CookingSessionProvider";
import { VoiceControl } from "@/components/cooking/VoiceControl";
import { ChatInput } from "./ChatInput";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatWindowProps {
  variant?: "inline" | "floating";
}

export function ChatWindow({ variant = "floating" }: ChatWindowProps) {
  const closeChat = useChatStore((s) => s.closeChat);
  const bottomRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    currentAiResponse,
    sendText,
    sessionId,
    isPlaying,
    isListening,
    isRecording,
    volumeLevel,
    recorderError,
    toggleListening,
  } = useCookingSessionContext();

  const isLoading = !!currentAiResponse;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentAiResponse]);

  const handleSend = useCallback(
    (text: string) => {
      if (!text.trim() || !sessionId) return;
      sendText(text);
    },
    [sessionId, sendText],
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
          {messages.map((msg, i) => (
            <MessageBubble key={i} role={msg.role} content={msg.content} />
          ))}
          {currentAiResponse && (
            <MessageBubble role="assistant" content={currentAiResponse} />
          )}
          {!sessionId && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center text-sm text-muted-foreground">
              <ChefHat className="mb-2 size-8 text-muted-foreground/50" />
              <p>연결 중...</p>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Voice Control */}
      {sessionId && (
        <div className="border-t px-4 py-3">
          <VoiceControl
            isListening={isListening}
            isRecording={isRecording}
            isAiSpeaking={isPlaying}
            volumeLevel={volumeLevel}
            error={recorderError}
            onToggleListening={toggleListening}
          />
        </div>
      )}

      {/* Text Input */}
      <ChatInput
        isLoading={isLoading}
        onSend={handleSend}
        placeholder={
          sessionId ? "텍스트로 질문하기..." : "세션 연결 대기중..."
        }
      />
    </div>
  );
}

function MessageBubble({
  role,
  content,
}: {
  role: "user" | "assistant";
  content: string;
}) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex w-full gap-2 items-center",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      {!isUser && (
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
          <ChefHat className="size-3.5" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-3 py-2 text-sm",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground",
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none [&_p]:mb-1 [&_p]:last:mb-0">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
