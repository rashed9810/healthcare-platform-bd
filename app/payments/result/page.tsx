"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { getPaymentStatus } from "@/lib/api/payments";
import PaymentStatusBadge from "@/components/payment/payment-status-badge";
import type { PaymentDetails, PaymentStatus } from "@/lib/api/types";

export default function PaymentResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      }
    >
      <ActualPaymentResultPage />
    </Suspense>
  );
}

function ActualPaymentResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payment, setPayment] = useState<PaymentDetails | null>(null);

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        // Get parameters from URL
        const paymentId = searchParams.get("paymentId");
        const status = searchParams.get("status") as PaymentStatus;

        if (!paymentId) {
          setError("Missing payment information");
          setIsLoading(false);
          return;
        }

        // Get payment status
        const paymentDetails = await getPaymentStatus(paymentId);
        setPayment(paymentDetails);

        // Redirect to appointment confirmation page after a delay if payment is completed
        if (paymentDetails.status === "completed") {
          setTimeout(() => {
            router.push(
              `/appointments/confirmation?id=${paymentDetails.appointmentId}`
            );
          }, 3000);
        }
      } catch (err: any) {
        setError(err.message || "Failed to get payment status");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentStatus();
  }, [searchParams, router]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Payment Result</span>
              {payment && <PaymentStatusBadge status={payment.status} />}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-center text-muted-foreground">
                  Checking payment status...
                </p>
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : payment ? (
              <>
                {payment.status === "completed" ? (
                  <div className="flex flex-col items-center justify-center py-4">
                    <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      Payment Successful
                    </h3>
                    <p className="text-center text-muted-foreground mb-4">
                      Your payment of ৳{payment.amount.toFixed(2)} has been
                      processed successfully. Redirecting to appointment
                      confirmation...
                    </p>
                    <Button onClick={() => router.push("/appointments")}>
                      View Appointments
                    </Button>
                  </div>
                ) : payment.status === "failed" ? (
                  <div className="flex flex-col items-center justify-center py-4">
                    <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      Payment Failed
                    </h3>
                    <p className="text-center text-muted-foreground mb-4">
                      Your payment could not be processed. Please try again or
                      choose a different payment method.
                    </p>
                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => router.push("/appointments")}
                      >
                        View Appointments
                      </Button>
                      <Button onClick={() => router.back()}>Try Again</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      Payment Processing
                    </h3>
                    <p className="text-center text-muted-foreground mb-4">
                      Your payment is being processed. Please wait...
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => router.push("/appointments")}
                    >
                      View Appointments
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Payment Not Found</AlertTitle>
                <AlertDescription>
                  We couldn't find information about your payment. Please
                  contact support.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
