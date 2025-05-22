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
        {Object.entries(PAYMENT_METHODS).map(
          ([key, { value, label, icon }]) => (
            <Label
              key={key}
              className={cn(
                "flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition hover:shadow-md",
                selectedMethod === value
                  ? "border-primary bg-primary/10"
                  : "border-gray-300"
              )}
            >
              {icon && <Image src={icon} alt={label} width={32} height={32} />}
              <div className="flex flex-col">
                <span className="font-medium text-gray-800">{label}</span>
                <span className="text-sm text-gray-500">{key}</span>
              </div>
              <RadioGroupItem value={value} id={key} className="ml-auto" />
            </Label>
          )
        )}
      </RadioGroup>
    </div>
  );
}
