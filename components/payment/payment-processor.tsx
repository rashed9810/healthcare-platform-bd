"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, ArrowLeft, ExternalLink } from "lucide-react";
import { initiatePayment, getPaymentStatus } from "@/lib/api/payments";
import type { PaymentMethod, PaymentStatus } from "@/lib/api/types";
import PaymentStatusBadge from "./payment-status-badge";

interface PaymentProcessorProps {
  appointmentId: string;
  amount: number;
  method: PaymentMethod;
  onSuccess: (paymentId: string) => void;
  onCancel: () => void;
}

// Enhanced PaymentProcessor with progress bar and detailed error handling
export default function PaymentProcessor({
  appointmentId,
  amount,
  method,
  onSuccess,
  onCancel,
}: PaymentProcessorProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [progress, setProgress] = useState(0);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  // Start payment process
  useEffect(() => {
    const startPayment = async () => {
      setIsProcessing(true);
      setError(null);
      setProgress(25);

      try {
        // Get the current URL for the return URL
        const returnUrl = `${window.location.origin}/payments/callback`;

        // Initiate payment
        const response = await initiatePayment({
          appointmentId,
          amount,
          method,
          returnUrl,
        });

        if (response.success && response.paymentId) {
          setPaymentId(response.paymentId);
          setStatus("pending");
          setProgress(50);

          // If there's a redirect URL, set it
          if (response.redirectUrl) {
            setRedirectUrl(response.redirectUrl);
            // Open the redirect URL in a new window
            window.open(response.redirectUrl, "_blank");

            // Start polling for payment status
            startPolling(response.paymentId);
          } else if (method === "cash") {
            // For cash payments, mark as completed immediately
            setStatus("completed");
            setProgress(100);
            onSuccess(response.paymentId);
          }
        } else {
          setError(response.message || "Failed to initiate payment");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while processing payment");
        setStatus("failed");
      } finally {
        setIsProcessing(false);
      }
    };

    startPayment();

    // Cleanup function
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [appointmentId, amount, method, onSuccess]);

  // Start polling for payment status
  const startPolling = (paymentId: string) => {
    // Poll every 5 seconds
    const interval = setInterval(async () => {
      try {
        const paymentDetails = await getPaymentStatus(paymentId);
        setStatus(paymentDetails.status);

        // If payment is completed or failed, stop polling
        if (
          paymentDetails.status === "completed" ||
          paymentDetails.status === "failed" ||
          paymentDetails.status === "cancelled"
        ) {
          if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
          }

          if (paymentDetails.status === "completed") {
            setProgress(100);
            onSuccess(paymentId);
          }
        }
      } catch (err) {
        console.error("Error polling payment status:", err);
      }
    }, 5000);

    setPollingInterval(interval);
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Payment Processing</span>
          {status && <PaymentStatusBadge status={status} />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isProcessing ? (
          <>
            <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="mt-4 text-muted-foreground">
              Processing your payment...
            </p>
          </>
        ) : error ? (
          <Alert className="mt-4" variant="destructive">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <AlertTitle>Payment Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </Alert>
        ) : (
          <PaymentStatusBadge status={status || "pending"} />
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        {status === "failed" && (
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        )}
      </CardFooter>
    </Card>
  );
}
