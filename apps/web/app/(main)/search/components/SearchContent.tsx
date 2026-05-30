"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, SearchX } from "lucide-react";
import { usePublicRecipes } from "@/app/(main)/search/hooks/use-public-recipes";
import { PublicRecipeCard } from "@/app/(main)/search/components/PublicRecipeCard";

export function SearchContent() {
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(inputValue), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue]);

  const { recipes, isLoading, sentinelRef } = usePublicRecipes(search);

  return (
    <div className="flex flex-1 flex-col">
      {/* 검색바 */}
      <div className="sticky top-0 z-10 border-b border-neutral-100 bg-white px-5 pb-3 pt-4">
        <div className="flex h-11 items-center gap-2.5 rounded-xl bg-neutral-100 px-4">
          <Search className="size-4 shrink-0 text-neutral-400" />
          <input
            type="text"
            placeholder="레시피 검색"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-transparent text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 px-5 py-4">
        {/* 결과 수 */}
        {!isLoading && (
          <span className="text-[13px] font-medium text-neutral-500">
            레시피 {recipes.length}개
          </span>
        )}

        {/* 빈 결과 */}
        {!isLoading && recipes.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16">
            <SearchX className="size-10 text-neutral-300" />
            <p className="text-[15px] font-semibold text-neutral-700">
              검색 결과가 없어요
            </p>
            <p className="text-[13px] text-neutral-400">검색어를 바꿔보세요</p>
          </div>
        )}

        {/* 레시피 카드 리스트 */}
        {recipes.map((recipe) => (
          <PublicRecipeCard key={recipe.id} recipe={recipe} />
        ))}

        {/* 하단 sentinel + 스피너 */}
        <div ref={sentinelRef} className="py-2">
          {isLoading && (
            <div className="flex justify-center">
              <Loader2 className="size-5 animate-spin text-neutral-400" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
