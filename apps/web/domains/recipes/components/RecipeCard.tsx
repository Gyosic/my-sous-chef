import { Clock, ImageIcon } from "lucide-react";
import { Badge } from "@repo/ui/components/badge";
import { useRouter } from "next/navigation";
import { RecipeState, useRecipeStore } from "@/hooks/use-recipes-store";

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "쉬움":
      return "text-green-500";
    case "보통":
      return "text-yellow-400";
    case "어려움":
      return "text-red-500";
    default:
      return "text-muted-foreground";
  }
}

function getMatchBadgeStyle(rate: number) {
  if (rate >= 90) return "bg-green-500 text-white";
  if (rate >= 80) return "bg-foreground text-background";
  return "bg-muted-foreground text-white";
}

export function RecipeCard(recipe: RecipeState) {
  const router = useRouter();
  const { setCurrentRecipe } = useRecipeStore();
  const handleClick = () => {
    router.push("/recipes/detail");
    setCurrentRecipe(recipe);
  };

  return (
    <div
      className="flex items-center gap-3.5 rounded-2xl bg-muted/50 p-3"
      onClick={handleClick}
    >
      <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-neutral-200/70">
        <ImageIcon className="size-6 text-neutral-400" />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-semibold text-foreground">
            {recipe.name}
          </span>
          <Badge
            className={`h-5.5 rounded-full px-2 text-[11px] font-semibold ${getMatchBadgeStyle(recipe.matchRate)}`}
          >
            {recipe.matchRate}%
          </Badge>
        </div>
        <p className="text-[13px] text-muted-foreground text-wrap">
          {recipe.description}
        </p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="size-3" />
          <span>{recipe.time}</span>
          <span>·</span>
          <span
            className={`font-medium ${getDifficultyColor(recipe.difficulty)}`}
          >
            {recipe.difficulty}
          </span>
        </div>
      </div>
    </div>
  );
}
