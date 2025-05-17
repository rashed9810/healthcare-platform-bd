// Doctor API client

import type { Doctor, DoctorRecommendation } from "./types"
import { getToken } from "./auth"

interface DoctorFilters {
  specialty?: string
  location?: string
  language?: string
  availability?: string
  rating?: number
}

export async function getDoctors(filters?: DoctorFilters): Promise<Doctor[]> {
  try {
    const queryParams = new URLSearchParams()

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString())
      })
    }

    const response = await fetch(`/api/doctors?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch doctors")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching doctors:", error)
    throw error
  }
}

export async function getDoctor(id: string): Promise<Doctor> {
  try {
    const response = await fetch(`/api/doctors/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch doctor")
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching doctor ${id}:`, error)
    throw error
  }
}

export async function getRecommendedDoctors(symptoms: string): Promise<DoctorRecommendation[]> {
  try {
    const response = await fetch("/api/doctors/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ symptoms }),
    })

    if (!response.ok) {
      throw new Error("Failed to get doctor recommendations")
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting doctor recommendations:", error)
    throw error
  }
}
