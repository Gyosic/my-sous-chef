"use client";

import { MyRecipe } from "@/app/(main)/(recipes)/components/MyRecipe";
import { RecommendRecipe } from "@/app/(main)/(recipes)/components/RecommendRecipe";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import { useState } from "react";

export function RecipeResultsContent() {
  const [selectedTab, setSelectedTab] = useState("my-recipe");

  return (
    <div className="overflow-y-auto p-5 h-full">
      <Tabs
        className="w-full h-full"
        value={selectedTab}
        onValueChange={setSelectedTab}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-recipe">나의 레시피</TabsTrigger>
          <TabsTrigger value="recommand">추천 레시피</TabsTrigger>
        </TabsList>
        <TabsContent value="my-recipe" className="h-full">
          <MyRecipe />
        </TabsContent>
        <TabsContent value="recommand" className="h-full">
          <RecommendRecipe />
        </TabsContent>
      </Tabs>
    </div>
  );
}
