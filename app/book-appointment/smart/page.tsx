"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Loader2, BrainCircuit, Calendar, ArrowLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n/i18n-context";
import SmartScheduler from "@/components/ai/smart-scheduler";
import { Doctor, Symptom } from "@/lib/api/types";

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
    availableForVideo: true,
  },
  {
    id: "doc_2",
    name: "Dr. Kamal Hossain",
    email: "dr.kamal@example.com",
    phone: "+8801812345678",
    role: "doctor",
    language: "en",
    createdAt: "2023-02-10T00:00:00Z",
    specialty: "Neurologist",
    qualifications: ["MBBS", "MD", "FCPS"],
    experience: 12,
    languages: ["English", "Bengali"],
    availableSlots: [],
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
  {
    id: "doc_3",
    name: "Dr. Nusrat Jahan",
    email: "dr.nusrat@example.com",
    phone: "+8801912345678",
    role: "doctor",
    language: "en",
    createdAt: "2023-03-05T00:00:00Z",
    specialty: "Dermatologist",
    qualifications: ["MBBS", "MD"],
    experience: 5,
    languages: ["English", "Bengali"],
    availableSlots: [],
    location: {
      address: "789 Skin Care Center, Dhanmondi",
      city: "Dhaka",
      coordinates: {
        latitude: 23.7465,
        longitude: 90.3753,
      },
    },
    rating: 4.7,
    reviewCount: 98,
    consultationFee: 1200,
    bio: "Specialized in skin disorders and cosmetic dermatology.",
    availableForVideo: true,
  },
  {
    id: "doc_4",
    name: "Dr. Rafiq Islam",
    email: "dr.rafiq@example.com",
    phone: "+8801612345678",
    role: "doctor",
    language: "en",
    createdAt: "2023-04-20T00:00:00Z",
    specialty: "Orthopedic Surgeon",
    qualifications: ["MBBS", "MS", "FCPS"],
    experience: 15,
    languages: ["English", "Bengali"],
    availableSlots: [],
    location: {
      address: "321 Orthopedic Hospital, Uttara",
      city: "Dhaka",
      coordinates: {
        latitude: 23.8759,
        longitude: 90.3795,
      },
    },
    rating: 4.9,
    reviewCount: 210,
    consultationFee: 2500,
    bio: "Experienced orthopedic surgeon specializing in joint replacements and sports injuries.",
    availableForVideo: false,
  },
  {
    id: "doc_5",
    name: "Dr. Sadia Ahmed",
    email: "dr.sadia@example.com",
    phone: "+8801512345678",
    role: "doctor",
    language: "en",
    createdAt: "2023-05-15T00:00:00Z",
    specialty: "Gynecologist",
    qualifications: ["MBBS", "MS", "FCPS"],
    experience: 10,
    languages: ["English", "Bengali"],
    availableSlots: [],
    location: {
      address: "567 Women's Health Center, Mirpur",
      city: "Dhaka",
      coordinates: {
        latitude: 23.8223,
        longitude: 90.3654,
      },
    },
    rating: 4.8,
    reviewCount: 178,
    consultationFee: 1800,
    bio: "Specialized in women's health and reproductive medicine.",
    availableForVideo: true,
  },
];

// Mock symptoms data (in a real app, this would come from an API)
const mockSymptoms: Symptom[] = [
  { id: "sym_1", name: "Headache", description: "Pain in the head or upper neck" },
  { id: "sym_2", name: "Fever", description: "Elevated body temperature" },
  { id: "sym_3", name: "Cough", description: "Sudden expulsion of air from the lungs" },
];

export default function SmartBookingPage() {
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
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get symptom IDs from URL if present
        const symptomIds = searchParams.get("symptoms")?.split(",") || [];
        
        // Filter symptoms based on URL params
        const filteredSymptoms = symptomIds.length > 0
          ? mockSymptoms.filter(s => symptomIds.includes(s.id))
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
  
  // Handle appointment scheduling
  const handleScheduleAppointment = (doctorId: string, date: string, time: string, type: "video" | "in-person") => {
    // In a real app, this would make an API call to create the appointment
    console.log("Scheduling appointment:", { doctorId, date, time, type });
    
    // Redirect to confirmation page
    router.push(`/book-appointment/confirmation?doctorId=${doctorId}&date=${date}&time=${time}&type=${type}`);
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("appointment.smartScheduling")}</h1>
          <p className="text-muted-foreground">{t("appointment.aiSchedulerDescription")}</p>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {symptoms.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BrainCircuit className="mr-2 h-5 w-5 text-primary" />
                  {t("appointment.basedOnYourSymptoms")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{t("symptomChecker.selectedSymptoms")}:</p>
                  <div className="flex flex-wrap gap-2">
                    {symptoms.map(symptom => (
                      <div key={symptom.id} className="bg-muted px-3 py-1 rounded-full text-sm">
                        {symptom.name}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <SmartScheduler
            doctors={doctors}
            symptoms={symptoms}
            onSchedule={handleScheduleAppointment}
          />
          
          <div className="mt-6">
            <Separator className="my-6" />
            <h2 className="text-xl font-semibold mb-4">{t("appointment.preferTraditionalBooking")}</h2>
            <p className="text-muted-foreground mb-4">
              {t("appointment.preferTraditionalBookingDescription")}
            </p>
            <Button 
              variant="outline"
              onClick={() => router.push("/find-doctor")}
              className="flex items-center"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {t("appointment.browseAllDoctors")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
