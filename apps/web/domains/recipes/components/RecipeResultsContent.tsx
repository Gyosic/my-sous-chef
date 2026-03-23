"use client";

import { MyRecipe } from "@/domains/recipes/components/MyRecipe";
import { RecipeRecommendCard } from "@/domains/recipes/components/RecipeRecommendCard";
import { useRecipeStore } from "@/hooks/use-recipes-store";
import { Button } from "@repo/ui/components/button";
import { toast } from "@repo/ui/components/sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function RecipeResultsContent() {
  const queryClient = new QueryClient();
  const { recipes } = useRecipeStore();
  const [selectedTab, setSelectedTab] = useState("recommand");
  const { data: sessionData, status: sessionStatus } = useSession();
  const router = useRouter();

  const handleTabValueChange = (tab: string) => {
    if (sessionStatus === "unauthenticated" && tab === "my-recipe") {
      toast.warning("로그인이 필요합니다.", {
        action: (
          <Button type="button" onClick={() => router.push("signin")}>
            로그인
          </Button>
        ),
      });
      return;
    }
    setSelectedTab(tab);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="overflow-y-auto p-5">
        <Tabs
          className="w-full max-w-md"
          value={selectedTab}
          onValueChange={handleTabValueChange}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recommand">추천 레시피</TabsTrigger>
            <TabsTrigger value="my-recipe">나의 레시피</TabsTrigger>
          </TabsList>
          <TabsContent value="recommand">
            <div className="flex flex-col gap-5 p-2">
              {/* Match Info */}
              <div className="flex flex-col gap-2">
                <h1 className="text-lg font-bold text-foreground">
                  AI가 추천해준 요리
                </h1>
                <p className="text-[13px] text-muted-foreground">
                  AI가 {recipes.length}개의 레시피를 찾았어요
                </p>
              </div>

              {/* Recipe List */}
              <div className="flex flex-col gap-3.5 w-full">
                {recipes.map((recipe, i) => (
                  <RecipeRecommendCard key={i} {...recipe} />
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="my-recipe">
            <MyRecipe />
          </TabsContent>
        </Tabs>
      </div>
    </QueryClientProvider>
  );
}
