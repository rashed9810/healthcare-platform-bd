"use client";

import { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PaymentProcessingLoaderProps {
  method?: string;
  className?: string;
  onCancel?: () => void;
  fullScreen?: boolean;
}

export default function PaymentProcessingLoader({
  method = "payment",
  className,
  onCancel,
  fullScreen = true,
}: PaymentProcessingLoaderProps) {
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("Initializing payment...");

  // Update step and message based on a timer
  useEffect(() => {
    const timer = setTimeout(() => {
      if (step < 3) {
        setStep(step + 1);

        if (step === 1) {
          setMessage(`Connecting to ${method} payment gateway...`);
        } else if (step === 2) {
          setMessage("Waiting for payment confirmation...");
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [step, method]);

  // Get the appropriate icon based on the payment method
  const getPaymentIcon = () => {
    switch (method) {
      case "bkash":
        return "/images/payment/bkash.png";
      case "nagad":
        return "/images/payment/nagad.png";
      case "rocket":
        return "/images/payment/rocket.png";
      case "card":
        return "/images/payment/card.png";
      default:
        return null;
    }
  };

  const paymentIcon = getPaymentIcon();

  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-8",
        className
      )}
    >
      <div className="relative mb-6">
        {paymentIcon ? (
          <div className="relative w-16 h-16 flex items-center justify-center">
            <img
              src={paymentIcon}
              alt={`${method} payment`}
              className="w-12 h-12 object-contain"
            />
            <div className="absolute inset-0 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        )}
      </div>

      <div className="space-y-4 text-center">
        <h3 className="text-xl font-semibold">Processing Payment</h3>
        <p className="text-muted-foreground">{message}</p>
      </div>

      <div className="w-full max-w-xs mt-8">
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Initializing</span>
          <span>Processing</span>
          <span>Confirming</span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mt-8 max-w-xs text-center">
        Please do not close this window while your payment is being processed.
      </p>

      {onCancel && (
        <Button variant="outline" className="mt-6" onClick={onCancel}>
          Cancel Payment
        </Button>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-md w-full">
          {onCancel && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={onCancel}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          {content}
        </div>
      </div>
    );
  }

  return content;
}
