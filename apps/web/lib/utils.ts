import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractErrorMessage(
  e: unknown,
  fallback = "오류가 발생했습니다.",
): string {
  const err = e as Error | null;
  return err?.message ?? fallback;
}
