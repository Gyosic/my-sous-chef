"use client";

import { IngredientInput } from "@/app/(main)/components/IngredientInput";
import { CategorySection } from "@/app/(main)/components/CategorySection";
import { RecipeRecommendButton } from "@/app/(main)/components/RecipeRecommendButton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { recommendSchema, type RecommendInput } from "@repo/db/types/recommend";
import { useRouter } from "next/navigation";
import { useRecipeStore } from "@/hooks/use-recipes-store";
import { toast } from "@repo/ui/components/sonner";
import { useState } from "react";
import { Loading } from "@/components/shared/Loading";

const queryClient = new QueryClient();
interface HomeContentProps {
  userName: string | null;
  baseurl: string;
}

export function HomeContent({ userName, baseurl }: HomeContentProps) {
  const router = useRouter();
  const { setRecipes } = useRecipeStore();
  const form = useForm<RecommendInput>({
    resolver: zodResolver(recommendSchema),
    mode: "onSubmit",
    defaultValues: { ingredients: [], model: "openai" },
  });
  const [loading, setLoading] = useState(false);

  const { handleSubmit } = form;

  const onSubmit = handleSubmit(async (inputs) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("ingredients", inputs.ingredients.join(","));
      if (inputs.model) params.set("model", inputs.model);

      const res = await fetch(`${baseurl}/api/recommends?${params}`);
      const { recipes } = await res.json();
      setRecipes(recipes);
    } catch (err) {
      toast.error("[오류]", {
        description: (err as Error)?.message ?? "알수없는 요류 발생.",
      });
    } finally {
      setLoading(false);
      router.push(`/recipes`);
    }
  });

  const onChipClick = (chip: string) => {
    const ingredients = form.getValues("ingredients");

    if (!ingredients.includes(chip)) ingredients.push(chip);

    form.setValue("ingredients", ingredients);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-1 flex-col gap-6 px-5 py-6">
        {/* Hero Section */}
        <div className="flex flex-col gap-1.5">
          <h1 className="whitespace-pre-line text-2xl font-bold leading-[1.35] text-neutral-950">
            {userName
              ? `${userName}님, 오늘은\n무엇을 만들어 볼까요?`
              : "냉장고 속 재료로\n레시피를 찾아보세요"}
          </h1>
          <p className="text-sm text-neutral-500">
            재료를 입력하면 AI가 맞춤 레시피를 추천해드려요
          </p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={onSubmit}>
          {/* Input Section */}
          <IngredientInput form={form} />

          {/* Recipe Recommend Button */}
          <RecipeRecommendButton />

          {/* Category Section */}
          <CategorySection onChipClick={onChipClick} />
        </form>
      </div>

      {loading && (
        <Loading>
          <div className="flex flex-col items-center gap-2">
            <p className="text-[17px] font-semibold text-foreground">
              AI가 레시피를 찾고 있어요
            </p>
            <p className="text-[13px] text-muted-foreground">
              {form.getValues("ingredients").length
                ? `${form.getValues("ingredients").join(", ")}로 만들 수 있는 요리를 분석 중...`
                : "맞춤 레시피를 분석 중..."}
            </p>
          </div>
        </Loading>
      )}
    </QueryClientProvider>
  );
}
