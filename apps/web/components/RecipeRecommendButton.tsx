"use client";

import { ChefHat } from "lucide-react";
import { Button } from "@repo/ui/components/button";

interface RecipeRecommendButtonProps {
  onClick?: () => void;
}

export function RecipeRecommendButton({
  onClick,
}: RecipeRecommendButtonProps) {
  return (
    <Button
      size="lg"
      onClick={onClick}
      className="h-[50px] w-full gap-2 rounded-xl text-[15px] font-semibold"
    >
      <ChefHat className="size-5" />
      레시피 추천받기
    </Button>
  );
}
