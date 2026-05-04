"use client";

import { useContext } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BaseurlContext } from "@/components/provider/BaseurlProvider";
import { actionFetch, getLocalStorage, setLocalStorage } from "@/lib/api";
import { toast } from "@repo/ui/components/sonner";
import type {
  IngredientInput,
  IngredientOutput,
} from "@repo/db/types/ingredients";
import { User } from "next-auth";

export type IngredientState = IngredientOutput & { id: string };

const getIngredient = async (baseurl: string, user: User) => {
  const data = await actionFetch<{ ingredients: IngredientState[] }>(
    new URL(`/api/ingredients`, baseurl),
    { headers: { Authorization: `Bearer ${user.access_token}` } },
  );

  return data;
};

const QUERY_KEY = ["ingredients"] as const;

export function useIngredients() {
  const { baseurl } = useContext(BaseurlContext);
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const token = session?.user.access_token;

  const getHeaders = () => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  });

  const { data: ingredients = [], isLoading } = useQuery<IngredientState[]>({
    queryKey: QUERY_KEY,
    queryFn: async () =>
      session
        ? getIngredient(baseurl, session.user)
        : getLocalStorage("ingredients") || [],
  });

  const addMutationFn = async (body: IngredientInput) => {
    if (session) {
      const data = await actionFetch<{ ingredient: IngredientState }>(
        new URL("/api/ingredients", baseurl),
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(body),
        },
      );

      return data.ingredient;
    } else {
      const prev = getLocalStorage("ingredients") || [];
      const cur = { ...body, id: crypto.randomUUID() };
      setLocalStorage("ingredients", [...prev, cur]);

      return cur;
    }
  };
  const updateMutationFn = async ({
    id,
    body,
  }: {
    id: string;
    body: Partial<IngredientInput>;
  }) => {
    if (session) {
      const data = await actionFetch<{ ingredient: IngredientState }>(
        new URL(`/api/ingredients/${id}`, baseurl),
        {
          method: "PATCH",
          headers: getHeaders(),
          body: JSON.stringify(body),
        },
      );

      return data.ingredient as IngredientState;
    } else {
      const prev = getLocalStorage("ingredients") || [];

      setLocalStorage(
        "ingredients",
        prev.map((p: IngredientState) => (p.id === id ? { ...body, id } : p)),
      );

      return { id, ...body };
    }
  };
  const removeMutationFn = async (id: string) => {
    if (session) {
      await actionFetch(new URL(`/api/ingredients/${id}`, baseurl), {
        method: "DELETE",
        headers: getHeaders(),
      });

      return id;
    } else {
      const prev = getLocalStorage("ingredients") || [];

      setLocalStorage(
        "ingredients",
        prev.filter((p: IngredientState) => p.id !== id),
      );

      return id;
    }
  };
  const onSuccess = () =>
    queryClient.invalidateQueries({ queryKey: QUERY_KEY });

  const onError = (err: Error) => {
    toast.error("요청에 실패했습니다.", { description: err.message });
  };

  const addMutation = useMutation({
    mutationFn: addMutationFn,
    onSuccess,
    onError,
  });

  const updateMutation = useMutation({
    mutationFn: updateMutationFn,
    onSuccess,
    onError,
  });

  const removeMutation = useMutation({
    mutationFn: removeMutationFn,
    onSuccess,
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
