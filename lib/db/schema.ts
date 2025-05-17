import type { ObjectId } from "mongodb"

// MongoDB Schema Types

// Users Collection
export interface User {
  _id: ObjectId
  name: string
  email: string
  password: string // Hashed with bcrypt
  phone: string
  role: "patient" | "doctor" | "admin"
  language: "en" | "bn"
  createdAt: Date
}

// Doctors Collection
export interface Doctor {
  _id: ObjectId
  userId: ObjectId // Reference to Users collection
  specialty: string
  qualifications: string[]
  experience: number
  languages: string[]
  availableSlots: {
    day: string
    startTime: string
    endTime: string
    available: boolean
  }[]
  location: {
    address: string
    city: string
    coordinates: {
      latitude: number
      longitude: number
    }
  }
  rating: number
  reviewCount: number
  consultationFee: number
  bio: string
}

// Appointments Collection
export interface Appointment {
  _id: ObjectId
  patientId: string // Reference to Users collection
  doctorId: string // Reference to Doctors collection
  date: string
  time: string
  type: "video" | "in-person"
  status: "scheduled" | "completed" | "cancelled" | "no-show"
  symptoms?: string
  urgencyScore?: number
  prescription?: string
  followUp?: boolean
  createdAt: Date
  updatedAt: Date
}

// Medical Records Collection
export interface MedicalRecord {
  _id: ObjectId
  patientId: string
  doctorId: string
  date: string
  diagnosis: string
  prescription: string
  notes: string
  createdAt: Date
}

// API Response Types

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  error?: string
}
