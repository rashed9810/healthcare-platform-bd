// Prescription API client

import { getToken } from "./auth"

export async function uploadPrescriptionImage(file: File): Promise<{ text: string; url: string }> {
  try {
    const formData = new FormData()
    formData.append("prescription", file)

    const response = await fetch("/api/prescriptions/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload prescription")
    }

    return await response.json()
  } catch (error) {
    console.error("Error uploading prescription:", error)
    throw error
  }
}

export async function getPrescription(appointmentId: string): Promise<string> {
  try {
    const response = await fetch(`/api/prescriptions/${appointmentId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch prescription")
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching prescription for appointment ${appointmentId}:`, error)
    throw error
  }
}
