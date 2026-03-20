import { RecipeDetail } from "@/components/recipes/RecipeDetail";
import { api } from "@/config";

export default async function RecipeDetailPage() {
  return <RecipeDetail wsUrl={api.wsUrl} />;
}
