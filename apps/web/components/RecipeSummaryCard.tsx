import { ImageIcon } from "lucide-react";

interface RecipeSummaryCardProps {
  name: string;
  meta: string;
}

export function RecipeSummaryCard({ name, meta }: RecipeSummaryCardProps) {
  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-neutral-100 bg-muted/30 px-4 py-3">
      <div className="flex size-12 items-center justify-center rounded-[10px] bg-neutral-200/70">
        <ImageIcon className="size-6 text-neutral-400" />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-foreground">{name}</span>
        <span className="text-xs text-muted-foreground">{meta}</span>
      </div>
    </div>
  );
}
