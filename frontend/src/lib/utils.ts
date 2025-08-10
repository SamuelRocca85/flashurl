import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat().format(n ?? 0);
}

export function formatMs(ms?: number): string {
  if (!ms && ms !== 0) return "—";
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

export function pct(part: number, total: number): number {
  if (!total) return 0;
  return (part / total) * 100;
}

let displayNames: Intl.DisplayNames | null = null;
export function countryName(code: string): string {
  try {
    if (!displayNames) {
      displayNames = new Intl.DisplayNames(undefined, { type: "region" });
    }
    return displayNames.of(code) || code;
  } catch {
    return code;
  }
}
