"use client";

import { useEffect, useState } from "react";
import { getAppointment } from "@/lib/api/appointments";
import { Appointment } from "@/lib/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, MapPin, User, Video, AlertCircle, FileText } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n-simple";
import { useAuth } from "@/contexts/auth-context";
import ProtectedRoute from "@/components/protected-route";
import AppointmentDetailsWrapper from "@/components/appointments/appointment-details-wrapper";

export default function AppointmentDetailsClient({ id }: { id: string }) {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useI18n();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchAppointment() {
      try {
        console.log("Fetching appointment details for ID:", id);
        const data = await getAppointment(id);
        console.log("Appointment data received:", data);
        setAppointment(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching appointment:", err);
        setError(
          language === "en"
            ? "Failed to load appointment details"
            : "অ্যাপয়েন্টমেন্ট বিবরণ লোড করতে ব্যর্থ হয়েছে"
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchAppointment();
    }
  }, [id, language]);

  const getAppointmentStatusClass = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAppointmentTypeIcon = (type: string) => {
    return type === "video" ? (
      <Video className="h-5 w-5 text-blue-600" />
    ) : (
      <MapPin className="h-5 w-5 text-purple-600" />
    );
  };

  return (
    <AppointmentDetailsWrapper>
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link
              href="/appointments"
              className="text-primary hover:underline flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              {language === "en" ? "Back to Appointments" : "অ্যাপয়েন্টমেন্টে ফিরে যান"}
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-6">
            {language === "en" ? "Appointment Details" : "অ্যাপয়েন্টমেন্ট বিবরণ"}
          </h1>

          {loading ? (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-1/3" />
                  <div className="flex gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                  <div className="flex gap-4 mt-4">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  <p>{error}</p>
                </div>
                <Button asChild className="mt-4">
                  <Link href="/appointments">
                    {language === "en" ? "View All Appointments" : "সমস্ত অ্যাপয়েন্টমেন্ট দেখুন"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : appointment ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      {language === "en" ? "Appointment Information" : "অ্যাপয়েন্টমেন্ট তথ্য"}
                    </CardTitle>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getAppointmentStatusClass(
                        appointment.status
                      )}`}
                    >
                      {appointment.status === "scheduled"
                        ? language === "en"
                          ? "Scheduled"
                          : "নির্ধারিত"
                        : appointment.status === "completed"
                        ? language === "en"
                          ? "Completed"
                          : "সম্পন্ন"
                        : language === "en"
                        ? "Cancelled"
                        : "বাতিল"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">
                        Dr. {appointment.doctorId}
                      </h2>
                      <div className="flex items-center mt-1">
                        {getAppointmentTypeIcon(appointment.type)}
                        <span className="ml-1 text-sm text-muted-foreground">
                          {appointment.type === "video"
                            ? language === "en"
                              ? "Video Consultation"
                              : "ভিডিও পরামর্শ"
                            : language === "en"
                            ? "In-person Visit"
                            : "সশরীরে সাক্ষাৎ"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {language === "en" ? "Date" : "তারিখ"}
                        </p>
                        <p className="font-medium">{appointment.date}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {language === "en" ? "Time" : "সময়"}
                        </p>
                        <p className="font-medium">{appointment.time}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {language === "en" ? "Symptoms" : "উপসর্গ"}
                        </p>
                        <p className="font-medium">{appointment.symptoms || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {language === "en" ? "Appointment ID" : "অ্যাপয়েন্টমেন্ট আইডি"}
                        </p>
                        <p className="font-medium">{appointment.id}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4 border-t">
                    {appointment.status === "scheduled" && (
                      <>
                        {appointment.type === "video" && (
                          <Button asChild className="bg-blue-600 hover:bg-blue-700">
                            <Link href={`/appointments/join/${appointment.id}`}>
                              <Video className="mr-2 h-4 w-4" />
                              {language === "en" ? "Join Video Call" : "ভিডিও কলে যোগ দিন"}
                            </Link>
                          </Button>
                        )}
                        <Button asChild variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                          <Link href={`/appointments/${appointment.id}/cancel`}>
                            {language === "en" ? "Cancel Appointment" : "অ্যাপয়েন্টমেন্ট বাতিল করুন"}
                          </Link>
                        </Button>
                        <Button asChild variant="outline">
                          <Link href={`/appointments/${appointment.id}/reschedule`}>
                            {language === "en" ? "Reschedule" : "পুনরায় সময়সূচি করুন"}
                          </Link>
                        </Button>
                      </>
                    )}
                    {appointment.status === "completed" && (
                      <Button asChild>
                        <Link href={`/prescriptions/${appointment.id}`}>
                          <FileText className="mr-2 h-4 w-4" />
                          {language === "en" ? "View Prescription" : "প্রেসক্রিপশন দেখুন"}
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {language === "en" ? "Appointment Not Found" : "অ্যাপয়েন্টমেন্ট পাওয়া যায়নি"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {language === "en"
                    ? "The appointment you're looking for doesn't exist or has been removed."
                    : "আপনি যে অ্যাপয়েন্টমেন্ট খুঁজছেন তা বিদ্যমান নেই বা সরানো হয়েছে।"}
                </p>
                <Button asChild>
                  <Link href="/appointments">
                    {language === "en" ? "View All Appointments" : "সমস্ত অ্যাপয়েন্টমেন্ট দেখুন"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </ProtectedRoute>
    </AppointmentDetailsWrapper>
  );
}
