import { RecipeDetail } from "@/app/(main)/recipes/detail/components/RecipeDetail";
import { api } from "@/config";

export default async function RecipeDetailPage() {
  return <RecipeDetail wsUrl={api.wsUrl} />;
}
