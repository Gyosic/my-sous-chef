"use client";

import { ChefHat } from "lucide-react";

interface RecipeLoadingProps {
  children: React.ReactNode;
}

export function Loading({ children }: RecipeLoadingProps) {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-muted/90 z-100 flex flex-1 flex-col items-center justify-center gap-5">
      <div className="flex size-18 items-center justify-center rounded-full bg-muted/50">
        <ChefHat className="size-8 text-foreground" />
      </div>
      {children}
      <div className="flex items-center gap-2">
        <span className="size-2 animate-dot-blink rounded-full bg-foreground" />
        <span className="size-2 animate-dot-blink rounded-full bg-foreground [animation-delay:0.4s]" />
        <span className="size-2 animate-dot-blink rounded-full bg-foreground [animation-delay:0.8s]" />
      </div>
    </div>
  );
}
