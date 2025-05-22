// Common types used across the application

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "patient" | "doctor" | "admin";
  language: "en" | "bn";
  createdAt: string;
}

export interface Patient extends User {
  role: "patient";
  medicalHistory?: MedicalRecord[];
  appointments?: Appointment[];
}

export interface Doctor extends User {
  role: "doctor";
  specialty: string;
  qualifications: string[];
  experience: number;
  languages: string[];
  availableSlots: TimeSlot[];
  location: Location;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  bio: string;
  image?: string; // Optional field to include doctor profile images
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  diagnosis: string;
  prescription: string;
  notes: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  type: "video" | "in-person";
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  symptoms?: string;
  urgencyScore?: number;
  prescription?: string;
  followUp?: boolean;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  paymentId?: string;
  fee?: number;
  doctor?: Doctor; // Optional field to include doctor details in the appointment
}

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface Location {
  address: string;
  city: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface SymptomAnalysis {
  urgencyScore: number; // 1-10
  possibleConditions: string[];
  recommendedSpecialty: string;
  recommendedTimeframe: string;
}

export interface DoctorRecommendation {
  doctorId: string;
  matchScore: number;
  reason: string;
}

export type PaymentMethod = "bkash" | "nagad" | "rocket" | "card" | "cash";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

export interface PaymentDetails {
  id: string;
  appointmentId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export interface PaymentRequest {
  appointmentId: string;
  amount: number;
  method: PaymentMethod;
  returnUrl: string;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  redirectUrl?: string;
  message?: string;
  status?: PaymentStatus;
}

export interface SymptomData {
  patientId: string;
  symptoms: string[];
  duration: string; // e.g., "2 days", "1 week"
  severity: number; // 1-10
  bodyParts: string[];
  additionalNotes?: string;
  language: "en" | "bn";
}

export interface SymptomResult {
  id: string;
  patientId: string;
  date: string;
  symptoms: string[];
  analysis: SymptomAnalysis;
  recommendations: DoctorRecommendation[];
  savedToHistory: boolean;
}
