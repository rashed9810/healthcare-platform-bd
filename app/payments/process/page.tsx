"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { initiatePayment } from "@/lib/api/payments";
import PaymentProcessor from "@/components/payment/payment-processor";
import type { PaymentMethod } from "@/lib/api/types";
import {
  WithSearchParams,
  useSearchParams,
} from "@/components/providers/search-params-provider";

export default function PaymentProcessPage() {
  return (
    <WithSearchParams>
      <ActualPaymentProcessPage />
    </WithSearchParams>
  );
}

function ActualPaymentProcessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get parameters from URL
  const appointmentId = searchParams.get("appointmentId");
  const method = searchParams.get("method") as PaymentMethod;
  const amount = searchParams.get("amount")
    ? parseInt(searchParams.get("amount")!)
    : 0;

  // Validate parameters
  useEffect(() => {
    if (!appointmentId || !method || !amount) {
      setError("Missing payment information");
      setIsLoading(false);
    }
  }, [appointmentId, method, amount]);

  const handlePaymentSuccess = (paymentId: string) => {
    // Redirect to appointment confirmation page
    router.push(`/appointments/confirmation?id=${appointmentId}`);
  };

  const handlePaymentCancel = () => {
    // Go back to appointment booking page
    router.back();
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-4 flex justify-center">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Payment</h1>
          <p className="text-muted-foreground mt-2">
            Complete your payment to confirm your appointment
          </p>
        </div>

        {appointmentId && method && amount ? (
          <PaymentProcessor
            appointmentId={appointmentId}
            amount={amount}
            method={method}
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />
        ) : (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}
