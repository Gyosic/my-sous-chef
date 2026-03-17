"use client";

import { ChefHat } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import Link from "next/link";

interface StartCookingButtonProps {
  recipeId: string;
}

export function StartCookingButton({ recipeId }: StartCookingButtonProps) {
  return (
    <Button
      asChild
      size="lg"
      className="h-[50px] w-full gap-2 rounded-xl text-[15px] font-semibold"
    >
      <Link href={`/cooking/${recipeId}`}>
        <ChefHat className="size-5" />
        요리 시작
      </Link>
    </Button>
  );
}
