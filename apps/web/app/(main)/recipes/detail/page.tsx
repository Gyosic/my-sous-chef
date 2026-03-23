import { RecipeDetail } from "@/domains/recipes/components/RecipeDetail";
import { api } from "@/config";

export default async function RecipeDetailPage() {
  return <RecipeDetail wsUrl={api.wsUrl} />;
}
