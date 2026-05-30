"use client";

import { Badge } from "@repo/ui/components/badge";
import { AlertTriangle, Check, Pencil } from "lucide-react";
import type { IngredientState } from "@/app/(main)/fridge/hooks/use-ingredients";

interface IngredientCardProps {
  ingredient: IngredientState;
  checked: boolean;
  onCheckChange: (checked: boolean) => void;
  onClick: () => void;
}

function isExpiringSoon(
  expiration: Date | string | null | undefined,
): "expired" | "soon" | null {
  if (!expiration) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(expiration);
  const diff = (exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  if (diff < 0) return "expired";
  if (diff <= 3) return "soon";
  return null;
}

function formatExpiration(expiration: Date | string | undefined): string {
  if (!expiration) return "";
  if (expiration instanceof Date)
    return expiration.toISOString().substring(0, 10);
  return String(expiration);
}

export function IngredientCard({
  ingredient,
  checked,
  onCheckChange,
  onClick,
}: IngredientCardProps) {
  const expiryStatus = isExpiringSoon(ingredient.expiration);

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl p-3.5 transition-colors ${
        checked
          ? "bg-green-50 border-l-[3px] border-l-green-500"
          : "bg-neutral-50"
      }`}
    >
      <div
        className="flex-shrink-0 cursor-pointer p-1 -m-1"
        onClick={(e) => {
          e.stopPropagation();
          onCheckChange(!checked);
        }}
      >
        <div
          className={`size-5 rounded flex items-center justify-center border-2 ${
            checked
              ? "bg-neutral-900 border-neutral-900"
              : "border-neutral-300 bg-white"
          }`}
        >
          {checked && <Check className="size-3 text-white" strokeWidth={3} />}
        </div>
      </div>

      <div
        className="flex flex-1 items-center gap-3 cursor-pointer"
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
                소비기한 만료
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
                <span>~ {formatExpiration(ingredient.expiration)}</span>
              </>
            )}
          </div>
        </div>
        <Pencil className="size-4 text-neutral-400 shrink-0" />
      </div>
    </div>
  );
}
