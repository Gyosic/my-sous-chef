"use client";

import { BaseurlContext } from "@/components/provider/BaseurlProvider";
import { RecipeCard } from "@/app/(main)/recipes/components/RecipeCard";
import { useRecipes } from "@/app/(main)/recipes/hooks/use-recipes";
import { RecipeState } from "@/hooks/use-recipes-store";
import { BookOpen, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import {
  Empty,
  EmptyContent,
  EmptyIcon,
  EmptyRedirectButton,
} from "@/components/shared/Empty";

export function MyRecipe() {
  const { baseurl } = useContext(BaseurlContext);

  const { data: sessionData } = useSession();
  const [recipes, setRecipes] = useState<RecipeState[]>([]);

  const { data } = useRecipes({ baseurl, user: sessionData?.user });

  useEffect(() => {
    if (data) setRecipes(data.recipes);
  }, [data]);

  return (
    <div className="flex flex-col gap-3.5 w-full h-full">
      {recipes.length ? (
        recipes.map((recipe, i) => <RecipeCard key={i} {...recipe} />)
      ) : (
        <Empty>
          <EmptyIcon>
            <BookOpen className="size-9 text-neutral-300" />
          </EmptyIcon>

          <EmptyContent>
            <p className="text-[17px] font-semibold text-foreground">
              등록된 레시피가 없어요
            </p>
            <p className="text-sm text-muted-foreground">
              레시피를 등록해주세요
            </p>
          </EmptyContent>

          <EmptyRedirectButton redirect="/recipes/registrate">
            <Plus className="size-5.5" />
            레시피 등록하기
          </EmptyRedirectButton>
        </Empty>
      )}
    </div>
  );
}
