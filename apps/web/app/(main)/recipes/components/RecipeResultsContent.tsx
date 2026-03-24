"use client";

import { MyRecipe } from "@/app/(main)/recipes/components/MyRecipe";
import { RecommendRecipe } from "@/app/(main)/recipes/components/RecommendRecipe";
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
  const [selectedTab, setSelectedTab] = useState("recommand");
  const { status: sessionStatus } = useSession();
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
      <div className="overflow-y-auto p-5 h-full">
        <Tabs
          className="w-full h-full"
          value={selectedTab}
          onValueChange={handleTabValueChange}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recommand">추천 레시피</TabsTrigger>
            <TabsTrigger value="my-recipe">나의 레시피</TabsTrigger>
          </TabsList>
          <TabsContent value="recommand" className="h-full">
            <RecommendRecipe />
          </TabsContent>
          <TabsContent value="my-recipe" className="h-full">
            <MyRecipe />
          </TabsContent>
        </Tabs>
      </div>
    </QueryClientProvider>
  );
}
