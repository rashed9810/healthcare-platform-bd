"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { use } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import VideoConsultation from "@/components/video-call/video-consultation";
import { getAppointment } from "@/lib/api/appointments";
import type { Appointment } from "@/lib/api/types";

export default function JoinAppointmentPage() {
  const params = useParams();
  const appointmentId = use(params).id as string;

  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [error, setError] = useState<string | null>(null);

  // For demo purposes, we'll assume the current user is the patient
  const isDoctor = false;

  useEffect(() => {
    async function fetchAppointment() {
      try {
        const appointmentData = await getAppointment(appointmentId);
        setAppointment(appointmentData);
      } catch (err) {
        console.error("Error fetching appointment:", err);
        setError("Failed to load appointment details");
      } finally {
        setLoading(false);
      }
    }

    fetchAppointment();
  }, [appointmentId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              {error || "Could not find appointment details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Video Consultation</CardTitle>
            <CardDescription>
              Appointment with Dr. {appointment.doctorId} on {appointment.date}{" "}
              at {appointment.time}
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="h-[600px]">
              <CardContent className="p-0 h-full">
                <VideoConsultation
                  appointmentId={appointmentId}
                  doctorId={appointment.doctorId}
                  patientId={appointment.patientId}
                  isDoctor={isDoctor}
                />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Tabs defaultValue="notes">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="info">Info</TabsTrigger>
              </TabsList>

              <TabsContent value="notes" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Consultation Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <textarea
                      className="w-full h-[400px] p-2 border rounded-md"
                      placeholder="Take notes during your consultation..."
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="info" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Patient Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium">Symptoms</h3>
                      <p className="text-sm text-muted-foreground">
                        {appointment.symptoms || "No symptoms recorded"}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium">Urgency Score</h3>
                      <p className="text-sm text-muted-foreground">
                        {appointment.urgencyScore
                          ? `${appointment.urgencyScore}/10`
                          : "Not assessed"}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium">Previous Consultations</h3>
                      <p className="text-sm text-muted-foreground">None</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
