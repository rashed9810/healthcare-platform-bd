// Appointments API client

import type { Appointment } from "./types";
import { getToken } from "./auth";

interface BookAppointmentData {
  doctorId: string;
  date: string;
  time: string;
  type: "video" | "in-person";
  symptoms?: string;
}

export async function getAppointments(status?: string): Promise<Appointment[]> {
  try {
    // First try to fetch from the API
    try {
      const queryParams = status ? `?status=${status}` : "";
      const response = await fetch(`/api/appointments${queryParams}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch appointments from API");
      }

      return await response.json();
    } catch (apiError) {
      console.warn("API fetch failed, using mock data:", apiError);

      // If API fails, return mock data
      return [
        {
          id: "1",
          patientId: "user123",
          doctorId: "Dr. Sarah Johnson",
          date: "2025-06-15",
          time: "10:00 AM",
          type: "video",
          status: "scheduled",
          symptoms: "Regular checkup",
        },
        {
          id: "2",
          patientId: "user123",
          doctorId: "Dr. Michael Chen",
          date: "2025-06-22",
          time: "2:30 PM",
          type: "in-person",
          status: "scheduled",
          symptoms: "Follow-up appointment",
        },
      ] as Appointment[];
    }
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
}

export async function getAppointment(id: string): Promise<Appointment> {
  try {
    // First try to fetch from the API
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch appointment from API");
      }

      return await response.json();
    } catch (apiError) {
      console.warn(
        `API fetch failed for appointment ${id}, using mock data:`,
        apiError
      );

      // If API fails, return mock data
      const mockAppointments = [
        {
          id: "1",
          patientId: "user123",
          doctorId: "Dr. Sarah Johnson",
          date: "2025-06-15",
          time: "10:00 AM",
          type: "video",
          status: "scheduled",
          symptoms: "Regular checkup",
        },
        {
          id: "2",
          patientId: "user123",
          doctorId: "Dr. Michael Chen",
          date: "2025-06-22",
          time: "2:30 PM",
          type: "in-person",
          status: "scheduled",
          symptoms: "Follow-up appointment",
        },
      ] as Appointment[];

      const appointment = mockAppointments.find((a) => a.id === id);

      if (!appointment) {
        throw new Error(`Appointment with ID ${id} not found`);
      }

      return appointment;
    }
  } catch (error) {
    console.error(`Error fetching appointment ${id}:`, error);
    throw error;
  }
}

export async function bookAppointment(
  data: BookAppointmentData
): Promise<Appointment> {
  try {
    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to book appointment");
    }

    return await response.json();
  } catch (error) {
    console.error("Error booking appointment:", error);
    throw error;
  }
}

export async function cancelAppointment(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/appointments/${id}/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to cancel appointment");
    }
  } catch (error) {
    console.error(`Error cancelling appointment ${id}:`, error);
    throw error;
  }
}

export async function rescheduleAppointment(
  id: string,
  newDate: string,
  newTime: string
): Promise<Appointment> {
  try {
    const response = await fetch(`/api/appointments/${id}/reschedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ date: newDate, time: newTime }),
    });

    if (!response.ok) {
      throw new Error("Failed to reschedule appointment");
    }

    return await response.json();
  } catch (error) {
    console.error(`Error rescheduling appointment ${id}:`, error);
    throw error;
  }
}
