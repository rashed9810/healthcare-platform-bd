import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-middleware";

// Mock doctor data for Bangladesh healthcare system
const MOCK_DOCTORS = [
  {
    id: "1",
    name: "Dr. Anika Rahman",
    specialty: "General Physician",
    location: "Dhaka Medical College Hospital",
    address: "Ramna, Dhaka 1000",
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
    consultationFee: 800,
    experience: "10+ years",
    coordinates: { lat: 23.7465, lng: 90.3763 },
    distance: "2.3 km",
    availability: {
      today: ["9:00 AM", "11:00 AM", "3:00 PM", "5:00 PM"],
      tomorrow: ["10:00 AM", "2:00 PM", "4:00 PM"],
    },
    reviews: [
      {
        text: "Dr. Rahman is very caring and professional. Highly recommended!",
        author: "Sarah Ahmed",
      },
      {
        text: "Excellent diagnosis and treatment. Very satisfied with the care.",
        author: "Mohammad Khan",
      },
    ],
  },
  {
    id: "2",
    name: "Dr. Mohammad Hasan",
    specialty: "Cardiologist",
    location: "Square Hospital",
    address: "West Panthapath, Dhaka 1205",
    rating: 4.9,
    reviewCount: 89,
    languages: ["Bengali", "English", "Hindi"],
    availableToday: true,
    nextAvailable: "Today, 4:00 PM",
    image: "/images/doctor-avatar-2.svg",
    bio: "Dr. Mohammad Hasan is a renowned cardiologist with expertise in interventional cardiology and heart disease prevention.",
    education: [
      "MBBS, Chittagong Medical College",
      "MD (Cardiology), BSMMU",
      "Fellowship in Interventional Cardiology, India",
    ],
    consultationFee: 1200,
    experience: "15+ years",
    coordinates: { lat: 23.7588, lng: 90.3802 },
    distance: "3.1 km",
    availability: {
      today: ["10:00 AM", "2:00 PM", "4:00 PM"],
      tomorrow: ["9:00 AM", "1:00 PM", "3:00 PM"],
    },
    reviews: [
      {
        text: "Outstanding cardiologist. Saved my life with his expertise.",
        author: "Fatima Begum",
      },
      {
        text: "Very knowledgeable and explains everything clearly.",
        author: "Abdul Rahman",
      },
    ],
  },
  {
    id: "3",
    name: "Dr. Fatima Khatun",
    specialty: "Pediatrician",
    location: "Birdem General Hospital",
    address: "Shahbag, Dhaka 1000",
    rating: 4.7,
    reviewCount: 156,
    languages: ["Bengali", "English"],
    availableToday: false,
    nextAvailable: "Tomorrow, 10:00 AM",
    image: "/images/doctor-avatar-3.svg",
    bio: "Dr. Fatima Khatun specializes in pediatric care with a focus on child development and vaccination programs.",
    education: [
      "MBBS, Sir Salimullah Medical College",
      "DCH (Pediatrics), BCPS",
    ],
    consultationFee: 700,
    experience: "8+ years",
    coordinates: { lat: 23.7372, lng: 90.3956 },
    distance: "4.2 km",
    availability: {
      today: [],
      tomorrow: ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"],
    },
    reviews: [
      {
        text: "Wonderful with children. My daughter loves visiting Dr. Fatima.",
        author: "Rashida Khatun",
      },
      {
        text: "Very patient and caring pediatrician. Highly recommended for kids.",
        author: "Aminul Islam",
      },
    ],
  },
  {
    id: "4",
    name: "Dr. Rafiqul Islam",
    specialty: "Orthopedic Surgeon",
    location: "National Institute of Traumatology",
    address: "Sher-e-Bangla Nagar, Dhaka 1207",
    rating: 4.6,
    reviewCount: 78,
    languages: ["Bengali", "English"],
    availableToday: true,
    nextAvailable: "Today, 6:00 PM",
    image: "/images/doctor-avatar-4.svg",
    bio: "Dr. Rafiqul Islam is an expert orthopedic surgeon specializing in joint replacement and sports medicine.",
    education: ["MBBS, Rajshahi Medical College", "MS (Orthopedics), BSMMU"],
    consultationFee: 1000,
    experience: "12+ years",
    coordinates: { lat: 23.7693, lng: 90.3563 },
    distance: "5.8 km",
    availability: {
      today: ["2:00 PM", "6:00 PM"],
      tomorrow: ["9:00 AM", "11:00 AM", "3:00 PM"],
    },
    reviews: [
      {
        text: "Excellent surgeon. My knee replacement was very successful.",
        author: "Karim Uddin",
      },
      {
        text: "Professional and skilled orthopedic specialist.",
        author: "Nasir Ahmed",
      },
    ],
  },
  {
    id: "5",
    name: "Dr. Nasreen Sultana",
    specialty: "Gynecologist",
    location: "Dhaka Shishu Hospital",
    address: "Agargaon, Dhaka 1207",
    rating: 4.8,
    reviewCount: 203,
    languages: ["Bengali", "English"],
    availableToday: true,
    nextAvailable: "Today, 1:00 PM",
    image: "/images/doctor-avatar-1.svg",
    bio: "Dr. Nasreen Sultana is a leading gynecologist with expertise in women's health and reproductive medicine.",
    education: [
      "MBBS, Mymensingh Medical College",
      "FCPS (Gynecology & Obstetrics), BCPS",
    ],
    consultationFee: 900,
    experience: "14+ years",
    coordinates: { lat: 23.7806, lng: 90.3492 },
    distance: "6.5 km",
    availability: {
      today: ["1:00 PM", "3:00 PM", "5:00 PM"],
      tomorrow: ["10:00 AM", "2:00 PM", "4:00 PM"],
    },
    reviews: [
      {
        text: "Dr. Nasreen is very understanding and professional. Great care during pregnancy.",
        author: "Salma Begum",
      },
      {
        text: "Excellent gynecologist. Very knowledgeable and caring.",
        author: "Ruma Akter",
      },
    ],
  },
  {
    id: "6",
    name: "Dr. Abdul Karim",
    specialty: "Neurologist",
    location: "National Institute of Neurosciences",
    address: "Agargaon, Dhaka 1207",
    rating: 4.9,
    reviewCount: 67,
    languages: ["Bengali", "English", "Urdu"],
    availableToday: false,
    nextAvailable: "Tomorrow, 9:00 AM",
    image: "/images/doctor-avatar-2.svg",
    bio: "Dr. Abdul Karim is a renowned neurologist specializing in stroke treatment and neurological disorders.",
    education: [
      "MBBS, Dhaka Medical College",
      "MD (Neurology), BSMMU",
      "Fellowship in Stroke Medicine, UK",
    ],
    consultationFee: 1500,
    experience: "18+ years",
    coordinates: { lat: 23.7806, lng: 90.3492 },
    distance: "6.5 km",
    availability: {
      today: [],
      tomorrow: ["9:00 AM", "11:00 AM", "2:00 PM"],
    },
    reviews: [
      {
        text: "Dr. Karim is an exceptional neurologist. Helped me recover from stroke.",
        author: "Hafizur Rahman",
      },
      {
        text: "Very experienced and knowledgeable. Excellent treatment for neurological issues.",
        author: "Shahida Khatun",
      },
    ],
  },
];

