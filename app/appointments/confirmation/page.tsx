"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CheckCircle2,
  Calendar,
  Video,
  MapPin,
  ArrowRight,
  CreditCard,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { getAppointment } from "@/lib/api/appointments";
import PaymentStatusBadge from "@/components/payment/payment-status-badge";
import type { Appointment } from "@/lib/api/types";

export default function AppointmentConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ActualAppointmentConfirmationPage />
    </Suspense>
  );
}

function ActualAppointmentConfirmationPage() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  // Get appointment ID from URL
  const appointmentId = searchParams.get("id");

  // Fetch appointment details
  useEffect(() => {
    const fetchAppointment = async () => {
      if (!appointmentId) {
        setError("Appointment ID is missing");
        setIsLoading(false);
        return;
      }

      try {
        const appointmentData = await getAppointment(appointmentId);
        setAppointment(appointmentData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch appointment details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  // Fallback appointment details if API fails
  const appointmentDetails = appointment || {
    id: appointmentId || "APT-20250518-1234",
    doctor: {
      name: "Dr. Anika Rahman",
      specialty: "General Physician",
      image: "/images/doctor-avatar-1.svg",
    },
    date: "May 18, 2025",
    time: "3:00 PM",
    type: "video",
    fee: 800,
    paymentStatus: "completed",
    paymentMethod: "bkash",
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">
              Loading appointment details...
            </p>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
              <h3 className="text-xl font-semibold mb-2">Error</h3>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button asChild>
                <Link href="/appointments">View All Appointments</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="text-center mb-8">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <h1 className="text-3xl font-bold tracking-tight">
                Appointment Confirmed
              </h1>
              <p className="text-muted-foreground mt-2">
                Your appointment has been successfully booked
              </p>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Appointment Details</CardTitle>
                    <CardDescription>
                      Booking ID: {appointmentDetails.id}
                    </CardDescription>
                  </div>
                  {appointmentDetails.paymentStatus && (
                    <PaymentStatusBadge
                      status={appointmentDetails.paymentStatus}
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden">
                    <img
                      src={
                        appointmentDetails.doctor?.image ||
                        "/images/doctor-avatar-1.svg"
                      }
                      alt={appointmentDetails.doctor?.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/images/doctor-avatar-1.svg";
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {appointmentDetails.doctor?.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {appointmentDetails.doctor?.specialty}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Date & Time</h4>
                      <p className="text-muted-foreground">
                        {appointmentDetails.date} at {appointmentDetails.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Video className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Appointment Type</h4>
                      <p className="text-muted-foreground">
                        {appointmentDetails.type === "video"
                          ? "Video Consultation"
                          : "In-Person Visit"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                {appointmentDetails.paymentMethod && (
                  <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Payment Method</h4>
                      <p className="text-muted-foreground capitalize">
                        {appointmentDetails.paymentMethod}
                      </p>
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Consultation Fee</span>
                    <span>৳{appointmentDetails.fee}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                  <AlertTitle className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Important Information
                  </AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                      <li>
                        You will receive a confirmation SMS and email shortly.
                      </li>
                      <li>
                        For video consultations, please join 5 minutes before
                        the appointment time.
                      </li>
                      <li>
                        You can reschedule or cancel up to 4 hours before the
                        appointment.
                      </li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  <Button asChild variant="outline">
                    <Link href="/appointments">View All Appointments</Link>
                  </Button>
                  {appointmentDetails.type === "video" && (
                    <Button asChild>
                      <Link
                        href={`/appointments/join?id=${appointmentDetails.id}`}
                      >
                        Join Consultation
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>

            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="mb-4 mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium mb-2">
                      Prepare for Appointment
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      List your symptoms and questions for the doctor
                    </p>
                  </CardContent>
                </Card>

                {appointmentDetails.type === "video" && (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="mb-4 mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                        <Video className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-medium mb-2">Test Your Device</h3>
                      <p className="text-sm text-muted-foreground">
                        Ensure your camera and microphone are working
                      </p>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="mb-4 mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium mb-2">Find Nearby Pharmacies</h3>
                    <p className="text-sm text-muted-foreground">
                      Locate pharmacies for your prescriptions
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
