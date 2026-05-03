import { Carrot, ChevronRight, ListOrdered, Users } from "lucide-react";
import { Badge } from "@repo/ui/components/badge";
import { useRouter } from "next/navigation";
import { RecipeState, useRecipeStore } from "@/hooks/use-recipes-store";

export function RecipeCard(recipe: RecipeState) {
  const router = useRouter();
  const { setCurrentRecipe } = useRecipeStore();
  const handleClick = () => {
    setCurrentRecipe(recipe);
    router.push("/recipes/detail");
  };

  return (
    <div
      className="flex items-center gap-3.5 rounded-2xl bg-neutral-50 p-3"
      onClick={handleClick}
    >
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-semibold text-foreground">
            {recipe.name}
          </span>
        </div>
        <p className="text-[13px] text-muted-foreground text-wrap">
          {recipe.description}
        </p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Badge className="bg-green-100 text-green py-3">
            <Users className="size-3" />
            <span>{recipe.servings}인분</span>
          </Badge>

          <Badge className="bg-transparent text-muted-foreground py-3">
            <Carrot className="size-3" />
            <span>재료 {recipe.ingredients.length}개</span>
          </Badge>

          <Badge className="bg-transparent text-muted-foreground py-3">
            <ListOrdered className="size-3" />
            <span> {recipe.steps.length}단계</span>
          </Badge>
        </div>
      </div>
      <ChevronRight />
    </div>
  );
}
