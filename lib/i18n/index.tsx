"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

// Define available languages
export type Language = "en" | "bn";

// Define translation keys
type TranslationKey =
  | "home"
  | "findDoctor"
  | "appointments"
  | "symptomChecker"
  | "login"
  | "register"
  | "bookAppointment"
  | "videoConsultation"
  | "inPersonVisit"
  | "confirmBooking"
  | "medicalRecords"
  | "profile"
  | "logout";
// Add more keys as needed

// Define translations
const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    home: "Home",
    findDoctor: "Find Doctor",
    appointments: "Appointments",
    symptomChecker: "Symptom Checker",
    login: "Login",
    register: "Register",
    bookAppointment: "Book Appointment",
    videoConsultation: "Video Consultation",
    inPersonVisit: "In-Person Visit",
    confirmBooking: "Confirm Booking",
    medicalRecords: "Medical Records",
    profile: "Profile",
    logout: "Logout",
  },
  bn: {
    home: "হোম",
    findDoctor: "ডাক্তার খুঁজুন",
    appointments: "অ্যাপয়েন্টমেন্ট",
    symptomChecker: "উপসর্গ পরীক্ষক",
    login: "লগইন",
    register: "নিবন্ধন",
    bookAppointment: "অ্যাপয়েন্টমেন্ট বুক করুন",
    videoConsultation: "ভিডিও পরামর্শ",
    inPersonVisit: "সরাসরি সাক্ষাৎ",
    confirmBooking: "বুকিং নিশ্চিত করুন",
    medicalRecords: "মেডিকেল রেকর্ড",
    profile: "প্রোফাইল",
    logout: "লগআউট",
  },
};

// Create context
interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Create provider
interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  // Use a state with a default value that will be the same on both server and client
  const [language, setLanguage] = useState<Language>("en");
  const [isClient, setIsClient] = useState(false);

  // This effect runs only once after hydration to mark that we're on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load language preference from localStorage only after hydration
  useEffect(() => {
    if (isClient) {
      const savedLanguage = localStorage.getItem("language") as Language;
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "bn")) {
        setLanguage(savedLanguage);
      }
    }
  }, [isClient]);

  // Save language preference to localStorage when it changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("language", language);
    }
  }, [language, isClient]);

  // Translation function
  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

// Create hook
export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
