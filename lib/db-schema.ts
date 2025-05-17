// This file is for reference only - it shows the database schema structure

// MongoDB Schema

import type { ObjectId } from "mongodb"

// Users Collection
interface User {
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
interface Doctor {
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
interface Appointment {
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
interface MedicalRecord {
  _id: ObjectId
  patientId: string
  doctorId: string
  date: string
  diagnosis: string
  prescription: string
  notes: string
  createdAt: Date
}

// PostgreSQL Schema (Alternative)

/*
-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  role VARCHAR(10) NOT NULL,
  language VARCHAR(2) NOT NULL DEFAULT 'en',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Doctors Table
CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  specialty VARCHAR(255) NOT NULL,
  qualifications TEXT[] NOT NULL,
  experience INTEGER NOT NULL,
  languages TEXT[] NOT NULL,
  consultation_fee NUMERIC(10, 2) NOT NULL,
  bio TEXT,
  rating NUMERIC(3, 2),
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Doctor Locations Table
CREATE TABLE doctor_locations (
  id SERIAL PRIMARY KEY,
  doctor_id INTEGER REFERENCES doctors(id),
  address TEXT NOT NULL,
  city VARCHAR(255) NOT NULL,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Doctor Availability Table
CREATE TABLE doctor_availability (
  id SERIAL PRIMARY KEY,
  doctor_id INTEGER REFERENCES doctors(id),
  day VARCHAR(10) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Appointments Table
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES users(id),
  doctor_id INTEGER REFERENCES doctors(id),
  date DATE NOT NULL,
  time TIME NOT NULL,
  type VARCHAR(10) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
  symptoms TEXT,
  urgency_score INTEGER,
  prescription TEXT,
  follow_up BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Medical Records Table
CREATE TABLE medical_records (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES users(id),
  doctor_id INTEGER REFERENCES doctors(id),
  date DATE NOT NULL,
  diagnosis TEXT NOT NULL,
  prescription TEXT,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
*/
