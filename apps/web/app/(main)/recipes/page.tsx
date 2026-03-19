import { RecipeResultsContent } from "@/components/recipes/RecipeResultsContent";
import { TopBar } from "@/components/TopBar";

export default function RecipeResultsPage() {
  return (
    <div className="flex h-full flex-col bg-white">
      <TopBar title="레시피" />
      <RecipeResultsContent />
    </div>
  );
}
