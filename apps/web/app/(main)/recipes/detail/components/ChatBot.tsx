"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useChatStore } from "@/hooks/use-chat-store";
import { Button } from "@repo/ui/components/button";
import { cn } from "@/lib/utils";
import { ChatWindow } from "@/app/(main)/recipes/detail/components/ChatWindow";

interface ChatBotProps {
  isAbsolute?: boolean;
  className?: string;
}
export function ChatBot({ isAbsolute = true, className }: ChatBotProps) {
  const { isOpen, toggleChat } = useChatStore();

  return (
    <>
      {/* Chat Window */}
      <motion.div
        initial={false}
        animate={
          isOpen
            ? { opacity: 1, scale: 1, y: 0, pointerEvents: "auto" as const }
            : { opacity: 0, scale: 0.9, y: 20, pointerEvents: "none" as const }
        }
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={cn(
          "absolute right-4 bottom-20 z-500 h-125 w-95 max-sm:right-2 max-sm:bottom-20 max-sm:h-[70dvh] max-sm:w-[calc(100vw-1rem)]",
        )}
      >
        <ChatWindow />
      </motion.div>
      {/* Floating Button */}
      <motion.div
        className={cn(
          isAbsolute
            ? "absolute right-4 bottom-4 z-50 max-sm:right-2 max-sm:bottom-2"
            : "",
          className,
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={toggleChat}
          size="icon"
          className="size-12 rounded-full shadow-lg"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="size-5" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <MessageCircle className="size-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>
    </>
  );
}
