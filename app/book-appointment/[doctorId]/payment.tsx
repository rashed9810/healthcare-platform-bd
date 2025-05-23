"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, ArrowLeft, CreditCard } from "lucide-react";
import PaymentMethodSelector from "@/components/payment/payment-method-selector";
import PaymentProcessor from "@/components/payment/payment-processor";
import type { PaymentMethod } from "@/lib/api/types";

interface PaymentPageProps {
  appointmentId: string;
  doctorId: string;
  appointmentType: "video" | "in-person";
  fee: number;
  onBack: () => void;
  onComplete: (paymentId: string) => void;
}

export default function PaymentPage({
  appointmentId,
  doctorId,
  appointmentType,
  fee,
  onBack,
  onComplete,
}: PaymentPageProps) {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("bkash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showProcessor, setShowProcessor] = useState(false);

  // Handle payment method change
  const handleMethodChange = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setError(null);
  };

  // Handle payment initiation
  const handleProceedToPayment = () => {
    if (!selectedMethod) {
      setError("Please select a payment method");
      return;
    }

    setShowProcessor(true);
  };

  // Handle payment success
  const handlePaymentSuccess = (paymentId: string) => {
    onComplete(paymentId);
  };

  // Handle payment cancellation
  const handlePaymentCancel = () => {
    setShowProcessor(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Payment</h2>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Consultation Fee</p>
          <p className="text-2xl font-semibold">৳{fee.toFixed(2)}</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showProcessor ? (
        <PaymentProcessor
          appointmentId={appointmentId}
          amount={fee}
          method={selectedMethod}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Appointment Type</p>
                    <p>{appointmentType === "video" ? "Video Consultation" : "In-Person Visit"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Amount</p>
                    <p className="font-semibold">৳{fee.toFixed(2)}</p>
                  </div>
                </div>

                <div className="pt-4">
                  <PaymentMethodSelector
                    selectedMethod={selectedMethod}
                    onMethodChange={handleMethodChange}
                    appointmentType={appointmentType}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleProceedToPayment}>
                Proceed to Payment
              </Button>
            </CardFooter>
          </Card>

          <div className="rounded-lg border p-4 bg-muted/50">
            <h3 className="font-medium mb-2">Payment Information</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• All payments are processed securely</li>
              <li>• For mobile payments (bKash, Nagad), you'll be redirected to complete the payment</li>
              <li>• Your appointment will be confirmed once payment is successful</li>
              <li>• Cash payments are only available for in-person appointments</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
