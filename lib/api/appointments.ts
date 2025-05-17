// Appointments API client

import type { Appointment } from "./types"
import { getToken } from "./auth"

interface BookAppointmentData {
  doctorId: string
  date: string
  time: string
  type: "video" | "in-person"
  symptoms?: string
}

export async function getAppointments(status?: string): Promise<Appointment[]> {
  try {
    const queryParams = status ? `?status=${status}` : ""
    const response = await fetch(`/api/appointments${queryParams}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch appointments")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching appointments:", error)
    throw error
  }
}

export async function getAppointment(id: string): Promise<Appointment> {
  try {
    const response = await fetch(`/api/appointments/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch appointment")
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching appointment ${id}:`, error)
    throw error
  }
}

export async function bookAppointment(data: BookAppointmentData): Promise<Appointment> {
  try {
    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to book appointment")
    }

    return await response.json()
  } catch (error) {
    console.error("Error booking appointment:", error)
    throw error
  }
}

export async function cancelAppointment(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/appointments/${id}/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to cancel appointment")
    }
  } catch (error) {
    console.error(`Error cancelling appointment ${id}:`, error)
    throw error
  }
}

export async function rescheduleAppointment(id: string, newDate: string, newTime: string): Promise<Appointment> {
  try {
    const response = await fetch(`/api/appointments/${id}/reschedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ date: newDate, time: newTime }),
    })

    if (!response.ok) {
      throw new Error("Failed to reschedule appointment")
    }

    return await response.json()
  } catch (error) {
    console.error(`Error rescheduling appointment ${id}:`, error)
    throw error
  }
}
