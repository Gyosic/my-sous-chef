"use client";

import { createContext } from "react";

export const BaseurlContext = createContext<{ baseurl: string }>({ baseurl: "" });

export default function BaseurlProvider({
  baseurl,
  children,
}: {
  baseurl: string;
  children: React.ReactNode;
}) {
  return (
    <BaseurlContext.Provider value={{ baseurl }}>
      {children}
    </BaseurlContext.Provider>
  );
}
