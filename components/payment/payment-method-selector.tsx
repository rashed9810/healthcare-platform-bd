"use client";

import { useState } from "react";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PAYMENT_METHODS } from "@/lib/constants";
import type { PaymentMethod } from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  appointmentType: "video" | "in-person";
  className?: string;
}

// Enhanced PaymentMethodSelector with icons and improved styling
export default function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
  appointmentType,
  className,
}: PaymentMethodSelectorProps) {
  return (
    <div
      className={cn(
        "space-y-6 p-4 border rounded-lg bg-white shadow-md",
        className
      )}
    >
      <h3 className="text-xl font-bold text-gray-800">Select Payment Method</h3>
      <RadioGroup
        value={selectedMethod}
        onValueChange={(value) => onMethodChange(value as PaymentMethod)}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {PAYMENT_METHODS.filter(
          (method) =>
            // Only show cash option for in-person appointments
            method.value !== "cash" || appointmentType === "in-person"
        ).map((method) => (
          <Label
            key={method.value}
            className={cn(
              "flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition hover:shadow-md",
              selectedMethod === method.value
                ? "border-primary bg-primary/10"
                : "border-gray-300"
            )}
          >
            {method.icon && (
              <div className="relative w-8 h-8">
                <Image
                  src={method.icon}
                  alt={method.label}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">{method.label}</span>
              <span className="text-sm text-gray-500">
                {method.description}
              </span>
            </div>
            <RadioGroupItem
              value={method.value}
              id={method.value}
              className="ml-auto"
            />
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
}
