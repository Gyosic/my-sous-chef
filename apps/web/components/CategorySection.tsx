"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/ui/components/collapsible";

interface Category {
  emoji: string;
  name: string;
  chips: string[];
}

const categories: Category[] = [
  {
    emoji: "🥬",
    name: "채소",
    chips: ["양파", "감자", "당근", "마늘", "버섯", "애호박"],
  },
  {
    emoji: "🥩",
    name: "고기 · 해산물",
    chips: ["돼지고기", "소고기", "닭고기", "새우", "오징어", "참치"],
  },
  {
    emoji: "🧂",
    name: "양념 · 소스",
    chips: ["간장", "고추장", "된장", "설탕", "식초", "참기름"],
  },
  {
    emoji: "🍚",
    name: "주식 · 면",
    chips: ["밥", "라면", "파스타", "우동", "떡", "식빵"],
  },
];

interface CategorySectionProps {
  onChipClick?: (chip: string) => void;
}

export function CategorySection({ onChipClick }: CategorySectionProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="flex flex-col gap-2.5">
      <h2 className="text-base font-semibold text-foreground">
        재료 빠른 추가
      </h2>

      {categories.map((category, index) => {
        const isOpen = openIndex === index;
        return (
          <Collapsible
            key={category.name}
            open={isOpen}
            onOpenChange={(open) => setOpenIndex(open ? index : -1)}
          >
            <div className="overflow-hidden rounded-[14px] bg-muted/50">
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="flex h-12 w-full items-center justify-between px-3.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{category.emoji}</span>
                    <span className="text-sm font-semibold text-foreground">
                      {category.name}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="size-[18px] text-muted-foreground" />
                  ) : (
                    <ChevronDown className="size-[18px] text-muted-foreground" />
                  )}
                </button>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="flex flex-wrap gap-1.5 px-3.5 pb-3.5">
                  {category.chips.map((chip) => (
                    <Button
                      key={chip}
                      variant="outline"
                      size="sm"
                      onClick={() => onChipClick?.(chip)}
                      className="h-[30px] rounded-full px-2.5 text-xs font-medium"
                    >
                      {chip}
                    </Button>
                  ))}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        );
      })}
    </div>
  );
}
