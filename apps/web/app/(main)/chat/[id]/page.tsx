import { TopBar } from "@/components/TopBar";
import { RecipeSummaryCard } from "@/components/RecipeSummaryCard";
import { ChatContent } from "./ChatContent";

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;

  // TODO: API에서 레시피 정보 가져오기
  const recipe = {
    id,
    name: "두부 달걀찌개",
    meta: "15분 · 쉽게 · 재료 100% 매칭",
  };

  return (
    <div className="flex h-svh flex-col bg-white">
      <TopBar title="AI 요리 도우미" />
      <RecipeSummaryCard name={recipe.name} meta={recipe.meta} />
      <ChatContent recipeId={id} recipeName={recipe.name} />
    </div>
  );
}
