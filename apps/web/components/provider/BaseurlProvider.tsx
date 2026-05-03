"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext } from "react";

export const BaseurlContext = createContext<{ baseurl: string }>({
  baseurl: "",
});

const queryClient = new QueryClient();

export default function BaseurlProvider({
  baseurl,
  children,
}: {
  baseurl: string;
  children: React.ReactNode;
}) {
  return (
    <BaseurlContext.Provider value={{ baseurl }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </BaseurlContext.Provider>
  );
}
