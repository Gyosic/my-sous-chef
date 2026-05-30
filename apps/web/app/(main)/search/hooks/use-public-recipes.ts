"use client";

import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { BaseurlContext } from "@/components/provider/BaseurlProvider";

export interface PublicRecipe {
  id: string;
  name: string;
  description: string | null;
  ingredients: { name: string; amount: string; optional: boolean }[];
  steps: { title: string; description: string }[];
  servings: number | null;
  like: number;
  createdAt: string;
  authorName: string | null;
  authorImage: string | null;
}

interface PublicRecipesResponse {
  recipes: PublicRecipe[];
  nextCursor: string | null;
}

export function usePublicRecipes(search: string) {
  const { baseurl } = useContext(BaseurlContext);
  const [recipes, setRecipes] = useState<PublicRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const cursorRef = useRef<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef(search);

  const fetchPage = useCallback(
    async (cursor: string | null, currentSearch: string) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({ limit: "10" });
        if (currentSearch) params.set("search", currentSearch);
        if (cursor) params.set("cursor", cursor);

        const res = await fetch(`${baseurl}/api/recipes/public?${params}`);
        const data: PublicRecipesResponse = await res.json();

        setRecipes((prev) =>
          cursor === null ? data.recipes : [...prev, ...data.recipes],
        );
        cursorRef.current = data.nextCursor;
        setHasMore(data.nextCursor !== null);
      } finally {
        setIsLoading(false);
      }
    },
    [baseurl],
  );

  // search 변경 시 초기화 후 재조회
  useEffect(() => {
    searchRef.current = search;
    cursorRef.current = null;
    setRecipes([]);
    setHasMore(true);
    fetchPage(null, search);
  }, [search, fetchPage]);

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    fetchPage(cursorRef.current, searchRef.current);
  }, [isLoading, hasMore, fetchPage]);

  // IntersectionObserver로 하단 sentinel 감지
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return { recipes, isLoading, hasMore, sentinelRef };
}
