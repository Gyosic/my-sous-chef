"use client";

import { BaseurlContext } from "@/components/provider/BaseurlProvider";
import { RecipeCard } from "@/app/(main)/(recipes)/components/RecipeCard";
import { useRecipes } from "@/app/(main)/(recipes)/hooks/use-recipes";
import { useSyncLocalRecipes } from "@/app/(main)/(recipes)/hooks/useSyncLocalRecipes";
import { RecipeState, useRecipeStore } from "@/lib/store/use-recipes-store";
import { actionFetch, getLocalStorage, setLocalStorage } from "@/lib/api";
import { extractErrorMessage } from "@/lib/utils";
import { BookOpen, Plus } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import {
  Empty,
  EmptyContent,
  EmptyIcon,
  EmptyRedirectButton,
} from "@/components/shared/Empty";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@repo/ui/components/sonner";

export function MyRecipe() {
  const { baseurl } = useContext(BaseurlContext);
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setCurrentRecipe } = useRecipeStore();

  const [recipes, setRecipes] = useState<RecipeState[]>([]);

  const { data } = useRecipes(baseurl);

  useSyncLocalRecipes();

  useEffect(() => {
    if (data) setRecipes(data.recipes);
  }, [data]);

  const handleEdit = (recipe: RecipeState) => {
    setCurrentRecipe(recipe);
    router.push(`/registrate?id=${recipe.id}`);
  };

  const handleDelete = async (recipe: RecipeState) => {
    if (session) {
      try {
        await actionFetch(new URL(`/api/recipes/${recipe.id}`, baseurl), {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.user.access_token}`,
          },
        });
        queryClient.invalidateQueries({ queryKey: ["recipes"] });
      } catch (err) {
        toast.error(extractErrorMessage(err, "레시피 삭제에 실패했습니다."));
      }
    } else {
      const stored = getLocalStorage("recipes") as RecipeState[] | undefined;
      const updated = (stored ?? []).filter((r) => r.id !== recipe.id);
      setLocalStorage("recipes", updated);
      setRecipes(updated);
    }
  };

  return (
    <div className="flex flex-col gap-3.5 w-full h-full">
      {recipes.length ? (
        recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            {...recipe}
            onEdit={() => handleEdit(recipe)}
            onDelete={() => handleDelete(recipe)}
          />
        ))
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

          <EmptyRedirectButton redirect="/registrate">
            <Plus className="size-5.5" />
            레시피 등록하기
          </EmptyRedirectButton>
        </Empty>
      )}
    </div>
  );
}
