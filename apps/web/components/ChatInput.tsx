"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@repo/ui/components/button";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    const trimmed = value.trim();
    if (trimmed) {
      onSend(trimmed);
      setValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex shrink-0 items-center gap-2 border-t border-neutral-100 bg-white px-4 pb-6 pt-2.5">
      <div className="flex h-[42px] flex-1 items-center rounded-full bg-neutral-100 px-3.5">
        <input
          type="text"
          placeholder="요리 중 궁금한 점을 물어보세요..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>
      <Button
        size="icon"
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className="size-[42px] rounded-full"
      >
        <ArrowUp className="size-5" />
      </Button>
    </div>
  );
}
