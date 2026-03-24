"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@repo/ui/components/button";

interface TopBarProps {
  title: string;
  children?: React.ReactNode;
}

export function TopBar({ title, children }: TopBarProps) {
  const router = useRouter();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => router.back()}
          aria-label="뒤로가기"
        >
          <ArrowLeft className="size-5.5 text-foreground" />
        </Button>
        <span className="text-base font-semibold text-foreground">{title}</span>
      </div>
      {children}
    </header>
  );
}
