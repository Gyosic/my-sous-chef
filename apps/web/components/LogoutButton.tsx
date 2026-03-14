"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@repo/ui/components/button";

export function LogoutButton() {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => signOut()}
      aria-label="로그아웃"
    >
      <LogOut className="size-[18px] text-muted-foreground" />
    </Button>
  );
}
