"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, BrainCircuit, ArrowLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n/i18n-context";
import SmartScheduler from "@/components/ai/smart-scheduler";
import { Doctor, Symptom } from "@/lib/api/types";
import {
  WithSearchParams,
  useSearchParams,
} from "@/components/providers/search-params-provider";

// Mock doctors data (in a real app, this would come from an API)
const mockDoctors: Doctor[] = [
  {
    id: "doc_1",
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
    availableSlots: [
      {
        day: "Monday",
        startTime: "10:00",
        endTime: "16:00",
        available: true,
      },
      {
        day: "Wednesday",
        startTime: "10:00",
        endTime: "16:00",
        available: true,
      },
      {
        day: "Friday",
        startTime: "14:00",
        endTime: "18:00",
        available: true,
      },
    ],
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
    availableForVideo: true,
  },
  {
    id: "doc_2",
    name: "Dr. Kamal Hossain",
    email: "dr.kamal@example.com",
    phone: "+8801712345679",
    role: "doctor",
    language: "en",
    createdAt: "2023-02-10T00:00:00Z",
    specialty: "Neurologist",
    qualifications: ["MBBS", "MD", "FCPS", "PhD"],
    experience: 12,
    languages: ["English", "Bengali", "Hindi"],
    availableSlots: [
      {
        day: "Tuesday",
        startTime: "09:00",
        endTime: "15:00",
        available: true,
      },
      {
        day: "Thursday",
        startTime: "09:00",
        endTime: "15:00",
        available: true,
      },
      {
        day: "Saturday",
        startTime: "10:00",
        endTime: "14:00",
        available: true,
      },
    ],
    location: {
      address: "456 Neurology Center, Banani",
      city: "Dhaka",
      coordinates: {
        latitude: 23.7937,
        longitude: 90.4066,
      },
    },
    rating: 4.9,
    reviewCount: 156,
    consultationFee: 2000,
    bio: "Specialized in treating neurological disorders with 12 years of experience.",
    availableForVideo: true,
  },
];

// Mock symptoms data (in a real app, this would come from an API)
const mockSymptoms: Symptom[] = [
  {
    id: "sym_1",
    name: "Headache",
    description: "Pain in the head or upper neck",
  },
  { id: "sym_2", name: "Fever", description: "Elevated body temperature" },
  {
    id: "sym_3",
    name: "Cough",
    description: "Sudden expulsion of air from the lungs",
  },
];

// Wrapper component that uses the search params
function SmartBookingPageContent() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch data from an API
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get symptom IDs from URL if present
        const symptomIds = searchParams.get("symptoms")?.split(",") || [];

        // Filter symptoms based on URL params
        const filteredSymptoms =
          symptomIds.length > 0
            ? mockSymptoms.filter((s) => symptomIds.includes(s.id))
            : [];

        setDoctors(mockDoctors);
        setSymptoms(filteredSymptoms);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  // Handle booking
  const handleBookAppointment = (
    doctorId: string,
    date: string,
    time: string,
    type: "video" | "in-person"
  ) => {
    // In a real app, this would call an API to create the appointment
    router.push(`/appointments/confirmation?id=mock_appointment_id`);
  };

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
        <h1 className="text-3xl font-bold tracking-tight">
          {t("appointment.smartScheduling")}
        </h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <BrainCircuit className="h-5 w-5 mr-2 text-primary" />
                <CardTitle>{t("appointment.aiScheduler")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <SmartScheduler
                doctors={doctors}
                symptoms={symptoms}
                onSchedule={handleBookAppointment}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Main component that wraps the content with search params provider
export default function SmartBookingPage() {
  return (
    <WithSearchParams>
      <SmartBookingPageContent />
    </WithSearchParams>
  );
}
