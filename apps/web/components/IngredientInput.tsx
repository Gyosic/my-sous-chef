"use client";

import { useState } from "react";
import { Search, Plus, X } from "lucide-react";
import { Input } from "@repo/ui/components/input";
import { Button } from "@repo/ui/components/button";
import { Badge } from "@repo/ui/components/badge";

export function IngredientInput() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const addIngredient = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setInputValue("");
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter((i) => i !== ingredient));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addIngredient();
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Input Row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="재료명을 입력하세요"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-11 rounded-[10px] pl-10"
          />
        </div>
        <Button
          size="icon"
          onClick={addIngredient}
          className="size-11 rounded-[10px]"
        >
          <Plus className="size-5" />
        </Button>
      </div>

      {/* Ingredient Tags */}
      {ingredients.length > 0 && (
        <>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ingredient) => (
              <Badge
                key={ingredient}
                variant="secondary"
                className="h-[34px] cursor-pointer gap-1.5 rounded-full px-3 text-[13px] font-medium"
                onClick={() => removeIngredient(ingredient)}
              >
                {ingredient}
                <X className="size-3.5 text-muted-foreground" />
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {ingredients.length}개의 재료가 입력되었어요
          </p>
        </>
      )}
    </div>
  );
}
