"use client";

import { BaseurlContext } from "@/components/provider/BaseurlProvider";
import { getLocalStorage } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useContext, useEffect } from "react";

export function useSyncLocalRecipes() {
  const { data: session, status } = useSession();
  const { baseurl } = useContext(BaseurlContext);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (status !== "authenticated") return;
    const localRecipes = getLocalStorage("recipes");
    if (!localRecipes?.length) return;

    fetch(`${baseurl}/api/recipes/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.access_token}`,
      },
      body: JSON.stringify({ recipes: localRecipes }),
    })
      .then(() => {
        localStorage.removeItem("recipes");
        queryClient.invalidateQueries({ queryKey: ["recipes"] });
      })
      .catch(() => {});
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps
}