export async function GET(request: Request) {
  try {
    // Allow public access to doctor listings for browsing
    // Authentication is only required for booking appointments
    const authResult = await verifyAuth(request);
    const isAuthenticated = authResult.isAuthenticated;

    const { searchParams } = new URL(request.url);

    // Get filter parameters
    const specialty = searchParams.get("specialty");
    const location = searchParams.get("location");
    const language = searchParams.get("language");
    const availability = searchParams.get("availability");
    const rating = searchParams.get("rating");

    let filteredDoctors = [...MOCK_DOCTORS];

    // Apply filters
    if (specialty && specialty !== "all") {
      filteredDoctors = filteredDoctors.filter((doctor) =>
        doctor.specialty.toLowerCase().includes(specialty.toLowerCase())
      );
    }

    if (location && location !== "all") {
      filteredDoctors = filteredDoctors.filter((doctor) =>
        doctor.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (language && language !== "all") {
      filteredDoctors = filteredDoctors.filter((doctor) =>
        doctor.languages.some((lang) =>
          lang.toLowerCase().includes(language.toLowerCase())
        )
      );
    }

    if (availability === "today") {
      filteredDoctors = filteredDoctors.filter(
        (doctor) => doctor.availableToday
      );
    }

    if (rating) {
      const minRating = parseFloat(rating);
      filteredDoctors = filteredDoctors.filter(
        (doctor) => doctor.rating >= minRating
      );
    }

    // Sort by rating and availability
    filteredDoctors.sort((a, b) => {
      if (a.availableToday && !b.availableToday) return -1;
      if (!a.availableToday && b.availableToday) return 1;
      return b.rating - a.rating;
    });

    // Return doctor data (public access allowed for browsing)
    // Note: Booking appointments will still require authentication
    return NextResponse.json(filteredDoctors);
  } catch (error: any) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
