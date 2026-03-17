"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@repo/ui/components/button";

interface RecipeStepTrackerProps {
  recipeName: string;
  steps: string[];
}

export function RecipeStepTracker({ recipeName, steps }: RecipeStepTrackerProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const completedCount = completedSteps.size;

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white">
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-3"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-sm font-semibold text-foreground">
            {recipeName}
          </span>
          <span className="text-xs text-muted-foreground">
            {completedCount}/{steps.length} 단계 완료
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="size-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="size-4 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-neutral-100 px-4 py-2">
          {steps.map((step, i) => {
            const isCompleted = completedSteps.has(i);
            return (
              <button
                key={i}
                type="button"
                className="flex w-full items-start gap-3 py-2 text-left"
                onClick={() => toggleStep(i)}
              >
                <div
                  className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border ${
                    isCompleted
                      ? "border-neutral-900 bg-neutral-900"
                      : "border-neutral-300"
                  }`}
                >
                  {isCompleted && <Check className="size-3 text-white" />}
                </div>
                <span
                  className={`text-sm leading-relaxed ${
                    isCompleted
                      ? "text-muted-foreground line-through"
                      : "text-foreground"
                  }`}
                >
                  {step}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
