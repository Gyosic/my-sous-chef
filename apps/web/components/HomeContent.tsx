"use client";

import { IngredientInput } from "@/components/IngredientInput";
import { CategorySection } from "@/components/CategorySection";
import { RecipeRecommendButton } from "@/components/RecipeRecommendButton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { recommendSchema } from "@repo/db/types/recommend";
import { useRouter } from "next/navigation";
import { useRecipeStore } from "@/lib/store/recipes";

const queryClient = new QueryClient();
interface HomeContentProps {
  userName: string | null;
  baseurl: string;
}

export function HomeContent({ userName, baseurl }: HomeContentProps) {
  const router = useRouter();
  const { setRecipes } = useRecipeStore();
  const form = useForm<UseFormReturn>({
    resolver: zodResolver(recommendSchema),
    mode: "onBlur",
    defaultValues: { ingredients: [], model: "openai" },
  });

  const { handleSubmit } = form;

  const onSubmit = handleSubmit(async (inputs) => {
    const params = new URLSearchParams();
    params.set("ingredients", inputs.ingredients.join(","));
    if (inputs.model) params.set("model", inputs.model);

    const res = await fetch(`${baseurl}/api/recommends?${params}`);
    const data = await res.json();
    setRecipes(data.recipes);

    router.push(`/recipes`);
  });

  const onChipClick = (chip) => {
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
    </QueryClientProvider>
  );
}
