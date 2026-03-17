import { CookingSession } from "./CookingSession";

interface CookingPageProps {
  params: Promise<{ recipeId: string }>;
}

export default async function CookingPage({ params }: CookingPageProps) {
  const { recipeId } = await params;

  return <CookingSession recipeId={recipeId} />;
}
