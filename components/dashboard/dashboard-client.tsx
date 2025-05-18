"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, FileText, Activity, AlertCircle } from "lucide-react";
import Link from "next/link";
import { getAppointments } from "@/lib/api/appointments";
import type { Appointment } from "@/lib/api/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
import { useI18n } from "@/lib/i18n-simple";
import ProtectedRoute from "@/components/protected-route";

export default function DashboardClient() {
  const [loading, setLoading] = useState(true);
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    Appointment[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { language } = useI18n();

  useEffect(() => {
    async function fetchAppointments() {
      try {
        console.log("Fetching appointments...");
        const appointments = await getAppointments("scheduled");
        console.log("Appointments fetched successfully:", appointments);
        setUpcomingAppointments(appointments);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError(
          language === "en"
            ? "Failed to load appointments"
            : "অ্যাপয়েন্টমেন্ট লোড করতে ব্যর্থ হয়েছে"
        );
      } finally {
        setLoading(false);
      }
    }

    // Only fetch appointments if user is logged in
    if (user) {
      console.log("User is logged in, fetching appointments");
      fetchAppointments();
    } else {
      console.log("User not logged in, skipping appointment fetch");
      setLoading(false);
    }
  }, [user, language]);

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {language === "en" ? "Patient Dashboard" : "রোগীর ড্যাশবোর্ড"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {language === "en"
                ? "Manage your healthcare journey"
                : "আপনার স্বাস্থ্যসেবা যাত্রা পরিচালনা করুন"}
            </p>
          </div>

          <div className="flex gap-4">
            <Button asChild>
              <Link href="/symptom-checker">
                {language === "en" ? "Check Symptoms" : "উপসর্গ পরীক্ষা করুন"}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/find-doctor">
                {language === "en" ? "Find Doctor" : "ডাক্তার খুঁজুন"}
              </Link>
            </Button>
          </div>
        </div>

        {/* Rest of the dashboard content */}
        {/* Cards section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "en"
                  ? "Upcoming Appointments"
                  : "আসন্ন অ্যাপয়েন্টমেন্ট"}
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  upcomingAppointments.length
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {language === "en"
                  ? "Scheduled consultations"
                  : "নির্ধারিত পরামর্শ"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "en" ? "Medical Records" : "মেডিকেল রেকর্ড"}
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? <Skeleton className="h-8 w-16" /> : "3"}
              </div>
              <p className="text-xs text-muted-foreground">
                {language === "en" ? "Available documents" : "উপলব্ধ নথি"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "en" ? "Health Status" : "স্বাস্থ্যের অবস্থা"}
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : language === "en" ? (
                  "Good"
                ) : (
                  "ভালো"
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {language === "en"
                  ? "Based on your recent checkups"
                  : "আপনার সাম্প্রতিক পরীক্ষার উপর ভিত্তি করে"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs section */}
        <Tabs defaultValue="appointments" className="space-y-8">
          <TabsList>
            <TabsTrigger value="appointments">
              {language === "en"
                ? "Upcoming Appointments"
                : "আসন্ন অ্যাপয়েন্টমেন্ট"}
            </TabsTrigger>
            <TabsTrigger value="reminders">
              {language === "en" ? "Health Reminders" : "স্বাস্থ্য রিমাইন্ডার"}
            </TabsTrigger>
            <TabsTrigger value="prescriptions">
              {language === "en"
                ? "Recent Prescriptions"
                : "সাম্প্রতিক প্রেসক্রিপশন"}
            </TabsTrigger>
          </TabsList>

          {/* Appointments tab content */}
          <TabsContent value="appointments" className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-1/3" />
                          <Skeleton className="h-4 w-1/4" />
                          <div className="flex gap-4 pt-2">
                            <Skeleton className="h-4 w-1/5" />
                            <Skeleton className="h-4 w-1/5" />
                          </div>
                        </div>
                        <Skeleton className="h-10 w-24" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    <p>{error}</p>
                  </div>
                </CardContent>
              </Card>
            ) : upcomingAppointments.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No Upcoming Appointments
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    You don't have any upcoming appointments scheduled.
                  </p>
                  <Button asChild>
                    <Link href="/find-doctor">Book an Appointment</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">
                              Appointment with Dr. {appointment.doctorId}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {appointment.type}
                            </p>
                            <div className="flex items-center gap-4 mt-1 text-sm">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                                {appointment.date}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                {appointment.time}
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button asChild size="sm">
                          <Link
                            href={`/appointments/details/${appointment.id}`}
                          >
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="flex justify-center mt-6">
              <Button asChild variant="outline">
                <Link href="/appointments">View All Appointments</Link>
              </Button>
            </div>
          </TabsContent>

          {/* Other tab contents */}
          {/* Reminders tab */}
          <TabsContent value="reminders" className="space-y-4">
            {/* Reminders content */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Activity className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Blood Pressure Check</h3>
                      <p className="text-sm text-muted-foreground">
                        Regular monitoring recommended
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Due in 3 days
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Mark as Done
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prescriptions tab */}
          <TabsContent value="prescriptions" className="space-y-4">
            {/* Prescriptions content */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        General Checkup Prescription
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Dr. Anika Rahman
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        April 10, 2025
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}
