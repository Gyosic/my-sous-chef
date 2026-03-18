"use client";

import { useEffect, useRef, useState } from "react";
import { ChatBubble } from "@/components/ChatBubble";
import { ChatInput } from "@/components/ChatInput";
import { useRecipeStore } from "@/lib/store/recipes";

interface Message {
  id: string;
  type: "ai" | "user";
  content: React.ReactNode;
}

export function ChatContent() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { currentRecipe } = useRecipeStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: (
        <div className="flex flex-col gap-2.5">
          <p>{currentRecipe?.name} 레시피를 안내해드릴게요! 😊</p>
          <div className="flex flex-col gap-1.5 rounded-[10px] bg-white p-2.5">
            <div className="flex items-center gap-1">
              <span className="flex size-5 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">
                1
              </span>
              <span className="text-[13px] font-semibold text-foreground">
                재료 준비
              </span>
            </div>
            <p className="text-[13px] leading-[1.45] text-muted-foreground">
              {currentRecipe?.steps[0]}
            </p>
          </div>
        </div>
      ),
    },
  ]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      type: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);

    // TODO: API 연동 - AI 응답 받아오기
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "잠시만 기다려주세요, 답변을 준비하고 있어요...",
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 500);
  };

  return (
    <>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-4">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} type={msg.type}>
              {msg.content}
            </ChatBubble>
          ))}
        </div>
      </div>
      <ChatInput onSend={handleSend} />
    </>
  );
}
