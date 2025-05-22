"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { verifyPayment } from "@/lib/api/payments";
import PaymentStatusBadge from "@/components/payment/payment-status-badge";
import type { PaymentStatus } from "@/lib/api/types";

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      }
    >
      <ActualPaymentCallbackPage />
    </Suspense>
  );
}

function ActualPaymentCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<PaymentStatus | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get parameters from URL
        const paymentId = searchParams.get("paymentId");
        const transactionId = searchParams.get("transactionId");
        const status = searchParams.get("status");

        if (!paymentId || !transactionId) {
          setError("Missing payment information");
          setIsProcessing(false);
          return;
        }

        // Verify payment
        const paymentDetails = await verifyPayment(paymentId, transactionId);
        setStatus(paymentDetails.status);

        // Redirect to appointment confirmation page after a delay
        if (paymentDetails.status === "completed") {
          setTimeout(() => {
            router.push(
              `/appointments/confirmation?id=${paymentDetails.appointmentId}`
            );
          }, 3000);
        }
      } catch (err: any) {
        setError(err.message || "Failed to process payment");
      } finally {
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [searchParams, router]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Payment Callback</span>
              {status && <PaymentStatusBadge status={status} />}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-center text-muted-foreground">
                  Processing your payment...
                </p>
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Payment Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : status === "completed" ? (
              <div className="flex flex-col items-center justify-center py-4">
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Payment Successful
                </h3>
                <p className="text-center text-muted-foreground mb-4">
                  Your payment has been processed successfully. Redirecting to
                  appointment confirmation...
                </p>
                <Button onClick={() => router.push("/appointments")}>
                  View Appointments
                </Button>
              </div>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Payment Failed</AlertTitle>
                <AlertDescription>
                  Your payment could not be processed. Please try again or
                  choose a different payment method.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
