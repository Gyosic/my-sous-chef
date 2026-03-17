import { TopBar } from "@/components/TopBar";
import { RecipeResultsContent } from "./RecipeResultsContent";

export default function RecipeResultsPage() {
  return (
    <div className="flex h-svh flex-col bg-white">
      <TopBar title="추천 레시피" />
      <RecipeResultsContent />
    </div>
  );
}
