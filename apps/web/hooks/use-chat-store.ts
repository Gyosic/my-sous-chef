import { create } from "zustand";

interface ChatStore {
  isOpen: boolean;
  messages: unknown[];
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  setMessages: (messages: unknown[]) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  isOpen: false,
  messages: [],
  toggleChat: () => set((s) => ({ isOpen: !s.isOpen })),
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
  setMessages: (messages) => set({ messages }),
}));
