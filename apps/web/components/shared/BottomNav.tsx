"use client";

import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Refrigerator, Search } from "lucide-react";
import { ButtonGroup } from "@repo/ui/components/button-group";
import { Button } from "@repo/ui/components/button";

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  authOnly?: boolean;
}

const navItems: NavItem[] = [
  { href: "/", icon: BookOpen, label: "레시피" },
  { href: "/fridge", icon: Refrigerator, label: "냉장고" },
  { href: "/search", icon: Search, label: "검색" },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleClickNavButton = (href: string) => {
    router.push(href);
  };

  return (
    <ButtonGroup className="flex w-full h-16 shrink-0 items-center justify-around border-t py-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Button
            type="button"
            key={item.href}
            className="flex flex-col items-center justify-center gap-1 flex-1 h-full bg-paper hover:bg-transparent"
            onClick={() => {
              if (!isActive) handleClickNavButton(item.href);
            }}
          >
            <item.icon
              className={`size-5.5 ${isActive ? "text-neutral-900" : "text-neutral-400"}`}
            />
            <span
              className={`text-[11px] ${isActive ? "font-semibold text-neutral-900" : "font-medium text-neutral-400"}`}
            >
              {item.label}
            </span>
          </Button>
        );
      })}
    </ButtonGroup>
  );
}
