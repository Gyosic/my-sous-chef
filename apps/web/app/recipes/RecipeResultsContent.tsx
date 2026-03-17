"use client";

import { RecipeCard } from "@/components/RecipeCard";

// TODO: API 연동 후 실제 데이터로 교체
const mockRecipes = [
  {
    id: "1",
    name: "두부 달걀찌개",
    description: "간단하고 따뜻한 한 끼 식사",
    time: "15분",
    difficulty: "쉽게",
    matchRate: 100,
  },
  {
    id: "2",
    name: "달걀말이",
    description: "부드러운 달걀에 두부와 채소를 넣어",
    time: "20분",
    difficulty: "쉽게",
    matchRate: 87,
  },
  {
    id: "3",
    name: "두부 달걀 볶음",
    description: "밥이 있으면 금상첨화, 재료 추가 필요",
    time: "25분",
    difficulty: "보통",
    matchRate: 75,
  },
];

export function RecipeResultsContent() {
  const ingredients = "달걀, 두부, 파";

  return (
    <div className="flex-1 overflow-y-auto p-5">
      <div className="flex flex-col gap-5">
        {/* Match Info */}
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-bold text-foreground">
            {ingredients}로 만들 수 있는 요리
          </h1>
          <p className="text-[13px] text-muted-foreground">
            AI가 {mockRecipes.length}개의 레시피를 찾았어요
          </p>
        </div>

        {/* Recipe List */}
        <div className="flex flex-col gap-3.5">
          {mockRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} {...recipe} />
          ))}
        </div>
      </div>
    </div>
  );
}
