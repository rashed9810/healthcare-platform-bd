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
import PaymentProcessingLoader from "./payment-processing-loader";

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
          setStatus("failed");
          setProgress(0);
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while processing payment");
        setStatus("failed");
        setProgress(0);
      } finally {
        setIsProcessing(false);
      }
    };

    startPayment();

    // Cleanup function
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
    };
  }, [appointmentId, amount, method, onSuccess, pollingInterval]);

  // Start polling for payment status
  const startPolling = (paymentId: string) => {
    // Clear any existing interval first
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

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
          clearInterval(interval);
          setPollingInterval(null);

          if (paymentDetails.status === "completed") {
            setProgress(100);
            onSuccess(paymentId);
          }
        }
      } catch (err: any) {
        console.error("Error polling payment status:", err);
        // If we've had multiple failures, stop polling and show error
        if (err.message) {
          setError(`Payment verification error: ${err.message}`);
          setStatus("failed");
          clearInterval(interval);
          setPollingInterval(null);
        }
      }
    }, 5000);

    // Store the interval ID in state
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
          <PaymentProcessingLoader method={method} fullScreen={false} />
        ) : error ? (
          <Alert className="mt-4" variant="destructive">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <AlertTitle>Payment Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </Alert>
        ) : status === "pending" ? (
          <>
            <div className="flex flex-col items-center justify-center py-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-center text-muted-foreground">
                Waiting for payment confirmation...
              </p>
              {redirectUrl && (
                <p className="text-center text-sm mt-4">
                  If the payment window didn't open, please{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => window.open(redirectUrl, "_blank")}
                  >
                    click here
                  </Button>
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <PaymentStatusBadge status={status || "pending"} className="mb-2" />
            <p className="text-center text-muted-foreground">
              {status === "completed"
                ? "Payment completed successfully!"
                : status === "failed"
                ? "Payment failed. Please try again."
                : "Processing payment..."}
            </p>
          </div>
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
