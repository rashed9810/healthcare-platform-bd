// Symptom analysis API client

import type { SymptomAnalysis } from "./types"
import { getToken } from "./auth"

interface SymptomData {
  symptoms: string
  duration: "today" | "days" | "weeks" | "months"
  severity: "mild" | "moderate" | "severe"
  language?: "en" | "bn"
}

export async function analyzeSymptoms(data: SymptomData): Promise<SymptomAnalysis> {
  try {
    const response = await fetch("/api/symptoms/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to analyze symptoms")
    }

    return await response.json()
  } catch (error) {
    console.error("Error analyzing symptoms:", error)
    throw error
  }
}
