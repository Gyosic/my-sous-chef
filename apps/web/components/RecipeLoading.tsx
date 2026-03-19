"use client";

import { ChefHat } from "lucide-react";

interface RecipeLoadingProps {
  ingredients?: string;
}

export function RecipeLoading({ ingredients }: RecipeLoadingProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5">
      <div className="flex size-[72px] items-center justify-center rounded-full bg-muted/50">
        <ChefHat className="size-8 text-foreground" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-[17px] font-semibold text-foreground">
          AI가 레시피를 찾고 있어요
        </p>
        <p className="text-[13px] text-muted-foreground">
          {ingredients
            ? `${ingredients}로 만들 수 있는 요리를 분석 중...`
            : "맞춤 레시피를 분석 중..."}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="size-2 animate-pulse rounded-full bg-foreground" />
        <span className="size-2 animate-pulse rounded-full bg-neutral-300 [animation-delay:0.2s]" />
        <span className="size-2 animate-pulse rounded-full bg-neutral-300 [animation-delay:0.4s]" />
      </div>
    </div>
  );
}
