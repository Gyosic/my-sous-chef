"use client";

import { createContext, useContext } from "react";
import { useCookingSession } from "@/hooks/use-cooking-session";

type CookingSessionContextType = ReturnType<typeof useCookingSession>;

const CookingSessionContext = createContext<CookingSessionContextType | null>(
  null,
);

export function CookingSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useCookingSession();
  return (
    <CookingSessionContext.Provider value={session}>
      {children}
    </CookingSessionContext.Provider>
  );
}

export function useCookingSessionContext() {
  const ctx = useContext(CookingSessionContext);
  if (!ctx) {
    throw new Error(
      "useCookingSessionContext must be used within CookingSessionProvider",
    );
  }
  return ctx;
}
