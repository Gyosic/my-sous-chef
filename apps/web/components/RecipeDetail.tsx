"use client";

import { useState } from "react";
import { Timer, ChefHat, Bookmark, X } from "lucide-react";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { TopBar } from "@/components/TopBar";
import { RecipeSummaryCard } from "@/components/RecipeSummaryCard";
import { ChatBubble } from "@/components/ChatBubble";
import { ChatInput } from "@/components/ChatInput";

interface Ingredient {
  name: string;
  amount: string;
  optional?: boolean;
}

interface Step {
  title: string;
  description: string;
}

export interface RecipeDetailProps {
  name: string;
  description: string;
  time: string;
  difficulty: string;
  matchRate: number;
  ingredients: Ingredient[];
  steps: Step[];
}

interface Message {
  id: string;
  type: "ai" | "user";
  content: React.ReactNode;
}

function getDifficultyStyle(difficulty: string) {
  switch (difficulty) {
    case "쉽게":
      return "bg-green-50 text-green-500";
    case "보통":
      return "bg-yellow-50 text-yellow-500";
    case "어려움":
      return "bg-red-50 text-red-500";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function RecipeDetail({
  name,
  description,
  time,
  difficulty,
  matchRate,
  ingredients,
  steps,
}: RecipeDetailProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const openChat = () => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "1",
          type: "ai",
          content: (
            <div className="flex flex-col gap-2.5">
              <p>{name} 레시피를 안내해드릴게요! 😊</p>
              {steps.map((step, i) => (
                <div
                  key={step.title}
                  className="flex flex-col gap-1.5 rounded-[10px] bg-white p-2.5"
                >
                  <div className="flex items-center gap-1">
                    <span className="flex size-5 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">
                      {i + 1}
                    </span>
                    <span className="text-[13px] font-semibold text-foreground">
                      {step.title}
                    </span>
                  </div>
                  <p className="text-[13px] leading-[1.45] text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          ),
        },
      ]);
    }
    setChatOpen(true);
  };

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
    <div className="relative flex h-svh flex-col bg-white">
      {/* Top Bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-100 px-4">
        <TopBar title="레시피 상세" />
        <Button variant="ghost" size="icon-sm" aria-label="북마크">
          <Bookmark className="size-[22px] text-foreground" />
        </Button>
      </header>

      {/* Scroll Content */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex flex-col gap-6">
          {/* Hero Info */}
          <div className="flex flex-col gap-3">
            <h1 className="text-[22px] font-bold text-foreground">{name}</h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className="h-7 gap-1 rounded-full px-2.5"
              >
                <Timer className="size-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  {time}
                </span>
              </Badge>
              <Badge
                className={`h-7 rounded-full px-2.5 text-xs font-medium ${getDifficultyStyle(difficulty)}`}
              >
                {difficulty}
              </Badge>
              <Badge className="h-7 rounded-full bg-foreground px-2.5 text-xs font-semibold text-background">
                재료 {matchRate}%
              </Badge>
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-foreground">재료</h2>
            <div className="overflow-hidden rounded-[14px] bg-muted/50 py-1">
              {ingredients.map((ing) => (
                <div
                  key={ing.name}
                  className="flex items-center justify-between px-4 py-2.5"
                >
                  <span
                    className={`text-sm font-medium ${ing.optional ? "text-muted-foreground" : "text-foreground"}`}
                  >
                    {ing.name}
                  </span>
                  <span className="text-[13px] text-muted-foreground">
                    {ing.amount}
                    {ing.optional && " (선택)"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Steps Section */}
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-foreground">요리 순서</h2>
            <div className="flex flex-col gap-3">
              {steps.map((step, index) => (
                <div key={step.title} className="flex gap-3">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-xl bg-foreground">
                    <span className="text-xs font-semibold text-background">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-foreground">
                      {step.title}
                    </span>
                    <p className="text-[13px] leading-[1.45] text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="shrink-0 border-t border-neutral-100 bg-white px-5 pb-7 pt-3">
        <Button
          size="lg"
          onClick={openChat}
          className="h-[50px] w-full gap-2 rounded-xl text-[15px] font-semibold"
        >
          <ChefHat className="size-5" />
          요리 시작하기
        </Button>
      </div>

      {/* Chat Panel (slide up) */}
      <div
        className={`absolute inset-0 z-50 flex flex-col bg-white transition-transform duration-300 ease-out ${
          chatOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Chat Top Bar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-100 px-4">
          <span className="text-base font-semibold text-foreground">
            AI 요리 도우미
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setChatOpen(false)}
            aria-label="닫기"
          >
            <X className="size-5 text-foreground" />
          </Button>
        </header>

        {/* Recipe Summary */}
        <RecipeSummaryCard
          name={name}
          meta={`${time} · ${difficulty} · 재료 ${matchRate}% 매칭`}
        />

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col gap-4">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} type={msg.type}>
                {msg.content}
              </ChatBubble>
            ))}
          </div>
        </div>

        {/* Chat Input */}
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
