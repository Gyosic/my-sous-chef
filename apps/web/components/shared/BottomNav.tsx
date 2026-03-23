"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Refrigerator } from "lucide-react";

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  authOnly?: boolean;
}

const navItems: NavItem[] = [
  { href: "/", icon: Home, label: "홈" },
  { href: "/recipes", icon: BookOpen, label: "레시피" },
  { href: "/fridge", icon: Refrigerator, label: "냉장고", authOnly: true },
];

interface BottomNavProps {
  isLoggedIn?: boolean;
}

export function BottomNav({ isLoggedIn }: BottomNavProps) {
  const pathname = usePathname();

  const visibleItems = navItems.filter(
    (item) => !item.authOnly || isLoggedIn,
  );

  return (
    <nav className="flex h-16 shrink-0 items-center justify-around border-t border-neutral-100 bg-white px-0 pb-4 pt-2">
      {visibleItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center gap-1"
          >
            <item.icon
              className={`size-[22px] ${isActive ? "text-neutral-900" : "text-neutral-400"}`}
            />
            <span
              className={`text-[11px] ${isActive ? "font-semibold text-neutral-900" : "font-medium text-neutral-400"}`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
