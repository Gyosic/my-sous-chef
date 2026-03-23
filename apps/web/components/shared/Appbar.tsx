"use client";
import { User, ChefHat } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { useRouter } from "next/navigation";
import { LogoutButton } from "@/components/shared/LogoutButton";

interface AppbarProps {
  user?: { name?: string | null } | null;
}

export function Appbar({ user }: AppbarProps) {
  const router = useRouter();
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-100 px-4">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-neutral-900">
          <ChefHat className="size-4.5 text-white" />
        </div>
        <span className="text-base font-bold text-foreground">
          My Sous Chef
        </span>
      </div>

      {user ? (
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-muted">
            <User className="size-4 text-muted-foreground" />
          </div>
          <span className="text-[13px] font-medium text-foreground">
            {user.name}
          </span>
          <LogoutButton />
        </div>
      ) : (
        <Button
          size="sm"
          className="h-8 rounded-2xl px-3.5"
          onClick={() => router.push("/signin")}
        >
          로그인
        </Button>
      )}
    </header>
  );
}
