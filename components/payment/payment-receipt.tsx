"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Download, Printer, Share2 } from "lucide-react";
import PaymentStatusBadge from "./payment-status-badge";
import type { PaymentDetails } from "@/lib/api/types";
import { formatDate } from "@/lib/utils/date";

interface PaymentReceiptProps {
  payment: PaymentDetails;
  doctorName?: string;
  patientName?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  appointmentType?: "video" | "in-person";
  className?: string;
}

export default function PaymentReceipt({
  payment,
  doctorName,
  patientName,
  appointmentDate,
  appointmentTime,
  appointmentType,
  className,
}: PaymentReceiptProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  // Format payment date
  const formattedDate = payment.createdAt ? formatDate(new Date(payment.createdAt)) : "N/A";
  
  // Handle print receipt
  const handlePrint = () => {
    setIsPrinting(true);
    window.print();
    setTimeout(() => setIsPrinting(false), 1000);
  };

  // Handle download receipt
  const handleDownload = () => {
    // In a real implementation, this would generate a PDF receipt
    alert("This feature will download a PDF receipt in the production version");
  };

  // Handle share receipt
  const handleShare = () => {
    // In a real implementation, this would open a share dialog
    if (navigator.share) {
      navigator.share({
        title: "HealthConnect Payment Receipt",
        text: `Payment receipt for appointment with ${doctorName} on ${appointmentDate}`,
        url: window.location.href,
      }).catch(err => {
        console.error("Error sharing:", err);
      });
    } else {
      alert("Sharing is not supported on this browser");
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="print:pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Payment Receipt</CardTitle>
          <PaymentStatusBadge status={payment.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 print:space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Receipt Number</p>
            <p className="font-medium">{payment.id.substring(0, 8).toUpperCase()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="font-medium">{formattedDate}</p>
          </div>
        </div>

        <Separator className="my-4 print:my-2" />

        <div className="grid grid-cols-2 gap-4 print:gap-2">
          {patientName && (
            <div>
              <p className="text-sm text-muted-foreground">Patient</p>
              <p className="font-medium">{patientName}</p>
            </div>
          )}
          {doctorName && (
            <div>
              <p className="text-sm text-muted-foreground">Doctor</p>
              <p className="font-medium">{doctorName}</p>
            </div>
          )}
          {appointmentDate && (
            <div>
              <p className="text-sm text-muted-foreground">Appointment Date</p>
              <p className="font-medium">{appointmentDate}</p>
            </div>
          )}
          {appointmentTime && (
            <div>
              <p className="text-sm text-muted-foreground">Appointment Time</p>
              <p className="font-medium">{appointmentTime}</p>
            </div>
          )}
          {appointmentType && (
            <div>
              <p className="text-sm text-muted-foreground">Appointment Type</p>
              <p className="font-medium">
                {appointmentType === "video" ? "Video Consultation" : "In-Person Visit"}
              </p>
            </div>
          )}
        </div>

        <Separator className="my-4 print:my-2" />

        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="text-muted-foreground">Payment Method</p>
            <p className="font-medium capitalize">{payment.method}</p>
          </div>
          {payment.transactionId && (
            <div className="flex justify-between">
              <p className="text-muted-foreground">Transaction ID</p>
              <p className="font-medium">{payment.transactionId}</p>
            </div>
          )}
          <div className="flex justify-between">
            <p className="text-muted-foreground">Amount</p>
            <p className="font-medium">৳{payment.amount.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-muted-foreground">Currency</p>
            <p className="font-medium">{payment.currency}</p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t print:hidden">
          <p className="text-xs text-center text-muted-foreground mb-2">
            This is an electronic receipt for your payment. 
            Thank you for choosing HealthConnect.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between print:hidden">
        <Button variant="outline" size="sm" onClick={handlePrint} disabled={isPrinting}>
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
}
