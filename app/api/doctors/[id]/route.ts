import { NextResponse } from "next/server";
import { getDoctorsCollection } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Mock doctor data for demo purposes
    const mockDoctors = [
      {
        id: "1",
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
        consultationFee: 800,
      },
      {
        id: "2",
        name: "Dr. Karim Ahmed",
        specialty: "Cardiologist",
        location: "Square Hospital",
        rating: 4.9,
        reviewCount: 89,
        languages: ["Bengali", "English"],
        availableToday: false,
        nextAvailable: "Tomorrow, 10:00 AM",
        image: "/images/doctor-avatar-2.svg",
        bio: "Dr. Karim Ahmed is a renowned cardiologist with expertise in interventional cardiology and heart disease prevention.",
        education: [
          "MBBS, Chittagong Medical College",
          "MD (Cardiology), National Institute of Cardiovascular Diseases",
        ],
        consultationFee: 1200,
      },
      {
        id: "3",
        name: "Dr. Fatima Begum",
        specialty: "Pediatrician",
        location: "Dhaka Shishu Hospital",
        rating: 4.7,
        reviewCount: 156,
        languages: ["Bengali", "English"],
        availableToday: true,
        nextAvailable: "Today, 5:00 PM",
        image: "/images/doctor-avatar-3.svg",
        bio: "Dr. Fatima Begum specializes in pediatric care with a focus on child development and vaccination programs.",
        education: [
          "MBBS, Sir Salimullah Medical College",
          "DCH (Pediatrics), Bangladesh Institute of Child Health",
        ],
        consultationFee: 600,
      },
    ];

    // First try to find in mock data
    let doctor = mockDoctors.find((d) => d.id === id);

    // If not found in mock data and ID is a valid ObjectId, try database
    if (!doctor && ObjectId.isValid(id)) {
      try {
        const doctorsCollection = await getDoctorsCollection();
        const dbDoctor = await doctorsCollection.findOne({
          _id: new ObjectId(id),
        });
        if (dbDoctor) {
          doctor = dbDoctor;
        }
      } catch (dbError) {
        console.warn("Database query failed, using mock data:", dbError);
      }
    }

    // If still not found, return the first mock doctor as fallback
    if (!doctor) {
      doctor = mockDoctors[0];
      doctor.id = id; // Use the requested ID
    }

    // Return the doctor details
    return NextResponse.json(doctor);
  } catch (error) {
    console.error("Error fetching doctor by ID:", error);

    // Return fallback doctor data
    return NextResponse.json({
      id: params.id,
      name: "Dr. Anika Rahman",
      specialty: "General Physician",
      location: "Dhaka Medical College Hospital",
      rating: 4.8,
      reviewCount: 124,
      languages: ["Bengali", "English"],
      availableToday: true,
      nextAvailable: "Today, 3:00 PM",
      image: "/images/doctor-avatar-1.svg",
      bio: "Dr. Anika Rahman is a highly experienced general physician with over 10 years of practice.",
      education: [
        "MBBS, Dhaka Medical College",
        "FCPS (Medicine), Bangladesh College of Physicians and Surgeons",
      ],
      consultationFee: 800,
    });
  }
}
