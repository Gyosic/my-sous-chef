import { RecipeResultsContent } from "@/domains/recipes/components/RecipeResultsContent";
import { TopBar } from "@/components/shared/TopBar";

export default function RecipeResultsPage() {
  return (
    <div className="flex h-full flex-col bg-white">
      <TopBar title="레시피" />
      <RecipeResultsContent />
    </div>
  );
}
