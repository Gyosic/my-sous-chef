"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@repo/ui/components/button";

interface TopBarProps {
  title: string;
}

export function TopBar({ title }: TopBarProps) {
  const router = useRouter();

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-neutral-100 px-4">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => router.back()}
        aria-label="뒤로가기"
      >
        <ArrowLeft className="size-[22px] text-foreground" />
      </Button>
      <span className="text-base font-semibold text-foreground">{title}</span>
    </header>
  );
}
