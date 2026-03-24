"use client";

import { RecipeCard } from "@/app/(main)/recipes/components/RecipeCard";
import {
  Empty,
  EmptyContent,
  EmptyIcon,
  EmptyRedirectButton,
} from "@/components/shared/Empty";
import { useRecipeStore } from "@/hooks/use-recipes-store";
import { BookOpen, ChefHat } from "lucide-react";

export function RecommendRecipe() {
  const { recipes } = useRecipeStore();

  return (
    <div className="flex flex-col gap-5 p-2 h-full">
      {recipes.length ? (
        <>
          <div className="flex flex-col gap-2">
            <h1 className="text-lg font-bold text-foreground">
              AI가 추천해준 요리
            </h1>
            <p className="text-[13px] text-muted-foreground">
              AI가 {recipes.length}개의 레시피를 찾았어요
            </p>
          </div>
          <div className="flex flex-col gap-3.5 w-full">
            {recipes.map((recipe, i) => (
              <RecipeCard key={i} {...recipe} />
            ))}
          </div>
        </>
      ) : (
        <Empty>
          <EmptyIcon>
            <BookOpen className="size-9 text-neutral-300" />
          </EmptyIcon>

          <EmptyContent>
            <p className="text-[17px] font-semibold text-foreground">
              추천된 레시피가 없어요
            </p>
            <p className="text-sm text-muted-foreground">
              레시피를 추천받아보세요!
            </p>
          </EmptyContent>

          <EmptyRedirectButton redirect="/">
            <ChefHat className="size-5.5" />
            레시피 추천받기
          </EmptyRedirectButton>
        </Empty>
      )}
    </div>
  );
}
