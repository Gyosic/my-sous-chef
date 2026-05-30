import { Heart } from "lucide-react";
import { type PublicRecipe } from "@/app/(main)/search/hooks/use-public-recipes";

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

export function PublicRecipeCard({ recipe }: { recipe: PublicRecipe }) {
  return (
    <div className="flex flex-col gap-2.5 rounded-2xl bg-neutral-50 p-4">
      {/* 제목 + 좋아요 + 날짜 */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-[15px] font-bold leading-snug text-neutral-950">
          {recipe.name}
        </span>
        <div className="flex shrink-0 items-center gap-1 pt-0.5">
          <Heart className="size-3.5 text-neutral-400" />
          <span className="text-[13px] text-neutral-400">{recipe.like}</span>
        </div>
      </div>

      <span className="text-[13px] text-neutral-400">
        {formatDate(recipe.createdAt)}
      </span>

      {/* 설명 */}
      {recipe.description && (
        <p className="line-clamp-2 text-[13px] leading-relaxed text-neutral-500">
          {recipe.description}
        </p>
      )}

      {/* 하단: 작성자 + 뱃지 */}
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-[13px] text-neutral-400">
          {recipe.authorName ?? "익명"}
        </span>
        <div className="flex shrink-0 gap-1.5">
          <span className="rounded-full bg-green-50 px-2.5 py-1 text-[12px] font-medium text-green-700">
            재료 {recipe.ingredients.length}개
          </span>
          <span className="rounded-full bg-green-50 px-2.5 py-1 text-[12px] font-medium text-green-700">
            {recipe.steps.length}단계
          </span>
        </div>
      </div>
    </div>
  );
}
