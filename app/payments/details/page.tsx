"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ArrowLeft } from "lucide-react";
import PaymentReceipt from "@/components/payment/payment-receipt";
import type { PaymentDetails, Appointment, Doctor } from "@/lib/api/types";
import { formatDate } from "@/lib/utils/date";
import {
  WithSearchParams,
  useSearchParams,
} from "@/components/providers/search-params-provider";

// Mock payment data (in a real app, this would come from an API)
const mockPayment: PaymentDetails = {
  id: "pay_123456789",
  appointmentId: "apt_123456",
  amount: 1500,
  currency: "BDT",
  method: "bkash",
  status: "completed",
  transactionId: "TXN123456",
  createdAt: "2023-06-15T10:30:00Z",
  updatedAt: "2023-06-15T10:35:00Z",
};

// Mock appointment data
const mockAppointment: Appointment = {
  id: "apt_123456",
  patientId: "pat_123456",
  doctorId: "doc_123456",
  date: "2023-06-20",
  time: "10:30",
  type: "video",
  status: "scheduled",
  paymentStatus: "completed",
  paymentMethod: "bkash",
  paymentId: "pay_123456789",
  fee: 1500,
};

// Mock doctor data
const mockDoctor: Doctor = {
  id: "doc_123456",
  name: "Dr. Anika Rahman",
  email: "dr.anika@example.com",
  phone: "+8801712345678",
  role: "doctor",
  language: "en",
  createdAt: "2023-01-15T00:00:00Z",
  specialty: "Cardiologist",
  qualifications: ["MBBS", "MD", "FCPS"],
  experience: 8,
  languages: ["English", "Bengali"],
  availableSlots: [],
  location: {
    address: "123 Medical Center, Gulshan",
    city: "Dhaka",
    coordinates: {
      latitude: 23.7937,
      longitude: 90.4066,
    },
  },
  rating: 4.8,
  reviewCount: 124,
  consultationFee: 1500,
  bio: "Experienced cardiologist with 8 years of practice.",
};

// Content component that uses search params
function PaymentDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [activeTab, setActiveTab] = useState("receipt");

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const paymentId = searchParams.get("id");

        if (!paymentId) {
          router.push("/payments/history");
          return;
        }

        // Fetch payment details from API
        const response = await fetch(`/api/payments/${paymentId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch payment details");
        }

        const data = await response.json();

        if (data.payment) {
          setPayment(data.payment);
        }

        if (data.appointment) {
          setAppointment(data.appointment);
        }

        if (data.doctor) {
          setDoctor(data.doctor);
        }
      } catch (error) {
        console.error("Error fetching payment details:", error);
        // Fallback to mock data if API fails
        setPayment(mockPayment);
        setAppointment(mockAppointment);
        setDoctor(mockDoctor);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [searchParams, router]);

  // Format appointment date and time
  const formattedAppointmentDate = appointment
    ? formatDate(`${appointment.date}T00:00:00`)
    : "";

  const formattedAppointmentTime = appointment?.time || "";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          size="icon"
          className="mr-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Payment Details</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : payment ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="receipt">Receipt</TabsTrigger>
                <TabsTrigger value="details">Transaction Details</TabsTrigger>
              </TabsList>

              <TabsContent value="receipt" className="mt-0">
                <PaymentReceipt
                  payment={payment}
                  doctorName={doctor?.name}
                  patientName="Your Name" // In a real app, this would come from user context
                  appointmentDate={formattedAppointmentDate}
                  appointmentTime={formattedAppointmentTime}
                  appointmentType={appointment?.type}
                />
              </TabsContent>

              <TabsContent value="details" className="mt-0">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Transaction Details
                  </h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Payment ID
                        </p>
                        <p className="font-medium">{payment.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Transaction ID
                        </p>
                        <p className="font-medium">
                          {payment.transactionId || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Payment Method
                        </p>
                        <p className="font-medium capitalize">
                          {payment.method}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="font-medium">
                          ৳{payment.amount.toFixed(2)} {payment.currency}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p className="font-medium capitalize">
                          {payment.status}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Date & Time
                        </p>
                        <p className="font-medium">
                          {new Date(payment.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {payment.status === "failed" && (
                      <div className="mt-6 p-4 bg-red-50 text-red-800 rounded-md">
                        <h3 className="font-semibold mb-2">Payment Failed</h3>
                        <p className="text-sm">
                          This payment was not successful. You can try again
                          with a different payment method.
                        </p>
                      </div>
                    )}

                    {payment.status === "pending" && (
                      <div className="mt-6 p-4 bg-yellow-50 text-yellow-800 rounded-md">
                        <h3 className="font-semibold mb-2">Payment Pending</h3>
                        <p className="text-sm">
                          This payment is still being processed. Please check
                          back later.
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Appointment Details
              </h2>

              {appointment && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Appointment ID
                    </p>
                    <p className="font-medium">{appointment.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Doctor</p>
                    <p className="font-medium">{doctor?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Specialty</p>
                    <p className="font-medium">{doctor?.specialty || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date & Time</p>
                    <p className="font-medium">
                      {formattedAppointmentDate} at {formattedAppointmentTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">
                      {appointment.type === "video"
                        ? "Video Consultation"
                        : "In-Person Visit"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium capitalize">
                      {appointment.status}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t">
                    <Button
                      className="w-full"
                      onClick={() =>
                        router.push(
                          `/appointments/details?id=${appointment.id}`
                        )
                      }
                    >
                      View Appointment
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Payment not found.</p>
          <Button
            className="mt-4"
            onClick={() => router.push("/payments/history")}
          >
            Back to Payment History
          </Button>
        </div>
      )}
    </div>
  );
}

// Main component that wraps the content with search params provider
export default function PaymentDetailsPage() {
  return (
    <WithSearchParams>
      <PaymentDetailsContent />
    </WithSearchParams>
  );
}
