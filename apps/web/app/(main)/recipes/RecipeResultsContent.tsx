"use client";

import { RecipeCard } from "@/components/RecipeCard";
import { useRecipeStore } from "@/lib/store/recipes";

export function RecipeResultsContent() {
  const { recipes } = useRecipeStore();

  return (
    <div className="flex-1 overflow-y-auto p-5">
      <div className="flex flex-col gap-5">
        {/* Match Info */}
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-bold text-foreground">
            AI가 추천해준 요리
          </h1>
          <p className="text-[13px] text-muted-foreground">
            AI가 {recipes.length}개의 레시피를 찾았어요
          </p>
        </div>

        {/* Recipe List */}
        <div className="flex flex-col gap-3.5 w-full">
          {recipes.map((recipe, i) => (
            <RecipeCard key={i} {...recipe} />
          ))}
        </div>
      </div>
    </div>
  );
}
