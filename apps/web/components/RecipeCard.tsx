import Link from "next/link";
import { Clock, ImageIcon } from "lucide-react";
import { Badge } from "@repo/ui/components/badge";

interface RecipeCardProps {
  id: string;
  name: string;
  description: string;
  time: string;
  difficulty: string;
  matchRate: number;
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "쉽게":
      return "text-green-500";
    case "보통":
      return "text-yellow-400";
    case "어려움":
      return "text-red-500";
    default:
      return "text-muted-foreground";
  }
}

function getMatchBadgeStyle(rate: number) {
  if (rate >= 90) return "bg-foreground text-background";
  if (rate >= 80) return "bg-green-500 text-white";
  return "bg-muted-foreground text-white";
}

export function RecipeCard({
  id,
  name,
  description,
  time,
  difficulty,
  matchRate,
}: RecipeCardProps) {
  return (
    <Link
      href={`/chat/${id}`}
      className="flex items-center gap-3.5 rounded-2xl bg-muted/50 p-3"
    >
      <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-neutral-200/70">
        <ImageIcon className="size-6 text-neutral-400" />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-semibold text-foreground">
            {name}
          </span>
          <Badge
            className={`h-[22px] rounded-full px-2 text-[11px] font-semibold ${getMatchBadgeStyle(matchRate)}`}
          >
            {matchRate}%
          </Badge>
        </div>
        <p className="text-[13px] text-muted-foreground">{description}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="size-3" />
          <span>{time}</span>
          <span>·</span>
          <span className={`font-medium ${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </span>
        </div>
      </div>
    </Link>
  );
}
