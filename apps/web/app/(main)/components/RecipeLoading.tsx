"use client";

import { ChefHat } from "lucide-react";

interface RecipeLoadingProps {
  ingredients?: string[];
}

export function RecipeLoading({ ingredients = [] }: RecipeLoadingProps) {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-muted/90 z-100 flex flex-1 flex-col items-center justify-center gap-5">
      <div className="flex size-18 items-center justify-center rounded-full bg-muted/50">
        <ChefHat className="size-8 text-foreground" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-[17px] font-semibold text-foreground">
          AI가 레시피를 찾고 있어요
        </p>
        <p className="text-[13px] text-muted-foreground">
          {ingredients.length
            ? `${ingredients.join(", ")}로 만들 수 있는 요리를 분석 중...`
            : "맞춤 레시피를 분석 중..."}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="size-2 animate-dot-blink rounded-full bg-foreground" />
        <span className="size-2 animate-dot-blink rounded-full bg-foreground [animation-delay:0.4s]" />
        <span className="size-2 animate-dot-blink rounded-full bg-foreground [animation-delay:0.8s]" />
      </div>
    </div>
  );
}
