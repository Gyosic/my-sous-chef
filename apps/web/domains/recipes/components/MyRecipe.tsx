"use client";

import { BaseurlContext } from "@/components/provider/BaseurlProvider";
import { MyRecipeCard } from "@/domains/recipes/components/MyRecipeCard";
import { useRecipes } from "@/domains/recipes/hooks/use-recipes";
import { RecipeState } from "@/hooks/use-recipes-store";
import { Button } from "@repo/ui/components/button";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export function MyRecipe() {
  const router = useRouter();
  const { baseurl } = useContext(BaseurlContext);

  const { data: sessionData } = useSession();
  const [recipes, setRecipes] = useState<RecipeState[]>([]);

  const { data } = useRecipes({ baseurl, user: sessionData?.user });

  useEffect(() => {
    if (data) setRecipes(data.recipes);
  }, [data]);

  return (
    <div className="flex flex-col gap-3.5 w-full">
      {recipes.map((recipe, i) => (
        <MyRecipeCard key={i} {...recipe} />
      ))}
      <Button
        type="button"
        className="absolute bottom-5 right-5 rounded-full size-12"
        onClick={() => router.push("/recipes/registrate")}
      >
        <Plus />
      </Button>
    </div>
  );
}
