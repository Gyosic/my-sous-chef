"use client";

import { useContext } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BaseurlContext } from "@/components/provider/BaseurlProvider";
import { actionFetch } from "@/lib/api";
import { toast } from "@repo/ui/components/sonner";
import type { IngredientInput } from "@repo/db/types/ingredients";

export interface Ingredient {
  id: string;
  userId: string;
  name: string;
  amount: number;
  unit: string;
  expiration: string | null;
  createdAt: string;
  updatedAt: string;
}

export function useIngredients() {
  const { baseurl } = useContext(BaseurlContext);
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const token = session?.user.access_token;

  const QUERY_KEY = ["ingredients", token] as const;

  const getHeaders = () => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  });

  const { data: ingredients = [], isLoading } = useQuery<Ingredient[]>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const data = await actionFetch(new URL("/api/ingredients", baseurl), {
        headers: getHeaders(),
      });
      return data.ingredients;
    },
    enabled: !!token,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: QUERY_KEY });

  const onError = (err: Error) => {
    toast.error("요청에 실패했습니다.", { description: err.message });
  };

  const addMutation = useMutation({
    mutationFn: async (body: IngredientInput) => {
      const data = await actionFetch(new URL("/api/ingredients", baseurl), {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(body),
      });

      return data.ingredient as Ingredient;
    },
    onSuccess: invalidate,
    onError,
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: string;
      body: Partial<IngredientInput>;
    }) => {
      const data = await actionFetch(
        new URL(`/api/ingredients/${id}`, baseurl),
        {
          method: "PATCH",
          headers: getHeaders(),
          body: JSON.stringify(body),
        },
      );

      return data.ingredient as Ingredient;
    },
    onSuccess: invalidate,
    onError,
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      await actionFetch(new URL(`/api/ingredients/${id}`, baseurl), {
        method: "DELETE",
        headers: getHeaders(),
      });

      return id;
    },
    onSuccess: invalidate,
    onError,
  });

  const addIngredient = (body: IngredientInput) =>
    addMutation.mutateAsync(body);

  const updateIngredient = (id: string, body: Partial<IngredientInput>) =>
    updateMutation.mutateAsync({ id, body });

  const removeIngredient = (id: string) => removeMutation.mutateAsync(id);

  return {
    ingredients,
    loading: isLoading,
    addIngredient,
    updateIngredient,
    removeIngredient,
  };
}
