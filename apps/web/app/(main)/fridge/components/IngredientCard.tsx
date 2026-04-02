"use client";

import { Badge } from "@repo/ui/components/badge";
import { AlertTriangle, ChevronRight } from "lucide-react";
import type { Ingredient } from "@/app/(main)/fridge/hooks/use-ingredients";

interface IngredientCardProps {
  ingredient: Ingredient;
  onClick: () => void;
}

function isExpiringSoon(expiration: string | null): "expired" | "soon" | null {
  if (!expiration) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(expiration);
  const diff = (exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  if (diff < 0) return "expired";
  if (diff <= 3) return "soon";
  return null;
}

export function IngredientCard({ ingredient, onClick }: IngredientCardProps) {
  const expiryStatus = isExpiringSoon(ingredient.expiration);

  return (
    <div
      className="flex items-center gap-3 rounded-2xl bg-neutral-50 p-3.5 active:bg-neutral-100 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-semibold text-foreground">
            {ingredient.name}
          </span>
          {expiryStatus === "expired" && (
            <Badge className="bg-red-100 text-red-600 text-[11px] py-0.5">
              <AlertTriangle className="size-3" />
              유통기한 만료
            </Badge>
          )}
          {expiryStatus === "soon" && (
            <Badge className="bg-amber-100 text-amber-600 text-[11px] py-0.5">
              <AlertTriangle className="size-3" />
              임박
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <span>
            {ingredient.amount} {ingredient.unit}
          </span>
          {ingredient.expiration && (
            <>
              <span className="text-neutral-300">|</span>
              <span>~ {ingredient.expiration}</span>
            </>
          )}
        </div>
      </div>
      <ChevronRight className="size-5 text-neutral-400" />
    </div>
  );
}
