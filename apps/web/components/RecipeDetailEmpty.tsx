"use client";

import { useRouter } from "next/navigation";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@repo/ui/components/button";

export function RecipeDetailEmpty() {
  const router = useRouter();

  return (
    <div className="flex h-svh flex-col bg-white">
      <div className="flex flex-1 flex-col items-center justify-center gap-5">
        <div className="flex size-20 items-center justify-center rounded-full bg-muted/50">
          <BookOpen className="size-9 text-neutral-300" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-[17px] font-semibold text-foreground">
            선택된 레시피가 없어요
          </p>
          <p className="text-sm text-muted-foreground">
            레시피 목록에서 요리를 선택해주세요
          </p>
        </div>
        <Button
          className="h-11 gap-1.5 rounded-full px-6"
          onClick={() => router.back()}
        >
          <ArrowLeft className="size-4" />
          레시피 목록으로
        </Button>
      </div>
    </div>
  );
}
