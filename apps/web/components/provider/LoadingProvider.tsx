"use client";

import { useLoadingStore } from "@/lib/store/loading";

export function LoadingProvider() {
  const { loading } = useLoadingStore();
}
