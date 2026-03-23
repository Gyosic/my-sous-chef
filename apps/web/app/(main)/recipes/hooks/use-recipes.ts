import { useQuery } from "@tanstack/react-query";
import { User } from "next-auth";

const fetchRecipesByEmail = async (baseurl: string, user?: User) => {
  if (user?.email) {
    const query = { email: user.email };
    const params = new URLSearchParams(query);

    const res = await fetch(
      new URL(`/api/recipes?${params.toString()}`, baseurl),
      { headers: { Authorization: `Bearer ${user.access_token}` } },
    );

    const data = await res.json();

    return data;
  }
};

export const useRecipes = ({
  baseurl,
  user,
}: {
  baseurl: string;
  user?: User;
}) => {
  const query = useQuery({
    queryKey: ["recipes"],
    queryFn: () => fetchRecipesByEmail(baseurl, user),
  });

  return query;
};
