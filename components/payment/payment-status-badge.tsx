"use client";

import { Badge } from "@/components/ui/badge";
import { PAYMENT_STATUS_LABELS } from "@/lib/constants";
import type { PaymentStatus } from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

export default function PaymentStatusBadge({
  status,
  className,
}: PaymentStatusBadgeProps) {
  // Define variant based on status
  const getVariant = () => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-800/20 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 dark:bg-yellow-800/20 dark:text-yellow-400";
      case "failed":
        return "bg-red-100 text-red-800 hover:bg-red-100/80 dark:bg-red-800/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80 dark:bg-gray-800/20 dark:text-gray-400";
    }
  };

  return (
    <Badge className={cn(getVariant(), className)}>
      {PAYMENT_STATUS_LABELS[status] || "Unknown"}
    </Badge>
  );
}
