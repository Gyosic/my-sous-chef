"use client";

import { useState } from "react";
import { Timer, ChefHat } from "lucide-react";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { TopBar } from "@/components/TopBar";
import { RecipeDetailEmpty } from "@/components/recipes/RecipeDetailEmpty";
import { useRecipeStore } from "@/hooks/use-recipes-store";
import { ChatBot } from "@/components/shared/ChatBot";
import { useElapsedTime } from "@/hooks/use-elapsed-time";
import {
  CookingSessionProvider,
  useCookingSessionContext,
} from "@/components/provider/CookingSessionProvider";

function getDifficultyStyle(difficulty: string) {
  switch (difficulty) {
    case "쉽게":
      return "bg-green-50 text-green-500";
    case "보통":
      return "bg-yellow-50 text-yellow-500";
    case "어려움":
      return "bg-red-50 text-red-500";
    default:
      return "bg-muted text-muted-foreground";
  }
}

interface RecipeDetailProps {
  wsUrl?: string;
}
export function RecipeDetail({ wsUrl }: RecipeDetailProps) {
  const { currentRecipe: recipe } = useRecipeStore();

  if (!recipe) return <RecipeDetailEmpty />;

  return (
    <CookingSessionProvider wsUrl={wsUrl}>
      <RecipeDetailInner />
    </CookingSessionProvider>
  );
}

function RecipeDetailInner() {
  const { currentRecipe: recipe } = useRecipeStore();
  const [aiStarted, setAiStarted] = useState(false);
  const { formatted } = useElapsedTime(aiStarted);
  const { startSession, endSession, isConnected } = useCookingSessionContext();

  if (!recipe) return null;

  const startAi = () => {
    if (!aiStarted) {
      startSession(recipe.id, {
        name: recipe.name,
        description: recipe.description,
        steps: recipe.steps.map((s) => `${s.title}: ${s.description}`),
        ingredients: recipe.ingredients.map((i) => `${i.name} ${i.amount}`),
      });
      setAiStarted(true);
    } else {
      endSession();
      setAiStarted(false);
    }
  };

  return (
    <div className="relative flex h-full flex-col bg-white">
      {/* Top Bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-100 px-4">
        <TopBar title="레시피 상세" />
        {/* TODO: 북마크 기능 추가시 */}
        {/* <Button variant="ghost" size="icon-sm" aria-label="북마크">
          <Bookmark className="size-5.5 text-foreground" />
        </Button> */}
      </header>

      {/* Scroll Content */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex flex-col gap-6">
          {/* Hero Info */}
          <div className="flex flex-col gap-3">
            <h1 className="text-[22px] font-bold text-foreground">
              {recipe.name}
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {recipe.description}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className="h-7 gap-1 rounded-full px-2.5"
              >
                <Timer className="size-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  {recipe.time}
                </span>
              </Badge>
              <Badge
                className={`h-7 rounded-full px-2.5 text-xs font-medium ${getDifficultyStyle(recipe.difficulty)}`}
              >
                {recipe.difficulty}
              </Badge>
              <Badge className="h-7 rounded-full bg-foreground px-2.5 text-xs font-semibold text-background">
                {recipe.servings} 인분
              </Badge>
            </div>
          </div>

          {/* Unit Section */}
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-foreground">계량</h2>
            <div className="overflow-hidden rounded-[14px] bg-muted/50 py-1">
              {recipe.units.map((unit) => (
                <div
                  key={unit.name}
                  className="flex items-center justify-between px-4 py-2.5"
                >
                  <span className="text-sm font-medium text-foreground">
                    {unit.name}
                  </span>
                  <span className="text-[13px] text-muted-foreground">
                    {unit.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-foreground">재료</h2>
            <div className="overflow-hidden rounded-[14px] bg-muted/50 py-1">
              {recipe.ingredients.map((ing) => (
                <div
                  key={ing.name}
                  className="flex items-center justify-between px-4 py-2.5"
                >
                  <span
                    className={`text-sm font-medium ${ing.optional ? "text-muted-foreground" : "text-foreground"}`}
                  >
                    {ing.name}
                  </span>
                  <span className="text-[13px] text-muted-foreground">
                    {ing.amount}
                    {ing.optional && " (선택)"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Steps Section */}
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-foreground">요리 순서</h2>
            <div className="flex flex-col gap-3">
              {recipe.steps.map((step, index) => (
                <div key={step.title} className="flex gap-3">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-xl bg-foreground">
                    <span className="text-xs font-semibold text-background">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-foreground">
                      {step.title}
                    </span>
                    <p className="text-[13px] leading-[1.45] text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action - 요리 시작 전 */}
      <div className="flex items-center gap-4 shrink-0 border-t border-neutral-100 bg-white px-5 pb-7 pt-3">
        <Button
          size="lg"
          onClick={startAi}
          disabled={!aiStarted && !isConnected}
          className="h-12.5 flex-1 gap-2 rounded-xl text-[15px] font-semibold"
        >
          <ChefHat className="size-5" />
          {aiStarted ? `요리중... ${formatted}` : "요리 시작하기"}
        </Button>
        {/* Float Button - 요리 시작 후 */}
        {aiStarted && <ChatBot isAbsolute={false} />}
      </div>
    </div>
  );
}
