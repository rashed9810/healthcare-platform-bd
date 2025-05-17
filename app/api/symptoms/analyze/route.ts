import { NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth-middleware"

// In a real app, this would call your ML service
async function callSymptomAnalysisService(data: any) {
  try {
    // This would be a call to your Flask API or TensorFlow.js model
    const response = await fetch("https://your-ml-service.com/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("ML service error")
    }

    return await response.json()
  } catch (error) {
    console.error("Error calling ML service:", error)
    // Fallback to rule-based analysis if ML service fails
    return performRuleBasedAnalysis(data)
  }
}

// Simple rule-based fallback
function performRuleBasedAnalysis(data: any) {
  const { symptoms, duration, severity } = data

  // Very basic scoring algorithm
  let urgencyScore = 0

  // Severity contributes most to urgency
  if (severity === "mild") urgencyScore += 2
  else if (severity === "moderate") urgencyScore += 5
  else if (severity === "severe") urgencyScore += 8

  // Duration also affects urgency
  if (duration === "today") urgencyScore += 1
  else if (duration === "days") urgencyScore += 0
  else if (duration === "weeks") urgencyScore -= 1
  else if (duration === "months") urgencyScore -= 2

  // Clamp between 1-10
  urgencyScore = Math.max(1, Math.min(10, urgencyScore))

  // Simple keyword matching for common conditions
  const possibleConditions = []
  const symptomsLower = symptoms.toLowerCase()

  if (symptomsLower.includes("headache") || symptomsLower.includes("head pain")) {
    possibleConditions.push("Tension Headache")
    if (symptomsLower.includes("migraine") || symptomsLower.includes("light sensitivity")) {
      possibleConditions.push("Migraine")
    }
  }

  if (symptomsLower.includes("fever") || symptomsLower.includes("temperature")) {
    possibleConditions.push("Viral Infection")
    if (symptomsLower.includes("cough") || symptomsLower.includes("sore throat")) {
      possibleConditions.push("Upper Respiratory Infection")
    }
  }

  // Default if no matches
  if (possibleConditions.length === 0) {
    possibleConditions.push("General Medical Condition")
  }

  // Determine recommended specialty and timeframe based on urgency
  const recommendedSpecialty = "General Physician"
  let recommendedTimeframe = "Within a week"

  if (urgencyScore >= 8) {
    recommendedTimeframe = "Immediately"
  } else if (urgencyScore >= 6) {
    recommendedTimeframe = "Within 24 hours"
  } else if (urgencyScore >= 4) {
    recommendedTimeframe = "Within 3 days"
  }

  return {
    urgencyScore,
    possibleConditions,
    recommendedSpecialty,
    recommendedTimeframe,
  }
}

export async function POST(request: Request) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { symptoms, duration, severity, language } = data

    // Validate input
    if (!symptoms || !duration || !severity) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Call ML service or use rule-based analysis
    const analysisResult = await callSymptomAnalysisService({
      symptoms,
      duration,
      severity,
      language: language || "en",
      userId: authResult.user.id,
    })

    return NextResponse.json(analysisResult)
  } catch (error) {
    console.error("Symptom analysis error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
