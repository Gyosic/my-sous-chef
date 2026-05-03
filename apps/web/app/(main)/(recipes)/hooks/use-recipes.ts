import { RecipeState } from "@/hooks/use-recipes-store";
import { actionFetch, getLocalStorage } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { User } from "next-auth";
import { useSession } from "next-auth/react";

const getRecipes = async (baseurl: string, user?: User) => {
  if (user?.email) {
    const query = { email: user.email };
    const params = new URLSearchParams(query);

    const data = await actionFetch<{ recipes: RecipeState[] }>(
      new URL(`/api/recipes?${params.toString()}`, baseurl),
      { headers: { Authorization: `Bearer ${user.access_token}` } },
    );

    return data;
  }
};

export const useRecipes = (baseurl: string) => {
  const { data: session } = useSession();
  const query = useQuery({
    queryKey: ["recipes"],
    queryFn: () =>
      session
        ? getRecipes(baseurl, session.user)
        : { recipes: getLocalStorage("recipes") || [] },
  });

  return query;
};
