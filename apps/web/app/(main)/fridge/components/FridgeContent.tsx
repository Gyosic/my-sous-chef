"use client";

import { useContext, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  useIngredients,
  type IngredientState,
} from "@/app/(main)/fridge/hooks/use-ingredients";
import { IngredientCard } from "@/app/(main)/fridge/components/IngredientCard";
import { IngredientDrawer } from "@/app/(main)/fridge/components/IngredientDrawer";
import { Empty, EmptyIcon, EmptyContent } from "@/components/shared/Empty";
import { Loading } from "@/components/shared/Loading";
import { Button } from "@repo/ui/components/button";
import { Plus, Refrigerator, Sparkles } from "lucide-react";
import { BaseurlContext } from "@/components/provider/BaseurlProvider";
import { useRecipeStore } from "@/lib/store/use-recipes-store";
import { toast } from "@repo/ui/components/sonner";

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

  const { baseurl } = useContext(BaseurlContext);
  const { setRecipes } = useRecipeStore();
  const router = useRouter();

  const [editTarget, setEditTarget] = useState<IngredientState | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [recommending, setRecommending] = useState(false);

  const handleCardClick = (ingredient: IngredientState) => {
    setEditTarget(ingredient);
    setDrawerOpen(true);
  };

  const handleAddClick = () => {
    setEditTarget(null);
    setDrawerOpen(true);
  };

  const handleCheckChange = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const isAllSelected =
    ingredients.length > 0 && selectedIds.size === ingredients.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(ingredients.map((i) => i.id)));
    }
  };

  const handleRecommend = async () => {
    const targets =
      selectedIds.size > 0
        ? ingredients.filter((i) => selectedIds.has(i.id))
        : ingredients;

    try {
      setRecommending(true);
      const params = new URLSearchParams();
      params.set("ingredients", targets.map((i) => i.name).join(","));
      params.set("model", "openai");
      const res = await fetch(`${baseurl}/api/recommends?${params}`);
      const { recipes } = await res.json();
      setRecipes(recipes);
      router.push("/");
    } catch (err) {
      toast.error("[오류]", {
        description: (err as Error)?.message ?? "알 수 없는 오류가 발생했어요.",
      });
    } finally {
      setRecommending(false);
    }
  };

  const ctaLabel =
    selectedIds.size > 0
      ? `선택한 ${selectedIds.size}개 재료로 추천받기`
      : `전체 재료로 추천받기`;

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <span className="text-sm text-muted-foreground">불러오는 중...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-5 px-5 py-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-bold text-neutral-950">내 냉장고</h1>
          <p className="text-sm text-neutral-500">
            재료를 선택하면 AI가 레시피를 추천해드려요
          </p>
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
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-neutral-900">
                보유 재료
              </span>
              {selectedIds.size > 0 ? (
                <span className="text-xs font-bold text-neutral-900">
                  {selectedIds.size}개 선택됨
                </span>
              ) : (
                <button
                  type="button"
                  className="text-[13px] font-medium text-neutral-500 active:text-neutral-700"
                  onClick={handleSelectAll}
                >
                  {isAllSelected ? "전체 해제" : "전체 선택"}
                </button>
              )}
            </div>
            {ingredients.map((ingredient) => (
              <IngredientCard
                key={ingredient.id}
                ingredient={ingredient}
                checked={selectedIds.has(ingredient.id)}
                onCheckChange={(checked) =>
                  handleCheckChange(ingredient.id, checked)
                }
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
      </div>

      {ingredients.length > 0 && (
        <div className="sticky bottom-0 bg-white px-5 pb-5 pt-2 border-t border-neutral-100 flex flex-col gap-2">
          {selectedIds.size > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {ingredients
                .filter((i) => selectedIds.has(i.id))
                .map((i) => (
                  <span
                    key={i.id}
                    className="rounded-full border border-green-500 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700"
                  >
                    {i.name}
                  </span>
                ))}
            </div>
          ) : (
            <p className="text-center text-xs text-neutral-400">
              선택된 재료 없음 — 전체 재료 {ingredients.length}개로 추천
            </p>
          )}
          <Button
            className="w-full gap-2 h-[52px] rounded-[14px] text-[16px] font-semibold"
            onClick={handleRecommend}
            disabled={recommending}
          >
            <Sparkles className="size-5" />
            {recommending ? "추천 중..." : ctaLabel}
          </Button>
        </div>
      )}

      {recommending && (
        <Loading>
          <div className="flex flex-col items-center gap-2">
            <p className="text-[17px] font-semibold text-foreground">
              AI가 레시피를 찾고 있어요
            </p>
            <p className="text-[13px] text-muted-foreground">
              {(selectedIds.size > 0
                ? ingredients.filter((i) => selectedIds.has(i.id))
                : ingredients
              )
                .map((i) => i.name)
                .join(", ")}
              로 만들 수 있는 요리를 분석 중...
            </p>
          </div>
        </Loading>
      )}

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
