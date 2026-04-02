"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useIngredients,
  type Ingredient,
} from "@/app/(main)/fridge/hooks/use-ingredients";
import { IngredientCard } from "@/app/(main)/fridge/components/IngredientCard";
import { IngredientDrawer } from "@/app/(main)/fridge/components/IngredientDrawer";
import { Empty, EmptyIcon, EmptyContent } from "@/components/shared/Empty";
import { Button } from "@repo/ui/components/button";
import { Plus, Refrigerator } from "lucide-react";

const queryClient = new QueryClient();

export function FridgeContent() {
  return (
    <QueryClientProvider client={queryClient}>
      <FridgeInner />
    </QueryClientProvider>
  );
}

function FridgeInner() {
  const {
    ingredients,
    loading,
    addIngredient,
    updateIngredient,
    removeIngredient,
  } = useIngredients();

  const [editTarget, setEditTarget] = useState<Ingredient | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleCardClick = (ingredient: Ingredient) => {
    setEditTarget(ingredient);
    setDrawerOpen(true);
  };

  const handleAddClick = () => {
    setEditTarget(null);
    setDrawerOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <span className="text-sm text-muted-foreground">불러오는 중...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-5 px-5 py-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold text-neutral-950">내 냉장고</h1>
        <p className="text-sm text-neutral-500">보유 중인 재료를 관리하세요</p>
      </div>

      {ingredients.length === 0 ? (
        <Empty>
          <EmptyIcon>
            <Refrigerator className="size-10 text-muted-foreground" />
          </EmptyIcon>
          <EmptyContent>
            <p className="text-[15px] font-semibold text-foreground">
              냉장고가 비어있어요
            </p>
            <p className="text-[13px] text-muted-foreground">
              재료를 추가해서 관리해 보세요
            </p>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="flex flex-col gap-2.5">
          {ingredients.map((ingredient) => (
            <IngredientCard
              key={ingredient.id}
              ingredient={ingredient}
              onClick={() => handleCardClick(ingredient)}
            />
          ))}
        </div>
      )}

      <Button
        className="w-full gap-2 rounded-2xl border-2 border-dashed border-neutral-200 bg-transparent py-6 text-neutral-400 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-500"
        onClick={handleAddClick}
      >
        <Plus className="size-5" />
        재료 추가
      </Button>

      <IngredientDrawer
        ingredient={editTarget}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onAdd={addIngredient}
        onUpdate={updateIngredient}
        onRemove={removeIngredient}
      />
    </div>
  );
}
