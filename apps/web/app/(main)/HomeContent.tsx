"use client";

import { IngredientInput } from "@/components/IngredientInput";
import { CategorySection } from "@/components/CategorySection";
import { RecipeRecommendButton } from "@/components/RecipeRecommendButton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
interface HomeContentProps {
  userName: string | null;
}

export function HomeContent({ userName }: HomeContentProps) {
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

        {/* Input Section */}
        <IngredientInput />

        {/* Recipe Recommend Button */}
        <RecipeRecommendButton />

        {/* Category Section */}
        <CategorySection />
      </div>
    </QueryClientProvider>
  );
}
