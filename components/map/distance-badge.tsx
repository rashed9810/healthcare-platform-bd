"use client";

import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { formatDistance } from "@/lib/utils/geolocation";
import { cn } from "@/lib/utils";

interface DistanceBadgeProps {
  distance: number;
  showIcon?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function DistanceBadge({
  distance,
  showIcon = true,
  className,
  size = "md",
}: DistanceBadgeProps) {
  // Get color based on distance
  const getColor = () => {
    if (distance <= 2) return "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-800/20 dark:text-green-400";
    if (distance <= 5) return "bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-800/20 dark:text-blue-400";
    if (distance <= 10) return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 dark:bg-yellow-800/20 dark:text-yellow-400";
    return "bg-gray-100 text-gray-800 hover:bg-gray-100/80 dark:bg-gray-800/20 dark:text-gray-400";
  };

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-xs py-0 px-2";
      case "lg":
        return "text-sm py-1 px-3";
      default:
        return "text-xs py-0.5 px-2.5";
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        getColor(),
        getSizeClasses(),
        "font-medium rounded-full",
        className
      )}
    >
      {showIcon && <MapPin className="mr-1 h-3 w-3" />}
      {formatDistance(distance)}
    </Badge>
  );
}
