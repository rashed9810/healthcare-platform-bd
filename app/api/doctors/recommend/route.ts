import { NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth-middleware"
import { connectToDatabase } from "@/lib/db"

// In a real app, this would call your ML service
async function callDoctorRecommendationService(data: any) {
  try {
    // This would be a call to your Flask API or TensorFlow.js model
    const ML_API_URL = process.env.ML_API_URL || "http://localhost:5000"

    const response = await fetch(`${ML_API_URL}/api/recommend-doctors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`ML service error: ${errorData.message || response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error calling ML service:", error)
    // Fallback to rule-based analysis if ML service fails
    return performRuleBasedRecommendation(data)
  }
}

// Simple rule-based fallback
async function performRuleBasedRecommendation(data: any) {
  const { symptoms, userId } = data

  try {
    // Connect to database
    const db = await connectToDatabase()
    const doctorsCollection = db.collection("doctors")

    // Get all doctors
    const doctors = await doctorsCollection.find({}).toArray()

    // Very basic keyword matching for specialties
    const symptomsLower = symptoms.toLowerCase()
    let recommendedSpecialty = "General Physician"

    if (
      symptomsLower.includes("headache") ||
      symptomsLower.includes("migraine") ||
      symptomsLower.includes("dizziness") ||
      symptomsLower.includes("memory")
    ) {
      recommendedSpecialty = "Neurologist"
    } else if (
      symptomsLower.includes("chest pain") ||
      symptomsLower.includes("heart") ||
      symptomsLower.includes("palpitation") ||
      symptomsLower.includes("blood pressure")
    ) {
      recommendedSpecialty = "Cardiologist"
    } else if (symptomsLower.includes("skin") || symptomsLower.includes("rash") || symptomsLower.includes("itching")) {
      recommendedSpecialty = "Dermatologist"
    } else if (
      symptomsLower.includes("stomach") ||
      symptomsLower.includes("digestion") ||
      symptomsLower.includes("abdomen") ||
      symptomsLower.includes("vomiting")
    ) {
      recommendedSpecialty = "Gastroenterologist"
    }

    // Filter doctors by specialty
    const specialtyDoctors = doctors.filter((doctor) =>
      doctor.specialty.toLowerCase().includes(recommendedSpecialty.toLowerCase()),
    )

    // If no specialty doctors found, recommend general physicians
    const recommendedDoctors =
      specialtyDoctors.length > 0
        ? specialtyDoctors
        : doctors.filter((doctor) => doctor.specialty.toLowerCase().includes("general"))

    // Format recommendations
    return recommendedDoctors.slice(0, 5).map((doctor) => ({
      doctorId: doctor._id.toString(),
      matchScore: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
      reason: `Recommended based on your symptoms related to ${recommendedSpecialty.toLowerCase()}`,
    }))
  } catch (error) {
    console.error("Error in rule-based recommendation:", error)
    // Return a minimal fallback if everything fails
    return [
      {
        doctorId: "fallback-doctor-1",
        matchScore: 80,
        reason: "General recommendation based on your symptoms",
      },
      {
        doctorId: "fallback-doctor-2",
        matchScore: 75,
        reason: "General recommendation based on your symptoms",
      },
    ]
  }
}

export async function POST(request: Request) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: authResult.error || "Unauthorized" }, { status: 401 })
    }

    const { symptoms } = await request.json()

    // Validate input
    if (!symptoms) {
      return NextResponse.json({ message: "Symptoms are required" }, { status: 400 })
    }

    // Call ML service or use rule-based recommendations
    const recommendations = await callDoctorRecommendationService({
      symptoms,
      userId: authResult.user.id,
    })

    return NextResponse.json(recommendations)
  } catch (error) {
    console.error("Doctor recommendation error:", error)
    return NextResponse.json({ message: "Internal server error", error: String(error) }, { status: 500 })
  }
}
