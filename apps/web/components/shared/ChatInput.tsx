"use client";

import { Button } from "@repo/ui/components/button";
import { SendHorizonal } from "lucide-react";
import { type KeyboardEvent, useState } from "react";

interface ChatInputProps {
  isLoading: boolean;
  onSend: (text: string) => void;
  placeholder?: string;
}

export function ChatInput({ isLoading, onSend, placeholder }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex items-end gap-2 border-t p-3">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        className="flex-1 resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
        disabled={isLoading}
      />
      <Button
        type="button"
        size="icon"
        className="size-9 shrink-0 rounded-lg"
        disabled={!input.trim() || isLoading}
        onClick={handleSubmit}
      >
        <SendHorizonal className="size-4" />
      </Button>
    </div>
  );
}
