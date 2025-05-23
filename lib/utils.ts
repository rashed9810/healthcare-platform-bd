import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency amount
 * @param amount Amount to format
 * @param currency Currency code (default: BDT)
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = "BDT"
): string {
  if (currency === "BDT") {
    return `৳${amount.toLocaleString()}`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}
