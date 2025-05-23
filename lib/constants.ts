// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
  },
  // Doctors
  DOCTORS: {
    LIST: "/api/doctors",
    DETAIL: (id: string) => `/api/doctors/${id}`,
    RECOMMEND: "/api/doctors/recommend",
  },
  // Appointments
  APPOINTMENTS: {
    LIST: "/api/appointments",
    DETAIL: (id: string) => `/api/appointments/${id}`,
    CREATE: "/api/appointments",
    CANCEL: (id: string) => `/api/appointments/${id}/cancel`,
    RESCHEDULE: (id: string) => `/api/appointments/${id}/reschedule`,
  },
  // Symptoms
  SYMPTOMS: {
    ANALYZE: "/api/symptoms/analyze",
  },
  // Prescriptions
  PRESCRIPTIONS: {
    UPLOAD: "/api/prescriptions/upload",
    GET: (appointmentId: string) => `/api/prescriptions/${appointmentId}`,
  },
  // Payments
  PAYMENTS: {
    INITIATE: "/api/payments/initiate",
    VERIFY: "/api/payments/verify",
    CALLBACK: "/api/payments/callback",
    STATUS: (paymentId: string) => `/api/payments/${paymentId}/status`,
  },
};

// ML service endpoints
export const ML_API_URL = process.env.ML_API_URL || "http://localhost:5000";
export const ML_ENDPOINTS = {
  ANALYZE: `${ML_API_URL}/api/analyze`,
  RECOMMEND: `${ML_API_URL}/api/recommend-doctors`,
};

// Doctor specialties
export const DOCTOR_SPECIALTIES = [
  "General Physician",
  "Cardiologist",
  "Dermatologist",
  "Neurologist",
  "Pediatrician",
  "Orthopedist",
  "Gynecologist",
  "Ophthalmologist",
  "ENT Specialist",
  "Psychiatrist",
  "Dentist",
  "Urologist",
  "Endocrinologist",
  "Gastroenterologist",
  "Pulmonologist",
];

// Cities in Bangladesh
export const BANGLADESH_CITIES = [
  "Dhaka",
  "Chittagong",
  "Khulna",
  "Rajshahi",
  "Sylhet",
  "Barisal",
  "Rangpur",
  "Comilla",
  "Narayanganj",
  "Gazipur",
];

// Appointment types
export const APPOINTMENT_TYPES = [
  { value: "video", label: "Video Consultation" },
  { value: "in-person", label: "In-Person Visit" },
];

// Appointment status
export const APPOINTMENT_STATUS = {
  SCHEDULED: "scheduled",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  NO_SHOW: "no-show",
};

// Languages
export const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "bn", label: "Bengali (বাংলা)" },
];

// Symptom duration options
export const SYMPTOM_DURATION = [
  { value: "today", label: "Started today" },
  { value: "days", label: "A few days" },
  { value: "weeks", label: "A few weeks" },
  { value: "months", label: "A month or longer" },
];

// Symptom severity options
export const SYMPTOM_SEVERITY = [
  { value: "mild", label: "Mild - I can continue with my daily activities" },
  { value: "moderate", label: "Moderate - It's affecting my daily activities" },
  { value: "severe", label: "Severe - I cannot perform daily activities" },
];

// Payment methods
export const PAYMENT_METHODS = [
  {
    value: "bkash",
    label: "bKash",
    icon: "/images/payment/bkash.svg",
    description: "Pay with your bKash account",
  },
  {
    value: "nagad",
    label: "Nagad",
    icon: "/images/payment/nagad.svg",
    description: "Pay with your Nagad account",
  },
  {
    value: "rocket",
    label: "Rocket",
    icon: "/images/payment/rocket.svg",
    description: "Pay with your Rocket account",
  },
  {
    value: "card",
    label: "Credit/Debit Card",
    icon: "/images/payment/card.svg",
    description: "Pay with Visa, Mastercard, or American Express",
  },
  {
    value: "cash",
    label: "Cash on Visit",
    icon: "/images/payment/cash.svg",
    description: "Pay at the clinic during your visit (in-person only)",
  },
];

// Payment status labels
export const PAYMENT_STATUS_LABELS = {
  pending: "Pending",
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
  cancelled: "Cancelled",
};
