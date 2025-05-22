"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  MapPin,
  Star,
  Video,
  AlertCircle,
  Loader2,
  ArrowLeft,
  CreditCard,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AppointmentCalendar from "@/components/appointment-calendar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getDoctor } from "@/lib/api/doctors";
import { bookAppointment } from "@/lib/api/appointments";
import { isAuthenticated } from "@/lib/api/auth";
import { initiatePayment } from "@/lib/api/payments";
import PaymentMethodSelector from "@/components/payment/payment-method-selector";
import PaymentProcessor from "@/components/payment/payment-processor";
import type { PaymentMethod } from "@/lib/api/types";

interface BookAppointmentPageProps {
  params: {
    doctorId: string;
  };
}

export default function BookAppointmentPage({
  params,
}: BookAppointmentPageProps) {
  const router = useRouter();
  const { doctorId } = params as { doctorId: string }; // Explicitly type params
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appointmentType, setAppointmentType] = useState<"video" | "in-person">(
    "video"
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDoctor() {
      try {
        // Check if user is authenticated
        if (!isAuthenticated()) {
          // Redirect to login page
          router.push(`/login?redirect=/book-appointment/${doctorId}`);
          return;
        }

        // Validate doctorId format
        if (!/^[a-fA-F0-9]{24}$/.test(doctorId)) {
          setError("Invalid doctor ID format.");
          setLoading(false);
          return;
        }

        const doctorData = await getDoctor(doctorId);
        setDoctor(doctorData);
      } catch (err) {
        console.error("Error fetching doctor:", err);
        setError("Failed to load doctor information. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchDoctor();
  }, [doctorId, router]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const [showPayment, setShowPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>("bkash");
  const [appointmentId, setAppointmentId] = useState<string | null>(null);
  const [consultationFee, setConsultationFee] = useState<number>(0);

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      setBookingError("Please select both date and time for your appointment");
      return;
    }

    setIsBooking(true);
    setBookingError(null);

    try {
      const appointment = await bookAppointment({
        doctorId,
        date: selectedDate,
        time: selectedTime,
        type: appointmentType,
      });

      // Set appointment ID and consultation fee for payment
      setAppointmentId(appointment.id);
      setConsultationFee(doctorData.consultationFee || 800);

      // Show payment options
      setShowPayment(true);
    } catch (err) {
      console.error("Error booking appointment:", err);
      setBookingError("Failed to book appointment. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading doctor information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <Button asChild>
            <Link href="/find-doctor">Back to Find Doctor</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Fallback doctor data if API fails but no error is thrown
  const doctorData = doctor || {
    id: doctorId,
    name: "Dr. Anika Rahman",
    specialty: "General Physician",
    location: "Dhaka Medical College Hospital",
    rating: 4.8,
    reviewCount: 124,
    languages: ["Bengali", "English"],
    availableToday: true,
    nextAvailable: "Today, 3:00 PM",
    image: "/images/doctor-avatar-1.svg",
    bio: "Dr. Anika Rahman is a highly experienced general physician with over 10 years of practice. She specializes in preventive care, chronic disease management, and women's health issues.",
    education: [
      "MBBS, Dhaka Medical College",
      "FCPS (Medicine), Bangladesh College of Physicians and Surgeons",
    ],
    consultationFee: 800, // in BDT
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Book an Appointment
          </h1>
          <p className="text-muted-foreground mt-2">
            Select a date and time that works for you
          </p>
        </div>

        {bookingError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Booking Error</AlertTitle>
            <AlertDescription>{bookingError}</AlertDescription>
          </Alert>
        )}

        {!showPayment ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Doctor Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center text-center mb-4">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage
                        src={doctorData.image || "/images/doctor-avatar-1.svg"}
                        alt={doctorData.name}
                      />
                      <AvatarFallback>
                        {doctorData.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-semibold">{doctorData.name}</h3>
                    <p className="text-muted-foreground">
                      {doctorData.specialty}
                    </p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-medium">{doctorData.rating}</span>
                      <span className="text-muted-foreground ml-1">
                        ({doctorData.reviewCount} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{doctorData.location}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Next available: {doctorData.nextAvailable}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {doctorData.languages.map((language: string) => (
                      <Badge key={language} variant="outline">
                        {language}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium mb-2">About</h4>
                    <p className="text-sm text-muted-foreground">
                      {doctorData.bio}
                    </p>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Education</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {doctorData.education.map(
                        (edu: string, index: number) => (
                          <li key={index}>{edu}</li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Consultation Fee</h4>
                    <p className="text-sm">
                      <span className="font-medium">
                        ৳{doctorData.consultationFee}
                      </span>{" "}
                      per visit
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Select Appointment Type</CardTitle>
                  <CardDescription>
                    Choose how you would like to consult with the doctor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs
                    defaultValue="video"
                    onValueChange={(value) =>
                      setAppointmentType(value as "video" | "in-person")
                    }
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="video">
                        <Video className="mr-2 h-4 w-4" />
                        Video Consultation
                      </TabsTrigger>
                      <TabsTrigger value="in-person">
                        <MapPin className="mr-2 h-4 w-4" />
                        In-Person Visit
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="video" className="mt-6">
                      <div className="mb-6">
                        <p className="text-sm text-muted-foreground">
                          Video consultations are conducted through our secure
                          platform. You'll need a device with a camera and
                          microphone.
                        </p>
                      </div>
                      <AppointmentCalendar
                        onDateSelect={handleDateSelect}
                        onTimeSelect={handleTimeSelect}
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                      />
                    </TabsContent>

                    <TabsContent value="in-person" className="mt-6">
                      <div className="mb-6">
                        <p className="text-sm text-muted-foreground">
                          Visit the doctor at {doctorData.location}. Please
                          arrive 15 minutes before your appointment time.
                        </p>
                      </div>
                      <AppointmentCalendar
                        onDateSelect={handleDateSelect}
                        onTimeSelect={handleTimeSelect}
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" asChild>
                    <Link href="/find-doctor">Back to Doctors</Link>
                  </Button>
                  {!showPayment ? (
                    <Button
                      onClick={handleBookAppointment}
                      disabled={isBooking || !selectedDate || !selectedTime}
                    >
                      {isBooking ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Booking...
                        </>
                      ) : (
                        "Continue to Payment"
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setShowPayment(false)}
                      variant="outline"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Appointment
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 pb-4 border-b">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={doctorData.image || "/images/doctor-avatar-1.svg"}
                        alt={doctorData.name}
                      />
                      <AvatarFallback>
                        {doctorData.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{doctorData.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {doctorData.specialty}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium">{selectedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <span className="font-medium capitalize">
                        {appointmentType}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between text-lg">
                      <span className="font-medium">Total</span>
                      <span className="font-bold">৳{consultationFee}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Payment Method
                  </CardTitle>
                  <CardDescription>
                    Select your preferred payment method
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {appointmentId ? (
                    <div className="space-y-6">
                      <PaymentMethodSelector
                        selectedMethod={selectedPaymentMethod}
                        onMethodChange={setSelectedPaymentMethod}
                        appointmentType={appointmentType}
                      />

                      <div className="pt-4 border-t">
                        <Button
                          className="w-full"
                          onClick={() => {
                            // Show payment processor
                            router.push(
                              `/payments/process?appointmentId=${appointmentId}&method=${selectedPaymentMethod}&amount=${consultationFee}`
                            );
                          }}
                        >
                          Pay ৳{consultationFee}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowPayment(false)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Appointment Details
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
